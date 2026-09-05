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
  left: number;
  top: number;
  scale: number;
  rotate: number;
  opacity: number;
};

type SpinDirection = "cw" | "ccw";

/**
 * Detached iOS-wheel slots (% of the full stat area).
 * Upper = next neighbor; lower = previous neighbor.
 * Click upper → clockwise; click lower → counter-clockwise.
 */
const POSE = {
  enter: { left: 72, top: 15, scale: 0.3, rotate: 0, opacity: 0 },
  next: { left: 72, top: 27, scale: 0.34, rotate: 0, opacity: 0.5 },
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
  onActivate,
  ariaLabel,
}: {
  value: string;
  from: Pose;
  to: Pose;
  progress: MotionValue<number>;
  startsActive: boolean;
  endsActive: boolean;
  onActivate?: () => void;
  ariaLabel?: string;
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

  const interactive = Boolean(onActivate);

  return (
    <motion.button
      type="button"
      disabled={!interactive}
      aria-label={ariaLabel}
      aria-hidden={!interactive ? true : undefined}
      tabIndex={interactive ? 0 : -1}
      onClick={(event) => {
        event.stopPropagation();
        onActivate?.();
      }}
      className={clsx(
        "absolute origin-center border-0 bg-transparent p-0 font-['Lucas',sans-serif] text-5xl font-bold tabular-nums leading-none tracking-tight will-change-transform sm:text-6xl",
        interactive ? "cursor-pointer" : "pointer-events-none",
      )}
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
      {/* Enlarge hit target for the small grey numerals */}
      <span className="relative inline-block px-3 py-2">{value}</span>
    </motion.button>
  );
}

/**
 * Fixed 4-value wheel. Upper neighbour → clockwise; lower neighbour →
 * counter-clockwise. Shared spring progress keeps all digits locked together.
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
  const [direction, setDirection] = useState<SpinDirection>("ccw");
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
  const beforePrev = at(safeIndex - 2);

  const spin = useCallback(
    (dir: SpinDirection) => {
      if (spinningRef.current) return;

      const nextIndex =
        dir === "ccw"
          ? (safeIndex + 1) % count
          : (safeIndex - 1 + count) % count;

      if (reduceMotion) {
        onIndexChange(nextIndex);
        return;
      }

      spinningRef.current = true;
      setDirection(dir);
      setSpinning(true);
      progress.set(0);
      animate(progress, 1, {
        ...spring,
        onComplete: () => {
          onIndexChange(nextIndex);
          setSpinning(false);
          progress.set(0);
          spinningRef.current = false;
        },
      });
    },
    [reduceMotion, onIndexChange, safeIndex, count, progress],
  );

  /**
   * CCW: upper(next) → active → lower(prev) → exit
   * CW:  lower(prev) → active → upper(next) → exit-up
   */
  const digits: {
    value: string;
    from: Slot;
    to: Slot;
    key: string;
    onActivate?: () => void;
    ariaLabel?: string;
  }[] = spinning
    ? direction === "ccw"
      ? [
          {
            value: afterNext,
            from: "enter",
            to: "next",
            key: `in-${safeIndex}`,
          },
          {
            value: next,
            from: "next",
            to: "active",
            key: `next-${safeIndex}`,
          },
          {
            value: current,
            from: "active",
            to: "prev",
            key: `active-${safeIndex}`,
          },
          {
            value: prev,
            from: "prev",
            to: "exit",
            key: `prev-${safeIndex}`,
          },
        ]
      : [
          {
            value: beforePrev,
            from: "exit",
            to: "prev",
            key: `in-${safeIndex}`,
          },
          {
            value: prev,
            from: "prev",
            to: "active",
            key: `prev-${safeIndex}`,
          },
          {
            value: current,
            from: "active",
            to: "next",
            key: `active-${safeIndex}`,
          },
          {
            value: next,
            from: "next",
            to: "enter",
            key: `next-${safeIndex}`,
          },
        ]
    : [
        {
          value: next,
          from: "next",
          to: "next",
          key: `next-${safeIndex}`,
          onActivate: () => spin("cw"),
          ariaLabel: `Go to ${next} (clockwise)`,
        },
        {
          value: current,
          from: "active",
          to: "active",
          key: `active-${safeIndex}`,
          onActivate: () => spin("ccw"),
          ariaLabel: `Statistic ${current}. Click to advance.`,
        },
        {
          value: prev,
          from: "prev",
          to: "prev",
          key: `prev-${safeIndex}`,
          onActivate: () => spin("ccw"),
          ariaLabel: `Go to ${prev} (counter-clockwise)`,
        },
      ];

  return (
    <div
      role="group"
      aria-label={`Statistic wheel showing ${current}`}
      className={clsx(
        "relative h-full min-h-[10rem] w-full overflow-visible rounded-xl focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-zinc-400",
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
          onActivate={digit.onActivate}
          ariaLabel={digit.ariaLabel}
        />
      ))}
    </div>
  );
}
