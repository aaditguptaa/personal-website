"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Magnetic, m } from "./Motion";
import { CornerTicks, SectionHead } from "./Ornaments";

const EMAIL = "aadit.gupta@mail.utoronto.ca";

/* ------------------------ radiogram form ------------------------ */

type Status = "idle" | "sending" | "sent";

function fieldClass(extra = "") {
  return `w-full bg-transparent border-0 border-b border-line-strong focus:border-orange focus:ring-0 outline-none font-mono text-sm py-2 placeholder:text-faint ${extra}`;
}

function Radiogram() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const openMailto = () => {
    const subject = encodeURIComponent(
      form.subject || `Portfolio message from ${form.name}`,
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
        return;
      }
      // No provider configured → fall back to the sender's mail client.
      openMailto();
      setStatus("idle");
    } catch {
      openMailto();
      setStatus("idle");
    }
  };

  return (
    <div className="relative border border-line-strong bg-card shadow-lift">
      <CornerTicks />
      <div className="flex items-center justify-between border-b border-line-strong px-6 py-3">
        <h3 className="font-mono text-xs font-semibold tracking-[0.2em] uppercase">
          Radiogram
        </h3>
        <span className="anno">Priority — routine</span>
      </div>

      <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-7">
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label htmlFor="rg-name" className="anno block mb-1">
              From
            </label>
            <input
              id="rg-name"
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
              className={fieldClass()}
            />
          </div>
          <div>
            <label htmlFor="rg-email" className="anno block mb-1">
              Reply frequency
            </label>
            <input
              id="rg-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className={fieldClass()}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="rg-subject" className="anno block mb-1">
              Regarding
            </label>
            <input
              id="rg-subject"
              type="text"
              name="subject"
              placeholder="What is this about?"
              value={form.subject}
              onChange={handleChange}
              required
              className={fieldClass()}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="rg-message" className="anno block mb-1">
              Message text
            </label>
            <textarea
              id="rg-message"
              name="message"
              rows={5}
              placeholder="Keep it short; ink is expensive."
              value={form.message}
              onChange={handleChange}
              required
              className={`${fieldClass("resize-none leading-8")} ruled border-b-0`}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-5">
          <Magnetic>
            <button
              type="submit"
              disabled={status !== "idle"}
              className="inline-flex items-center gap-2 bg-ink text-paper font-mono text-xs tracking-[0.18em] uppercase px-6 py-3.5 hover:bg-orange transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {status === "sending" ? "Transmitting…" : "Transmit"}
            </button>
          </Magnetic>

          <AnimatePresence>
            {status === "sent" && (
              <m.span
                className="stamp text-sm"
                initial={{ opacity: 0, scale: 2.2, rotate: 8 }}
                animate={{ opacity: 1, scale: 1, rotate: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
              >
                Sent — msg received
              </m.span>
            )}
          </AnimatePresence>

          <a
            href={`mailto:${EMAIL}`}
            className="ink-link anno ml-auto hidden sm:inline"
          >
            or write directly
          </a>
        </div>
      </form>
    </div>
  );
}

/* ------------------------ tower radio chat ------------------------ */

interface Message {
  role: "assistant" | "user";
  content: string;
}

const QUICK_CALLS = [
  "What is Aadit working on right now?",
  "Tell me about the drone research",
  "What's his hardware experience?",
];

function TowerRadio() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Tower here, reading you five by five. Ask me anything about Aadit's projects, research, or experience.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Pin the log to the newest transmission whenever one lands.
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll must re-run on new messages
  useEffect(() => {
    if (bodyRef.current)
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.response || data.message || "Say again? Transmission garbled.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Static on the line — try again shortly, or send a radiogram instead.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative border border-line-strong bg-paper flex flex-col h-full min-h-[26rem]">
      <div className="flex items-center justify-between border-b border-line-strong px-6 py-3">
        <h3 className="font-mono text-xs font-semibold tracking-[0.2em] uppercase">
          Tower — 121.5 MHz
        </h3>
        <span className="anno inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-olive animate-pulse" />
          Receiving
        </span>
      </div>

      <div
        ref={bodyRef}
        className="flex-1 overflow-y-auto px-6 py-5 space-y-4 font-mono text-[13px] leading-relaxed max-h-96"
        aria-live="polite"
      >
        {messages.map((msg, i) => (
          <div
            key={`${i}-${msg.content.slice(0, 12)}`}
            className="grid grid-cols-[3rem_1fr] gap-3"
          >
            <span
              className={`anno pt-0.5 ${msg.role === "user" ? "text-orange" : ""}`}
            >
              {msg.role === "user" ? "YOU" : "TWR"}
            </span>
            <p className={msg.role === "user" ? "text-orange" : "text-ink"}>
              {msg.content}
            </p>
          </div>
        ))}
        {loading && (
          <div className="grid grid-cols-[3rem_1fr] gap-3">
            <span className="anno pt-0.5">TWR</span>
            <m.p
              className="text-soft"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              …
            </m.p>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-6 pb-3 flex flex-wrap gap-2">
          {QUICK_CALLS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => send(q)}
              className="font-mono text-[11px] border border-line-strong px-3 py-1.5 hover:border-orange hover:text-orange transition-colors duration-200 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-line-strong flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Transmit to tower…"
          disabled={loading}
          aria-label="Message to the tower"
          className="flex-1 bg-transparent px-6 py-3.5 font-mono text-[13px] outline-none placeholder:text-faint"
        />
        <button
          type="button"
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          aria-label="Send"
          className="px-5 font-mono text-xs tracking-[0.18em] uppercase border-l border-line-strong hover:text-orange transition-colors duration-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          Key
        </button>
      </div>
    </div>
  );
}

/* ------------------------ section ------------------------ */

export default function Transmission() {
  return (
    <section
      id="radio"
      className="scroll-mt-20 max-w-7xl mx-auto px-5 sm:px-8 pt-28"
    >
      <SectionHead
        no="06"
        kicker="Communications"
        title="Send a transmission"
        note={`Direct line: ${EMAIL}`}
      />
      <div className="grid gap-8 lg:grid-cols-[3fr_2fr] items-stretch">
        <Radiogram />
        <TowerRadio />
      </div>
    </section>
  );
}
