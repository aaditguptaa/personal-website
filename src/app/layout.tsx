import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Archivo, Fraunces, IBM_Plex_Mono } from "next/font/google";
import PageTracker from "./components/PageTracker";
import "./globals.css";

// Self-hosted via next/font — no render-blocking CDN, no layout shift.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aaditgupta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Aadit Gupta — Field Atlas",
  description:
    "The field atlas of Aadit Gupta — Computer Engineering at the University of Toronto. Machine-learning systems for emergency drones, FPGA hardware, autonomous vehicles, and other charted expeditions.",
  keywords: [
    "Aadit Gupta",
    "Computer Engineering",
    "University of Toronto",
    "Machine Learning",
    "Robotics",
    "Autonomous Drones",
    "Portfolio",
  ],
  authors: [{ name: "Aadit Gupta" }],
  icons: { icon: "/a.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Aadit Gupta — Field Atlas",
    description:
      "Charted expeditions in machine learning, autonomous drones, and silicon — a UofT Computer Engineering portfolio drawn as an aviation atlas.",
    siteName: "Aadit Gupta",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aadit Gupta — Field Atlas",
    description:
      "Charted expeditions in machine learning, autonomous drones, and silicon.",
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
      className={`${fraunces.variable} ${archivo.variable} ${plexMono.variable}`}
    >
      <body>
        {children}
        <PageTracker />
        <Analytics />
      </body>
    </html>
  );
}
