import { Diamond } from "./Ornaments";

export default function Footer() {
  return (
    <footer className="border-t border-line-strong mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-2.5 font-mono text-xs tracking-[0.2em] uppercase font-semibold">
            <Diamond className="text-orange" />
            End of chart
          </p>
          <p className="text-sm text-soft mt-4 max-w-xs leading-relaxed">
            Drawn by hand in React. Set in Fraunces, Archivo &amp; IBM Plex
            Mono. No template harmed in the making.
          </p>
        </div>

        <nav className="flex flex-col gap-2" aria-label="Footer">
          {[
            ["GitHub", "https://github.com/aaditguptaa"],
            ["LinkedIn", "https://www.linkedin.com/in/aadit-gupta-ag"],
            ["Email", "mailto:aadit.gupta@mail.utoronto.ca"],
            ["Résumé", "/documents/Aadit_Gupta_Resume.pdf"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target={
                href.startsWith("http") || href.endsWith(".pdf")
                  ? "_blank"
                  : undefined
              }
              rel="noopener noreferrer"
              className="ink-link self-start font-mono text-xs uppercase tracking-[0.18em]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="md:text-right">
          <p className="anno">43°39′14″N 79°23′10″W · Toronto, Canada</p>
          <p className="anno mt-2">© {new Date().getFullYear()} Aadit Gupta</p>
          <p className="anno mt-2">This chart is not for actual navigation.</p>
          <a
            href="#chart"
            className="ink-link inline-block font-mono text-xs uppercase tracking-[0.18em] mt-5"
          >
            Return to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
