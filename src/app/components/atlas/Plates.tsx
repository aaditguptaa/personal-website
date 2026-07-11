"use client";

import Link from "next/link";
import { DrawnGroup, DrawnPath, m } from "./Motion";
import { CornerTicks, SectionHead } from "./Ornaments";

/* ------- hand-drawn schematics, one per plate ------- */

function SchematicCaelus() {
  return (
    <svg viewBox="0 0 220 150" className="w-full h-auto" aria-hidden="true">
      {/* city blocks */}
      {[
        [12, 14],
        [52, 14],
        [92, 14],
        [12, 52],
        [92, 52],
        [132, 52],
        [12, 96],
        [52, 96],
        [132, 96],
        [172, 96],
        [172, 14],
      ].map(([x, y]) => (
        <DrawnPath
          key={`${x}-${y}`}
          d={`M${x},${y} h30 v28 h-30 Z`}
          stroke="var(--color-line-strong)"
          strokeWidth="1"
          duration={0.7}
        />
      ))}
      {/* stations + coverage */}
      {[
        [66, 66, 34],
        [160, 34, 26],
        [96, 120, 28],
      ].map(([x, y, r], i) => (
        <g key={`${x}-${y}`}>
          <DrawnPath
            d={`M${x + r},${y} a${r},${r} 0 1,0 -${2 * r},0 a${r},${r} 0 1,0 ${2 * r},0`}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            delay={0.4 + i * 0.2}
          />
          <circle cx={x} cy={y} r="3.5" fill="currentColor" />
        </g>
      ))}
      {/* incident + route */}
      <DrawnPath
        d="M66,66 C110,50 140,44 186,112"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="6 5"
        delay={0.9}
      />
      <path
        d="M181,107 l10,10 M191,107 l-10,10"
        stroke="var(--color-stamp)"
        strokeWidth="2"
      />
      <text
        x="12"
        y="144"
        fontFamily="var(--font-mono)"
        fontSize="8"
        letterSpacing="1.5"
        fill="var(--color-soft)"
      >
        STATION COVERAGE — GLASGOW
      </text>
    </svg>
  );
}

function SchematicStreetview() {
  return (
    <svg viewBox="0 0 220 150" className="w-full h-auto" aria-hidden="true">
      {/* street perspective */}
      <DrawnPath
        d="M20,130 L98,42 M200,130 L122,42"
        stroke="var(--color-line-strong)"
        strokeWidth="1.2"
        duration={0.9}
      />
      <DrawnPath
        d="M40,130 L104,42 M180,130 L116,42"
        stroke="var(--color-line)"
        strokeWidth="1"
        duration={0.9}
        delay={0.15}
      />
      {/* horizon buildings */}
      <DrawnPath
        d="M30,74 h28 v-22 h14 v34 M160,86 h24 v-30 h-12"
        stroke="var(--color-line-strong)"
        strokeWidth="1"
        delay={0.3}
      />
      {/* board squares along bottom */}
      {[16, 56, 96, 136, 176].map((x, i) => (
        <DrawnPath
          key={x}
          d={`M${x},134 h28 v-14 h-28 Z`}
          stroke="currentColor"
          strokeWidth="1.2"
          delay={0.4 + i * 0.1}
          duration={0.5}
        />
      ))}
      {/* map pin */}
      <DrawnPath
        d="M110,58 c-9,0 -14,7 -14,13 c0,10 14,25 14,25 c0,0 14,-15 14,-25 c0,-6 -5,-13 -14,-13 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        delay={0.8}
      />
      <circle cx="110" cy="72" r="4" fill="currentColor" />
      <text
        x="12"
        y="112"
        fontFamily="var(--font-mono)"
        fontSize="8"
        letterSpacing="1.5"
        fill="var(--color-soft)"
      >
        PANORAMA → GUESS → SCORE
      </text>
    </svg>
  );
}

