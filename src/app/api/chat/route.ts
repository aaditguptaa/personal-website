import Anthropic from "@anthropic-ai/sdk";
import { type NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "../../lib/rateLimit";
import { logRequest } from "../../lib/requestInfo";

// Knowledge base — Claude answers as Aadit's portfolio guide from this context.
const SYSTEM_PROMPT = `You are the flight-desk guide on Aadit Gupta's personal portfolio, which is laid out as an aeronautical sectional chart. Answer visitors' questions about Aadit in a warm, concise tone (2-4 sentences). A light aviation/chart flavour is welcome but keep it professional and genuinely informative. If you don't know something, say so and point them to the "Send a transmission" contact section. Only respond with the final answer — no preamble or meta commentary.

The site's sections, if you need to point someone somewhere: the Operator's logbook (about Aadit), the Operations board of flight-progress strips (experience), the Atlas plates (project case files), the Equipment manifest (skills), and Send a transmission (contact). The résumé PDF is linked from the chart at the top.

About Aadit Gupta:
- Computer Engineering student at the University of Toronto (BASc + PEY Co-op, 2024–2029).
- Relevant coursework: Digital Systems (Verilog/FPGA design), Computer Fundamentals (C/C++), Electrical Fundamentals, Calculus III, Engineering Strategies & Practices.
- Works across machine learning, full-stack development, and embedded/hardware.
- Experience:
  * Machine Learning Researcher — CAELUS Project, University of Strathclyde, Glasgow (Jun–Aug 2026): built an end-to-end digital twin deciding in real time whether an AED-delivery drone can safely beat an ambulance to a cardiac arrest across Greater Glasgow & Clyde. Includes an NSGA-II (pymoo) multi-objective station-placement optimizer that raised reachable cardiac-arrest demand from 47% to 72% (5 → 9 stations), a demographic-aware demand model (Poisson NLL, spatial k-fold cross-validation), A* routing over a population/wind cost grid, FlightTimeNet (a PyTorch flight-time surrogate), a JARUS SORA 2.5 aviation-risk engine with a per-flight go/no-go gate, and a Flask + Leaflet operator console. Validated on 992 real emergency incidents: drones reached patients in ~2.5 min vs ~9 min for ambulances, saving 6–7 minutes on 43% of calls. CAELUS is a peer-reviewed framework used by NHS Greater Glasgow and Clyde.
  * Product Management Intern — Andersen UAE (Summer 2025): built an AI-powered E-Invoicing Assistant answering tax queries in under 5 seconds, using a FastAPI REST API, a ChromaDB vector database over 10,000+ entries, GPT-4, and retrieval+caching that cut response times 40%.
- Projects & teams:
  * UofT Autonomous Scale Racing (hardware): C++ Arduino to Nvidia Jetson UART communication and a custom Altium PCB section.
  * UofT Aerospace Team (software): camera-based target localization with Python/OpenCV, minimum-jerk trajectory planning in MATLAB/Python, Docker.
  * Streetview Monopoly: a full-stack multiplayer game using Google Streetview and the Google Maps API.
  * FPGA Rhythm Game: a rhythm game on the DE1-SoC board (VGA, keyboard, speakers) built with Verilog FSMs.
  * Camera Strap Redesign (Jan–Apr 2025): a client design project where Aadit was the communication liaison — three prototypes iterated on client and user feedback, plus a Gantt chart and two status reports.
- Skills: Python, C/C++, TypeScript, Verilog, SQL; ML & data science (NumPy, Pandas, scikit-learn, PyTorch, NSGA-II/pymoo multi-objective optimization, spatial statistics); frameworks (React, Next.js, Node.js, Django, FastAPI, Flask, Tailwind, OpenCV, ChromaDB, SQLite, Leaflet); tools (Git, Docker, MATLAB, LTSpice, Altium).
- Contact: aadit.gupta@mail.utoronto.ca; GitHub: github.com/aaditguptaa; LinkedIn: linkedin.com/in/aadit-gupta-ag.`;

// Deterministic fallback so the chatbot works even without an API key configured.
function fallbackReply(message: string): string {
  const m = message.toLowerCase();
  if (
    /(study|studying|school|university|major|degree|education|course)/.test(m)
  )
    return "Aadit is a Computer Engineering student at the University of Toronto (BASc + PEY Co-op, 2024–2029), with coursework in digital systems (Verilog/FPGA), C/C++, and electrical fundamentals.";
  if (/(experience|research|intern|job|caelus|andersen|work)/.test(m))
    return "Aadit spent summer 2026 as a machine learning researcher on the CAELUS project (Univ. of Strathclyde), building a digital twin that decides whether an AED drone can beat an ambulance to a cardiac arrest in Glasgow, and was a Product Management Intern at Andersen UAE where he built an AI e-invoicing assistant. Pull a strip on the operations board for details!";
  if (/(project|mission|built|building|game|drone|fpga|monopoly)/.test(m))
    return "Charted plates include the CAELUS drone optimizer (ML), a Streetview Monopoly multiplayer game, an FPGA rhythm game in Verilog, autonomous scale racing, and an aerospace autonomy build. Have a look at the Atlas plates!";
  if (/(skill|tech|stack|language|know|good at)/.test(m))
    return "Aadit works in Python, C/C++, and TypeScript, with ML (PyTorch, scikit-learn, NSGA-II), full-stack (React, Node, FastAPI, Django), and hardware tools (Verilog, Altium, MATLAB, Docker). See the equipment manifest!";
  if (/(contact|email|reach|hire|connect|linkedin|github)/.test(m))
    return "You can reach Aadit at aadit.gupta@mail.utoronto.ca, on LinkedIn (aadit-gupta-ag), or GitHub (aaditguptaa). The Contact panel below has a quick message form too!";
  if (/(hi|hey|hello|sup|yo)\b/.test(m))
    return "Hey there! 👋 I'm Aadit's flight-desk guide. Ask me about his studies, research, projects, skills, or how to get in touch.";
  if (/(resume|cv)/.test(m))
    return "You can grab Aadit's résumé as a PDF — the link sits on the chart at the very top of the page.";
  return "Great question! I can tell you about Aadit's studies, research, projects, skills, or how to reach him. What would you like to know? (Or send a transmission below to message him directly.)";
}

export async function POST(request: NextRequest) {
  // Throttle abuse: 10 requests / minute per IP (protects the paid API + cost).
  const ip = getClientIp(request);
  const { ok, retryAfter } = rateLimit(`chat:${ip}`, 10, 60_000);
  if (!ok) {
    return NextResponse.json(
      {
        response:
          "Whoa, slow down, speedrunner! ⏳ Give me a moment and try again.",
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  await logRequest(request, "/api/chat");

  let message = "";
  try {
    const body = await request.json();
    message = (body?.message ?? "").toString().slice(0, 1000);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!message.trim()) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // No key configured → use the built-in fallback so the widget still works.
  if (!apiKey) {
    return NextResponse.json({ response: fallbackReply(message) });
  }

  try {
    const client = new Anthropic({ apiKey });
    // Haiku: fast and cost-efficient — ideal for a lightweight FAQ chatbot.
    const completion = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: message }],
    });

    const text = completion.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    return NextResponse.json({ response: text || fallbackReply(message) });
  } catch (error) {
    console.error("Chat API error:", error);
    // Degrade gracefully rather than showing an error to the visitor.
    return NextResponse.json({ response: fallbackReply(message) });
  }
}
