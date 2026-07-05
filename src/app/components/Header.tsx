"use client";
import { useEffect, useState } from "react";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Journey" },
  { id: "projects", label: "Missions" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll("section[id]"),
    ) as HTMLElement[];

    const handleScroll = () => {
      const top = window.scrollY;
      setScrolled(top > 60);

      let current = "home";
      sections.forEach((sec) => {
        if (top >= sec.offsetTop - 200) current = sec.id;
      });
      setActive(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <header className={`hud-header ${scrolled ? "scrolled" : ""}`}>
      <a href="#home" className="hud-logo" onClick={close}>
        <b>AADIT</b>.EXE
        <span className="cursor" />
      </a>

      <button
        type="button"
        className={`hud-menu-icon bx ${menuOpen ? "bx-x" : "bx-menu"}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      />

      <nav className={`hud-nav ${menuOpen ? "open" : ""}`}>
        {LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={active === link.id ? "active" : ""}
            onClick={close}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
