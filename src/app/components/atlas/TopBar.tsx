"use client";

import { AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { m } from "./Motion";
import { Diamond } from "./Ornaments";

const LINKS = [
  { id: "chart", no: "01", label: "Chart" },
  { id: "logbook", no: "02", label: "Logbook" },
  { id: "strips", no: "03", label: "Strips" },
  { id: "plates", no: "04", label: "Plates" },
  { id: "manifest", no: "05", label: "Manifest" },
  { id: "radio", no: "06", label: "Radio" },
];

export default function TopBar() {
  const [active, setActive] = useState("chart");
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      Boolean,
    ) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    for (const s of sections) observer.observe(s);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-paper/95 border-b border-line-strong">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-6">
        <a
          href="#chart"
          className="flex items-center gap-2.5 font-mono text-xs tracking-[0.2em] uppercase font-semibold"
        >
          <Diamond className="text-orange" />
          A. Gupta — Field Atlas
        </a>

        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Sections"
        >
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              aria-current={active === l.id ? "true" : undefined}
              className={`font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-200 ${
                active === l.id ? "text-orange" : "text-soft hover:text-ink"
              }`}
            >
              <span className="mr-1 opacity-60">{l.no}</span>
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden font-mono text-[11px] tracking-[0.2em] uppercase border border-ink px-3 py-1.5"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close index" : "Open index"}
        >
          {open ? "Close" : "Index"}
        </button>
      </div>

      {/* distance-flown progress line */}
      <div className="relative h-px bg-transparent" aria-hidden="true">
        <m.div
          className="absolute left-0 top-0 h-px w-full bg-orange origin-left"
          style={{ scaleX: progress }}
        />
      </div>

      {/* mobile index overlay */}
      <AnimatePresence>
        {open && (
          <m.nav
            className="md:hidden fixed inset-x-0 top-14 bottom-0 bg-paper chart-grid border-t border-line-strong px-6 py-10 flex flex-col gap-2 z-50"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
            aria-label="Sections"
          >
            {LINKS.map((l, i) => (
              <m.a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-b border-line py-4"
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.04 * i,
                  type: "spring",
                  stiffness: 180,
                  damping: 20,
                }}
              >
                <span className="anno">{l.no}</span>
                <span className="font-display text-3xl">{l.label}</span>
              </m.a>
            ))}
            <p className="anno mt-auto">43°39′N 79°23′W — Toronto, Canada</p>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