function SchematicFpga() {
  return (
    <svg viewBox="0 0 220 150" className="w-full h-auto" aria-hidden="true">
      {/* chip */}
      <DrawnPath
        d="M70,44 h80 v62 h-80 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        duration={0.9}
      />
      {/* pins */}
      {[54, 68, 82, 96].map((y, i) => (
        <DrawnPath
          key={y}
          d={`M56,${y} h14 M150,${y} h14`}
          stroke="var(--color-line-strong)"
          strokeWidth="1.2"
          delay={0.3 + i * 0.08}
          duration={0.3}
        />
      ))}
      {[86, 104, 122, 138].map((x, i) => (
        <DrawnPath
          key={x}
          d={`M${x},30 v14 M${x},106 v14`}
          stroke="var(--color-line-strong)"
          strokeWidth="1.2"
          delay={0.4 + i * 0.08}
          duration={0.3}
        />
      ))}
      <text
        x="84"
        y="80"
        fontFamily="var(--font-mono)"
        fontSize="9"
        letterSpacing="1"
        fill="var(--color-soft)"
      >
        CYCLONE V
      </text>
      {/* clock waveform */}
      <DrawnPath
        d="M14,132 h16 v-12 h16 v12 h16 v-12 h16 v12 h16 v-12 h16 v12 h16"
        stroke="currentColor"
        strokeWidth="1.6"
        delay={0.7}
        duration={1.2}
      />
      {/* falling notes */}
      {[92, 110, 128].map((x, i) => (
        <DrawnPath
          key={x}
          d={`M${x},8 v${10 + i * 4}`}
          stroke="var(--color-stamp)"
          strokeWidth="2.4"
          delay={1 + i * 0.12}
          duration={0.4}
        />
      ))}
      <text
        x="14"
        y="24"
        fontFamily="var(--font-mono)"
        fontSize="8"
        letterSpacing="1.5"
        fill="var(--color-soft)"
      >
        50 MHZ · NO CPU
      </text>
    </svg>
  );
}

function SchematicRacing() {
  return (
    <svg viewBox="0 0 220 150" className="w-full h-auto" aria-hidden="true">
      {/* track outline */}
      <DrawnPath
        d="M36,116 C10,96 16,54 52,44 C88,34 96,66 132,56 C168,46 190,58 196,84 C202,110 170,128 128,124 C86,120 62,136 36,116 Z"
        stroke="var(--color-line-strong)"
        strokeWidth="1.2"
        duration={1.4}
      />
      {/* racing line */}
      <DrawnPath
        d="M40,110 C22,92 28,60 56,52 C92,42 100,70 134,62 C166,54 182,64 188,86 C192,106 166,120 130,116 C92,112 64,128 40,110 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="7 5"
        delay={0.5}
        duration={1.4}
      />
      {/* UART frame */}
      <DrawnPath
        d="M60,20 h100 v16 h-100 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        delay={1}
      />
      {[80, 100, 120, 140].map((x, i) => (
        <DrawnPath
          key={x}
          d={`M${x},20 v16`}
          stroke="var(--color-line-strong)"
          strokeWidth="1"
          delay={1.2 + i * 0.06}
          duration={0.25}
        />
      ))}
      <text
        x="62"
        y="14"
        fontFamily="var(--font-mono)"
        fontSize="8"
        letterSpacing="1.5"
        fill="var(--color-soft)"
      >
        START · DATA · CRC
      </text>
      <circle cx="40" cy="110" r="4" fill="var(--color-stamp)" />
    </svg>
  );
}

function SchematicAero() {
  return (
    <svg viewBox="0 0 220 150" className="w-full h-auto" aria-hidden="true">
      {/* drone */}
      <g transform="translate(42, 40)">
        <DrawnPath
          d="M-12,-12 L12,12 M-12,12 L12,-12"
          stroke="currentColor"
          strokeWidth="1.8"
          duration={0.7}
        />
        {[
          [-12, -12],
          [12, -12],
          [-12, 12],
          [12, 12],
        ].map(([x, y]) => (
          <DrawnPath
            key={`${x},${y}`}
            d={`M${x + 6},${y} a6,6 0 1,0 -12,0 a6,6 0 1,0 12,0`}
            stroke="currentColor"
            strokeWidth="1.4"
            delay={0.4}
          />
        ))}
      </g>
      {/* minimum-jerk trajectory */}
      <DrawnPath
        d="M58,56 C100,86 120,120 176,112"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="6 5"
        delay={0.7}
        duration={1.2}
      />
      {/* velocity profile */}
      <DrawnPath
        d="M20,140 h180 M20,140 C60,108 140,108 196,138"
        stroke="var(--color-line-strong)"
        strokeWidth="1"
        delay={1}
      />
      {/* target crosshair */}
      <g transform="translate(176, 112)">
        <DrawnPath
          d="M12,0 a12,12 0 1,0 -24,0 a12,12 0 1,0 24,0"
          stroke="var(--color-stamp)"
          strokeWidth="1.6"
          delay={1.5}
        />
        <path
          d="M0,-16 v8 M0,8 v8 M-16,0 h8 M8,0 h8"
          stroke="var(--color-stamp)"
          strokeWidth="1.4"
        />
      </g>
      <text
        x="20"
        y="20"
        fontFamily="var(--font-mono)"
        fontSize="8"
        letterSpacing="1.5"
        fill="var(--color-soft)"
      >
        MIN-JERK · GPS DENIED
      </text>
    </svg>
  );
}

