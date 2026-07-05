"use client";
import { useEffect, useRef, useState } from "react";

const CATEGORIES = [
  {
    title: "Languages",
    icon: "💻",
    skills: [
      { name: "Python", level: 92 },
      { name: "C / C++", level: 82 },
      { name: "TypeScript", level: 85 },
      { name: "SQL", level: 78 },
    ],
  },
  {
    title: "ML & Data Science",
    icon: "🧠",
    skills: [
      { name: "PyTorch", level: 82 },
      { name: "NumPy / Pandas", level: 90 },
      { name: "scikit-learn", level: 85 },
      { name: "Optimization (NSGA-II)", level: 80 },
    ],
  },
  {
    title: "Frameworks & Libraries",
    icon: "🧩",
    skills: [
      { name: "React & Node.js", level: 88 },
      { name: "FastAPI / Django", level: 82 },
      { name: "OpenCV", level: 80 },
      { name: "Tailwind CSS", level: 88 },
    ],
  },
  {
    title: "Tools & Hardware",
    icon: "🛠️",
    skills: [
      { name: "Git & Docker", level: 88 },
      { name: "MATLAB", level: 80 },
      { name: "Altium (PCB)", level: 72 },
      { name: "Verilog / FPGA", level: 78 },
    ],
  },
];

function toLevel(pct: number) {
  return Math.max(1, Math.round(pct / 10));
}

export default function SkillsSection() {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="skills" id="skills" ref={ref}>
      <div className="section-tag">{"// SKILL TREE"}</div>
      <h2 className="heading">
        My <span>Skills</span>
      </h2>

      <div className="skill-grid">
        {CATEGORIES.map((cat, ci) => (
          <div
            className="skill-tree fade-up"
            key={cat.title}
            style={{ animationDelay: `${ci * 0.12}s` }}
          >
            <div className="skill-tree-head">
              <span className="ico">{cat.icon}</span>
              <h3>{cat.title}</h3>
            </div>
            {cat.skills.map((skill, si) => (
              <div className="skill" key={skill.name}>
                <div className="skill-label">
                  <span className="n">{skill.name}</span>
                  <span className="lv">LV.{toLevel(skill.level)}</span>
                </div>
                <div className="skill-bar">
                  <div
                    className="skill-fill"
                    style={{
                      width: inView ? `${skill.level}%` : "0%",
                      transitionDelay: `${ci * 0.12 + si * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
