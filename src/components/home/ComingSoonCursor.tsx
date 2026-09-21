"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type ComingSoonCursorProps = {
  active: boolean;
  x: number;
  y: number;
};

export function useComingSoonCursor(enabled: boolean) {
  const [cursor, setCursor] = useState({ active: false, x: 0, y: 0 });

  const handlers = enabled
    ? {
        onMouseEnter: () =>
          setCursor((current) => ({ ...current, active: true })),
        onMouseLeave: () => setCursor({ active: false, x: 0, y: 0 }),
        onMouseMove: (event: MouseEvent) => {
          setCursor({ active: true, x: event.clientX, y: event.clientY });
        },
      }
    : {};

  return { cursor, handlers };
}

/** Pixel-perfect blue arrow (matches site CSS cursor assets). */
function BlueArrowCursor({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M3.2 2.4 L3.2 18.6 L7.4 14.5 L10.6 21.2 L13.4 19.9 L10.2 13.2 L15.8 13.2 Z"
        fill="#3b82f6"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Coming-soon project hover cursor: blue arrow + sharp “Coming Soon” badge.
 * Animates in from the default arrow-only cursor.
 */
export default function ComingSoonCursor({
  active,
  x,
  y,
}: ComingSoonCursorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {active && (
        <motion.div
          key="coming-soon-cursor"
          aria-hidden="true"
          className="pointer-events-none fixed z-[9999] hidden md:flex items-start"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.14, ease: "easeOut" }}
        >
          <BlueArrowCursor className="shrink-0 drop-shadow-sm" />
          <motion.span
            initial={{ opacity: 0, x: -6, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -4, scale: 0.96 }}
            transition={{ duration: 0.16, ease: "easeOut", delay: 0.02 }}
            className="mt-[14px] ml-0.5 whitespace-nowrap bg-[#3b82f6] px-2 py-1 font-['Lucas',sans-serif] text-[11px] font-medium leading-none text-white shadow-sm"
          >
            Coming Soon
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
