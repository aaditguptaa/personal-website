"use client";

import Link from "next/link";
import type { Block, CaseFileData } from "../../data/projects";
import { CASES } from "../../data/projects";
import Footer from "./Footer";
import { MotionProvider, m, Reveal } from "./Motion";
import { CornerTicks, Diamond } from "./Ornaments";

/* ---------------- block renderers ---------------- */

function Paras({ text }: { text: string[] }) {
  return (
    <div className="space-y-5">
      {text.map((t) => (
        <p
          key={t.slice(0, 24)}
          className="text-base sm:text-lg leading-relaxed text-soft max-w-3xl"
        >
          {t}
        </p>
      ))}
    </div>
  );
}

function Steps({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="relative">
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 0.05}>
          <li className="relative grid grid-cols-[2.6rem_1fr] gap-x-5 pb-9 last:pb-0">
            {/* dashed connector */}
            {i < items.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-[1.05rem] top-9 bottom-0 w-px border-l border-dashed border-line-strong"
              />
            )}
            <span className="relative z-10 w-9 h-9 border border-ink bg-card rotate-45 flex items-center justify-center">
              <span className="-rotate-45 font-mono text-[11px] font-semibold">
                {String(i + 1).padStart(2, "0")}
              </span>
            </span>
            <div className="pt-1">
              <h3 className="font-display font-semibold text-xl sm:text-2xl tracking-tight">
                {item.title}
              </h3>
              <p className="text-[15px] sm:text-base leading-relaxed text-soft mt-1.5 max-w-2xl">
                {item.text}
              </p>
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

function Grid({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 0.05}>
          <div className="border border-line-strong bg-card p-6 h-full hover:bg-parch transition-colors duration-300">
            <h3 className="font-display font-semibold text-lg sm:text-xl tracking-tight">
              {item.title}
            </h3>
            <p className="text-[14px] sm:text-[15px] leading-relaxed text-soft mt-2">
              {item.text}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function Specs({
  rows,
}: {
  rows: { label: string; value: string; note?: string }[];
}) {
  return (
    <div className="border border-line-strong bg-card divide-y divide-line">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[minmax(7rem,1fr)_auto] sm:grid-cols-[12rem_1fr_auto] items-baseline gap-x-6 gap-y-1 px-5 sm:px-6 py-3.5"
        >
          <span className="anno">{row.label}</span>
          <span className="font-display font-semibold text-lg sm:text-xl text-orange">
            {row.value}
          </span>
          {row.note && (
            <span className="font-mono text-[11px] text-soft col-span-2 sm:col-span-1 sm:text-right">
              {row.note}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function Callout({
  title,
  text,
  items,
}: {
  title: string;
  text?: string;
  items?: string[];
}) {
  return (
    <div className="relative border border-line-strong bg-parch px-6 sm:px-8 py-6">
      <CornerTicks />
      <p className="anno mb-3">{title}</p>
      {text && (
        <p className="font-display italic text-lg sm:text-xl leading-relaxed max-w-2xl">
          &ldquo;{text}&rdquo;
        </p>
      )}
      {items && (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item}
              className="font-mono text-[12px] sm:text-[13px] leading-relaxed flex gap-3"
            >
              <span className="text-orange shrink-0">▸</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "paras":
      return <Paras text={block.text} />;
    case "steps":
      return <Steps items={block.items} />;
    case "grid":
      return <Grid items={block.items} />;
    case "specs":
      return <Specs rows={block.rows} />;
    case "callout":
      return (
        <Callout title={block.title} text={block.text} items={block.items} />
      );
  }
}

/* ---------------- the case file ---------------- */

export default function CaseFile({ data }: { data: CaseFileData }) {
  const order = Object.values(CASES);
  const idx = order.findIndex((c) => c.slug === data.slug);
  const next = order[(idx + 1) % order.length];

  return (
    <MotionProvider>
      {/* file header */}
      <div className="border-b border-line-strong bg-paper/95 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-12 flex items-center justify-between">
          <Link
            href="/#plates"
            className="ink-link font-mono text-[11px] tracking-[0.18em] uppercase"
          >
            ← Return to atlas
          </Link>
          <span className="anno">Case file — Plate {data.plate}</span>
        </div>
      </div>

      <main className="min-h-dvh">
        {/* hero */}
        <header className="chart-grid border-b border-line-strong">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
            >
              <div className="flex flex-wrap items-center gap-4">
                <p className="anno">Plate {data.plate} of 06</p>
                <span className="stamp text-[11px] rotate-[-3deg]">
                  {data.stamp}
                </span>
              </div>

              <h1 className="font-display font-semibold tracking-tight text-4xl sm:text-6xl md:text-7xl mt-5 max-w-4xl">
                {data.title}
              </h1>

              <p className="font-display text-lg sm:text-2xl leading-relaxed text-soft mt-6 max-w-3xl">
                {data.abstract}
              </p>

              <dl className="mt-10 border border-line-strong bg-card/85 divide-y divide-line max-w-2xl">
                {data.meta.map((row) => (
                  <div
                    key={row.k}
                    className="grid grid-cols-[7.5rem_1fr] gap-3 px-5 py-2.5"
                  >
                    <dt className="anno self-center">{row.k}</dt>
                    <dd className="font-mono text-[13px]">{row.v}</dd>
                  </div>
                ))}
              </dl>

              {data.doc && (
                <a
                  href={data.doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 border border-ink font-mono text-xs tracking-[0.18em] uppercase px-5 py-3 hover:border-orange hover:text-orange transition-colors duration-300"
                >
                  {data.doc.label}
                </a>
              )}
            </m.div>
          </div>
        </header>

        {/* body */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid gap-12 lg:grid-cols-[10rem_1fr]">
          <nav className="hidden lg:block" aria-label="Case file sections">
            <ol className="sticky top-24 space-y-3">
              {data.sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="ink-link font-mono text-[11px] tracking-[0.16em] uppercase text-soft hover:text-ink"
                  >
                    §{i + 1} {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0 space-y-20">
            {data.sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
              >
                <Reveal>
                  <div className="flex items-center gap-3 mb-2">
                    <Diamond className="text-orange" />
                    <p className="anno">
                      §{i + 1} — {section.label}
                    </p>
                    <div className="route-rule flex-1" />
                  </div>
                  {section.lede && (
                    <p className="font-display italic text-xl sm:text-2xl tracking-tight mt-4 mb-8">
                      {section.lede}
                    </p>
                  )}
                </Reveal>
                <div className={`space-y-8 ${section.lede ? "" : "mt-8"}`}>
                  {section.blocks.map((block, bi) => (
                    <BlockView key={`${section.id}-${bi}`} block={block} />
                  ))}
                </div>
              </section>
            ))}

            {/* next plate */}
            <Link
              href={`/projects/${next.slug}`}
              className="group flex items-center justify-between border border-line-strong bg-card hover:bg-parch transition-colors duration-300 px-6 sm:px-8 py-6"
            >
              <div>
                <p className="anno">Next — Plate {next.plate}</p>
                <p className="font-display font-semibold text-2xl sm:text-3xl tracking-tight mt-1 group-hover:text-orange transition-colors duration-300">
                  {next.title}
                </p>
              </div>
              <svg
                width="34"
                height="14"
                viewBox="0 0 34 14"
                aria-hidden="true"
                className="text-orange transition-transform duration-300 group-hover:translate-x-2 shrink-0 ml-6"
              >
                <path
                  d="M0 7 h30 M25 1.5 l6 5.5 -6 5.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </MotionProvider>
  );
}
