import { Reveal } from "./Motion";
import { SectionHead } from "./Ornaments";

interface Item {
  name: string;
  role: string;
  use: string[];
}

const GROUPS: { title: string; code: string; items: Item[] }[] = [
  {
    title: "Languages",
    code: "LNG",
    items: [
      {
        name: "Python",
        role: "Primary instrument",
        use: ["CAELUS", "AER-25", "AND-25"],
      },
      {
        name: "C / C++",
        role: "Firmware & fundamentals",
        use: ["ASR-25", "UOFT-24"],
      },
      {
        name: "TypeScript",
        role: "Interfaces, incl. this one",
        use: ["STREETVIEW", "ATLAS"],
      },
      { name: "Verilog", role: "Hardware description", use: ["FPGA"] },
      { name: "SQL", role: "Storage & queries", use: ["STREETVIEW", "ATLAS"] },
    ],
  },
  {
    title: "ML & optimization",
    code: "OPT",
    items: [
      { name: "PyTorch", role: "Neural surrogates", use: ["CAELUS"] },
      { name: "NSGA-II", role: "Multi-objective search", use: ["CAELUS"] },
      {
        name: "NumPy / Pandas",
        role: "Data handling",
        use: ["CAELUS", "AND-25"],
      },
      { name: "scikit-learn", role: "Classical models & CV", use: ["CAELUS"] },
    ],
  },
  {
    title: "Systems & hardware",
    code: "HW",
    items: [
      { name: "Arduino / Jetson", role: "Embedded compute", use: ["ASR-25"] },
      { name: "UART protocols", role: "Framing, checksums", use: ["ASR-25"] },
      { name: "Altium", role: "PCB layout", use: ["ASR-25"] },
      { name: "DE1-SoC FPGA", role: "Digital design", use: ["FPGA"] },
      { name: "ROS", role: "Robot middleware", use: ["AER-25"] },
    ],
  },
  {
    title: "Web & field kit",
    code: "KIT",
    items: [
      {
        name: "React / Next.js",
        role: "Frontends",
        use: ["STREETVIEW", "ATLAS"],
      },
      { name: "FastAPI / Node", role: "APIs", use: ["AND-25", "STREETVIEW"] },
      { name: "OpenCV", role: "Perception", use: ["AER-25"] },
      {
        name: "Docker",
        role: "Reproducible deploys",
        use: ["AER-25", "AND-25"],
      },
      { name: "MATLAB", role: "Trajectory math", use: ["AER-25"] },
    ],
  },
];

export default function Manifest() {
  return (
    <section
      id="manifest"
      className="scroll-mt-20 max-w-7xl mx-auto px-5 sm:px-8 pt-28"
    >
      <SectionHead
        no="05"
        kicker="Equipment manifest"
        title="Carried on all missions"
        note="No proficiency bars — gear is either flight-worthy or it stays in the shop."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {GROUPS.map((group, gi) => (
          <Reveal key={group.code} delay={gi * 0.06}>
            <div className="border border-line-strong bg-card h-full">
              <div className="flex items-center justify-between border-b border-line-strong px-5 py-3">
                <h3 className="font-mono text-xs font-semibold tracking-[0.2em] uppercase">
                  {group.title}
                </h3>
                <span className="anno">{group.code}</span>
              </div>
              <ul>
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="group grid grid-cols-[1fr_auto] sm:grid-cols-[11rem_1fr_auto] gap-x-4 gap-y-1 items-baseline px-5 py-3 border-b border-line last:border-b-0 hover:bg-parch transition-colors duration-200"
                  >
                    <span className="font-display font-medium text-lg leading-tight">
                      {item.name}
                    </span>
                    <span className="hidden sm:block text-[13px] text-soft">
                      {item.role}
                    </span>
                    <span className="justify-self-end text-right space-x-2 whitespace-nowrap">
                      {item.use.map((u) => (
                        <span
                          key={u}
                          className="font-mono text-[10px] tracking-[0.12em] text-chart group-hover:text-orange transition-colors duration-200"
                        >
                          {u}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="anno mt-6">
          Cross-references point to plates (Fig. 4) and strips (Fig. 3).
          &ldquo;ATLAS&rdquo; is the document you are reading.
        </p>
      </Reveal>
    </section>
  );
}