function SchematicStrap() {
  return (
    <svg viewBox="0 0 220 150" className="w-full h-auto" aria-hidden="true">
      {/* camera body */}
      <DrawnPath
        d="M84,92 h52 v34 h-52 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        duration={0.8}
      />
      <DrawnPath
        d="M102,92 v-8 h16 v8 M110,116 a8,8 0 1,0 0.1,0"
        stroke="currentColor"
        strokeWidth="1.4"
        delay={0.3}
      />
      {/* strap curve over shoulder */}
      <DrawnPath
        d="M88,96 C56,64 60,28 110,22 C160,28 164,64 132,96"
        stroke="currentColor"
        strokeWidth="1.8"
        delay={0.5}
        duration={1.1}
      />
      <DrawnPath
        d="M92,90 C66,64 70,36 110,30 C150,36 154,64 128,90"
        stroke="var(--color-line-strong)"
        strokeWidth="1"
        strokeDasharray="3 4"
        delay={0.7}
        duration={1.1}
      />
      {/* load arrows */}
      {[
        [70, 58],
        [110, 26],
        [150, 58],
      ].map(([x, y], i) => (
        <DrawnPath
          key={`${x}`}
          d={`M${x},${y - 14} L${x},${y} M${x - 4},${y - 5} L${x},${y} L${x + 4},${y - 5}`}
          stroke="var(--color-stamp)"
          strokeWidth="1.4"
          delay={1 + i * 0.15}
          duration={0.4}
        />
      ))}
      <text
        x="60"
        y="144"
        fontFamily="var(--font-mono)"
        fontSize="8"
        letterSpacing="1.5"
        fill="var(--color-soft)"
      >
        LOAD PATH — SECTION A-A
      </text>
    </svg>
  );
}

/* ------- plate data ------- */

interface Plate {
  no: string;
  slug: string;
  title: string;
  spec: string[];
  stamp: string;
  fig: string;
  Schematic: () => React.ReactElement;
  abstract: string;
}

