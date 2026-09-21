"use client";

import clsx from "clsx";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { brandSubtextClass } from "../../styles/brandTypography";
import HeroCapabilitySentence from "./hero/HeroCapabilitySentence";

const HERO_TEXT = "lucas vu";

const HERO_SUBTEXT =
  "a six time hackathon winner who transforms ideas into interfaces people adore";

const LOAD_ANIMATION_DURATION = 3;
const LOAD_STAGGER = 0.12;
const HOVER_REVERT_DELAY_MS = 1000;

const heroNameClass = clsx(
  "font-['Lucas',sans-serif] font-light leading-none text-[#3f3f46]",
  "text-[clamp(4rem,16vw,11.5rem)]",
);

function HeroLetter({ char }: { char: string }) {
  return (
    <span
      data-hero-letter=""
      className="inline-block cursor-default will-change-transform"
      style={{ transformOrigin: "center center" }}
    >
      {char}
    </span>
  );
}

function attachLetterHover(letter: HTMLElement) {
  let revertTimeout: ReturnType<typeof setTimeout> | null = null;
  let hoverTween: gsap.core.Tween | null = null;

  const onEnter = () => {
    if (revertTimeout) {
      clearTimeout(revertTimeout);
      revertTimeout = null;
    }

    hoverTween?.kill();
    hoverTween = gsap.to(letter, {
      rotation: gsap.utils.random(-22, 22),
      x: gsap.utils.random(-5, 5),
      y: gsap.utils.random(-5, 5),
      duration: 0.28,
      ease: "back.out(1.7)",
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    hoverTween?.kill();
    revertTimeout = setTimeout(() => {
      gsap.to(letter, {
        rotation: 0,
        x: 0,
        y: 0,
        duration: 0.45,
        ease: "back.out(1.7)",
        overwrite: "auto",
      });
    }, HOVER_REVERT_DELAY_MS);
  };

  letter.addEventListener("pointerenter", onEnter);
  letter.addEventListener("pointerleave", onLeave);

  return () => {
    if (revertTimeout) clearTimeout(revertTimeout);
    hoverTween?.kill();
    letter.removeEventListener("pointerenter", onEnter);
    letter.removeEventListener("pointerleave", onLeave);
  };
}

export default function WorkHero() {
  const ghostRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasAnimatedRef = useRef(false);

  useLayoutEffect(() => {
    if (hasAnimatedRef.current || !headingRef.current) return;

    const letters = Array.from(
      headingRef.current.querySelectorAll<HTMLElement>("[data-hero-letter]"),
    );
    if (!letters.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const hoverCleanups = letters.map((letter) => attachLetterHover(letter));

    if (prefersReducedMotion) {
      hasAnimatedRef.current = true;
      return () => {
        hoverCleanups.forEach((cleanup) => cleanup());
      };
    }

    hasAnimatedRef.current = true;

    const letterDuration = Math.max(
      0.6,
      LOAD_ANIMATION_DURATION - (letters.length - 1) * LOAD_STAGGER,
    );

    letters.forEach((letter) => {
      gsap.set(letter, {
        rotation: gsap.utils.random(-30, 30),
        x: gsap.utils.random(-6, 6),
        y: gsap.utils.random(-6, 6),
        transformOrigin: "center center",
      });
    });

    const timeline = gsap.timeline();

    timeline.to(
      letters,
      {
        rotation: 0,
        x: 0,
        y: 0,
        duration: letterDuration,
        ease: "back.out(1.7)",
        stagger: LOAD_STAGGER,
      },
      0,
    );

    if (ghostRef.current) {
      timeline.to(
        ghostRef.current,
        {
          opacity: 0,
          duration: LOAD_ANIMATION_DURATION,
          ease: "power2.out",
        },
        0,
      );
    }

    return () => {
      timeline.kill();
      hoverCleanups.forEach((cleanup) => cleanup());
      hasAnimatedRef.current = false;
    };
  }, []);

  let letterIndex = 0;

  const renderLetters = (text: string, segmentId: string) =>
    text.split("").map((char) => {
      const node = (
        <HeroLetter key={`${segmentId}-${char}-${letterIndex}`} char={char} />
      );
      letterIndex += 1;
      return node;
    });

  return (
    <section
      aria-label="Introduction"
      className="relative flex w-full flex-col overflow-visible px-16 py-8 max-md:px-6 max-md:py-6"
    >
      {/* Left column: name + interactive sentence */}
      <div className="relative flex w-full max-w-full flex-col items-start text-left">
        <div className="relative inline-block max-w-full overflow-visible">
          <p
            ref={ghostRef}
            aria-hidden="true"
            className={clsx(
              heroNameClass,
              "pointer-events-none absolute inset-0 select-none text-[#fce7f3] opacity-[0.18]",
            )}
            style={{ transform: "translate(3px, 2px)" }}
          >
            {HERO_TEXT}
          </p>

          <h1
            ref={headingRef}
            className={clsx(
              heroNameClass,
              "relative z-[1] inline-flex items-end whitespace-nowrap",
            )}
          >
            <span className="inline-block whitespace-nowrap">
              {renderLetters("lucas", "lucas")}
            </span>

            <span className="inline-block w-[0.2em]" aria-hidden="true" />

            <span className="inline-block whitespace-nowrap">
              {renderLetters("vu", "vu")}
            </span>
          </h1>
        </div>

        <div className="mt-5 w-full max-w-full md:mt-6">
          <HeroCapabilitySentence />
        </div>
      </div>

      {/* Bottom-right hackathon subtext */}
      <p
        className={clsx(
          brandSubtextClass,
          "mt-10 max-w-sm self-end text-right text-lg max-md:mt-8 max-md:max-w-none max-md:self-stretch max-md:text-left md:text-[1.35rem]",
        )}
      >
        {HERO_SUBTEXT}
      </p>
    </section>
  );
}
