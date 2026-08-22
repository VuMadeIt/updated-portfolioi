import type { Metadata } from "next";
import DesignPhilosophyPage from "@/components/design-philosophy/DesignPhilosophyPage";

const description =
  "Why I'm excited to be a designer in 2026 — Lucas Vu's design philosophy on taste, curiosity, and the privilege of building.";

export const metadata: Metadata = {
  title: "Design Philosophy | lucas vu",
  description,
  openGraph: {
    title: "Design Philosophy | lucas vu",
    description,
    url: "https://www.liumichelle.com/design-philosophy",
  },
  twitter: {
    title: "Design Philosophy | lucas vu",
    description,
  },
};

export default function Page() {
  return <DesignPhilosophyPage />;
}
