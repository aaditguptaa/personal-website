"use client";

interface Quest {
  year: string;
  title: string;
  organization: string;
  description: string;
  status: "active" | "done";
  highlights?: string[];
}

const education: Quest[] = [
  {
    year: "2024 - 2029",
    title: "BASc, Computer Engineering + PEY Co-op",
    organization: "University of Toronto",
    status: "active",
    description:
      "Pursuing a Bachelor of Applied Science in Computer Engineering with a Professional Experience Year (PEY) co-op.",
    highlights: [
      "Digital Systems (Verilog / FPGA Design)",
      "Computer Fundamentals (C / C++)",
      "Electrical Fundamentals · Calculus III",
    ],
  },
];

const experience: Quest[] = [
  {
    year: "2026 - Present",
    title: "Research Assistant — CAELUS Project",
    organization: "University of Strathclyde",
    status: "active",
    description:
      "Building an ML system to optimize emergency drone deployment for cardiac-arrest response across Glasgow, extending CAELUS — a peer-reviewed framework used by NHS Greater Glasgow and Clyde.",
    highlights: [
      "NSGA-II multi-objective station placement optimizer",
      "Demographic-aware demand model (Poisson NLL, spatial CV)",
      "A* path planning + FlightTimeNet NN surrogate",
    ],
  },
  {
    year: "2025",
    title: "Product Management Intern",
    organization: "Andersen UAE",
    status: "done",
    description:
      "Developed an AI-powered E-Invoicing Assistant that answered client tax queries in under 5 seconds, deployed via a FastAPI REST API.",
    highlights: [
      "GPT-4 response pipeline (−1.3s latency)",
      "ChromaDB vector store over 10,000+ entries",
      "Retrieval + caching cut response times 40%",
    ],
  },
];

function QuestCard({ item }: { item: Quest }) {
  return (
    <div className="quest">
      <div className="quest-card">
        <div className="quest-meta">
          <span className="quest-year">
            <i className="bx bxs-calendar" /> {item.year}
          </span>
          <span className={`quest-status ${item.status}`}>
            {item.status === "active" ? "◉ IN PROGRESS" : "✓ COMPLETE"}
          </span>
        </div>
        <h3>{item.title}</h3>
        <div className="quest-org">{item.organization}</div>
        <p>{item.description}</p>
        {item.highlights && (
          <ul className="quest-rewards">
            {item.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Education() {
  return (
    <section className="education" id="education">
      <div className="section-tag">{"// QUEST LOG"}</div>
      <h2 className="heading">
        My <span>Journey</span>
      </h2>

      <div className="quest-row">
        <div className="quest-col">
          <h3 className="col-title">
            <i className="bx bxs-graduation" /> Education
          </h3>
          <div className="quest-track">
            {education.map((item) => (
              <QuestCard key={item.title} item={item} />
            ))}
          </div>
        </div>

        <div className="quest-col">
          <h3 className="col-title">
            <i className="bx bxs-briefcase" /> Experience
          </h3>
          <div className="quest-track">
            {experience.map((item) => (
              <QuestCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
