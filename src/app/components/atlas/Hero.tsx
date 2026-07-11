"use client";

import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Magnetic, m } from "./Motion";

/* The route: Toronto (home) → Dubai (internship) → Glasgow (research). */
const ROUTE_D = "M620,620 C760,668 900,620 940,500 C990,360 940,260 1030,180";

const WAYPOINTS = [
  { id: "CYYZ", name: "TORONTO", note: "HOME BASE — UOFT", x: 620, y: 620 },
  { id: "OMDB", name: "DUBAI", note: "PM INTERN ’25", x: 940, y: 500 },
  { id: "EGPF", name: "GLASGOW", note: "ML RESEARCH ’26", x: 1030, y: 180 },
];

const CONTOURS = [
  "M-40,180 C240,120 420,260 640,210 C860,160 1000,260 1260,200",
  "M-40,300 C200,240 480,380 700,330 C920,280 1080,380 1260,320",
  "M-40,480 C180,420 380,560 620,500 C860,440 1040,560 1260,500",
  "M-40,650 C220,590 420,720 660,670 C900,620 1060,720 1260,660",
  "M-40,760 C260,710 480,820 720,780 C960,740 1100,820 1260,770",
];

/* ---------------------------------------------------------------- */

function DroneGlyph() {
  return (
    <g>
      <circle r="4.5" fill="var(--color-orange)" />
      <g stroke="var(--color-orange)" strokeWidth="1.4" fill="none">
        <line x1="-9" y1="-9" x2="9" y2="9" />
        <line x1="-9" y1="9" x2="9" y2="-9" />
        <circle cx="-9" cy="-9" r="3.4" />
        <circle cx="9" cy="-9" r="3.4" />
        <circle cx="-9" cy="9" r="3.4" />
        <circle cx="9" cy="9" r="3.4" />
      </g>
    </g>
  );
}

/** Marker that flies along the route after the ink finishes drawing. */
function RouteFlyer({ onArrive }: { onArrive: () => void }) {
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();
  const progress = useMotionValue(0);

  useMotionValueEvent(progress, "change", (t) => {
    const path = pathRef.current;
    const marker = markerRef.current;
    if (!path || !marker) return;
    const len = path.getTotalLength();
    const p = path.getPointAtLength(t * len);
    const ahead = path.getPointAtLength(Math.min(len, t * len + 1));
    const angle = (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI;
    marker.setAttribute(
      "transform",
      `translate(${p.x}, ${p.y}) rotate(${angle + 45})`,
    );
  });

  useEffect(() => {
    if (reduced) {
      progress.set(1);
      onArrive();
      return;
    }
    const controls = animate(progress, 1, {
      duration: 3,
      delay: 1.1,
      ease: [0.45, 0.05, 0.35, 1],
      onComplete: onArrive,
    });
    return () => controls.stop();
  }, [progress, reduced, onArrive]);

  return (
    <>
      {/* Invisible measuring copy of the route. */}
      <path ref={pathRef} d={ROUTE_D} fill="none" stroke="none" />
      <g ref={markerRef} transform="translate(620, 620)">
        <DroneGlyph />
      </g>
    </>
  );
}

/** Surveyor's crosshair following the cursor with spring lag. */
function Crosshair({
  hostRef,
}: {
  hostRef: React.RefObject<HTMLElement | null>;
}) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 400, damping: 40, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 400, damping: 40, mass: 0.6 });

  // Pseudo-coordinates centred on Toronto, drifting with the cursor.
  const lat = useTransform(y, (v) => {
    const h = hostRef.current?.clientHeight ?? 800;
    const deg = 43.653 + ((h / 2 - v) / h) * 0.4;
    return `${Math.floor(deg)}°${String(Math.round((deg % 1) * 60)).padStart(2, "0")}′N`;
  });
  const lon = useTransform(x, (v) => {
    const w = hostRef.current?.clientWidth ?? 1200;
    const deg = 79.383 + ((w / 2 - v) / w) * 0.6;
    return `${Math.floor(deg)}°${String(Math.round((deg % 1) * 60)).padStart(2, "0")}′W`;
  });
  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      rawX.set(e.clientX - rect.left);
      rawY.set(e.clientY - rect.top);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [hostRef, rawX, rawY, reduced]);

  if (reduced) return null;

  return (
    <m.div
      aria-hidden="true"
      className="absolute inset-0 z-20 pointer-events-none hidden lg:block"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25 }}
    >
      <m.div
        className="absolute top-0 bottom-0 w-px bg-chart/40"
        style={{ x }}
      />
      <m.div
        className="absolute left-0 right-0 h-px bg-chart/40"
        style={{ y }}
      />
      <m.div className="absolute" style={{ x, y }}>
        <div className="translate-x-3 translate-y-3 font-mono text-[10px] tracking-widest text-chart bg-paper/80 px-1.5 py-0.5 whitespace-nowrap">
          <m.span>{lat}</m.span> <m.span>{lon}</m.span>
        </div>
      </m.div>
    </m.div>
  );
}

