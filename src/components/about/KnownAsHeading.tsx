"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export const KNOWN_AS_NAMES = [
  "lucas vu",
  "chess jesus",
  "the young fisherman",
  "bigmanvu",
  "solo leveling aura boss big man sung jin vu",
] as const;

const LONG_NAME = "solo leveling aura boss big man sung jin vu";

function formatKnownAsName(name: string) {
  return name === "lucas vu" ? name : `"${name}"`;
}

const LONGEST_REGULAR_NAME = KNOWN_AS_NAMES.filter((name) => name !== LONG_NAME).reduce(
  (longest, name) => {
    const formatted = formatKnownAsName(name);
    return formatted.length > longest.length ? formatted : longest;
  },
  "",
);

export default function KnownAsHeading() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const name = KNOWN_AS_NAMES[index];
  const isLongName = name === LONG_NAME;
  const displayName = formatKnownAsName(name);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % KNOWN_AS_NAMES.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <h2 className="w-full min-w-0 font-['Lucas',sans-serif] text-2xl font-medium text-zinc-600 md:text-3xl">
      <span className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2">
        <span className="shrink-0">i am known as</span>
        <span className="relative inline-grid max-w-full min-w-0 overflow-hidden align-bottom leading-[1.15]">
          <span
            className="invisible col-start-1 row-start-1 whitespace-normal break-words sm:whitespace-nowrap"
            aria-hidden
          >
            {LONGEST_REGULAR_NAME}
          </span>
          <span
            className="invisible col-start-1 row-start-1 whitespace-normal break-words text-xl md:text-2xl"
            aria-hidden
          >
            {formatKnownAsName(LONG_NAME)}
          </span>
          <AnimatePresence initial={false} mode="sync">
            <motion.span
              key={name}
              className={clsx(
                "col-start-1 row-start-1 max-w-full",
                isLongName
                  ? "whitespace-normal break-words text-xl md:text-2xl"
                  : "whitespace-nowrap",
              )}
              initial={reduceMotion ? { opacity: 0 } : { y: "-110%" }}
              animate={reduceMotion ? { opacity: 1 } : { y: "0%" }}
              exit={reduceMotion ? { opacity: 0 } : { y: "110%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {displayName}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </h2>
  );
}
