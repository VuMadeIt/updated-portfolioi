import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";

const aboutDescription =
  "Hi, I'm Lucas! I love art, business, technology, & the ways that they can work together to create extraordinary products for people. I obsess over crafting beautiful tools for creation & human connection. I view myself as an artist at heart, designing where beauty meets tactile utility. I like to think of it as my ikigai: the constant pursuit of an intersection between passion, profession, & personal mission. 3 words to describe me: Golden Retriever Energy (even on the bad days)";

export const metadata: Metadata = {
  title: "About | lucas vu",
  description: aboutDescription,
  openGraph: {
    title: "About | lucas vu",
    description: aboutDescription,
    url: "https://www.liumichelle.com/about",
  },
  twitter: {
    title: "About | lucas vu",
    description: aboutDescription,
  },
};

export default function Page() {
  return <AboutPage />;
}
