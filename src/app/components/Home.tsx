"use client";

import { useEffect, useRef, useState } from "react";

// ⚙️  Update these with your real profile URLs.
const SOCIAL = {
  github: "https://github.com/aaditguptaa",
  linkedin: "https://www.linkedin.com/in/aadit-gupta-ag",
  email: "mailto:aadit.gupta@mail.utoronto.ca",
};

const PHRASES = [
  "Computer Engineering Student",
  "Machine Learning Researcher",
  "Full-Stack Developer",
  "Hardware & Embedded Tinkerer",
];

const SUGGESTIONS = [
  "What are you studying?",
  "Tell me about your projects",
  "What are your skills?",
];

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function HomeSection() {
  // Typing animation
  const [typed, setTyped] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  // Chatbot
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Aadit's in-game guide. Ask me anything about his experience, projects, or skills!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const phrase = PHRASES[phraseIdx];
    const speed = deleting ? 45 : 95;

    if (paused) {
      const t = setTimeout(() => {
        setPaused(false);
        setDeleting(true);
      }, 1800);
      return () => clearTimeout(t);
    }
    if (!deleting && typed === phrase) {
      setPaused(true);
      return;
    }
    if (deleting && typed === "") {
      setDeleting(false);
      setPhraseIdx((p) => (p + 1) % PHRASES.length);
      return;
    }
    const t = setTimeout(() => {
      setTyped(
        deleting
          ? phrase.substring(0, typed.length - 1)
          : phrase.substring(0, typed.length + 1),
      );
    }, speed);
    return () => clearTimeout(t);
  }, [typed, deleting, phraseIdx, paused]);

  useEffect(() => {
    if (bodyRef.current)
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
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
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.response || data.message || "Hmm, I couldn't parse that.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connection glitch! Try again in a moment, or reach Aadit directly via the Contact panel.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <section className="home" id="home">
      <div className="home-grid">
        {/* Player card */}
        <div className="home-content fade-up">
          <div className="welcome-badge">🎮 PLAYER ONE — READY</div>

          <h1>
            Hi, I&apos;m <span className="name">Aadit Gupta</span>
          </h1>

          <div className="class-line">
            <span className="label">{"CLASS //"}</span>
            <span className="typed">{typed}</span>
            <span className="type-cursor" />
          </div>

          <p className="home-bio">
            Computer Engineering student at the University of Toronto, building
            across machine learning, full-stack, and embedded hardware — from ML
            drone-deployment optimizers to FPGA games.
          </p>

          <div className="stat-hud">
            <div className="stat">
              <div className="k">LEVEL</div>
              <div className="v">Yr 2</div>
            </div>
            <div className="stat">
              <div className="k">CLASS</div>
              <div className="v">Cmp Eng</div>
            </div>
            <div className="stat">
              <div className="k">GUILD</div>
              <div className="v">UofT</div>
            </div>
          </div>

          <a
            href="/documents/Aadit_Gupta_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="loot-card"
            aria-label="Download resume"
          >
            <div className="loot-icon">
              <i className="bx bxs-file" style={{ fontSize: "2.4rem" }} />
            </div>
            <div>
              <div className="t">Download Character Sheet</div>
              <div className="s">
                Resume — qualifications, experience &amp; projects
              </div>
            </div>
            <i
              className="bx bx-right-arrow-alt"
              style={{ fontSize: "3rem", color: "var(--gold)" }}
            />
          </a>

          <div className="home-actions">
            <a href="#projects" className="gbtn">
              ▶ View Missions
            </a>
            <a href="#contact" className="gbtn ghost">
              Start Chat
            </a>
          </div>

          <div className="sci">
            <a
              href={SOCIAL.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <i className="bx bxl-github" />
            </a>
            <a
              href={SOCIAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="bx bxl-linkedin" />
            </a>
            <a href={SOCIAL.email} aria-label="Email">
              <i className="bx bx-envelope" />
            </a>
          </div>
        </div>

        {/* NPC chatbot */}
        <div className="npc fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="npc-head">
            <div className="npc-avatar">🤖</div>
            <div>
              <div className="name">Ask the Guide</div>
              <div className="status">ONLINE — ask me anything</div>
            </div>
          </div>

          <div className="npc-body" ref={bodyRef}>
            {messages.map((msg, i) => (
              <div
                className={`msg ${msg.role === "user" ? "user" : "bot"}`}
                key={i}
              >
                <div className="bubble">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="msg bot">
                <div className="bubble">
                  <span className="typing">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="npc-suggest">
              {SUGGESTIONS.map((s) => (
                <button type="button" key={s} onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="npc-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your message…"
              disabled={loading}
              aria-label="Chat message"
            />
            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              <i className="bx bx-send" style={{ fontSize: "2rem" }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
