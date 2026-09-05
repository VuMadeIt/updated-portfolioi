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

/** Which grey neighbour was clicked — that value becomes the new active. */
type SelectTarget = "upper" | "lower";

/**
 * Slots shifted ~6% further right. Click a grey numeral to make it the bold center.
 * Upper → clockwise into center; lower → counter-clockwise into center.
 */
const POSE = {
  enter: { left: 78, top: 15, scale: 0.3, rotate: 0, opacity: 0 },
  next: { left: 78, top: 27, scale: 0.34, rotate: 0, opacity: 0.5 },
  active: { left: 48, top: 53, scale: 1.1, rotate: 0, opacity: 1 },
  prev: { left: 78, top: 77, scale: 0.34, rotate: 0, opacity: 0.5 },
  exit: { left: 78, top: 95, scale: 0.3, rotate: 0, opacity: 0 },
} as const satisfies Record<string, Pose>;

type Slot = keyof typeof POSE;

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
        "absolute origin-center border-0 bg-transparent p-0 font-['Lucas',sans-serif] text-5xl font-bold tabular-nums leading-none tracking-tight outline-none will-change-transform focus:outline-none focus-visible:outline-none sm:text-6xl",
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
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span className="relative inline-block px-3 py-2">{value}</span>
    </motion.button>
  );
}

/**
 * Click a grey neighbour to promote it to the bold center.
 * Upper spins in clockwise; lower spins in counter-clockwise.
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
  const [selectTarget, setSelectTarget] = useState<SelectTarget>("upper");
  const progress = useMotionValue(0);

  const count = values.length;
  if (count < 2) return null;

  const safeIndex = ((index % count) + count) % count;
  const at = (i: number) => values[(i + count) % count];

  const prev = at(safeIndex - 1);
  const current = at(safeIndex);
  const next = at(safeIndex + 1);
  const afterNext = at(safeIndex + 2);
  const beforePrev = at(safeIndex - 2);

  const select = useCallback(
    (target: SelectTarget) => {
      if (spinningRef.current) return;

      // Clicked grey numeral becomes the new active index.
      const nextIndex =
        target === "upper"
          ? (safeIndex + 1) % count
          : (safeIndex - 1 + count) % count;

      if (reduceMotion) {
        onIndexChange(nextIndex);
        return;
      }

      spinningRef.current = true;
      setSelectTarget(target);
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
   * Upper click (clockwise): upper value → center.
   * Lower click (counter-clockwise): lower value → center.
   */
  const digits: {
    value: string;
    from: Slot;
    to: Slot;
    key: string;
    onActivate?: () => void;
    ariaLabel?: string;
  }[] = spinning
    ? selectTarget === "upper"
      ? [
          // Clockwise: next (upper) lands in active
          { value: afterNext, from: "enter", to: "next", key: `in-${safeIndex}` },
          { value: next, from: "next", to: "active", key: `up-${safeIndex}` },
          { value: current, from: "active", to: "prev", key: `mid-${safeIndex}` },
          { value: prev, from: "prev", to: "exit", key: `lo-${safeIndex}` },
        ]
      : [
          // Counter-clockwise: prev (lower) lands in active
          { value: beforePrev, from: "exit", to: "prev", key: `in-${safeIndex}` },
          { value: prev, from: "prev", to: "active", key: `lo-${safeIndex}` },
          { value: current, from: "active", to: "next", key: `mid-${safeIndex}` },
          { value: next, from: "next", to: "enter", key: `up-${safeIndex}` },
        ]
    : [
        {
          value: next,
          from: "next",
          to: "next",
          key: `next-${safeIndex}`,
          onActivate: () => select("upper"),
          ariaLabel: `Show statistic ${next}`,
        },
        {
          value: current,
          from: "active",
          to: "active",
          key: `active-${safeIndex}`,
          ariaLabel: `Current statistic ${current}`,
        },
        {
          value: prev,
          from: "prev",
          to: "prev",
          key: `prev-${safeIndex}`,
          onActivate: () => select("lower"),
          ariaLabel: `Show statistic ${prev}`,
        },
      ];

  return (
    <div
      role="group"
      aria-label={`Statistic wheel showing ${current}`}
      className={clsx(
        "relative h-full min-h-[10rem] w-full overflow-visible rounded-xl outline-none",
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
