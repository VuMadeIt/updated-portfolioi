"use client";

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

      <NavigationTabs activeTab="about" heroAnimationPlayed={heroAnimationPlayed} />

      <DesignPhilosophyContent variant="page" />

      <Footer />
    </div>
  );
}
