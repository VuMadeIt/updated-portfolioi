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

export function isOverDropZone(
  folderRect: { left: number; top: number; right: number; bottom: number } | null,
  wordRect: { left: number; top: number; right: number; bottom: number } | null,
  point: { x: number; y: number },
) {
  if (!folderRect) return false;
  // Prefer word↔folder overlap — most reliable while dragging.
  if (wordRect && rectsOverlap(wordRect, folderRect, 100)) return true;
  if (pointInExpanded(point, folderRect, 120)) return true;
  return false;
}
