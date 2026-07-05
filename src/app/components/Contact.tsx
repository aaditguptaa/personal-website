"use client";
import { useState } from "react";

const EMAIL = "aadit.gupta@mail.utoronto.ca";
const LINKEDIN = "https://www.linkedin.com/in/aadit-gupta-ag";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Compose a real email via the user's mail client — works with no backend.
    const subject = encodeURIComponent(
      form.subject || `Portfolio message from ${form.name}`,
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("achievement", {
          detail: {
            icon: "📨",
            title: "Message Dispatched!",
            key: "contact-sent",
          },
        }),
      );
    }
    setForm({ name: "", email: "", subject: "", message: "" });
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
              <button type="submit" className="gbtn">
                <i className="bx bx-send" style={{ fontSize: "2rem" }} />{" "}
                Transmit Message
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
