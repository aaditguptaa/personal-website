"use client";

import {
  domAnimation,
  LazyMotion,
  MotionConfig,
  m,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useId, useRef } from "react";

/** App-wide motion setup: lazy features + reduced-motion respected. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

const SPRING = { type: "spring", stiffness: 120, damping: 22 } as const;

/** In-view reveal with a physical spring — used sparingly, for blocks of prose. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </m.div>
  );
}

/**
 * A container whose descendants draw themselves when it scrolls into view.
 * The observer lives on an HTML element (reliable everywhere); DrawnPath
 * children inherit the trigger through variant propagation, which also works
 * for paths inside <mask>, where IntersectionObserver never fires.
 */
export function DrawnGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {children}
    </m.div>
  );
}

/**
 * An SVG path that draws itself when its DrawnGroup enters the viewport.
 * Dashed paths are revealed through an animated mask, because animating
 * pathLength directly would overwrite the dash pattern.
 */
export function DrawnPath({
  d,
  delay = 0,
  duration = 1.4,
  stroke = "currentColor",
  strokeWidth = 1.4,
  strokeDasharray,
}: {
  d: string;
  delay?: number;
  duration?: number;
  stroke?: string;
  strokeWidth?: number | string;
  strokeDasharray?: string;
}) {
  const maskId = `dp-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const variants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration, delay, ease: [0.33, 1, 0.68, 1] as const },
    },
  };

  if (!strokeDasharray) {
    return (
      <m.path
        d={d}
        fill="none"
        variants={variants}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  }

  return (
    <>
      <mask id={maskId}>
        <m.path
          d={d}
          fill="none"
          variants={variants}
          stroke="#fff"
          strokeWidth={12}
        />
      </mask>
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        mask={`url(#${maskId})`}
      />
    </>
  );
}

/** Element that leans toward the cursor with spring physics. */
export function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.5 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.5 });

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-block" }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </m.div>
  );
}

export { m, SPRING };
