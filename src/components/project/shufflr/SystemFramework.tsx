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

/**
 * Arc above the bottom-center folder.
 * Viability sits on the center axis (directly over the folder), higher;
 * the other two share the same offset from center and sit lower.
 */
const SLOT_LAYOUT: Record<
  PillarId,
  { left: string; top: string; bobDelay: number }
> = {
  desirability: { left: "22%", top: "34%", bobDelay: 0 },
  viability: { left: "50%", top: "22%", bobDelay: 0.45 },
  feasibility: { left: "78%", top: "34%", bobDelay: 0.9 },
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
  onDropInFolder,
  folderRef,
  onHoverFolderChange,
}: {
  pillar: Pillar;
  reduceMotion: boolean | null;
  absorbing: boolean;
  onDropInFolder: (id: PillarId) => void;
  folderRef: React.RefObject<HTMLDivElement | null>;
  onHoverFolderChange: (over: boolean) => void;
}) {
  const layout = SLOT_LAYOUT[pillar.id];
  const wordRef = useRef<HTMLDivElement>(null);
  const overRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  const evaluateOver = useCallback(
    (point: { x: number; y: number }) => {
      const folder = folderRef.current;
      const word = wordRef.current;
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
        "absolute z-30 -translate-x-1/2 touch-none select-none",
        dragging ? "cursor-grabbing" : "cursor-grab",
      )}
      style={{ left: layout.left, top: layout.top }}
      drag={!absorbing}
      dragMomentum={false}
      dragElastic={0.05}
      dragPropagation={false}
      initial={false}
      animate={
        absorbing
          ? { opacity: 0, scale: 0.12, y: 160 }
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
      <p className="whitespace-nowrap text-center font-['Lucas',sans-serif] text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl md:text-3xl">
        {pillar.title}
      </p>
    </motion.div>
  );
}

function RevealedCard({
  pillar,
  reduceMotion,
}: {
  pillar: Pillar;
  reduceMotion: boolean | null;
}) {
  const layout = SLOT_LAYOUT[pillar.id];

  return (
    <motion.div
      className="absolute z-20 w-[min(200px,30%)] -translate-x-1/2 sm:w-[min(220px,28%)]"
      style={{ left: layout.left, top: layout.top }}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    >
      <div className="rounded-2xl border border-white/70 bg-white/90 p-3 shadow-[0_8px_24px_rgba(24,24,27,0.1)] backdrop-blur-sm sm:p-3.5">
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
        <p className="font-['Lucas',sans-serif] text-[11px] leading-relaxed text-zinc-600 sm:text-xs">
          {pillar.body}
        </p>
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
    (p) => !droppedIds.includes(p.id) && absorbingId !== p.id,
  );

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

  const visibleWords = SHUFFLR_SYSTEM_PILLARS.filter(
    (p) => !droppedIds.includes(p.id),
  );
  const revealed = SHUFFLR_SYSTEM_PILLARS.filter((p) =>
    droppedIds.includes(p.id),
  );

  return (
    <div className={clsx("w-full", className)}>
      <div
        className="relative min-h-[480px] w-full overflow-hidden rounded-[26px] p-4 sm:min-h-[520px] sm:p-5 md:min-h-[540px] md:p-6"
        style={{ backgroundColor: "#E7F0FA" }}
        aria-label="Drag each word into the Shufflr folder to reveal its definition"
      >
        <p className="pointer-events-none absolute right-4 top-4 z-40 max-w-[11rem] text-right font-['Lucas',sans-serif] text-[10px] leading-snug text-zinc-400 sm:right-5 sm:top-5 sm:max-w-[14rem] sm:text-[11px] md:right-6 md:top-6">
          Drag each word into the folder
        </p>

        {visibleWords.map((pillar) => (
          <PillarWord
            key={pillar.id}
            pillar={pillar}
            reduceMotion={reduceMotion}
            absorbing={absorbingId === pillar.id}
            onDropInFolder={beginDrop}
            folderRef={folderRef}
            onHoverFolderChange={setFolderHighlight}
          />
        ))}

        <AnimatePresence>
          {revealed.map((pillar) => (
            <RevealedCard
              key={pillar.id}
              pillar={pillar}
              reduceMotion={reduceMotion}
            />
          ))}
        </AnimatePresence>

        <div
          ref={folderRef}
          className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 sm:bottom-5 md:bottom-6"
          data-drop-zone="shufflr-folder"
        >
          <div
            className={clsx(
              "rounded-2xl p-1 transition-colors sm:p-1.5",
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
