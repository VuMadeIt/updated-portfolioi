"use client";

import { useCallback, useRef, useState } from "react";
import clsx from "clsx";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

type StatNumberCyclerProps = {
  /** Fixed wheel order — never reshuffled. Expected length 4. */
  values: readonly string[];
  index: number;
  onIndexChange: (next: number) => void;
  className?: string;
};

type Pose = {
  /** % of wheel container width */
  left: number;
  /** % of wheel container height */
  top: number;
  scale: number;
  rotate: number;
  opacity: number;
};

/**
 * Detached iOS-wheel slots (% of the full stat area).
 * All numerals stay upright (0°). Active is centered; next/prev sit to the
 * right with edge padding — not glued to the active number, not flush to rim.
 *
 * - active: horizontally centered in the grey box
 * - next:   upper-right, inset from top/right
 * - prev:   lower-right, same x as next (mirrored y)
 */
const POSE = {
  enter: { left: 72, top: 15, scale: 0.3, rotate: 0, opacity: 0 },
  next: { left: 72, top: 27, scale: 0.34, rotate: 0, opacity: 0.5 },
  // Active is 10% larger (1.1) and the whole wheel sits 5% lower in the box.
  active: { left: 42, top: 53, scale: 1.1, rotate: 0, opacity: 1 },
  prev: { left: 72, top: 77, scale: 0.34, rotate: 0, opacity: 0.5 },
  exit: { left: 72, top: 95, scale: 0.3, rotate: 0, opacity: 0 },
} as const satisfies Record<string, Pose>;

type Slot = keyof typeof POSE;

const WHEEL_LEN = 4;

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 18,
  mass: 0.55,
};

function WheelDigit({
  value,
  from,
  to,
  progress,
  startsActive,
  endsActive,
}: {
  value: string;
  from: Pose;
  to: Pose;
  progress: MotionValue<number>;
  startsActive: boolean;
  endsActive: boolean;
}) {
  const leftPct = useTransform(progress, [0, 1], [from.left, to.left]);
  const topPct = useTransform(progress, [0, 1], [from.top, to.top]);
  const left = useTransform(leftPct, (v) => `${v}%`);
  const top = useTransform(topPct, (v) => `${v}%`);
  const scale = useTransform(progress, [0, 1], [from.scale, to.scale]);
  const rotate = useTransform(progress, [0, 1], [from.rotate, to.rotate]);
  const opacity = useTransform(progress, [0, 1], [from.opacity, to.opacity]);
  const color = useTransform(
    progress,
    [0, 1],
    [startsActive ? "#18181b" : "#a1a1aa", endsActive ? "#18181b" : "#a1a1aa"],
  );

  return (
    <motion.span
      className="absolute origin-center font-['Lucas',sans-serif] text-5xl font-bold tabular-nums leading-none tracking-tight will-change-transform sm:text-6xl"
      style={{
        left,
        top,
        scale,
        rotate,
        opacity,
        color,
        x: "-50%",
        y: "-50%",
      }}
    >
      {value}
    </motion.span>
  );
}

/**
 * Fixed 4-value iOS-style wheel picker (click to advance).
 * Order is stable: for any active index, next/prev are always the same neighbors.
 * One shared spring progress drives every digit so the wheel turns as one unit.
 */
export function StatNumberCycler({
  values,
  index,
  onIndexChange,
  className,
}: StatNumberCyclerProps) {
  const reduceMotion = useReducedMotion();
  const spinningRef = useRef(false);
  const [spinning, setSpinning] = useState(false);
  const progress = useMotionValue(0);

  const wheel = values.slice(0, WHEEL_LEN);
  while (wheel.length < WHEEL_LEN) {
    wheel.push(wheel[wheel.length - 1] ?? "0");
  }
  const count = WHEEL_LEN;
  const safeIndex = ((index % count) + count) % count;

  const at = (i: number) => wheel[(i + count) % count];
  const prev = at(safeIndex - 1);
  const current = at(safeIndex);
  const next = at(safeIndex + 1);
  const afterNext = at(safeIndex + 2);

  const advance = useCallback(() => {
    if (spinningRef.current) return;

    if (reduceMotion) {
      onIndexChange((safeIndex + 1) % count);
      return;
    }

    spinningRef.current = true;
    setSpinning(true);
    progress.set(0);
    animate(progress, 1, {
      ...spring,
      onComplete: () => {
        onIndexChange((safeIndex + 1) % count);
        setSpinning(false);
        progress.set(0);
        spinningRef.current = false;
      },
    });
  }, [reduceMotion, onIndexChange, safeIndex, count, progress]);

  /** Counter-clockwise slot handoff driven by one shared progress. */
  const digits: {
    value: string;
    from: Slot;
    to: Slot;
    key: string;
  }[] = spinning
    ? [
        { value: afterNext, from: "enter", to: "next", key: `in-${safeIndex}` },
        { value: next, from: "next", to: "active", key: `next-${safeIndex}` },
        {
          value: current,
          from: "active",
          to: "prev",
          key: `active-${safeIndex}`,
        },
        { value: prev, from: "prev", to: "exit", key: `prev-${safeIndex}` },
      ]
    : [
        { value: next, from: "next", to: "next", key: `next-${safeIndex}` },
        {
          value: current,
          from: "active",
          to: "active",
          key: `active-${safeIndex}`,
        },
        { value: prev, from: "prev", to: "prev", key: `prev-${safeIndex}` },
      ];

  return (
    <button
      type="button"
      onClick={advance}
      aria-label={`Statistic ${current}. Click to show the next statistic.`}
      className={clsx(
        "relative h-full min-h-[10rem] w-full cursor-pointer overflow-visible rounded-xl border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400",
        className,
      )}
    >
      {digits.map((digit) => (
        <WheelDigit
          key={digit.key}
          value={digit.value}
          from={POSE[digit.from]}
          to={POSE[digit.to]}
          progress={progress}
          startsActive={digit.from === "active"}
          endsActive={digit.to === "active"}
        />
      ))}
    </button>
  );
}
