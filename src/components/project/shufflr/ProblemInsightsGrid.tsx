"use client";

import { useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  SHUFFLR_RESEARCH_STATS,
  SHUFFLR_USER_INSIGHTS,
} from "./shufflrContent";
import { StatNumberCycler } from "./StatNumberCycler";
import {
  assertZeroOverlap,
  buildZeroOverlapLayouts,
  type ScatterLayout,
} from "./stickyLayout";

type ProblemInsightsGridProps = {
  className?: string;
};

const NOTE_COUNT = SHUFFLR_USER_INSIGHTS.length;

/** Pop-in timing matched to the reference staggered corkboard. */
const STAGGER_S = 0.14;
const POP_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 20,
  mass: 0.65,
};

function StickyNote({
  note,
  index,
  reduceMotion,
  layout,
  constraintsRef,
}: {
  note: (typeof SHUFFLR_USER_INSIGHTS)[number];
  index: number;
  reduceMotion: boolean | null;
  layout: ScatterLayout;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [canDrag, setCanDrag] = useState(Boolean(reduceMotion));
  const [zIndex, setZIndex] = useState(layout.zIndex);

  return (
    <motion.div
      className={clsx(
        "absolute origin-center touch-none shadow-[0_6px_18px_rgba(24,24,27,0.12)]",
        canDrag && "cursor-grab active:cursor-grabbing",
      )}
      style={{
        top: `${layout.cyPct}%`,
        left: `${layout.cxPct}%`,
        width: `${layout.sizePct}%`,
        aspectRatio: "1 / 1",
        zIndex,
        backgroundColor: note.color,
        x: "-50%",
        y: "-50%",
        rotate: layout.rotate,
        containerType: "size",
      }}
      initial={
        reduceMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.82 }
      }
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { ...POP_SPRING, delay: index * STAGGER_S }
      }
      onAnimationComplete={() => {
        if (!canDrag) setCanDrag(true);
      }}
      drag={canDrag}
      dragConstraints={constraintsRef}
      dragMomentum={false}
      dragElastic={0.08}
      whileHover={canDrag && !reduceMotion ? { scale: 1.04 } : undefined}
      whileDrag={
        reduceMotion
          ? undefined
          : {
              scale: 1.06,
              boxShadow: "0 14px 32px rgba(24,24,27,0.22)",
            }
      }
      onDragStart={() => setZIndex(80)}
      onDragEnd={() => setZIndex(layout.zIndex + 10)}
    >
      <div className="box-border flex h-full w-full flex-col justify-between gap-1 p-[8%]">
        <p
          className="text-pretty font-['Lucas',sans-serif] font-medium leading-snug text-zinc-900"
          style={{ fontSize: "clamp(7px, 7.2cqw, 11px)" }}
        >
          “{note.quote}”
        </p>
        <p
          className="shrink-0 font-['Lucas',sans-serif] font-medium text-zinc-900/80"
          style={{ fontSize: "clamp(6px, 5.5cqw, 9px)" }}
        >
          — {note.attribution}
        </p>
      </div>
    </motion.div>
  );
}

export function ProblemInsightsGrid({ className }: ProblemInsightsGridProps) {
  const reduceMotion = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const [statIndex, setStatIndex] = useState(0);
  const activeStat = SHUFFLR_RESEARCH_STATS[statIndex];

  const noteLayouts = useMemo(() => {
    const layouts = buildZeroOverlapLayouts(SHUFFLR_USER_INSIGHTS);
    if (process.env.NODE_ENV !== "production") {
      const check = assertZeroOverlap(layouts);
      if (!check.ok) {
        console.error(
          "[ProblemInsightsGrid] sticky overlap detected:",
          check.conflicts,
        );
      }
    }
    return layouts;
  }, []);

  const displayValues = useMemo(
    () => SHUFFLR_RESEARCH_STATS.map((stat) => stat.display),
    [],
  );

  // Slightly taller on narrow screens so 8 rotated notes fit edge-to-edge.
  const canvasAspect =
    NOTE_COUNT > 6 ? "aspect-[5/6] sm:aspect-square" : "aspect-square";

  return (
    <div
      className={clsx(
        "grid w-full grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 lg:gap-12",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-['Lucas',sans-serif] text-sm text-zinc-400">
            User Insights
          </p>
          <h3 className="text-balance font-['Lucas',sans-serif] text-xl font-semibold text-zinc-900 md:text-2xl">
            Friends want to hang out. Planning is the friction.
          </h3>
          <p className="text-pretty font-['Lucas',sans-serif] text-base leading-relaxed text-zinc-500">
            Across interviews, people described the same pattern: desire for
            spontaneous connection, and almost no one willing to initiate the
            plan.
          </p>
        </div>

        <div
          ref={boardRef}
          className={clsx(
            "relative w-full overflow-hidden rounded-2xl bg-zinc-100",
            canvasAspect,
          )}
          aria-label="User insight sticky notes. Drag notes to rearrange."
        >
          {SHUFFLR_USER_INSIGHTS.map((note, index) => (
            <StickyNote
              key={note.id}
              note={note}
              index={index}
              reduceMotion={reduceMotion}
              layout={noteLayouts.get(note.id)!}
              constraintsRef={boardRef}
            />
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-['Lucas',sans-serif] text-sm text-zinc-400">
            Insight #2
          </p>
          <h3 className="text-balance font-['Lucas',sans-serif] text-xl font-semibold text-zinc-900 md:text-2xl">
            Loneliness is measurable. Loneliness is widespread.
          </h3>
          <p className="text-pretty font-['Lucas',sans-serif] text-base leading-relaxed text-zinc-500">
            National research puts numbers behind the friction students already
            feel when trying to make and keep friends.
          </p>
        </div>

        <div
          className={clsx(
            "flex w-full flex-col overflow-hidden rounded-2xl bg-zinc-100",
            canvasAspect,
          )}
        >
          <div className="relative min-h-0 flex-1 px-2 py-2">
            <StatNumberCycler
              values={displayValues}
              index={statIndex}
              onIndexChange={setStatIndex}
            />
          </div>

          <div className="px-5 pb-6 pt-5 sm:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStat.id}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col gap-2"
              >
                <p className="text-pretty font-['Lucas',sans-serif] text-sm leading-relaxed text-zinc-700">
                  {activeStat.headline}
                </p>
                <a
                  href={activeStat.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit font-['Lucas',sans-serif] text-sm text-zinc-500 underline-offset-2 transition-colors hover:text-zinc-800 hover:underline"
                >
                  — {activeStat.source}
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
