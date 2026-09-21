"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import clsx from "clsx";

const wordBaseClass = clsx(
  "font-['Lucas',sans-serif] font-light text-[#3f3f46]",
  "text-[clamp(1.5rem,4vw,2.75rem)] leading-none",
);

const punctClass = clsx(wordBaseClass, "select-none text-zinc-400");

/** Locked sentence row height — hover cards overflow vertically without jumping. */
const SENTENCE_ROW_H = "h-[100px]";

/** True when the primary input can't hover (phones/tablets). */
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const sync = () => setIsTouch(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isTouch;
}

/**
 * “Design” — Figma selection chrome + magnetic drag (snap back).
 * On hover, system cursor becomes a blue Figma pointer + “you” badge.
 */
function DesignWord({ reduceMotion }: { reduceMotion: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const textRef = useRef<HTMLSpanElement>(null);
  const isTouch = useIsTouchDevice();

  const showChrome = isHovered || isDragging;
  const showCustomCursor = showChrome && !isTouch;

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [isDragging]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const updateDimensions = () => {
      const { width, height } = el.getBoundingClientRect();
      setDimensions({
        width: Math.round(width),
        height: Math.round(height),
      });
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <span className="relative mx-0 inline-flex h-full items-center select-none align-middle">
      <motion.span
        ref={textRef}
        layout="position"
        drag={!reduceMotion}
        dragSnapToOrigin
        dragElastic={0.35}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onPointerMove={(e) => {
          setCursorPos({ x: e.clientX, y: e.clientY });
        }}
        className={clsx(
          wordBaseClass,
          "relative z-20 inline-block px-1 py-1",
          showCustomCursor ? "cursor-none" : "cursor-grab active:cursor-grabbing",
        )}
        tabIndex={0}
        role="button"
        aria-label="Design — drag to move, releases snap back"
      >
        <span className="relative z-10">Design</span>

        <AnimatePresence>
          {showChrome && (
            <motion.div
              key="design-frame"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 z-20 border-[1.5px] border-[#0088FF]"
              aria-hidden
            >
              <span className="absolute -left-1 -top-1 size-2 border border-[#0088FF] bg-white" />
              <span className="absolute -right-1 -top-1 size-2 border border-[#0088FF] bg-white" />
              <span className="absolute -bottom-1 -left-1 size-2 border border-[#0088FF] bg-white" />
              <span className="absolute -bottom-1 -right-1 size-2 border border-[#0088FF] bg-white" />

              <span className="absolute -top-5 left-0 font-['Lucas',sans-serif] text-[11px] font-medium text-[#0088FF]">
                Design
              </span>

              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#0088FF] px-2 py-0.5 font-mono text-[10px] text-white tabular-nums shadow-lg">
                {dimensions.width} × {dimensions.height}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.span>

      <AnimatePresence>
        {showCustomCursor && (
          <motion.div
            key="figma-cursor"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="pointer-events-none fixed z-[100] flex items-start gap-1"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
            }}
            aria-hidden
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#0088FF"
              className="shrink-0 stroke-white stroke-[1.5] drop-shadow-sm"
            >
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>
            <span className="mt-3 rounded-full bg-[#0088FF] px-2 py-0.5 text-[11px] font-semibold text-white shadow-md">
              you
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

const CODE_LINES = [
  "float d = dist(uv, p);",
  "v += ink * exp(-d*d);",
  "frag = vec4(col, v);",
] as const;

/** Workflow palette from the product color strip (pastels). */
const PALETTE = {
  lavender: "#D19FFF",
  kiwi: "#7DDEA8",
  blueberry: "#70D1FF",
  mustard: "#FFD45A",
  salmon: "#FF8B8E",
} as const;

const TYPE_MS = 14; // rapid typewriter

function renderTypedLine(full: string, typedLen: number) {
  const typed = full.slice(0, typedLen);
  const parts: { text: string; accent?: boolean }[] = [];
  const keyword = /(float|vec4)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = keyword.exec(typed)) !== null) {
    if (m.index > last) {
      parts.push({ text: typed.slice(last, m.index) });
    }
    parts.push({ text: m[0], accent: true });
    last = m.index + m[0].length;
  }
  if (last < typed.length) parts.push({ text: typed.slice(last) });
  if (parts.length === 0) parts.push({ text: typed });
  return parts;
}

function CodeTypewriter({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setLineIndex(0);
      setCharIndex(0);
      setDone(false);
      return;
    }

    if (reduceMotion) {
      setLineIndex(CODE_LINES.length - 1);
      setCharIndex(CODE_LINES[CODE_LINES.length - 1].length);
      setDone(true);
      return;
    }

    setLineIndex(0);
    setCharIndex(0);
    setDone(false);

    let cancelled = false;
    let li = 0;
    let ci = 0;

    const tick = () => {
      if (cancelled) return;
      const line = CODE_LINES[li];
      if (ci < line.length) {
        ci += 1;
        setCharIndex(ci);
        setLineIndex(li);
        window.setTimeout(tick, TYPE_MS);
        return;
      }
      if (li < CODE_LINES.length - 1) {
        li += 1;
        ci = 0;
        setLineIndex(li);
        setCharIndex(0);
        window.setTimeout(tick, TYPE_MS * 2);
        return;
      }
      setDone(true);
    };

    const id = window.setTimeout(tick, 40);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [active, reduceMotion]);

  const activeLine = done ? -1 : lineIndex;

  return (
    <div className="flex flex-col gap-px text-left font-mono text-[9px] leading-[1.15] text-zinc-600 sm:text-[10px]">
      {CODE_LINES.map((line, i) => {
        const isActive = i === activeLine;
        const isComplete = done || i < lineIndex;
        const typedLen = isComplete
          ? line.length
          : i === lineIndex
            ? charIndex
            : 0;
        const parts = renderTypedLine(line, typedLen);
        const showCaret = isActive || (done && i === CODE_LINES.length - 1);

        return (
          <div
            key={line}
            className={clsx(
              "flex min-h-[1.1em] items-center rounded-sm px-0.5 whitespace-nowrap",
              isActive && "bg-blue-100",
            )}
          >
            <span>
              {parts.map((p, pi) => (
                <span
                  key={`${i}-${pi}`}
                  className={p.accent ? "text-blue-500" : undefined}
                >
                  {p.text}
                </span>
              ))}
            </span>
            {showCaret && (
              <span
                className="ml-0.5 inline-block h-2.5 w-1.5 animate-pulse bg-blue-500"
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * “Code” morphs into a compact light IDE — width expands, height matches sibling hovers.
 */
function CodeWord({ reduceMotion }: { reduceMotion: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const isTouch = useIsTouchDevice();
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isOpen || !isTouch) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen, isTouch]);

  return (
    <motion.span
      ref={rootRef}
      layout="position"
      className="relative inline-flex h-full items-center align-middle"
      onClick={() => {
        if (isTouch) setIsOpen((v) => !v);
      }}
      onMouseEnter={() => {
        if (!isTouch) setIsOpen(true);
      }}
      onMouseLeave={() => {
        if (!isTouch) setIsOpen(false);
      }}
      tabIndex={0}
      role="button"
      aria-label="Code"
      aria-expanded={isOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen((v) => !v);
        }
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {isOpen ? (
          <motion.span
            key="code-block"
            layout="position"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="z-10 inline-block cursor-pointer select-none rounded-lg border border-zinc-200 bg-white px-2 py-1.5 shadow-sm"
          >
            <CodeTypewriter active={isOpen} reduceMotion={reduceMotion} />
          </motion.span>
        ) : (
          <motion.span
            key="code-text"
            layout="position"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className={clsx(wordBaseClass, "inline-block cursor-pointer")}
          >
            Code
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

const AI_NODES = [
  { id: "plan", label: "PLAN", y: -10, accent: PALETTE.kiwi },
  { id: "build", label: "BUILD", y: 10, accent: PALETTE.blueberry },
  { id: "test", label: "TEST", y: -10, accent: PALETTE.mustard },
  { id: "iterate", label: "ITERATE", y: 10, accent: PALETTE.salmon },
] as const;

function BendyConnector({
  fromY,
  toY,
  stroke,
  reduceMotion,
}: {
  fromY: number;
  toY: number;
  stroke: string;
  reduceMotion: boolean;
}) {
  const x1 = 2;
  const x2 = 38;
  const y1 = 20 + fromY;
  const y2 = 20 + toY;
  const mid = (x1 + x2) / 2;
  const d = `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      className="relative z-0 shrink-0 overflow-visible"
      aria-hidden
    >
      <path d={d} fill="none" stroke="#e4e4e7" strokeWidth="1.5" />
      {!reduceMotion && (
        <motion.path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeDasharray="4 6"
          initial={{ strokeDashoffset: 20 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: 1,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      )}
    </svg>
  );
}

/**
 * “AI Workflows” → PLAN → BUILD → TEST → ITERATE (light DS pills + palette checks).
 */
function AIWorkflowsWord({ reduceMotion }: { reduceMotion: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const isTouch = useIsTouchDevice();
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isOpen || !isTouch) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen, isTouch]);

  return (
    <motion.span
      ref={rootRef}
      layout="position"
      className="relative inline-flex h-full items-center align-middle"
      onClick={() => {
        if (isTouch) setIsOpen((v) => !v);
      }}
      onMouseEnter={() => {
        if (!isTouch) setIsOpen(true);
      }}
      onMouseLeave={() => {
        if (!isTouch) setIsOpen(false);
      }}
      tabIndex={0}
      role="button"
      aria-label="AI Workflows"
      aria-expanded={isOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen((v) => !v);
        }
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {isOpen ? (
          <motion.span
            key="node-pipeline"
            layout="position"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 inline-flex cursor-pointer select-none items-center px-1"
          >
            {AI_NODES.map((node, i) => (
              <span key={node.id} className="contents">
                {i > 0 && (
                  <BendyConnector
                    fromY={AI_NODES[i - 1].y}
                    toY={node.y}
                    stroke={node.accent}
                    reduceMotion={reduceMotion}
                  />
                )}
                <motion.div
                  className="relative z-10 flex items-center rounded-xl border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[10px] text-zinc-600 shadow-sm"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1, y: node.y }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.05 * i,
                    duration: 0.18,
                    ease: "easeOut",
                  }}
                >
                  <span>{node.label}</span>
                  <motion.span
                    className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full text-[9px] font-bold leading-none text-white"
                    style={{ backgroundColor: node.accent }}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.18 + 0.1 * i,
                      duration: 0.18,
                      ease: "easeOut",
                    }}
                    aria-hidden
                  >
                    ✓
                  </motion.span>
                </motion.div>
              </span>
            ))}
          </motion.span>
        ) : (
          <motion.span
            key="text-label"
            layout="position"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className={clsx(wordBaseClass, "inline-block cursor-pointer")}
          >
            AI Workflows
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

/**
 * Interactive “Design, Code & AI Workflows.” sentence for the Work hero.
 * Fixed row height locks baseline; Code / AI expand horizontally only.
 */
export default function HeroCapabilitySentence() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <LayoutGroup>
      <motion.div
        layout="position"
        className={clsx(
          SENTENCE_ROW_H,
          "flex max-w-full flex-nowrap items-center gap-x-[0.35em] overflow-visible",
        )}
        aria-label="Design, Code and AI Workflows"
      >
        <DesignWord reduceMotion={reduceMotion} />
        <span className={clsx(punctClass, "inline-flex h-full items-center")} aria-hidden>
          ,
        </span>
        <CodeWord reduceMotion={reduceMotion} />
        <span className={clsx(punctClass, "inline-flex h-full items-center")} aria-hidden>
          &
        </span>
        <AIWorkflowsWord reduceMotion={reduceMotion} />
        <span className={clsx(punctClass, "inline-flex h-full items-center")} aria-hidden>
          .
        </span>
      </motion.div>
    </LayoutGroup>
  );
}
