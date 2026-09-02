"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";

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

export default function ComingSoonCursor({
  active,
  x,
  y,
}: ComingSoonCursorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !active) return null;

  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[9999] hidden md:block"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      <div className="flex size-16 items-center justify-center rounded-full border border-[#D9D9E2] bg-[#F5F5F7]/80 text-center shadow-sm backdrop-blur-[2px]">
        <span className="px-1.5 font-['Lucas',sans-serif] text-[11px] font-normal leading-[1.15] text-zinc-600">
          Coming Soon
        </span>
      </div>
    </div>,
    document.body,
  );
}
