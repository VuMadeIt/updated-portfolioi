"use client";

import clsx from "clsx";
import { ScrollReveal } from "../../shared/ScrollReveal";
import ShimmerImage from "../../shared/ShimmerImage";
import ShimmerVideo from "../../shared/ShimmerVideo";
import {
  SHUFFLR_CHALLENGE_TITLE,
  SHUFFLR_EDITORIAL_BLOCKS,
  SHUFFLR_FEATURES,
  SHUFFLR_PROBLEM_STATEMENT,
  SHUFFLR_REFLECTION,
  type ShufflrEditorialBlock,
  type ShufflrFeatureBlock,
} from "./shufflrContent";
import { CASE_STUDY_COLUMN } from "../caseStudyLayout";
import { ProblemInsightsGrid } from "./ProblemInsightsGrid";
import { SystemFramework } from "./SystemFramework";
import { NorthStarDiagram } from "./NorthStarDiagram";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title?: string;
  titleClassName?: string;
  children: React.ReactNode;
  className?: string;
};

function ShufflrSection({
  id,
  eyebrow,
  title,
  titleClassName,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      data-section-number={id}
      data-section-heading={title || eyebrow || id}
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
            {title && (
              <h2
                className={clsx(
                  "text-balance font-['Lucas',sans-serif] font-normal leading-tight text-zinc-900",
                  titleClassName ?? "text-3xl md:text-4xl",
                )}
              >
                {title}
              </h2>
            )}
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

function PullQuote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <blockquote
      className={clsx(
        "font-['Lucas',sans-serif] text-base leading-relaxed text-zinc-700 md:text-lg",
        className,
      )}
    >
      {children}
    </blockquote>
  );
}

function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[26px] border border-dashed border-zinc-200 bg-zinc-50">
      <p className="font-['Lucas',sans-serif] text-sm text-zinc-400">{label}</p>
    </div>
  );
}

function EditorialBlock({
  block,
  showTitle = true,
}: {
  block: ShufflrEditorialBlock;
  showTitle?: boolean;
}) {
  const images = block.images ?? [];

  return (
    <div className="flex w-full flex-col gap-8">
      {showTitle && (
        <h3 className="font-['Lucas',sans-serif] text-2xl text-zinc-900">
          {block.title}
        </h3>
      )}
      {block.body.length > 0 && (
        <div className="flex flex-col gap-4">
          {block.body.map((paragraph) => (
            <BodyText key={paragraph}>{paragraph}</BodyText>
          ))}
        </div>
      )}
      {images.map((image) => (
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
      {block.placeholder && images.length === 0 && (
        <MediaPlaceholder label={block.placeholder} />
      )}
    </div>
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
        playerName={`Shufflr ${title}`}
      />
    </div>
  );
}

function FeatureShowcase({ feature }: { feature: ShufflrFeatureBlock }) {
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
        <div className="flex w-full flex-col gap-6">
          {images.map((image) => (
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
      )}
      {!feature.video && images.length === 0 && feature.placeholder && (
        <MediaPlaceholder label={feature.placeholder} />
      )}
    </div>
  );
}

const EDITORIAL_SECTION_IDS = ["solution", "system"] as const;

export default function ShufflrCaseStudy() {
  return (
    <div className="w-full bg-white">
      <ShufflrSection
        id="challenge"
        eyebrow="The challenge"
        title={SHUFFLR_CHALLENGE_TITLE}
        titleClassName="text-xl md:text-2xl"
      >
        <ScrollReveal>
          <PullQuote>{SHUFFLR_PROBLEM_STATEMENT}</PullQuote>
        </ScrollReveal>
      </ShufflrSection>

      <ShufflrSection id="problem" eyebrow="Problem">
        <ScrollReveal>
          <ProblemInsightsGrid />
        </ScrollReveal>
      </ShufflrSection>

      {SHUFFLR_EDITORIAL_BLOCKS.map((block, index) => {
        const sectionId = EDITORIAL_SECTION_IDS[index];
        const eyebrow =
          sectionId === "solution"
            ? "Solution"
            : sectionId === "system"
              ? "System"
              : undefined;

        return (
          <ShufflrSection
            key={sectionId}
            id={sectionId}
            eyebrow={eyebrow}
            title={block.title}
          >
            <ScrollReveal>
              {sectionId === "system" ? (
                <SystemFramework />
              ) : (
                <EditorialBlock block={block} showTitle={false} />
              )}
            </ScrollReveal>
          </ShufflrSection>
        );
      })}

      <ShufflrSection
        id="features"
        eyebrow="Core features"
        title="Four surfaces, one idea."
      >
        <div className="flex flex-col gap-16 md:gap-20">
          {SHUFFLR_FEATURES.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 60}>
              <FeatureShowcase feature={feature} />
            </ScrollReveal>
          ))}
        </div>
      </ShufflrSection>

      <section
        id="learnings"
        data-section-number="learnings"
        data-section-heading="How we measure success"
        className="scroll-mt-28 bg-white py-16 text-zinc-900 md:py-20"
      >
        <div className={clsx(CASE_STUDY_COLUMN, "flex flex-col gap-8")}>
          <div className="flex flex-col gap-3">
            <p className="font-['Lucas',sans-serif] text-sm uppercase tracking-[0.12em] text-zinc-400">
              Key learnings
            </p>
            <h2 className="text-balance font-['Lucas',sans-serif] text-3xl font-normal leading-tight text-zinc-900 md:text-4xl">
              How we measure success
            </h2>
          </div>
          <BodyText>
            The north star metric and key drivers that tell us whether Shufflr is
            actually getting people off their phones and into real life.
          </BodyText>
          <ScrollReveal>
            <NorthStarDiagram />
          </ScrollReveal>
        </div>
      </section>

      <ShufflrSection
        id="reflection"
        eyebrow="Reflection"
        title="Key learnings"
        className="pb-24"
      >
        <ul className="flex list-disc flex-col gap-5 pl-5 marker:text-zinc-400">
          {SHUFFLR_REFLECTION.map((item) => (
            <li
              key={item.slice(0, 48)}
              className="pl-1 font-['Lucas',sans-serif] text-base leading-relaxed text-zinc-600 md:text-lg"
            >
              {item}
            </li>
          ))}
        </ul>
      </ShufflrSection>
    </div>
  );
}
