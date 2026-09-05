"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { SHUFFLR_SYSTEM_PILLARS } from "./shufflrContent";
import { isOverDropZone } from "./dropZone";

type Pillar = (typeof SHUFFLR_SYSTEM_PILLARS)[number];
type PillarId = Pillar["id"];

const WORD_LAYOUTS: Record<
  PillarId,
  { left: string; top: string; rotate: number; bobDelay: number }
> = {
  desirability: { left: "12%", top: "10%", rotate: -5, bobDelay: 0 },
  viability: { left: "40%", top: "7%", rotate: 4, bobDelay: 0.45 },
  feasibility: { left: "64%", top: "18%", rotate: -3, bobDelay: 0.9 },
};

function MacFolder({
  highlighted,
  reduceMotion,
}: {
  highlighted: boolean;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div
      className="relative flex w-[100px] flex-col items-center sm:w-[120px]"
      animate={
        highlighted && !reduceMotion ? { scale: 1.08 } : { scale: 1 }
      }
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
    >
      <svg
        viewBox="0 0 128 104"
        className="h-auto w-full drop-shadow-[0_10px_24px_rgba(37,99,235,0.28)]"
        aria-hidden
      >
        <path
          d="M8 28c0-6.627 5.373-12 12-12h28l10 10h50c6.627 0 12 5.373 12 12v54c0 6.627-5.373 12-12 12H20c-6.627 0-12-5.373-12-12V28z"
          fill={highlighted ? "#60A5FA" : "#3B82F6"}
        />
        <path
          d="M8 38h112v44c0 6.627-5.373 12-12 12H20c-6.627 0-12-5.373-12-12V38z"
          fill={highlighted ? "#93C5FD" : "#60A5FA"}
          opacity={0.95}
        />
        <path
          d="M20 16h28l8 8H20c-2.2 0-4 1.8-4 4v2h-0.01C14.79 22.9 17.1 16 20 16z"
          fill={highlighted ? "#93C5FD" : "#60A5FA"}
        />
      </svg>
      <p className="mt-2 font-['Lucas',sans-serif] text-sm font-medium text-zinc-700">
        Shufflr
      </p>
    </motion.div>
  );
}

