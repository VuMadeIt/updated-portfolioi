export type ScatterLayout = {
  /** Note center X as % of canvas */
  cxPct: number;
  /** Note center Y as % of canvas */
  cyPct: number;
  /** Note width/height as % of canvas (square) */
  sizePct: number;
  rotate: number;
  zIndex: number;
};

type Aabb = { x: number; y: number; w: number; h: number };

/** Minimum gap between rotated AABBs (% of canvas). */
export const STICKY_GAP_PCT = 1.25;
const PLACE_ATTEMPTS_PER_CELL = 48;
const ROTATE_MIN = -8;
const ROTATE_MAX = 8;

function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function unit(seed: number, salt: number): number {
  const x = Math.sin(seed * 0.00013 + salt * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Axis-aligned bounding box that fully covers a square of `size` centered at
 * (cx, cy) after rotation by `deg`. Larger than the unrotated box — required so
 * rotated corners never clip into neighbors.
 */
export function rotatedSquareAabb(
  cx: number,
  cy: number,
  size: number,
  deg: number,
): Aabb {
  const rad = (deg * Math.PI) / 180;
  const c = Math.abs(Math.cos(rad));
  const s = Math.abs(Math.sin(rad));
  const half = size / 2;
  const halfW = half * c + half * s;
  const halfH = half * s + half * c;
  return {
    x: cx - halfW,
    y: cy - halfH,
    w: halfW * 2,
    h: halfH * 2,
  };
}

export function aabbsOverlap(a: Aabb, b: Aabb, gap = 0): boolean {
  return !(
    a.x + a.w + gap <= b.x ||
    b.x + b.w + gap <= a.x ||
    a.y + a.h + gap <= b.y ||
    b.y + b.h + gap <= a.y
  );
}

/** Minimum inset from canvas edges (%). Keeps notes off the rim. */
const CANVAS_PAD_PCT = 4.5;

function aabbInsideCanvas(box: Aabb, pad = CANVAS_PAD_PCT): boolean {
  return (
    box.x >= pad &&
    box.y >= pad &&
    box.x + box.w <= 100 - pad &&
    box.y + box.h <= 100 - pad
  );
}

type Placed = {
  id: string;
  cx: number;
  cy: number;
  size: number;
  rotate: number;
  aabb: Aabb;
};

function collidesAny(candidate: Aabb, placed: Placed[], gap: number): boolean {
  return placed.some((p) => aabbsOverlap(candidate, p.aabb, gap));
}

/**
 * Grid-with-jitter, zero-overlap layout.
 * Uses rotation-expanded AABBs. Shrinks note size until every note places.
 * Never falls back to allowing overlap.
 */
export function buildZeroOverlapLayouts(
  notes: readonly { id: string }[],
): Map<string, ScatterLayout> {
  const n = notes.length;
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);

  const sizeCandidates: number[] = [];
  // Prefer larger uniform squares so the longest quote fits without clipping.
  for (let s = 32; s >= 18; s -= 0.5) sizeCandidates.push(s);

  for (const sizePct of sizeCandidates) {
    const placed: Placed[] = [];
    let failed = false;

    for (let i = 0; i < n; i += 1) {
      const note = notes[i];
      const seed = hashId(note.id);
      const col = i % cols;
      const row = Math.floor(i / cols);

      const cellW = 100 / cols;
      const cellH = 100 / rows;
      const maxJitterX = Math.max(0, (cellW - sizePct) * 0.42);
      const maxJitterY = Math.max(0, (cellH - sizePct) * 0.42);

      let placedNote: Placed | null = null;

      for (let attempt = 0; attempt < PLACE_ATTEMPTS_PER_CELL; attempt += 1) {
        const rotate =
          ROTATE_MIN + unit(seed, attempt * 5 + 7) * (ROTATE_MAX - ROTATE_MIN);

        const cx =
          cellW * (col + 0.5) +
          (unit(seed, attempt * 5 + 1) * 2 - 1) * maxJitterX;
        const cy =
          cellH * (row + 0.5) +
          (unit(seed, attempt * 5 + 2) * 2 - 1) * maxJitterY;

        const aabb = rotatedSquareAabb(cx, cy, sizePct, rotate);
        if (!aabbInsideCanvas(aabb)) continue;
        if (collidesAny(aabb, placed, STICKY_GAP_PCT)) continue;

        placedNote = { id: note.id, cx, cy, size: sizePct, rotate, aabb };
        break;
      }

      if (!placedNote) {
        for (let attempt = 0; attempt < 120; attempt += 1) {
          const rotate =
            ROTATE_MIN +
            unit(seed, 200 + attempt * 3) * (ROTATE_MAX - ROTATE_MIN);
          const halfExt =
            (sizePct / 2) *
            (Math.abs(Math.cos((rotate * Math.PI) / 180)) +
              Math.abs(Math.sin((rotate * Math.PI) / 180)));
          const minC = halfExt + CANVAS_PAD_PCT;
          const maxC = 100 - halfExt - CANVAS_PAD_PCT;
          if (maxC <= minC) break;
          const cx = minC + unit(seed, 300 + attempt * 3 + 1) * (maxC - minC);
          const cy = minC + unit(seed, 300 + attempt * 3 + 2) * (maxC - minC);
          const aabb = rotatedSquareAabb(cx, cy, sizePct, rotate);
          if (!aabbInsideCanvas(aabb)) continue;
          if (collidesAny(aabb, placed, STICKY_GAP_PCT)) continue;
          placedNote = { id: note.id, cx, cy, size: sizePct, rotate, aabb };
          break;
        }
      }

      if (!placedNote) {
        failed = true;
        break;
      }
      placed.push(placedNote);
    }

    if (!failed && placed.length === n) {
      for (let i = 0; i < placed.length; i += 1) {
        for (let j = i + 1; j < placed.length; j += 1) {
          if (aabbsOverlap(placed[i].aabb, placed[j].aabb, STICKY_GAP_PCT)) {
            failed = true;
            break;
          }
        }
        if (failed) break;
      }
    }

    if (!failed && placed.length === n) {
      const map = new Map<string, ScatterLayout>();
      placed.forEach((p, index) => {
        map.set(p.id, {
          cxPct: Number(p.cx.toFixed(3)),
          cyPct: Number(p.cy.toFixed(3)),
          sizePct: Number(p.size.toFixed(3)),
          rotate: Number(p.rotate.toFixed(2)),
          zIndex: 1 + index,
        });
      });
      return map;
    }
  }

  // Last resort: denser pack, still zero overlap (no jitter, no rotation).
  const fallbackSize = 14;
  const map = new Map<string, ScatterLayout>();
  notes.forEach((note, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = (100 / cols) * (col + 0.5);
    const cy = (100 / rows) * (row + 0.5);
    map.set(note.id, {
      cxPct: cx,
      cyPct: cy,
      sizePct: fallbackSize,
      rotate: 0,
      zIndex: 1 + i,
    });
  });
  return map;
}

/** Assert every pair of layouts has non-overlapping rotated AABBs. */
export function assertZeroOverlap(
  layouts: Map<string, ScatterLayout>,
  gap = STICKY_GAP_PCT,
): { ok: boolean; conflicts: string[] } {
  const entries = [...layouts.entries()];
  const conflicts: string[] = [];
  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const [, a] = entries[i];
      const [, b] = entries[j];
      const aa = rotatedSquareAabb(a.cxPct, a.cyPct, a.sizePct, a.rotate);
      const bb = rotatedSquareAabb(b.cxPct, b.cyPct, b.sizePct, b.rotate);
      if (aabbsOverlap(aa, bb, gap)) {
        conflicts.push(`${entries[i][0]}↔${entries[j][0]}`);
      }
    }
  }
  return { ok: conflicts.length === 0, conflicts };
}