/* ---------------------------------------------------------------- */

const LEGEND_ROWS = [
  {
    k: "CURRENT POSITION",
    v: "Research assistant, CAELUS — U. of Strathclyde",
  },
  { k: "HEADING", v: "Machine learning × autonomous flight" },
  { k: "AIRFRAME", v: "Computer Engineering + PEY, UofT ’29" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [arrived, setArrived] = useState(false);

  return (
    <section
      ref={sectionRef}
      id="chart"
      className="relative min-h-dvh chart-grid overflow-hidden flex items-center"
      aria-label="Introduction — personal sectional chart"
    >
      {/* ------ the chart itself ------ */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hatch"
            width="7"
            height="7"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="7"
              stroke="var(--color-chart)"
              strokeWidth="1"
              opacity="0.35"
            />
          </pattern>
        </defs>

        {/* terrain contours */}
        {CONTOURS.map((d, i) => (
          <m.path
            key={d}
            d={d}
            fill="none"
            stroke="var(--color-olive)"
            strokeWidth="1"
            opacity="0.28"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, delay: 0.15 * i, ease: "easeOut" }}
          />
        ))}

        {/* a restricted zone, because every good chart has one */}
        <g opacity="0.5">
          <polygon
            points="120,120 320,90 360,240 180,290"
            fill="url(#hatch)"
            stroke="var(--color-chart)"
            strokeWidth="1"
          />
          <text
            x="200"
            y="200"
            fontFamily="var(--font-mono)"
            fontSize="11"
            letterSpacing="2"
            fill="var(--color-chart)"
          >
            CR(A)-1
          </text>
          <text
            x="168"
            y="218"
            fontFamily="var(--font-mono)"
            fontSize="9"
            letterSpacing="1"
            fill="var(--color-chart)"
          >
            COMFORT ZONE — AVOID
          </text>
        </g>

        {/* compass rose */}
        <m.g
          transform="translate(760, 170)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <circle
            r="52"
            fill="none"
            stroke="var(--color-line-strong)"
            strokeWidth="1"
          />
          <circle
            r="40"
            fill="none"
            stroke="var(--color-line)"
            strokeWidth="1"
          />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * 15 * Math.PI) / 180;
            const r1 = i % 6 === 0 ? 44 : 48;
            return (
              <line
                key={a}
                x1={Math.sin(a) * r1}
                y1={-Math.cos(a) * r1}
                x2={Math.sin(a) * 52}
                y2={-Math.cos(a) * 52}
                stroke="var(--color-line-strong)"
                strokeWidth="1"
              />
            );
          })}
          <path d="M0,-34 L7,8 L0,0 L-7,8 Z" fill="var(--color-orange)" />
          <text
            x="0"
            y="-60"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="12"
            fill="var(--color-ink)"
          >
            N
          </text>
          <text
            x="0"
            y="76"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="9"
            letterSpacing="2"
            fill="var(--color-soft)"
          >
            VAR 10°W
          </text>
        </m.g>

        {/* the route — dashed ink revealed by an animated mask, since
            animating pathLength directly would overwrite the dash pattern */}
        <mask id="route-reveal">
          <m.path
            d={ROUTE_D}
            fill="none"
            stroke="#fff"
            strokeWidth="8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 1.1, ease: [0.45, 0.05, 0.35, 1] }}
          />
        </mask>
        <path
          d={ROUTE_D}
          fill="none"
          stroke="var(--color-orange)"
          strokeWidth="2"
          strokeDasharray="8 7"
          mask="url(#route-reveal)"
        />
        <RouteFlyer onArrive={() => setArrived(true)} />

        {/* waypoints */}
        {WAYPOINTS.map((w, i) => (
          <m.g
            key={w.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 + i * 0.9 }}
          >
            <path
              d={`M${w.x},${w.y - 7} L${w.x + 7},${w.y} L${w.x},${w.y + 7} L${w.x - 7},${w.y} Z`}
              fill="var(--color-paper)"
              stroke="var(--color-ink)"
              strokeWidth="1.6"
            />
            <circle
              cx={w.x}
              cy={w.y}
              r="14"
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="0.8"
              opacity="0.5"
            />
            <text
              x={w.x + 22}
              y={w.y - 2}
              fontFamily="var(--font-mono)"
              fontSize="13"
              fontWeight="600"
              fill="var(--color-ink)"
            >
              {w.id} · {w.name}
            </text>
            <text
              x={w.x + 22}
              y={w.y + 13}
              fontFamily="var(--font-mono)"
              fontSize="10"
              letterSpacing="1"
              fill="var(--color-soft)"
            >
              {w.note}
            </text>
          </m.g>
        ))}

        {/* arrival ping at Glasgow */}
        {arrived && (
          <>
            <circle
              cx="1030"
              cy="180"
              r="14"
              fill="none"
              stroke="var(--color-orange)"
              strokeWidth="1.5"
              style={{
                transformOrigin: "1030px 180px",
                animation: "ping-soft 2.4s cubic-bezier(0,0,0.2,1) infinite",
              }}
            />
            <text
              x="1052"
              y="152"
              fontFamily="var(--font-mono)"
              fontSize="10"
              letterSpacing="1.5"
              fill="var(--color-orange)"
            >
              YOU ARE HERE
            </text>
          </>
        )}

        {/* edge graticule labels */}
        {[
          { x: 60, y: 792, t: "79°30′W" },
          { x: 480, y: 792, t: "60°00′W" },
          { x: 900, y: 792, t: "20°00′W" },
          { x: 1180, y: 60, t: "56°N" },
          { x: 1180, y: 420, t: "48°N" },
        ].map((g) => (
          <text
            key={g.t + g.x}
            x={g.x}
            y={g.y}
            fontFamily="var(--font-mono)"
            fontSize="10"
            letterSpacing="1.5"
            fill="var(--color-faint)"
          >
            {g.t}
          </text>
        ))}
      </svg>

      <Crosshair hostRef={sectionRef} />

      {/* ------ title block / legend ------ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 py-28 md:py-32">
        <m.div
          className="max-w-xl bg-paper/90 border border-line-strong shadow-lift relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            delay: 0.15,
          }}
        >
          <div className="flex items-center justify-between border-b border-line-strong px-5 py-2.5">
            <span className="anno">Sectional chart — personal edition</span>
            <span className="anno">Sheet 1 / 1</span>
          </div>

          <div className="px-5 sm:px-8 pt-8 pb-6">
            <h1 className="font-display font-semibold tracking-tight leading-[0.95] text-6xl sm:text-7xl md:text-[5.2rem]">
              Aadit
              <br />
              <span className="italic font-medium text-orange">Gupta</span>
            </h1>

            <p className="anno mt-5">
              Computer Engineering · University of Toronto · 43°39′N 79°23′W
            </p>

            <p className="font-display text-lg sm:text-xl leading-relaxed mt-6 text-ink">
              I chart systems that have to survive the real world — optimizers
              that route life‑saving drones over Glasgow, games burned into FPGA
              silicon, and vehicles that drive themselves around a track.
            </p>
          </div>

          <dl className="border-t border-line-strong">
            {LEGEND_ROWS.map((row) => (
              <div
                key={row.k}
                className="grid grid-cols-[9.5rem_1fr] gap-3 px-5 sm:px-8 py-2.5 border-b border-line last:border-b-0"
              >
                <dt className="anno self-center">{row.k}</dt>
                <dd className="font-mono text-[13px] text-ink">{row.v}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-4 px-5 sm:px-8 py-6 border-t border-line-strong">
            <Magnetic>
              <a
                href="#logbook"
                className="inline-flex items-center gap-2 bg-ink text-paper font-mono text-xs tracking-[0.18em] uppercase px-5 py-3 hover:bg-orange transition-colors duration-300"
              >
                Begin the tour
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                >
                  <path
                    d="M6 1v9M2 6.5 6 10.5 10 6.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </a>
            </Magnetic>
            <Magnetic strength={0.22}>
              <a
                href="/documents/Aadit_Gupta_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-ink font-mono text-xs tracking-[0.18em] uppercase px-5 py-3 hover:border-orange hover:text-orange transition-colors duration-300"
              >
                Résumé, PDF
              </a>
            </Magnetic>
            <div className="flex items-center gap-4 ml-auto">
              <a
                href="https://github.com/aaditguptaa"
                target="_blank"
                rel="noopener noreferrer"
                className="ink-link font-mono text-xs uppercase tracking-widest"
                aria-label="GitHub"
              >
                GH
              </a>
              <a
                href="https://www.linkedin.com/in/aadit-gupta-ag"
                target="_blank"
                rel="noopener noreferrer"
                className="ink-link font-mono text-xs uppercase tracking-widest"
                aria-label="LinkedIn"
              >
                LI
              </a>
              <a
                href="mailto:aadit.gupta@mail.utoronto.ca"
                className="ink-link font-mono text-xs uppercase tracking-widest"
                aria-label="Email"
              >
                @
              </a>
            </div>
          </div>
        </m.div>
      </div>

      {/* scale bar */}
      <div className="absolute bottom-4 left-5 sm:left-8 right-5 sm:right-8 z-10 flex items-end justify-between pointer-events-none">
        <div>
          <div className="flex h-1.5 w-40 border border-ink/70">
            <span className="w-1/4 bg-ink/70" />
            <span className="w-1/4" />
            <span className="w-1/4 bg-ink/70" />
            <span className="w-1/4" />
          </div>
          <p className="anno mt-1.5">Scale 1:500,000 approx.</p>
        </div>
        <p className="anno hidden md:block">
          Not to be used for actual navigation
        </p>
      </div>
    </section>
  );
}
