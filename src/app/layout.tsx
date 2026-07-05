import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Orbitron, Press_Start_2P, Rajdhani } from "next/font/google";
import "boxicons/css/boxicons.min.css";
import "./globals.css";

// Self-hosted via next/font (no render-blocking CDN, no layout shift).
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});
const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-press-start",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aaditgupta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Aadit Gupta — Player One",
  description:
    "The gamified portfolio of Aadit Gupta — Computer Engineering student at the University of Toronto working in machine learning, full-stack development, and embedded hardware.",
  keywords: [
    "Aadit Gupta",
    "Computer Engineering",
    "University of Toronto",
    "Machine Learning",
    "Full-Stack Developer",
    "Portfolio",
  ],
  authors: [{ name: "Aadit Gupta" }],
  icons: { icon: "/a.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Aadit Gupta — Player One",
    description:
      "Gamified portfolio — ML, full-stack, and embedded projects from a UofT Computer Engineering student.",
    siteName: "Aadit Gupta",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aadit Gupta — Player One",
    description:
      "Gamified portfolio — ML, full-stack, and embedded projects from a UofT Computer Engineering student.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} ${pressStart.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
