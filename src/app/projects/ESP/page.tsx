"use client";
import { useState } from "react";
import Background from "../../components/Background";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem Analysis" },
  { id: "design", label: "Design Solution" },
  { id: "specifications", label: "Specifications" },
];

const PROBLEMS = [
  {
    title: "Neck & Shoulder Strain",
    desc: "Concentrated pressure on a small area leads to discomfort during extended shooting, especially with heavier setups.",
  },
  {
    title: "Poor Weight Distribution",
    desc: "Standard straps fail to distribute weight evenly, causing muscle tension and potential long-term issues.",
  },
  {
    title: "Limited Adjustability",
    desc: "Insufficient customization makes it hard for different body types to achieve optimal comfort.",
  },
  {
    title: "Material Discomfort",
    desc: "Thin, rigid materials dig into the skin, while slippery ones cause constant readjustment.",
  },
];

const FEATURES = [
  {
    num: "01",
    title: "Ergonomic Padding System",
    text: "Wide, contoured memory-foam padding distributes weight across a larger area, reducing pressure points.",
  },
  {
    num: "02",
    title: "Advanced Weight Distribution",
    text: "Cross-body design with adjustable anchor points balances load and reduces single-area strain.",
  },
  {
    num: "03",
    title: "Multi-Point Adjustment",
    text: "Quick-release buckles and multiple adjustment points enable precise customization.",
  },
  {
    num: "04",
    title: "Premium Materials",
    text: "Breathable, moisture-wicking outer layer with a non-slip inner surface for all-day comfort.",
  },
  {
    num: "05",
    title: "Modular Accessories",
    text: "Built-in attachment points for lens caps, memory cards, and small accessories.",
  },
];

const SPECS = [
  { label: "Strap Width", value: "40–50mm padded" },
  { label: "Length Range", value: "90–150cm adjustable" },
  { label: "Weight Capacity", value: "Up to 5kg systems" },
  { label: "Padding", value: "8–12mm memory foam" },
  { label: "Material", value: "Nylon + neoprene" },
  { label: "Weather", value: "Water-resistant coating" },
];

export default function ESP() {
  const [active, setActive] = useState("overview");

  return (
    <>
      <Background />
      <div className="detail-page">
        <div className="detail-hero">
          <div className="detail-inner">
            <a href="/#projects" className="back-link">
              <i
                className="bx bx-left-arrow-alt"
                style={{ fontSize: "2rem" }}
              />{" "}
              Back to Missions
            </a>

            <div
              className="section-tag"
              style={{ textAlign: "left", marginBottom: "1.4rem" }}
            >
              {"// SIDE QUEST — DESIGN"}
            </div>
            <h1 className="detail-title">Camera Strap Redesign</h1>
            <p className="detail-sub">
              A comprehensive Conceptual Design Specification addressing
              ergonomic and functional challenges in traditional camera strap
              design.
            </p>

            <div className="detail-meta">
              <div className="meta-item">
                <div className="box">
                  <i className="bx bxs-bulb" />
                </div>
                <div>
                  <div className="k">Type</div>
                  <div className="v">Product Design</div>
                </div>
              </div>
              <div className="meta-item">
                <div className="box">
                  <i className="bx bxs-file" />
                </div>
                <div>
                  <div className="k">Document</div>
                  <div className="v">Full CDS</div>
                </div>
              </div>
              <div className="meta-item">
                <div className="box">
                  <i className="bx bxs-cog" />
                </div>
                <div>
                  <div className="k">Focus</div>
                  <div className="v">Ergonomics</div>
                </div>
              </div>
            </div>

            <a
              href="/documents/ESP2_CDS.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="gbtn"
            >
              <i className="bx bxs-file-pdf" style={{ fontSize: "2rem" }} />{" "}
              View Design Specification
            </a>
          </div>
        </div>

        <div className="detail-content">
          <div className="tab-nav">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={active === s.id ? "active" : ""}
                onClick={() => setActive(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="tab-panel">
            {active === "overview" && (
              <div className="fade-up">
                <h2>Project Overview</h2>
                <p>
                  This Conceptual Design Specification (CDS) presents a
                  comprehensive redesign of the traditional camera strap,
                  addressing critical ergonomic challenges faced by
                  photographers during extended shooting sessions.
                </p>
                <p>
                  Through user research, ergonomic analysis, and iterative
                  design, it outlines an innovative solution that distributes
                  weight effectively, reduces pressure points, and enhances the
                  overall photography experience.
                </p>
                <div className="callout">
                  <h3>Design Goal</h3>
                  <p>
                    &quot;To create an ergonomic camera strap that significantly
                    reduces physical strain during extended use while
                    maintaining quick-access functionality and durability.&quot;
                  </p>
                </div>
              </div>
            )}

            {active === "problem" && (
              <div className="fade-up">
                <h2>Problem Analysis</h2>
                <p>
                  User surveys and ergonomic analysis identified several key
                  issues with traditional straps:
                </p>
                <div className="mission-grid" style={{ marginTop: "3rem" }}>
                  {PROBLEMS.map((p) => (
                    <div
                      className="panel"
                      key={p.title}
                      style={{ padding: "2.4rem" }}
                    >
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "var(--cyan)",
                          fontSize: "2rem",
                          marginBottom: "1rem",
                        }}
                      >
                        {p.title}
                      </h3>
                      <p style={{ margin: 0 }}>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "design" && (
              <div className="fade-up">
                <h2>Design Solution</h2>
                <p>
                  The proposed design incorporates innovative features that
                  directly address the identified problems.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2.5rem",
                    marginTop: "2rem",
                  }}
                >
                  {FEATURES.map((f) => (
                    <div
                      key={f.num}
                      style={{
                        display: "flex",
                        gap: "2rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-pixel)",
                          fontSize: "1.8rem",
                          color: "var(--cyan)",
                          minWidth: "5rem",
                        }}
                      >
                        {f.num}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "2.2rem",
                            color: "var(--text)",
                            marginBottom: "0.6rem",
                          }}
                        >
                          {f.title}
                        </h3>
                        <p style={{ margin: 0 }}>{f.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "specifications" && (
              <div className="fade-up">
                <h2>Technical Specifications</h2>
                <p>
                  Detailed requirements for materials, dimensions, and
                  performance criteria.
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(24rem, 1fr))",
                    gap: "1.6rem",
                    marginTop: "3rem",
                  }}
                >
                  {SPECS.map((s) => (
                    <div
                      className="panel"
                      key={s.label}
                      style={{ padding: "2rem" }}
                    >
                      <div
                        style={{
                          fontSize: "1.4rem",
                          color: "var(--muted)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: "1.9rem",
                          fontWeight: 700,
                          fontFamily: "var(--font-display)",
                          color: "var(--cyan)",
                        }}
                      >
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="callout">
                  <h3>Key Design Considerations</h3>
                  <ul
                    style={{
                      marginLeft: "2rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                      fontStyle: "normal",
                    }}
                  >
                    <li>Durability tested for 50,000+ adjustment cycles</li>
                    <li>Quick-release mechanism operable with one hand</li>
                    <li>Compatible with standard camera mounting systems</li>
                    <li>Machine-washable, maintenance-free components</li>
                    <li>
                      Sustainable materials with minimal environmental impact
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