const PLATES: Plate[] = [
  {
    no: "01",
    slug: "/projects/CAELUS",
    title: "CAELUS Drone Optimizer",
    spec: ["Python", "PyTorch", "NSGA-II", "PostGIS"],
    stamp: "Active research",
    fig: "Fig. 4.1 — station coverage",
    Schematic: SchematicCaelus,
    abstract:
      "When a heart stops in Glasgow, an ambulance takes five to eight minutes. A drone carrying a defibrillator can do it in three. This system decides where the drones wait and how they fly — evolutionary station placement, a demographic demand model, A* routing, and a neural surrogate that predicts flight times a thousand times faster than simulation.",
  },
  {
    no: "02",
    slug: "/projects/AerospaceAutonomy",
    title: "Aerospace Autonomy",
    spec: ["OpenCV", "ROS", "MATLAB", "Docker"],
    stamp: "Flight tested",
    fig: "Fig. 4.2 — approach trajectory",
    Schematic: SchematicAero,
    abstract:
      "Drone autonomy for places GPS can't reach: camera-based target localization at 30 fps on embedded hardware, minimum-jerk trajectory planning, PID control, and ROS plumbing between them — shipped as a single Docker image that flies on any airframe.",
  },
  {
    no: "03",
    slug: "/projects/ScaleRacing",
    title: "Autonomous Scale Racing",
    spec: ["C++", "Arduino", "Jetson", "Altium"],
    stamp: "Race ready",
    fig: "Fig. 4.3 — racing line & frame format",
    Schematic: SchematicRacing,
    abstract:
      "A 1:10 race car that drives itself around a track. I built its spinal cord — a checksummed binary UART protocol carrying sensor data and motor commands between Arduino and Jetson at 500 Hz — and part of its heart, the power-distribution copper in Altium.",
  },
  {
    no: "04",
    slug: "/projects/FPGA",
    title: "FPGA Rhythm Game",
    spec: ["Verilog", "DE1-SoC", "VGA", "PS/2"],
    stamp: "Taped out",
    fig: "Fig. 4.4 — datapath & clock",
    Schematic: SchematicFpga,
    abstract:
      "A rhythm game with no CPU and no software — the game is the circuit. Verilog state machines drive a 640×480 VGA display, scan a PS/2 keyboard, and synthesize PWM audio on a DE1-SoC, everything in lockstep with a 50 MHz clock.",
  },
  {
    no: "05",
    slug: "/projects/Streetview",
    title: "Streetview Monopoly",
    spec: ["React", "Socket.io", "PostgreSQL", "Maps API"],
    stamp: "Deployed",
    fig: "Fig. 4.5 — panorama to score",
    Schematic: SchematicStreetview,
    abstract:
      "Monopoly, except the board is planet Earth. A multiplayer geography game built on Google Streetview — server-authoritative turns, Haversine proximity scoring, and a caching layer that keeps the Maps API bill from becoming the real boss fight.",
  },
  {
    no: "06",
    slug: "/projects/ESP",
    title: "Camera Strap, Redesigned",
    spec: ["Ergonomics", "CDS", "Client liaison"],
    stamp: "Spec issued",
    fig: "Fig. 4.6 — load path, section A-A",
    Schematic: SchematicStrap,
    abstract:
      "The odd one out — no code at all. A full conceptual design specification for an ergonomic camera strap, written as sole client liaison on a five-person engineering team. Wider load paths, memory foam, 42% less strain.",
  },
];

/* ------- the plates themselves ------- */

function PlateRow({ plate, flip }: { plate: Plate; flip: boolean }) {
  const { Schematic } = plate;
  return (
    <m.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 90, damping: 20 }}
    >
      <Link
        href={plate.slug}
        className="group grid md:grid-cols-[3fr_2fr] border border-line-strong bg-card hover:bg-parch transition-colors duration-400 shadow-lift relative overflow-hidden"
      >
        <CornerTicks />

        <div
          className={`px-6 sm:px-10 py-9 sm:py-11 flex flex-col ${flip ? "md:order-2" : ""}`}
        >
          <div className="flex items-baseline justify-between gap-4">
            <p className="anno">Plate {plate.no}</p>
            <span className="stamp text-[10px] rotate-[-3deg]">
              {plate.stamp}
            </span>
          </div>

          <h3 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight mt-4 group-hover:text-orange transition-colors duration-300">
            {plate.title}
          </h3>

          <p className="text-[15px] sm:text-base leading-relaxed text-soft mt-4 max-w-xl">
            {plate.abstract}
          </p>

          <div className="mt-auto pt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
            {plate.spec.map((s) => (
              <span
                key={s}
                className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink"
              >
                {s}
              </span>
            ))}
            <span className="ml-auto font-mono text-[11px] tracking-[0.18em] uppercase text-orange inline-flex items-center gap-2">
              Open case file
              <svg
                width="22"
                height="10"
                viewBox="0 0 22 10"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              >
                <path
                  d="M0 5 h19 M15 1 l5 4 -5 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                />
              </svg>
            </span>
          </div>
        </div>

        <div
          className={`relative border-line-strong text-ink group-hover:text-orange transition-colors duration-400 chart-grid px-6 py-8 flex flex-col justify-center border-t md:border-t-0 ${
            flip ? "md:order-1 md:border-r" : "md:border-l"
          }`}
        >
          <DrawnGroup>
            <Schematic />
          </DrawnGroup>
          <p className="anno mt-4 text-center">{plate.fig}</p>
        </div>
      </Link>
    </m.article>
  );
}

export default function Plates() {
  return (
    <section
      id="plates"
      className="scroll-mt-20 max-w-7xl mx-auto px-5 sm:px-8 pt-28"
    >
      <SectionHead
        no="04"
        kicker="Atlas plates"
        title="Charted expeditions"
        note="Six plates. Each one survived contact with reality."
      />
      <div className="space-y-8">
        {PLATES.map((p, i) => (
          <PlateRow key={p.no} plate={p} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
