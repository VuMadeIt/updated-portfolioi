import type { Metadata } from "next";
import SystemPage from "@/components/system/SystemPage";

export const metadata: Metadata = {
  title: "Design System | lucas vu",
  description:
    "The complete visual language of lucas vu — colors, typography, shadows, radii, spacing, materials, motion, components, and experiments.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SystemPage />;
}
