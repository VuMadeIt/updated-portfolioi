import type { Metadata } from "next";
import DesignPhilosophyPage from "@/components/design-philosophy/DesignPhilosophyPage";
import { siteUrl } from "@/lib/site";

const description =
  "Why I’m Finally Ready to Call Myself a Designer — a morning by the water, a hummingbird, and the craft that actually feeds you.";

export const metadata: Metadata = {
  title: "Design Philosophy | lucas vu",
  description,
  openGraph: {
    title: "Design Philosophy | lucas vu",
    description,
    url: siteUrl("/design-philosophy"),
  },
  twitter: {
    title: "Design Philosophy | lucas vu",
    description,
  },
};

export default function Page() {
  return <DesignPhilosophyPage />;
}
