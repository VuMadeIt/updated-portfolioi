/** Geometry helpers for SystemFramework folder drop detection. */

export function expandRect(
  rect: { left: number; top: number; right: number; bottom: number },
  pad: number,
) {
  return {
    left: rect.left - pad,
    top: rect.top - pad,
    right: rect.right + pad,
    bottom: rect.bottom + pad,
  };
}

export function pointInExpanded(
  point: { x: number; y: number },
  rect: { left: number; top: number; right: number; bottom: number },
  pad: number,
) {
  const r = expandRect(rect, pad);
  return (
    point.x >= r.left &&
    point.x <= r.right &&
    point.y >= r.top &&
    point.y <= r.bottom
  );
}

export function rectsOverlap(
  a: { left: number; top: number; right: number; bottom: number },
  b: { left: number; top: number; right: number; bottom: number },
  pad: number,
) {
  const e = expandRect(b, pad);
  return !(
    a.right < e.left ||
    a.left > e.right ||
    a.bottom < e.top ||
    a.top > e.bottom
  );
}

/** Tight hitbox — must be directly over the folder (small pad for finger precision). */
const FOLDER_HIT_PAD = 12;

export function isOverDropZone(
  folderRect: { left: number; top: number; right: number; bottom: number } | null,
  wordRect: { left: number; top: number; right: number; bottom: number } | null,
  point: { x: number; y: number },
) {
  if (!folderRect) return false;
  // Require actual overlap with the folder bounds (tight pad).
  if (wordRect && rectsOverlap(wordRect, folderRect, FOLDER_HIT_PAD)) return true;
  if (pointInExpanded(point, folderRect, FOLDER_HIT_PAD)) return true;
  return false;
}
