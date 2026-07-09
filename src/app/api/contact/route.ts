import { type NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "../../lib/rateLimit";
import { logRequest } from "../../lib/requestInfo";

const TO_EMAIL = "aadit.gupta@mail.utoronto.ca";

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function clean(v: unknown, max: number): string {
  return (v ?? "").toString().trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  // Throttle: 5 messages / 10 min per IP.
  const ip = getClientIp(request);
  const { ok, retryAfter } = rateLimit(`contact:${ip}`, 5, 10 * 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Too many messages. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Log the origin (metadata only — not the message body) for abuse visibility.
  await logRequest(request, "/api/contact");

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const subject = clean(body.subject, 200);
  const message = clean(body.message, 5000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  // No email provider configured → tell the client to fall back to mailto.
  if (!apiKey) {
    return NextResponse.json({ fallback: true }, { status: 200 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Use a verified domain here once you have one; onboarding@resend.dev
        // works for sending to your own address in test mode.
        from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
        to: [TO_EMAIL],
        reply_to: email,
        subject: subject || `Portfolio message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!res.ok) {
      console.error("Resend error:", await res.text());
      return NextResponse.json({ fallback: true }, { status: 200 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ fallback: true }, { status: 200 });
  }
}
