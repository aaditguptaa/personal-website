/** Structured content for the atlas case files (project detail pages). */

export type Block =
  | { kind: "paras"; text: string[] }
  | { kind: "steps"; items: { title: string; text: string }[] }
  | { kind: "grid"; items: { title: string; text: string }[] }
  | { kind: "specs"; rows: { label: string; value: string; note?: string }[] }
  | { kind: "callout"; title: string; text?: string; items?: string[] };

export interface CaseSection {
  id: string;
  label: string;
  lede?: string;
  blocks: Block[];
}

export interface CaseFileData {
  slug: string;
  plate: string;
  title: string;
  abstract: string;
  stamp: string;
  meta: { k: string; v: string }[];
  doc?: { label: string; href: string };
  sections: CaseSection[];
}

export const CASES: Record<string, CaseFileData> = {
  caelus: {
    slug: "CAELUS",
    plate: "01",
    title: "CAELUS Drone Optimizer",
    stamp: "Active research",
    abstract:
      "A machine-learning system that decides where emergency drones should wait, and how they should fly, so a defibrillator reaches a cardiac arrest in Glasgow before an ambulance can.",
    meta: [
      { k: "Type", v: "ML research — U. of Strathclyde" },
      { k: "Stack", v: "Python, PyTorch, PostGIS" },
      { k: "Methods", v: "NSGA-II, A*, Monte Carlo" },
      { k: "Status", v: "In progress, 2026 —" },
    ],
    sections: [
      {
        id: "brief",
        label: "Brief",
        blocks: [
          {
            kind: "paras",
            text: [
              "CAELUS is a peer-reviewed drone-logistics framework used by NHS Greater Glasgow and Clyde. My work extends it toward a sharper question: can autonomous drones deliver automated external defibrillators (AEDs) to cardiac arrests faster than the ambulance service — and if so, where exactly should those drones live?",
              "Cardiac arrest survival falls roughly 10% for every minute without defibrillation. Traditional response takes five to eight minutes. The delivery problem is therefore an optimization problem with a body count.",
            ],
          },
          {
            kind: "callout",
            title: "Research goal",
            text: "Determine the minimum number and optimal placement of drone stations in Glasgow to achieve sub-3-minute AED delivery for 95%+ of cardiac-arrest incidents, balancing cost, coverage, and response time.",
          },
        ],
      },
      {
        id: "problem",
        label: "Problem",
        lede: "Three hard constraints shape the design space.",
        blocks: [
          {
            kind: "grid",
            items: [
              {
                title: "The clock",
                text: "Glasgow targets sub-4-minute response for cardiac-arrest calls; ambulances routinely exceed the window. Every design decision is downstream of this deadline.",
              },
              {
                title: "Coverage gaps",
                text: "Ambulance stations were positioned for general demand, not for cardiac emergencies that need immediate defibrillation. The existing network's geometry is the wrong shape.",
              },
              {
                title: "Unknown topology",
                text: "Nobody knows how many drone stations a city needs, where they belong, or how routing behaves under a shifting, demographic-driven call distribution.",
              },
            ],
          },
        ],
      },
      {
        id: "method",
        label: "Method",
        lede: "Four subsystems, each feeding the next.",
        blocks: [
          {
            kind: "steps",
            items: [
              {
                title: "Demand modelling",
                text: "Three-plus years of Glasgow cardiac-arrest call data, modelled with demographic covariates — Poisson negative log-likelihood, validated with spatial cross-validation so the model can't memorize neighbourhoods.",
              },
              {
                title: "Station placement, NSGA-II",
                text: "Evolutionary multi-objective search over candidate station sets, trading coverage against cost against response time. Produces a Pareto front instead of a single opinion.",
              },
              {
                title: "A* path planning",
                text: "Routing around urban obstacles and airspace constraints, with a FlightTimeNet neural surrogate predicting flight times ~1000× faster than full simulation inside the optimizer's inner loop.",
              },
              {
                title: "End-to-end simulation",
                text: "Monte Carlo replay of thousands of call scenarios against each candidate network before any conclusion is allowed to survive.",
              },
            ],
          },
          {
            kind: "callout",
            title: "Toolchain",
            items: [
              "Python — data processing and simulation",
              "NSGA-II — evolutionary multi-objective optimization",
              "A* — urban pathfinding under airspace constraints",
              "PyTorch — FlightTimeNet flight-time surrogate",
              "PostGIS — spatial data and geographic queries",
            ],
          },
        ],
      },
      {
        id: "findings",
        label: "Findings",
        lede: "The optimization produced findings with policy weight.",
        blocks: [
          {
            kind: "specs",
            rows: [
              {
                label: "Response time",
                value: "< 180 s",
                note: "vs ~5–8 min for ambulances",
              },
              {
                label: "Stations required",
                value: "7–9",
                note: "vs an initial estimate of 15+",
              },
              {
                label: "Coverage",
                value: "95%+ of calls",
                note: "within the response window",
              },
              {
                label: "Setup cost",
                value: "~£2.5M",
                note: "vs £8M+ for equivalent ambulances",
              },
            ],
          },
          {
            kind: "callout",
            title: "What it means",
            items: [
              "Drone-assisted response is economically viable and medically significant.",
              "The optimal network is much smaller than intuition suggests — geometry beats volume.",
              "The binding constraints are regulatory and airspace-related, not technical.",
              "Findings prepared for policy review with UK emergency services.",
            ],
          },
        ],
      },
    ],
  },

  aerospace: {
    slug: "AerospaceAutonomy",
    plate: "02",
    title: "Aerospace Autonomy",
    stamp: "Flight tested",
    abstract:
      "An autonomy stack for drone missions where GPS doesn't reach: see the target with a camera, plan a smooth path to it, fly it — and deploy the whole thing anywhere Docker runs.",
    meta: [
      { k: "Type", v: "Robotics — UofT Aerospace Team" },
      { k: "Stack", v: "Python, OpenCV, MATLAB, ROS" },
      { k: "Deployment", v: "Docker" },
      { k: "Focus", v: "Perception → planning → control" },
    ],
    sections: [
      {
        id: "brief",
        label: "Brief",
        blocks: [
          {
            kind: "paras",
            text: [
              "Given a target location, the drone must localize itself using an onboard camera, plan a smooth trajectory, and execute it with precision — without GPS and without a pre-mapped environment.",
              "The stack crosses disciplines on purpose: computer vision for perception, control theory for planning and actuation, and DevOps so the result runs on more than one bench. It is a full-stack robotics system in the literal sense.",
            ],
          },
          {
            kind: "callout",
            title: "Mission objectives",
            items: [
              "Detect and localize target markers from a live camera feed",
              "Plan collision-free, energy-efficient trajectories",
              "Execute paths with sub-meter accuracy",
              "Operate reliably in GPS-denied environments",
              "Deploy across drone platforms via a single Docker image",
            ],
          },
        ],
      },
      {
        id: "problem",
        label: "Problem",
        lede: "Autonomy means answering four questions at once.",
        blocks: [
          {
            kind: "grid",
            items: [
              {
                title: "Where am I?",
                text: "No GPS indoors, underground, or in urban canyons. Position must come from onboard sensors — camera, IMU, compass — which means robust real-time vision.",
              },
              {
                title: "Where do I go?",
                text: "A trajectory from A to B must dodge obstacles while respecting dynamics: acceleration limits, energy budget, and the physics of a small airframe in wind.",
              },
              {
                title: "How do I execute?",
                text: "Real drones are noisy systems. Wind, sensor drift, and actuator delay pull the vehicle off-plan; control laws must pull it back in real time.",
              },
              {
                title: "How do I deploy?",
                text: "Different airframes, OSes, and compute boards. Reproducibility is not a nicety — it decides whether the code flies this week or next term.",
              },
            ],
          },
        ],
      },
      {
        id: "method",
        label: "Method",
        lede: "Modular subsystems, joined by ROS.",
        blocks: [
          {
            kind: "steps",
            items: [
              {
                title: "Vision-based localization",
                text: "Python + OpenCV pipeline detecting target markers in the camera feed, extracting coordinates and orientation at 30+ fps on embedded hardware.",
              },
              {
                title: "Trajectory planning",
                text: "Minimum-jerk trajectory generation in MATLAB/Python — smooth, energy-efficient paths that respect acceleration constraints and feel natural in flight.",
              },
              {
                title: "Control laws",
                text: "PID controllers for multi-axis control, with gains tuned empirically for stability and responsiveness.",
              },
              {
                title: "ROS integration",
                text: "Vision, planning, and control run as separate nodes — /vision/localize, /planning/trajectory, /control/pid — talking over topics, swappable without touching the rest.",
              },
              {
                title: "Containerized deployment",
                text: "OpenCV, ROS, and the MATLAB runtime packaged into one Docker image. The same artifact runs on a laptop, a Jetson, or a cloud VM.",
              },
            ],
          },
        ],
      },
      {
        id: "findings",
        label: "Findings",
        blocks: [
          {
            kind: "grid",
            items: [
              {
                title: "Minimum-jerk is worth the math",
                text: "Minimizing the third derivative of position produces motion that is smoother, more efficient, and visibly less robotic than naive waypoint chasing.",
              },
              {
                title: "Real-time vision is a budget",
                text: "30 fps on embedded hardware is a negotiation between accuracy and speed. Every stage of the pipeline pays rent.",
              },
              {
                title: "Middleware pays off",
                text: "ROS topics, services, and transforms turn a monolith into a system — subsystems were debugged and replaced independently all season.",
              },
              {
                title: "Containers end dependency hell",
                text: "One image, every platform. The gap between research code and something that flies is mostly packaging.",
              },
            ],
          },
          {
            kind: "callout",
            title: "Field notes",
            items: [
              "Simulate extensively before flying — crashes are expensive tutors.",
              "Real-world control is messier than the textbook; tuning is empirical.",
              "Modular design scales; monoliths stall the whole team.",
            ],
          },
        ],
      },
    ],
  },

  racing: {
    slug: "ScaleRacing",
    plate: "03",
    title: "Autonomous Scale Racing",
    stamp: "Race ready",
    abstract:
      "A 1:10-scale self-driving race car built for national competition. My part: the checksummed UART spinal cord between the autonomy brain and the actuators, and a slice of the power-distribution PCB.",
    meta: [
      { k: "Type", v: "Competitive robotics — UofT" },
      { k: "Hardware", v: "Arduino + Nvidia Jetson" },
      { k: "Tools", v: "C++, Python, Altium" },
      { k: "Scope", v: "Real-time control at 500 Hz" },
    ],
    sections: [
      {
        id: "brief",
        label: "Brief",
        blocks: [
          {
            kind: "paras",
            text: [
              "Scale Racing pits university teams against each other with 1:10-scale autonomous vehicles: navigate the track faster and more reliably than everyone else, with no human in the loop.",
              "On the hardware team, I owned the communication layer between the embedded controller (Arduino) and the autonomy computer (Jetson), and contributed a section of the custom PCB handling power distribution and sensor integration.",
            ],
          },
          {
            kind: "callout",
            title: "Team goals",
            items: [
              "Sub-3-minute lap times at competition speed",
              "100% autonomous navigation, no GPS or markers",
              "10+ consecutive runs without a manual reset",
              "Compete against 20+ university teams nationally",
            ],
          },
        ],
      },
      {
        id: "problem",
        label: "Problem",
        blocks: [
          {
            kind: "grid",
            items: [
              {
                title: "Reliable UART at speed",
                text: "Sensor data and motor commands cross a serial link at high sample rates. At racing speed, a corrupted frame is a crashed car.",
              },
              {
                title: "Power management",
                text: "Motors, sensors, and compute all pull from one battery budget. Power delivery has to be coordinated, not hoped for.",
              },
              {
                title: "Integration deadlines",
                text: "The custom PCB sat on the critical path for a national competition. Hardware schedules do not negotiate.",
              },
            ],
          },
        ],
      },
      {
        id: "method",
        label: "Method",
        blocks: [
          {
            kind: "steps",
            items: [
              {
                title: "Arduino firmware",
                text: "Interrupt-driven I/O handlers for sensor reading, motor control, and UART — a 500 Hz update rate with deterministic timing.",
              },
              {
                title: "Custom UART protocol",
                text: "Binary framing with checksums so noise on the wire becomes a rejected frame, not a wrong steering angle.",
              },
              {
                title: "PCB section in Altium",
                text: "Power distribution and sensor integration: routing, via placement, and thermal management on a board that had to work on the first spin.",
              },
              {
                title: "Jetson middleware",
                text: "Python layer interpreting sensor streams, running the autonomy algorithms, and issuing motor commands back down the wire.",
              },
            ],
          },
          {
            kind: "specs",
            rows: [
              {
                label: "Control loop",
                value: "500 Hz",
                note: "interrupt-driven",
              },
              {
                label: "Link",
                value: "UART, binary framed",
                note: "checksummed",
              },
              { label: "Firmware", value: "C++ on Arduino" },
              { label: "PCB", value: "Altium Designer" },
            ],
          },
        ],
      },
      {
        id: "findings",
        label: "Findings",
        blocks: [
          {
            kind: "grid",
            items: [
              {
                title: "Latency is physical",
                text: "50 ms of delay in sensor feedback is the difference between a clean apex and a wall. Profiling for deterministic timing became a habit.",
              },
              {
                title: "Protocols are state machines",
                text: "Weeks of designing framing and checksums taught what every RFC knows: resilient communication is a state-machine problem, not a wiring problem.",
              },
              {
                title: "Hardware–software codesign",
                text: "PCB layout isn't drawing — thermal paths, power rails, and signal integrity decide whether the firmware above them can ever be correct.",
              },
              {
                title: "Debugging under pressure",
                text: "Logic analyzers, oscilloscopes, and serial printf. Systematic debugging with a competition clock running is its own discipline.",
              },
            ],
          },
        ],
      },
    ],
  },

  fpga: {
    slug: "FPGA",
    plate: "04",
    title: "FPGA Rhythm Game",
    stamp: "Taped out",
    abstract:
      "A rhythm game with no CPU and no software. The game is the circuit: Verilog state machines drive a VGA display, scan a PS/2 keyboard, and synthesize audio, all in lockstep at 50 MHz.",
    meta: [
      { k: "Type", v: "Digital hardware design" },
      { k: "Platform", v: "Altera DE1-SoC, Cyclone V" },
      { k: "Language", v: "Verilog" },
      { k: "Display", v: "VGA 640×480 @ 60 Hz" },
    ],
    sections: [
      {
        id: "brief",
        label: "Brief",
        blocks: [
          {
            kind: "paras",
            text: [
              "Every component — graphics, game logic, input, audio — is implemented as digital circuits on an FPGA. There is no processor executing instructions; there are only wires, registers, and clock edges.",
              "That constraint is the point. You stop thinking in sequential program steps and start thinking in clock cycles, state machines, and parallel dataflow — the mental model that everything else in computing quietly sits on.",
            ],
          },
          {
            kind: "callout",
            title: "Design constraints",
            items: [
              "No game engines, no high-level abstractions",
              "All logic expressed in Verilog — gate-level thinking",
              "Real-time display and input with zero latency jitter",
              "Limited on-board memory — aggressive framebuffer management",
            ],
          },
        ],
      },
      {
        id: "design",
        label: "Game design",
        lede: "The player sees a rhythm game. The board sees five parallel machines.",
        blocks: [
          {
            kind: "steps",
            items: [
              {
                title: "Falling-notes mechanics",
                text: "Notes descend the screen; the player keys them as they cross the hit zone. Note positions are counters, hits are comparators.",
              },
              {
                title: "FSM game control",
                text: "A finite state machine sequences idle → playing → game over with fully deterministic behavior — the whole game is formally a state diagram.",
              },
              {
                title: "VGA rendering",
                text: "A custom video driver generates 640×480 timing and sync; pixel buffers are managed with shift registers and dual buffering.",
              },
              {
                title: "Audio synthesis",
                text: "PWM output generates tones and feedback in real time from GPIO — audio as a duty cycle, not a file.",
              },
              {
                title: "Keyboard scanning",
                text: "PS/2 protocol decoding with hardware debouncing for glitch-free input.",
              },
            ],
          },
        ],
      },
      {
        id: "hardware",
        label: "Hardware",
        blocks: [
          {
            kind: "specs",
            rows: [
              {
                label: "Board",
                value: "Altera DE1-SoC",
                note: "Cyclone V FPGA",
              },
              { label: "Display", value: "VGA 640×480 @ 60 Hz" },
              {
                label: "Input",
                value: "PS/2 keyboard",
                note: "hardware debounced",
              },
              { label: "Audio", value: "PWM on GPIO" },
              {
                label: "Memory",
                value: "On-board SRAM",
                note: "framebuffer + game state",
              },
            ],
          },
          {
            kind: "grid",
            items: [
              {
                title: "Datapath",
                text: "Clock dividers for game timing, the game-state FSM, note position counters and comparators, and the score accumulator.",
              },
              {
                title: "I/O & rendering",
                text: "VGA timing controller and sync generators, dual-buffered pixel framebuffer, PS/2 scanner, PWM audio driver.",
              },
            ],
          },
        ],
      },
      {
        id: "findings",
        label: "Findings",
        blocks: [
          {
            kind: "grid",
            items: [
              {
                title: "Timing is everything",
                text: "Every operation costs a known number of clock cycles. Responsive, glitch-free gameplay is an exercise in counting.",
              },
              {
                title: "Parallelism is free",
                text: "VGA scanning, input processing, and game logic run simultaneously without stealing cycles from each other — hardware's superpower.",
              },
              {
                title: "No printf",
                text: "Debugging means simulation, logic analyzers, and reasoning analytically about waveforms. It forces disciplined design.",
              },
              {
                title: "Memory is precious",
                text: "Limited SRAM makes every sprite and buffer negotiable — which pushes you toward procedural graphics and cleverness.",
              },
            ],
          },
        ],
      },
    ],
  },

  streetview: {
    slug: "Streetview",
    plate: "05",
    title: "Streetview Monopoly",
    stamp: "Deployed",
    abstract:
      "A competitive multiplayer geography game built on Google Streetview — server-authoritative turns, Haversine proximity scoring, and a caching layer that keeps the Maps API bill from becoming the final boss.",
    meta: [
      { k: "Type", v: "Full-stack multiplayer game" },
      { k: "Frontend", v: "React, TypeScript, Mapbox" },
      { k: "Backend", v: "Node/Express, PostgreSQL, Socket.io" },
      { k: "Deploy", v: "Docker, AWS EC2, GitHub Actions" },
    ],
    sections: [
      {
        id: "brief",
        label: "Brief",
        blocks: [
          {
            kind: "paras",
            text: [
              "Players are dropped into random Google Streetview panoramas and must guess where on Earth they are. Turns pass around the table, guesses are scored by proximity, and leaderboards keep the rivalry honest — GeoGuessr's premise with Monopoly's turn structure and custom multiplayer.",
            ],
          },
          {
            kind: "callout",
            title: "Design philosophy",
            text: "Make geography fun through friendly competition — knowledge, pattern recognition, and intuition battling for supremacy.",
          },
        ],
      },
      {
        id: "gameplay",
        label: "Gameplay",
        blocks: [
          {
            kind: "steps",
            items: [
              {
                title: "Location-based guessing",
                text: "Random Streetview panoramas, real-world locations, points for accuracy.",
              },
              {
                title: "Turn-based multiplayer",
                text: "Real-time state transitions with server-side enforcement — no cheating, no out-of-order moves.",
              },
              {
                title: "Proximity scoring",
                text: "The Haversine formula measures guess-to-truth distance; closer guesses earn more.",
              },
              {
                title: "Secure API integration",
                text: "All Google Maps calls happen server-side: coordinate generation, location validation, imagery fetching. Keys never reach the client.",
              },
              {
                title: "Leaderboards",
                text: "Persistent records track accuracy, rounds played, and rankings.",
              },
            ],
          },
        ],
      },
      {
        id: "architecture",
        label: "Architecture",
        blocks: [
          {
            kind: "specs",
            rows: [
              {
                label: "Frontend",
                value: "React + TypeScript",
                note: "Material-UI, Mapbox",
              },
              {
                label: "Backend",
                value: "Node.js / Express",
                note: "PostgreSQL, Socket.io",
              },
              {
                label: "APIs",
                value: "Google Maps + Streetview",
                note: "server-side only",
              },
              {
                label: "Deployment",
                value: "Docker on AWS EC2",
                note: "GitHub Actions CI",
              },
            ],
          },
          {
            kind: "callout",
            title: "Key decisions",
            items: [
              "Socket.io for real-time sync — every player sees the same game instantly",
              "Server-authoritative state with optimistic client updates that reconcile on divergence",
              "API keys secured on the backend, never exposed to the client",
              "Recently used locations cached in the database to cut API costs",
            ],
          },
        ],
      },
      {
        id: "findings",
        label: "Findings",
        blocks: [
          {
            kind: "grid",
            items: [
              {
                title: "State sync is the game",
                text: "A canonical server state with optimistic clients was the only architecture that stayed fair and felt fast at the same time.",
              },
              {
                title: "APIs have a meter",
                text: "Maps calls are expensive at scale. A smart caching layer and rate limits turned an unpredictable bill into a budget.",
              },
              {
                title: "Fairness is a feature",
                text: "Server-side validation, fingerprinting, and rate limiting — anti-cheat work is invisible when it works.",
              },
              {
                title: "Geo-algorithms everywhere",
                text: "Haversine for distances, geohashing for spatial queries — geography turns out to be an indexing problem.",
              },
            ],
          },
        ],
      },
    ],
  },

  esp: {
    slug: "ESP",
    plate: "06",
    title: "Camera Strap, Redesigned",
    stamp: "Spec issued",
    abstract:
      "A complete conceptual design specification for an ergonomic camera strap — user research, load-path analysis, and a design that cut strain by 42%. Written as sole client liaison for a five-person engineering team.",
    meta: [
      { k: "Type", v: "Product design — CDS" },
      { k: "Role", v: "Sole client liaison" },
      { k: "Team", v: "Five engineers" },
      { k: "Focus", v: "Ergonomics & load distribution" },
    ],
    doc: {
      label: "Read the full specification (PDF)",
      href: "/documents/ESP2_CDS.pdf",
    },
    sections: [
      {
        id: "brief",
        label: "Brief",
        blocks: [
          {
            kind: "paras",
            text: [
              "Photographers carry kilograms of glass on a centimetre-wide strap for hours. This Conceptual Design Specification redesigns that interface from the load path up: user research, ergonomic analysis, and iterative design toward a strap that distributes weight instead of concentrating it.",
            ],
          },
          {
            kind: "callout",
            title: "Design goal",
            text: "An ergonomic camera strap that significantly reduces physical strain during extended use while keeping quick-access functionality and durability.",
          },
        ],
      },
      {
        id: "problem",
        label: "Problem",
        lede: "Surveys and ergonomic analysis surfaced four repeat offenders.",
        blocks: [
          {
            kind: "grid",
            items: [
              {
                title: "Neck & shoulder strain",
                text: "Pressure concentrated on a small contact area becomes pain over a long shoot, especially with heavier bodies and lenses.",
              },
              {
                title: "Poor weight distribution",
                text: "Standard straps load one narrow line of muscle; tension and long-term issues follow.",
              },
              {
                title: "Limited adjustability",
                text: "Bodies differ; straps mostly don't. Optimal fit was impossible for many users.",
              },
              {
                title: "Material discomfort",
                text: "Thin rigid webbing digs in; slippery materials demand constant readjustment.",
              },
            ],
          },
        ],
      },
      {
        id: "design",
        label: "Design",
        blocks: [
          {
            kind: "steps",
            items: [
              {
                title: "Ergonomic padding system",
                text: "Wide, contoured memory-foam padding spreads load across a larger area and kills pressure points.",
              },
              {
                title: "Cross-body load path",
                text: "Adjustable anchor geometry balances weight across the torso rather than one shoulder line.",
              },
              {
                title: "Multi-point adjustment",
                text: "Quick-release buckles and multiple adjustment points for genuinely individual fit.",
              },
              {
                title: "Materials",
                text: "Breathable moisture-wicking outer, non-slip inner — comfort that survives an all-day shoot.",
              },
              {
                title: "Modular attachments",
                text: "Built-in points for lens caps, memory cards, and small accessories.",
              },
            ],
          },
        ],
      },
      {
        id: "specs",
        label: "Specification",
        blocks: [
          {
            kind: "specs",
            rows: [
              { label: "Strap width", value: "40–50 mm", note: "padded" },
              { label: "Length range", value: "90–150 cm", note: "adjustable" },
              { label: "Load capacity", value: "up to 5 kg" },
              { label: "Padding", value: "8–12 mm memory foam" },
              {
                label: "Materials",
                value: "Nylon + neoprene",
                note: "water-resistant coating",
              },
              {
                label: "Durability",
                value: "50,000+ cycles",
                note: "adjustment tested",
              },
            ],
          },
          {
            kind: "callout",
            title: "Design considerations",
            items: [
              "Quick-release operable with one hand",
              "Compatible with standard camera mounts",
              "Machine-washable, maintenance-free components",
              "Sustainable materials with minimal environmental impact",
            ],
          },
        ],
      },
    ],
  },
};
