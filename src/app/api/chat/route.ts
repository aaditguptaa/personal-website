import Anthropic from "@anthropic-ai/sdk";
import { type NextRequest, NextResponse } from "next/server";

// Knowledge base — Claude answers as Aadit's portfolio guide from this context.
const SYSTEM_PROMPT = `You are the friendly in-game "Guide" NPC on Aadit Gupta's gamified personal portfolio website. Answer visitors' questions about Aadit in a warm, concise, upbeat tone (2-4 sentences). A light gaming flavor is welcome but keep it professional and genuinely informative. If you don't know something, say so and point them to the Contact section. Only respond with the final answer — no preamble or meta commentary.

About Aadit Gupta:
- Computer Engineering student at the University of Toronto (BASc + PEY Co-op, 2024–2029).
- Relevant coursework: Digital Systems (Verilog/FPGA design), Computer Fundamentals (C/C++), Electrical Fundamentals, Calculus III, Engineering Strategies & Practices.
- Works across machine learning, full-stack development, and embedded/hardware.
- Experience:
  * Research Assistant — CAELUS Project, University of Strathclyde (2026–present): building an ML system to optimize emergency drone deployment for cardiac-arrest response across Glasgow. Built an NSGA-II multi-objective station-placement optimizer, a demographic-aware demand model (Poisson NLL, spatial k-fold cross-validation), A* routing for drone path planning, and FlightTimeNet, a neural-network flight-time surrogate with uncertainty. CAELUS is a peer-reviewed framework used by NHS Greater Glasgow and Clyde.
  * Product Management Intern — Andersen UAE (Summer 2025): built an AI-powered E-Invoicing Assistant answering tax queries in under 5 seconds, using a FastAPI REST API, a ChromaDB vector database over 10,000+ entries, GPT-4, and retrieval+caching that cut response times 40%.
- Projects & teams:
  * UofT Autonomous Scale Racing (hardware): C++ Arduino to Nvidia Jetson UART communication and a custom Altium PCB section.
  * UofT Aerospace Team (software): camera-based target localization with Python/OpenCV, minimum-jerk trajectory planning in MATLAB/Python, Docker.
  * Streetview Monopoly: a full-stack multiplayer game using Google Streetview and the Google Maps API.
  * FPGA Rhythm Game: a rhythm game on the DE1-SoC board (VGA, keyboard, speakers) built with Verilog FSMs.
  * Camera Strap Redesign: a conceptual design specification that made camera straps 42% more ergonomic (he was the sole client liaison for a 5-person team).
- Skills: Python, C/C++, TypeScript, SQL; ML & data science (NumPy, Pandas, scikit-learn, PyTorch, NSGA-II/multi-objective optimization, MCMC, spatial statistics); frameworks (React, Node.js, Django, FastAPI, Tailwind, OpenCV, ChromaDB, SQLite); tools (Git, Docker, MATLAB, LTSpice, Altium).
- Contact: aadit.gupta@mail.utoronto.ca; GitHub: github.com/aaditguptaa; LinkedIn: linkedin.com/in/aadit-gupta-ag.`;

// Deterministic fallback so the chatbot works even without an API key configured.
function fallbackReply(message: string): string {
  const m = message.toLowerCase();
  if (/(study|studying|school|university|major|degree|education|course)/.test(m))
    return "Aadit is a Computer Engineering student at the University of Toronto (BASc + PEY Co-op, 2024–2029), with coursework in digital systems (Verilog/FPGA), C/C++, and electrical fundamentals.";
  if (/(experience|research|intern|job|caelus|andersen|work)/.test(m))
    return "Aadit is a research assistant on the CAELUS project (Univ. of Strathclyde) building an ML system to optimize emergency drone deployment in Glasgow, and was a Product Management Intern at Andersen UAE where he built an AI e-invoicing assistant. See the Quest Log for details!";
  if (/(project|mission|built|building|game|drone|fpga|monopoly)/.test(m))
    return "Featured missions include the CAELUS drone optimizer (ML), a Streetview Monopoly multiplayer game, an FPGA rhythm game in Verilog, autonomous scale racing, and an aerospace autonomy build. Check the Missions section!";
  if (/(skill|tech|stack|language|know|good at)/.test(m))
    return "Aadit works in Python, C/C++, and TypeScript, with ML (PyTorch, scikit-learn, NSGA-II), full-stack (React, Node, FastAPI, Django), and hardware tools (Verilog, Altium, MATLAB, Docker). See the Skill Tree!";
  if (/(contact|email|reach|hire|connect|linkedin|github)/.test(m))
    return "You can reach Aadit at aadit.gupta@mail.utoronto.ca, on LinkedIn (aadit-gupta-ag), or GitHub (aaditguptaa). The Contact panel below has a quick message form too!";
  if (/(hi|hey|hello|sup|yo)\b/.test(m))
    return "Hey there, player! 👋 I'm Aadit's guide. Ask me about his studies, research, projects, skills, or how to get in touch.";
  if (/(resume|cv)/.test(m))
    return "You can grab Aadit's résumé (his 'Character Sheet') from the download card in the hero section up top!";
  return "Great question! I can tell you about Aadit's studies, research, projects, skills, or how to reach him. What would you like to know? (Or use the Contact panel to message him directly.)";
}

export async function POST(request: NextRequest) {
  let message = "";
  try {
    const body = await request.json();
    message = (body?.message ?? "").toString().slice(0, 2000);
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
    const completion = await client.messages.create({
      model: "claude-opus-4-8",
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
