"use client";

import PageHeader from "../layout/PageHeader";
import NavigationTabs from "../layout/NavigationTabs";
import Footer from "../layout/Footer";
import { useHeroAnimation } from "../../hooks/useHeroAnimation";
import { fadeUpStyles } from "../../styles/animations";
import DesignPhilosophyContent from "./DesignPhilosophyContent";

export default function DesignPhilosophyPage() {
  const heroAnimationPlayed = useHeroAnimation();

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center bg-white">
      <style>{fadeUpStyles}</style>

      <PageHeader variant="about" heroAnimationPlayed={heroAnimationPlayed}>
        <>
          <div className="hidden md:block">
            <p>Product, design, &lt;dev&gt;,</p>
            <p>&amp; everything in between.</p>
          </div>
          <div className="md:hidden">
            <p className="mb-0">Product, design, &lt;dev&gt;,</p>
            <p>&amp; everything in between.</p>
          </div>
        </>
      </PageHeader>

      <NavigationTabs activeTab="about" heroAnimationPlayed={heroAnimationPlayed} />

      <DesignPhilosophyContent variant="page" />

      <Footer />
    </div>
  );
}
