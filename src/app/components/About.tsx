"use client";

import Image from "next/image";
import { useState } from "react";

const TRAITS = [
  "Machine Learning",
  "Full-Stack Development",
  "Embedded & Hardware",
  "Computer Vision",
  "Problem Solving",
];

const STATS = [
  { v: "2029", k: "Graduation" },
  { v: "Cmp Eng", k: "Class / Major" },
  { v: "Yr 2", k: "Current Level" },
];

export default function About() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="about" id="about">
      <div className="section-tag">{"// PLAYER PROFILE"}</div>
      <h2 className="heading">
        About <span>Me</span>
      </h2>

      <div className="about-wrap">
        <div className="avatar-ring">
          <span className="ring" />
          <span className="ring two" />
          <Image
            src="/aaditImage-copy.png"
            alt="Aadit Gupta"
            width={300}
            height={300}
            priority
          />
          <span className="lvl-badge">LV.2</span>
        </div>

        <div className="about-content">
          <h3>
            Computer Engineering Student &amp;{" "}
            <span>Builder</span>
          </h3>
          <p>
            I&apos;m a Computer Engineering student at the University of Toronto,
            working across machine learning, full-stack development, and
            embedded hardware. I like taking ideas from research to shipped
            systems — from ML optimizers to FPGA games.
          </p>

          {showMore && (
            <div className="fade-up">
              <p>
                Currently I&apos;m a research assistant on the CAELUS project,
                building an ML system to optimize emergency drone deployment for
                cardiac-arrest response across Glasgow. Previously I built an
                AI-powered e-invoicing assistant as a product management intern
                at Andersen UAE.
              </p>
              <p>
                On the co-curricular side I&apos;m on UofT&apos;s Autonomous
                Scale Racing and Aerospace teams, working on everything from
                Arduino↔Jetson communication to camera-based target
                localization. Off the clock, you&apos;ll find me shipping side
                quests — full-stack games and hardware projects.
              </p>
            </div>
          )}

          <button className="read-more" onClick={() => setShowMore((v) => !v)}>
            {showMore ? "Show less" : "Read more"}
            <i
              className={`bx ${showMore ? "bx-chevron-up" : "bx-chevron-down"}`}
              style={{ fontSize: "2rem" }}
            />
          </button>

          <div className="trait-title">{"// PERKS & TRAITS"}</div>
          <div className="trait-list">
            {TRAITS.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>

          <div className="stat-title">{"// CORE STATS"}</div>
          <div className="about-stats">
            {STATS.map((s) => (
              <div className="box" key={s.k}>
                <div className="v">{s.v}</div>
                <div className="k">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
