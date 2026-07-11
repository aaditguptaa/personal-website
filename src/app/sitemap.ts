import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aaditgupta.vercel.app";

const PROJECTS = [
  "CAELUS",
  "AerospaceAutonomy",
  "ScaleRacing",
  "FPGA",
  "Streetview",
  "ESP",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...PROJECTS.map((slug) => ({
      url: `${SITE_URL}/projects/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
