"use client";

export default function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="footer">
      <p>
        <b>© {new Date().getFullYear()} Aadit Gupta</b> — Thanks for playing.
        All rights reserved.
      </p>
      <button className="respawn" onClick={toTop} aria-label="Back to top">
        <i className="bx bx-up-arrow-alt" style={{ fontSize: "2rem" }} />{" "}
        Respawn
      </button>
    </footer>
  );
}
