"use client";

import clsx from "clsx";
import { ScrollReveal } from "../../shared/ScrollReveal";
import ShimmerImage from "../../shared/ShimmerImage";
import ShimmerVideo from "../../shared/ShimmerVideo";
import {
  SHUFFLR_CHALLENGE_TITLE,
  SHUFFLR_EDITORIAL_BLOCKS,
  SHUFFLR_FEATURES,
  SHUFFLR_LEARNINGS,
  SHUFFLR_PROBLEM_STATEMENT,
  type ShufflrEditorialBlock,
  type ShufflrFeatureBlock,
} from "./shufflrContent";
import { CASE_STUDY_COLUMN } from "../caseStudyLayout";
import { ProblemInsightsGrid } from "./ProblemInsightsGrid";
import { SystemFramework } from "./SystemFramework";

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

      <ShufflrSection
        id="learnings"
        eyebrow="Key learnings"
        title="How we measure success"
      >
        <div className="flex flex-col gap-10">
          <BodyText>
            The north star metric and key drivers that tell us whether Shufflr is
            actually getting people off their phones and into real life.
          </BodyText>
          {SHUFFLR_LEARNINGS.map((item) => (
            <ScrollReveal key={item.number}>
              <div className="flex flex-col gap-2">
                <h3 className="font-['Lucas',sans-serif] text-xl text-zinc-900">
                  {item.title}
                </h3>
                <BodyText>{item.body}</BodyText>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </ShufflrSection>

      <ShufflrSection
        id="reflection"
        eyebrow="Reflection"
        title="Looking back"
        className="pb-24"
      >
        <BodyText>
          Shufflr started as a product concept for university students who miss the
          spontaneity of pre-algorithm social life. The biggest takeaway: reducing
          activation energy matters more than adding another feature. If hanging out
          is easier than staying in, connection becomes the default.
        </BodyText>
      </ShufflrSection>
    </div>
  );
}
