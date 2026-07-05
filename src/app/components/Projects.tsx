import Link from "next/link";

interface Project {
  title: string;
  description: string;
  href?: string;
  tags: string[];
  difficulty: string;
}

const projects: Project[] = [
  {
    title: "CAELUS Drone Optimizer",
    description:
      "ML system optimizing emergency drone deployment for cardiac-arrest response across Glasgow — NSGA-II station placement, demand modelling, and A* path planning.",
    tags: ["Python", "PyTorch", "NSGA-II", "Research"],
    difficulty: "BOSS FIGHT",
  },
  {
    title: "Streetview Monopoly",
    description:
      "A full-stack multiplayer game using Google Streetview for location-based gameplay, with turn-based state management and secure Google Maps API integration.",
    tags: ["Full-Stack", "Google Maps API", "Multiplayer"],
    difficulty: "CO-OP RAID",
  },
  {
    title: "FPGA Rhythm Game",
    description:
      "A rhythm game on the DE1-SoC board driving a VGA display, keyboard and speakers — game logic built from FSMs, shift registers and counters in Verilog.",
    tags: ["Verilog", "FPGA", "DE1-SoC"],
    difficulty: "HARDWARE BOSS",
  },
  {
    title: "Autonomous Scale Racing",
    description:
      "Hardware team member enabling autonomous Arduino ↔ Nvidia Jetson communication over UART, plus a custom PCB section designed in Altium.",
    tags: ["C++", "Arduino", "Jetson", "Altium"],
    difficulty: "SPEED RUN",
  },
  {
    title: "Aerospace Autonomy",
    description:
      "Camera-based target localization with Python & OpenCV and minimum-jerk trajectory planning in MATLAB/Python, containerized with Docker for autonomous drone missions.",
    tags: ["Python", "OpenCV", "MATLAB", "Docker"],
    difficulty: "FLIGHT SIM",
  },
  {
    title: "Camera Strap Redesign",
    description:
      "A conceptual design specification that made camera straps 42% more ergonomic — served as sole client liaison for a 5-person engineering team.",
    href: "/projects/ESP",
    tags: ["Design", "Ergonomics"],
    difficulty: "SIDE QUEST",
  },
];

function MissionInner({ project, i }: { project: Project; i: number }) {
  return (
    <>
      <div className="mission-top">
        <span className="mission-no">
          MISSION #{String(i + 1).padStart(2, "0")}
        </span>
        <span className="mission-diff">{project.difficulty}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="mission-tags">
        {project.tags.map((tag) => (
          <span className="chip" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      {project.href ? (
        <span className="mission-cta">
          Enter Mission{" "}
          <i className="bx bx-right-arrow-alt" style={{ fontSize: "2.2rem" }} />
        </span>
      ) : (
        <span className="mission-cta" style={{ color: "var(--green)" }}>
          <i className="bx bx-check-circle" style={{ fontSize: "2rem" }} />{" "}
          Deployed
        </span>
      )}
    </>
  );
}

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="section-tag">{"// MISSION SELECT"}</div>
      <h2 className="heading">
        My <span>Missions</span>
      </h2>

      <div className="mission-grid">
        {projects.map((project, i) =>
          project.href ? (
            <Link
              key={project.title}
              href={project.href}
              className="mission fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <MissionInner project={project} i={i} />
            </Link>
          ) : (
            <div
              key={project.title}
              className="mission fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <MissionInner project={project} i={i} />
            </div>
          ),
        )}
      </div>
    </section>
  );
}
