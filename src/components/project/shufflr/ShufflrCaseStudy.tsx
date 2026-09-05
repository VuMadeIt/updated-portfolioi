"use client";

import clsx from "clsx";
import { ScrollReveal } from "../../shared/ScrollReveal";
import {
  SHUFFLR_DECISIONS,
  SHUFFLR_EDITORIAL_BLOCKS,
  SHUFFLR_FEATURES,
  SHUFFLR_FIGMA_EMBED_URL,
  SHUFFLR_LEARNINGS,
  SHUFFLR_PROBLEM_STATEMENT,
  type ShufflrEditorialBlock,
  type ShufflrFeatureBlock,
} from "./shufflrContent";
import { CASE_STUDY_COLUMN } from "../caseStudyLayout";
import { ProblemInsightsGrid } from "./ProblemInsightsGrid";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

function ShufflrSection({ id, eyebrow, title, children, className }: SectionProps) {
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
        "border-l-2 border-zinc-300 pl-5 font-['Lucas',sans-serif] text-xl leading-relaxed text-zinc-800 md:text-2xl",
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
      {block.placeholder && <MediaPlaceholder label={block.placeholder} />}
    </div>
  );
}

function FeatureShowcase({ feature }: { feature: ShufflrFeatureBlock }) {
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
      {feature.placeholder && <MediaPlaceholder label={feature.placeholder} />}
    </div>
  );
}

const EDITORIAL_SECTION_IDS = ["approach", "problem", "solution", "ambition", "system"] as const;

export default function ShufflrCaseStudy() {
  const showFigmaEmbed =
    Boolean(SHUFFLR_FIGMA_EMBED_URL) && SHUFFLR_FIGMA_EMBED_URL.includes("figma.com");

  return (
    <div className="w-full bg-white">
      <ShufflrSection id="challenge" eyebrow="The challenge" title="Bringing back the social energy of 2016">
        <ScrollReveal>
          <div className="flex flex-col gap-6">
            <BodyText>
              University students want deeper friendships, but coordinating unstructured
              social time has become high-friction. We asked:
            </BodyText>
            <PullQuote>{SHUFFLR_PROBLEM_STATEMENT}</PullQuote>
            <BodyText>
              Shufflr is our answer: a concept for spontaneous, low-stakes hangout moments
              that feel more like 2016 than another group chat debate.
            </BodyText>
          </div>
        </ScrollReveal>
      </ShufflrSection>

      {SHUFFLR_EDITORIAL_BLOCKS.map((block, index) => {
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
          <ShufflrSection
            key={sectionId}
            id={sectionId}
            eyebrow={eyebrow}
            title={block.title}
          >
            <ScrollReveal>
              <div className="flex flex-col gap-10">
                <EditorialBlock block={block} showTitle={false} />
                {sectionId === "problem" && (
                  <ProblemInsightsGrid className="mt-2" />
                )}
              </div>
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
        id="decisions"
        eyebrow="Design decisions"
        title="What makes Shufflr different"
      >
        <div className="flex flex-col gap-10">
          {SHUFFLR_DECISIONS.map((decision, index) => (
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
      </ShufflrSection>

      <ShufflrSection
        id="prototype"
        eyebrow="Prototype"
        title="Try it out"
      >
        <ScrollReveal>
          {showFigmaEmbed ? (
            <div className="w-full overflow-hidden rounded-[26px] border border-zinc-200">
              <iframe
                title="Shufflr Figma prototype"
                className="aspect-[16/10] w-full"
                src={SHUFFLR_FIGMA_EMBED_URL}
                allowFullScreen
              />
            </div>
          ) : (
            <MediaPlaceholder label="Figma prototype embed" />
          )}
        </ScrollReveal>
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
