import type { Metadata } from "next";
import CaseFile from "../../components/atlas/CaseFile";
import { CASES } from "../../data/projects";

const data = CASES.streetview;

export const metadata: Metadata = {
  title: `${data.title} — Aadit Gupta`,
  description: data.abstract,
};

export default function Page() {
  return <CaseFile data={data} />;
}
