import type { Metadata } from "next";
import GalleryPage from "@/components/gallery/GalleryPage";
import { siteUrl } from "@/lib/site";

const galleryDescription =
  "An interactive art gallery to visualize your ideas — generate paintings inspired by The Met.";

const galleryOgImage = {
  url: siteUrl("/gallery-og.png?v=4"),
  width: 1200,
  height: 630,
  alt: "Lucas Vu’s interactive Gallery — framed AI paintings in a 3D room",
};

export const metadata: Metadata = {
  title: "gallery",
  description: galleryDescription,
  openGraph: {
    title: "gallery · lucas vu",
    description: galleryDescription,
    type: "website",
    url: siteUrl("/gallery"),
    images: [galleryOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "gallery · lucas vu",
    description: galleryDescription,
    images: [galleryOgImage.url],
  },
};

export default function Page() {
  return <GalleryPage />;
}
