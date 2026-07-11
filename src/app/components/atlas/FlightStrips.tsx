"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { m } from "./Motion";
import { SectionHead } from "./Ornaments";

interface Strip {
  callsign: string;
  time: string;
  role: string;
  org: string;
  status: "ACTIVE" | "CLOSED" | "ENROLLED";
  accent: string; // left-edge colour class
  brief: string;
  log: string[];
}

const OPS: Strip[] = [
  {
    callsign: "CAE-26",
    time: "2026 — NOW",
    role: "Research Assistant, CAELUS Project",
    org: "University of Strathclyde · Glasgow",
    status: "ACTIVE",
    accent: "bg-orange",
    brief:
      "Extending CAELUS — a peer-reviewed drone-logistics framework used by NHS Greater Glasgow & Clyde — with an ML system that decides where drone stations go and how they fly to cardiac arrests.",
    log: [
      "NSGA-II multi-objective optimizer for station placement",
      "Demographic-aware demand model (Poisson NLL, spatial CV)",
      "A* path planning + FlightTimeNet neural surrogate",
    ],
  },
  {
    callsign: "AND-25",
    time: "2025",
    role: "Product Management Intern",
    org: "Andersen UAE · Dubai",
    status: "CLOSED",
    accent: "bg-olive",
    brief:
      "Shipped an AI e-invoicing assistant that answered client tax queries in under five seconds, deployed behind a FastAPI REST API.",
    log: [
      "GPT-4 response pipeline, −1.3 s latency",
      "ChromaDB vector store over 10,000+ entries",
      "Retrieval + caching cut response times 40%",
    ],
  },
  {
    callsign: "ASR-25",
    time: "2025 — NOW",
    role: "Hardware Team, Autonomous Scale Racing",
    org: "University of Toronto",
    status: "ACTIVE",
    accent: "bg-orange",
    brief:
      "1:10-scale self-driving race car. I own the link between the autonomy brain and the actuators.",
    log: [
      "Custom binary UART protocol, Arduino ↔ Jetson at 500 Hz",
      "Power-distribution PCB section in Altium",
    ],
  },
  {
    callsign: "AER-25",
    time: "2025 — NOW",
    role: "Autonomy, UofT Aerospace Team",
    org: "University of Toronto",
    status: "ACTIVE",
    accent: "bg-orange",
    brief:
      "Autonomous drone missions in GPS-denied environments — perception, planning, and packaging.",
    log: [
      "Camera-based target localization, Python + OpenCV",
      "Minimum-jerk trajectory planning, MATLAB/Python",
      "Docker images so the stack flies on any airframe",
    ],
  },
];

const TRAINING: Strip[] = [
  {
    callsign: "UOFT-24",
    time: "2024 — 2029",
    role: "BASc Computer Engineering + PEY Co-op",
    org: "University of Toronto",
    status: "ENROLLED",
    accent: "bg-chart",
    brief:
      "Five-year engineering program with a professional experience year in industry.",
    log: [
      "Digital systems — Verilog & FPGA design",
      "Computer fundamentals — C / C++",
      "Electrical fundamentals · Calculus III",
    ],
  },
];

function StripRow({ strip, index }: { strip: Strip; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `strip-${strip.callsign}`;

  return (
    <m.div
      initial={{ opacity: 0, x: -48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 110,
        damping: 20,
        delay: index * 0.07,
      }}
    >
      <m.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full text-left bg-card border border-line-strong shadow-lift relative overflow-hidden cursor-pointer group"
        whileHover={{ x: 8 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        <span
          className={`absolute left-0 top-0 bottom-0 w-1.5 ${strip.accent}`}
        />
        <span className="grid grid-cols-[5.5rem_1fr_auto] @2xl:grid-cols-[6.5rem_7.5rem_1fr_7rem] items-stretch divide-x divide-line">
          <span className="px-3 @2xl:px-4 py-4 font-mono font-semibold text-sm tracking-wider self-center">
            {strip.callsign}
          </span>
          <span className="hidden @2xl:flex px-4 py-4 font-mono text-[11px] tracking-widest text-soft items-center">
            {strip.time}
          </span>
          <span className="px-4 py-3.5 min-w-0">
            <span className="block font-display font-semibold text-base @2xl:text-lg leading-snug">
              {strip.role}
            </span>
            <span className="block font-mono text-[11px] tracking-wider text-soft mt-0.5 truncate">
              {strip.org}
            </span>
            <span className="block @2xl:hidden font-mono text-[10px] tracking-widest text-faint mt-1">
              {strip.time}
            </span>
          </span>
          <span className="px-3 @2xl:px-4 py-4 font-mono text-[10px] tracking-[0.18em] self-center justify-self-end @2xl:justify-self-auto">
            <span
              className={`inline-flex items-center gap-1.5 ${
                strip.status === "CLOSED" ? "text-soft" : "text-orange"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  strip.status === "CLOSED"
                    ? "bg-soft"
                    : "bg-orange animate-pulse"
                }`}
              />
              {strip.status}
            </span>
          </span>
        </span>
      </m.button>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 26 }}
            className="overflow-hidden"
          >
            <div className="border-x border-b border-line bg-paper px-5 sm:px-8 py-5 ml-1.5">
              <p className="text-sm sm:text-base text-soft leading-relaxed max-w-3xl">
                {strip.brief}
              </p>
              <ul className="mt-4 space-y-1.5">
                {strip.log.map((item) => (
                  <li
                    key={item}
                    className="font-mono text-[12px] sm:text-[13px] flex gap-3"
                  >
                    <span className="text-orange shrink-0">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

export default function FlightStrips() {
  return (
    <section
      id="strips"
      className="scroll-mt-20 max-w-7xl mx-auto px-5 sm:px-8 pt-28"
    >
      <SectionHead
        no="03"
        kicker="Flight progress strips"
        title="Operations board"
        note="Live board — pull a strip to read it."
      />

      <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div>
          <p className="anno mb-4">Operations</p>
          <div className="space-y-3 @container">
            {OPS.map((s, i) => (
              <StripRow key={s.callsign} strip={s} index={i} />
            ))}
          </div>
        </div>

        <div>
          <p className="anno mb-4">Training</p>
          <div className="space-y-3 @container">
            {TRAINING.map((s, i) => (
              <StripRow key={s.callsign} strip={s} index={i} />
            ))}
          </div>
          <p className="font-mono text-[11px] leading-relaxed text-soft border border-dashed border-line-strong p-4 mt-6">
            NOTE — Strips are ordered by recency, not by importance. All
            timestamps local to wherever the laptop was.
          </p>
        </div>
      </div>
    </section>
  );
}