function PillarWord({
  pillar,
  reduceMotion,
  absorbing,
  showDragHint,
  onDropInFolder,
  folderRef,
  onHoverFolderChange,
}: {
  pillar: Pillar;
  reduceMotion: boolean | null;
  absorbing: boolean;
  showDragHint: boolean;
  onDropInFolder: (id: PillarId) => void;
  folderRef: React.RefObject<HTMLDivElement | null>;
  onHoverFolderChange: (over: boolean) => void;
}) {
  const layout = WORD_LAYOUTS[pillar.id];
  const wordRef = useRef<HTMLDivElement>(null);
  const overRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  const evaluateOver = useCallback(
    (point: { x: number; y: number }) => {
      const folder = folderRef.current;
      const word = wordRef.current;
      // Framer `point` is page-space; rects are viewport — normalize.
      const clientPoint = {
        x: point.x - (typeof window !== "undefined" ? window.scrollX : 0),
        y: point.y - (typeof window !== "undefined" ? window.scrollY : 0),
      };
      return isOverDropZone(
        folder ? folder.getBoundingClientRect() : null,
        word ? word.getBoundingClientRect() : null,
        clientPoint,
      );
    },
    [folderRef],
  );

  return (
    <motion.div
      ref={wordRef}
      className={clsx(
        "absolute z-30 touch-none select-none",
        dragging ? "cursor-grabbing" : "cursor-grab",
      )}
      style={{
        left: layout.left,
        top: layout.top,
        rotate: layout.rotate,
      }}
      drag={!absorbing}
      dragMomentum={false}
      dragElastic={0.05}
      dragPropagation={false}
      initial={false}
      animate={
        absorbing
          ? { opacity: 0, scale: 0.15, x: -60, y: 110 }
          : reduceMotion || dragging
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 1, scale: 1, y: [0, -5, 0] }
      }
      transition={
        absorbing
          ? { duration: 0.28, ease: "easeIn" }
          : reduceMotion || dragging
            ? { duration: 0.1 }
            : {
                y: {
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: layout.bobDelay,
                },
              }
      }
      whileHover={
        absorbing || reduceMotion ? undefined : { scale: 1.05 }
      }
      whileDrag={{ scale: 1.08, zIndex: 50 }}
      onDragStart={() => {
        setDragging(true);
        overRef.current = false;
      }}
      onDrag={(_, info: PanInfo) => {
        const over = evaluateOver(info.point);
        overRef.current = over;
        onHoverFolderChange(over);
      }}
      onDragEnd={(_, info: PanInfo) => {
        setDragging(false);
        const overNow = evaluateOver(info.point);
        const shouldDrop = overRef.current || overNow;
        overRef.current = false;
        onHoverFolderChange(false);
        if (shouldDrop) onDropInFolder(pillar.id);
      }}
    >
      <div className="relative inline-block">
        <p className="font-['Lucas',sans-serif] text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl md:text-4xl">
          {pillar.title}
        </p>
        {showDragHint && !absorbing && (
          <span className="pointer-events-none absolute bottom-0 right-0 translate-x-[110%] translate-y-[40%] whitespace-nowrap font-['Lucas',sans-serif] text-[10px] text-zinc-400 sm:text-[11px]">
            drag me
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function SystemFramework({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const folderRef = useRef<HTMLDivElement>(null);
  const [droppedIds, setDroppedIds] = useState<PillarId[]>([]);
  const [absorbingId, setAbsorbingId] = useState<PillarId | null>(null);
  const [folderHighlight, setFolderHighlight] = useState(false);

  const remaining = SHUFFLR_SYSTEM_PILLARS.filter(
    (p) => !droppedIds.includes(p.id),
  );
  const revealed = droppedIds
    .map((id) => SHUFFLR_SYSTEM_PILLARS.find((p) => p.id === id)!)
    .filter(Boolean);

  const finalizeDrop = useCallback((id: PillarId) => {
    setDroppedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setAbsorbingId((current) => (current === id ? null : current));
    setFolderHighlight(false);
  }, []);

  const beginDrop = useCallback(
    (id: PillarId) => {
      if (droppedIds.includes(id) || absorbingId === id) return;
      if (reduceMotion) {
        finalizeDrop(id);
        return;
      }
      setAbsorbingId(id);
      setFolderHighlight(true);
    },
    [absorbingId, droppedIds, finalizeDrop, reduceMotion],
  );

  useEffect(() => {
    if (!absorbingId) return;
    const t = window.setTimeout(() => finalizeDrop(absorbingId), 280);
    return () => window.clearTimeout(t);
  }, [absorbingId, finalizeDrop]);

  const hintId = remaining[0]?.id;

  return (
    <div className={clsx("w-full", className)}>
      <div
        className={clsx(
          "relative w-full overflow-hidden rounded-[26px]",
          revealed.length > 1
            ? "min-h-[680px] sm:min-h-[640px]"
            : "min-h-[560px] sm:min-h-[620px]",
        )}
        style={{ backgroundColor: "#E7F0FA" }}
        aria-label="Drag Desirability, Viability, and Feasibility into the Shufflr folder to reveal each definition"
      >
        {remaining.map((pillar) => (
          <PillarWord
            key={pillar.id}
            pillar={pillar}
            reduceMotion={reduceMotion}
            absorbing={absorbingId === pillar.id}
            showDragHint={pillar.id === hintId}
            onDropInFolder={beginDrop}
            folderRef={folderRef}
            onHoverFolderChange={setFolderHighlight}
          />
        ))}

        {/* Large bottom-left drop zone (~42% of canvas) */}
        <div
          ref={folderRef}
          className="absolute bottom-0 left-0 z-20 flex h-[42%] w-[42%] min-h-[200px] min-w-[180px] items-end justify-start p-4 sm:p-6"
          data-drop-zone="shufflr-folder"
        >
          <div
            className={clsx(
              "rounded-2xl p-2 transition-colors",
              folderHighlight &&
                "bg-white/55 ring-2 ring-dashed ring-blue-400/80",
            )}
          >
            <MacFolder
              highlighted={folderHighlight}
              reduceMotion={reduceMotion}
            />
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-[30%] right-3 z-10 sm:bottom-5 sm:left-[32%] sm:right-5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
            <AnimatePresence initial={false}>
              {revealed.map((pillar) => (
                <motion.div
                  key={pillar.id}
                  className="pointer-events-auto overflow-hidden rounded-2xl border border-white/70 bg-white/90 p-3 shadow-[0_8px_24px_rgba(24,24,27,0.1)] backdrop-blur-sm sm:p-3.5"
                  initial={
                    reduceMotion ? false : { opacity: 0, y: 18, scale: 0.94 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  layout
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: pillar.color }}
                      aria-hidden
                    />
                    <h3 className="font-['Lucas',sans-serif] text-sm font-semibold text-zinc-900">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="font-['Lucas',sans-serif] text-[11px] leading-relaxed text-zinc-600 sm:text-xs md:text-[13px]">
                    {pillar.body}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="sr-only">
          {remaining.map((pillar) => (
            <button
              key={pillar.id}
              type="button"
              onClick={() => beginDrop(pillar.id)}
            >
              Add {pillar.title} to Shufflr folder
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
