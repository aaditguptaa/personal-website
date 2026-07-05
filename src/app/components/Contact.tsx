"use client";
import { useState } from "react";

const EMAIL = "aadit.gupta@mail.utoronto.ca";
const LINKEDIN = "https://www.linkedin.com/in/aadit-gupta-ag";

type Status = "idle" | "sending" | "sent";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openMailto = () => {
    const subject = encodeURIComponent(
      form.subject || `Portfolio message from ${form.name}`,
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  const fireAchievement = () => {
    window.dispatchEvent(
      new CustomEvent("achievement", {
        detail: {
          icon: "📨",
          title: "Message Dispatched!",
          key: "contact-sent",
        },
      }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        // Email sent server-side (Resend configured).
        setStatus("sent");
        fireAchievement();
        setForm({ name: "", email: "", subject: "", message: "" });
        return;
      }
      // No provider configured (or a soft failure) → open the user's mail client.
      openMailto();
      fireAchievement();
      setStatus("idle");
    } catch {
      // Network error → still let them send via their mail client.
      openMailto();
      setStatus("idle");
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="section-tag">{"// COMMS CHANNEL"}</div>
      <h2 className="heading">
        Contact <span>Me</span>
      </h2>

      <div className="terminal">
        <div className="terminal-bar">
          <span className="dot r" />
          <span className="dot y" />
          <span className="dot g" />
          <span className="title">new_message.exe</span>
        </div>
        <div className="terminal-body">
          <div className="terminal-line">
            <span className="prompt">guest@aadit:~$</span> ./send_message --to
            Aadit
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>PLAYER_NAME</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>EMAIL_ADDR</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field full">
                <label>SUBJECT</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field full">
                <label>MESSAGE</label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Type your message…"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: "2.4rem" }}>
              <button
                type="submit"
                className="gbtn"
                disabled={status === "sending"}
                style={
                  status === "sending"
                    ? { opacity: 0.6, cursor: "not-allowed" }
                    : undefined
                }
              >
                {status === "sending" ? (
                  <>
                    <i
                      className="bx bx-loader-alt bx-spin"
                      style={{ fontSize: "2rem" }}
                    />{" "}
                    Transmitting…
                  </>
                ) : status === "sent" ? (
                  <>
                    <i className="bx bx-check" style={{ fontSize: "2rem" }} />{" "}
                    Message Sent!
                  </>
                ) : (
                  <>
                    <i className="bx bx-send" style={{ fontSize: "2rem" }} />{" "}
                    Transmit Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="contact-links">
        <div className="sub">{"// OR REACH OUT DIRECTLY"}</div>
        <div className="contact-icons">
          <a href={`mailto:${EMAIL}`} className="sci-inline" aria-label="Email">
            <span className="chip">
              <i className="bx bx-envelope" style={{ fontSize: "1.8rem" }} />{" "}
              Email
            </span>
          </a>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <span className="chip">
              <i className="bx bxl-linkedin" style={{ fontSize: "1.8rem" }} />{" "}
              LinkedIn
            </span>
          </a>
        </div>
        <p className="contact-email">{EMAIL}</p>
      </div>
    </section>
  );
}
