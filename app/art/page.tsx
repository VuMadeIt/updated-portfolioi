import type { Metadata } from "next";
import ArtPage from "@/components/art/ArtPage";
import { siteUrl } from "@/lib/site";

const artDescription =
  "Paintings, drawings, graphite, sketchbooks, and murals by Lucas Vu.";

export const metadata: Metadata = {
  title: "Art | lucas vu",
  description: artDescription,
  openGraph: {
    title: "Art | lucas vu",
    description: artDescription,
    type: "website",
    url: siteUrl("/art"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Art | lucas vu",
    description: artDescription,
  },
};

export default function Page() {
  return <ArtPage />;
}
