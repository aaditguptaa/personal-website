import Image from "next/image";
import { Reveal } from "./Motion";
import { CornerTicks, SectionHead } from "./Ornaments";

const FIELDS = [
  { k: "Program", v: "BASc Computer Engineering + PEY" },
  { k: "Class of", v: "2029" },
  { k: "Base", v: "Toronto, Canada" },
  { k: "Certified on", v: "ML · full-stack · embedded · vision" },
];

export default function Logbook() {
  return (
    <section
      id="logbook"
      className="scroll-mt-20 max-w-7xl mx-auto px-5 sm:px-8 pt-28"
    >
      <SectionHead
        no="02"
        kicker="Operator's logbook"
        title="The operator on record"
        note="One (1) operator. Curiosity uncalibrated."
      />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] items-start">
        {/* attached photograph */}
        <Reveal className="lg:sticky lg:top-24">
          <figure className="relative inline-block w-full max-w-sm">
            <div className="relative border border-line-strong bg-card p-3 -rotate-1 hover:rotate-0 transition-transform duration-500 ease-out shadow-lift">
              <CornerTicks />
              <Image
                src="/aaditImage.png"
                alt="Aadit Gupta"
                width={640}
                height={720}
                className="w-full h-auto object-cover grayscale-[35%] contrast-[1.02]"
                sizes="(max-width: 1024px) 90vw, 380px"
              />
              <figcaption className="anno pt-3 flex justify-between">
                <span>Plate A — the operator</span>
                <span>Field conditions</span>
              </figcaption>
            </div>
            <span className="stamp absolute -bottom-4 -right-3 rotate-[-7deg] text-sm">
              Airworthy
            </span>
          </figure>
        </Reveal>

        {/* log entry */}
        <div>
          <Reveal>
            <div className="grid gap-x-8 md:grid-cols-[minmax(0,1fr)_9rem]">
              <p className="dropcap font-display text-xl sm:text-2xl leading-relaxed">
                I&apos;m a computer engineering student at the University of
                Toronto who likes problems with consequences. The one I care
                about most right now routes autonomous drones carrying
                defibrillators across Glasgow — a machine-learning system where
                a better answer is measured in minutes of someone&apos;s life.
              </p>
              <p className="anno pt-3 md:pt-2 mb-6 md:mb-0">
                → See Plate 01,
                <br className="hidden md:block" /> CAELUS
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-x-8 md:grid-cols-[minmax(0,1fr)_9rem] mt-8">
              <p className="text-base sm:text-lg leading-relaxed text-soft">
                Before that I built an AI e‑invoicing assistant in Dubai that
                answered tax questions in under five seconds, and I spend term
                time on UofT&apos;s autonomous racing and aerospace teams —
                writing UART protocols, planning minimum‑jerk drone
                trajectories, and laying out PCB copper in Altium.
              </p>
              <p className="anno pt-2 mb-6 md:mb-0">
                → Strips AND‑25, ASR, AER
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="grid gap-x-8 md:grid-cols-[minmax(0,1fr)_9rem] mt-8">
              <p className="text-base sm:text-lg leading-relaxed text-soft">
                The pattern, if there is one: I like the full stack of an idea —
                the math, the code, the silicon, and the reason it should exist
                at all. Off duty it&apos;s cameras, maps, and finding an excuse
                to be somewhere I haven&apos;t been.
              </p>
              <p className="anno pt-2">Hence this chart.</p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-12 border border-line-strong divide-y divide-line bg-card">
              {FIELDS.map((f) => (
                <div
                  key={f.k}
                  className="grid grid-cols-[8.5rem_1fr] gap-3 px-5 py-3"
                >
                  <dt className="anno self-center">{f.k}</dt>
                  <dd className="font-mono text-[13px]">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
