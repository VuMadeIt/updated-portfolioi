"use client";

import clsx from "clsx";
import { ScrollReveal } from "../../shared/ScrollReveal";
import ShimmerImage from "../../shared/ShimmerImage";
import ShimmerVideo from "../../shared/ShimmerVideo";
import { CASE_STUDY_COLUMN } from "../caseStudyLayout";
import {
  RIPPLE_DECISIONS,
  RIPPLE_EDITORIAL_BLOCKS,
  RIPPLE_FEATURES,
  RIPPLE_FIGMA_EMBED_URL,
  RIPPLE_REFLECTION,
  type RippleEditorialBlock,
  type RippleFeatureBlock,
} from "./rippleContent";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

function RippleSection({ id, eyebrow, title, children, className }: SectionProps) {
  return (
    <section
      id={id}
      data-section-number={id}
      data-section-heading={title}
      className={clsx("scroll-mt-28 bg-white py-16 text-zinc-900 md:py-20", className)}
    >
      <div className={clsx(CASE_STUDY_COLUMN, "flex flex-col gap-8")}>
        {(eyebrow || title) && (
          <div className="flex flex-col gap-3">
            {eyebrow && (
              <p className="font-['Lucas',sans-serif] text-sm uppercase tracking-[0.12em] text-zinc-400">
                {eyebrow}
              </p>
            )}
            <h2 className="text-balance font-['Lucas',sans-serif] text-3xl font-normal leading-tight text-zinc-900 md:text-4xl">
              {title}
            </h2>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

function BodyText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={clsx(
        "font-['Lucas',sans-serif] text-base leading-relaxed text-zinc-600 md:text-lg",
        className,
      )}
    >
      {children}
    </p>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-2 border-zinc-300 pl-5 font-['Lucas',sans-serif] text-xl leading-relaxed text-zinc-800 md:text-2xl">
      {children}
    </blockquote>
  );
}

function FeatureVideo({ src, title }: { src: string; title: string }) {
  return (
    <div className="w-full overflow-hidden rounded-[26px] bg-zinc-50">
      <ShimmerVideo
        src={src}
        className="h-auto w-full object-contain"
        wrapperClassName="w-full"
        rounded="rounded-[26px]"
        autoPlay
        muted
        loop
        controls={false}
        playerName={`Ripple ${title}`}
      />
    </div>
  );
}

function EditorialBlock({
  block,
  showTitle = true,
}: {
  block: RippleEditorialBlock;
  showTitle?: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-8">
      {showTitle && (
        <h3 className="font-['Lucas',sans-serif] text-2xl text-zinc-900">
          {block.title}
        </h3>
      )}
      <div className="flex flex-col gap-4">
        {block.body.map((paragraph) => (
          <BodyText key={paragraph}>{paragraph}</BodyText>
        ))}
      </div>
      {block.images.map((image) => (
        <ShimmerImage
          key={image.src}
          src={image.src}
          alt={image.alt}
          className="h-auto w-full object-contain"
          wrapperClassName="w-full"
          rounded="rounded-[26px]"
          loading="lazy"
        />
      ))}
    </div>
  );
}

function FeatureShowcase({ feature }: { feature: RippleFeatureBlock }) {
  const images = feature.images ?? [];

  return (
    <div className="flex w-full flex-col gap-6">
      <h3 className="font-['Lucas',sans-serif] text-2xl text-zinc-900">
        {feature.title}
      </h3>
      <div className="flex flex-col gap-4">
        {feature.body.map((paragraph) => (
          <BodyText key={paragraph}>{paragraph}</BodyText>
        ))}
      </div>
      {feature.video && <FeatureVideo src={feature.video} title={feature.title} />}
      {images.length > 0 && (
        <div
          className={clsx(
            "flex w-full gap-6",
            feature.layout === "pair" ? "flex-col md:flex-row md:items-end" : "flex-col",
          )}
        >
          {images.map((image) => (
            <ShimmerImage
              key={image.src}
              src={image.src}
              alt={image.alt}
              className="h-auto w-full object-contain"
              wrapperClassName="w-full flex-1"
              rounded="rounded-[26px]"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </div>
  );
}

const EDITORIAL_SECTION_IDS = ["approach", "problem", "solution", "ambition", "system"] as const;

export default function RippleCaseStudy() {
  const showFigmaEmbed =
    Boolean(RIPPLE_FIGMA_EMBED_URL) && RIPPLE_FIGMA_EMBED_URL.includes("figma.com");

  return (
    <div className="w-full bg-white">
      <RippleSection id="challenge" eyebrow="The challenge" title="BLOOM Designathon 2026">
        <ScrollReveal>
          <div className="flex flex-col gap-6">
            <BodyText>
              For BLOOM Designathon 2026, our team of four designers tackled:
            </BodyText>
            <PullQuote>
              How might we use design and technology to make climate awareness and
              sustainable action easier to understand and practice in everyday life?
            </PullQuote>
            <BodyText>
              We focused on the part of the challenge that felt most actionable:
              sustainable action people could practice in everyday life.
            </BodyText>
          </div>
        </ScrollReveal>
      </RippleSection>

      {RIPPLE_EDITORIAL_BLOCKS.map((block, index) => {
        const sectionId = EDITORIAL_SECTION_IDS[index];
        const eyebrow =
          sectionId === "approach"
            ? "Defining a direction"
            : sectionId === "problem"
              ? "Problem"
              : sectionId === "solution"
                ? "Solution"
                : sectionId === "ambition"
                  ? "One step at a time"
                  : sectionId === "system"
                    ? "System"
                    : undefined;

        return (
          <RippleSection
            key={sectionId}
            id={sectionId}
            eyebrow={eyebrow}
            title={block.title}
          >
            <ScrollReveal>
              <EditorialBlock block={block} showTitle={false} />
            </ScrollReveal>
          </RippleSection>
        );
      })}

      <RippleSection
        id="features"
        eyebrow="Core features"
        title="Four surfaces, one idea."
      >
        <div className="flex flex-col gap-16 md:gap-20">
          {RIPPLE_FEATURES.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 60}>
              <FeatureShowcase feature={feature} />
            </ScrollReveal>
          ))}
        </div>
      </RippleSection>

      <RippleSection
        id="decisions"
        eyebrow="Design decisions"
        title="A familiar, clean, and emotionally effective design"
      >
        <div className="flex flex-col gap-10">
          {RIPPLE_DECISIONS.map((decision, index) => (
            <ScrollReveal key={decision.title} delay={index * 60}>
              <div className="flex flex-col gap-4">
                <h3 className="font-['Lucas',sans-serif] text-xl text-zinc-900">
                  {decision.title}
                </h3>
                {decision.body.map((paragraph) => (
                  <BodyText key={paragraph}>{paragraph}</BodyText>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </RippleSection>

      <RippleSection
        id="prototype"
        eyebrow="Prototype"
        title="Try it out"
      >
        <ScrollReveal>
          {showFigmaEmbed ? (
            <div className="w-full overflow-hidden rounded-[26px] border border-zinc-200">
              <iframe
                title="Ripple Figma prototype"
                className="aspect-[16/10] w-full"
                src={RIPPLE_FIGMA_EMBED_URL}
                allowFullScreen
              />
            </div>
          ) : null}
        </ScrollReveal>
      </RippleSection>

      <RippleSection
        id="reflection"
        eyebrow="Reflection"
        title="Key learnings"
        className="pb-24"
      >
        <ul className="flex list-disc flex-col gap-5 pl-5 marker:text-zinc-400">
          {RIPPLE_REFLECTION.map((item) => (
            <li
              key={item.slice(0, 48)}
              className="pl-1 font-['Lucas',sans-serif] text-base leading-relaxed text-zinc-600 md:text-lg"
            >
              {item}
            </li>
          ))}
        </ul>
      </RippleSection>
    </div>
  );
}
