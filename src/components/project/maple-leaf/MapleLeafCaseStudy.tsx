"use client";

import clsx from "clsx";
import { ScrollReveal } from "../../shared/ScrollReveal";
import ShimmerImage from "../../shared/ShimmerImage";
import { CASE_STUDY_COLUMN } from "../caseStudyLayout";
import {
  MAPLE_LEAF_MISSION,
  MAPLE_LEAF_PROJECTS,
  type MapleLeafProjectBlock,
} from "./mapleLeafContent";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

function MapleLeafSection({
  id,
  eyebrow,
  title,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      data-section-number={id}
      data-section-heading={title}
      className={clsx(
        "scroll-mt-28 bg-white py-16 text-zinc-900 md:py-20",
        className,
      )}
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

function ProjectBlock({ project }: { project: MapleLeafProjectBlock }) {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-4">
        {project.body.map((paragraph) => (
          <BodyText key={paragraph}>{paragraph}</BodyText>
        ))}
      </div>
      <ShimmerImage
        src={project.image.src}
        alt={project.image.alt}
        className="h-auto w-full object-contain"
        wrapperClassName="w-full"
        rounded="rounded-[26px]"
        loading="lazy"
      />
    </div>
  );
}

const PROJECT_SECTION_IDS = ["project-01", "project-02", "project-03"] as const;

export default function MapleLeafCaseStudy() {
  return (
    <div className="w-full bg-white">
      <MapleLeafSection
        id="mission"
        eyebrow="The Mission"
        title={MAPLE_LEAF_MISSION.title}
      >
        <ScrollReveal>
          <div className="flex flex-col gap-4">
            {MAPLE_LEAF_MISSION.body.map((paragraph) => (
              <BodyText key={paragraph}>{paragraph}</BodyText>
            ))}
          </div>
        </ScrollReveal>
      </MapleLeafSection>

      {MAPLE_LEAF_PROJECTS.map((project, index) => (
        <MapleLeafSection
          key={project.title}
          id={PROJECT_SECTION_IDS[index]}
          eyebrow={project.eyebrow}
          title={project.title}
        >
          <ScrollReveal delay={index * 60}>
            <ProjectBlock project={project} />
          </ScrollReveal>
        </MapleLeafSection>
      ))}
    </div>
  );
}
