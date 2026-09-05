"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { SHUFFLR_NORTH_STAR_ROWS } from "./shufflrContent";

const STAR_ICON = "/images/shufflr/north-star-icon.png";

type Pt = { x: number; y: number };

type ConnectorPaths = {
  straights: Array<{ from: Pt; to: Pt }>;
  curves: Array<{ from: Pt; to: Pt; control: Pt }>;
};

function midRight(el: HTMLElement, origin: DOMRect): Pt {
  const r = el.getBoundingClientRect();
  return {
    x: r.right - origin.left,
    y: r.top + r.height / 2 - origin.top,
  };
}

function midLeft(el: HTMLElement, origin: DOMRect): Pt {
  const r = el.getBoundingClientRect();
  return {
    x: r.left - origin.left,
    y: r.top + r.height / 2 - origin.top,
  };
}

function circleCenter(el: HTMLElement, origin: DOMRect): Pt {
  const r = el.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 - origin.left,
    y: r.top + r.height / 2 - origin.top,
  };
}

/** Point on the circle perimeter where a ray from `from` toward `center` hits the edge. */
function pointOnCircleEdge(from: Pt, center: Pt, radius: number): Pt {
  const dx = center.x - from.x;
  const dy = center.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return {
    x: center.x - (dx / len) * radius,
    y: center.y - (dy / len) * radius,
  };
}

function arrowHead(from: Pt, to: Pt, size = 6) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  return [
    to,
    {
      x: to.x - size * Math.cos(angle - Math.PI / 7),
      y: to.y - size * Math.sin(angle - Math.PI / 7),
    },
    {
      x: to.x - size * Math.cos(angle + Math.PI / 7),
      y: to.y - size * Math.sin(angle + Math.PI / 7),
    },
  ] as const;
}

/** Tangent at end of quadratic curve is control → end. */
function curveArrowHead(control: Pt, to: Pt, size = 6) {
  return arrowHead(control, to, size);
}

export function NorthStarDiagram({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const kpiRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dimensionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [paths, setPaths] = useState<ConnectorPaths>({
    straights: [],
    curves: [],
  });
  const [size, setSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const root = rootRef.current;
    const circle = circleRef.current;
    if (!root || !circle) return;

    const origin = root.getBoundingClientRect();
    const straights: ConnectorPaths["straights"] = [];
    const curves: ConnectorPaths["curves"] = [];
    const center = circleCenter(circle, origin);
    const radius = circle.getBoundingClientRect().width / 2;

    SHUFFLR_NORTH_STAR_ROWS.forEach((_, index) => {
      const feature = featureRefs.current[index];
      const kpi = kpiRefs.current[index];
      const dimension = dimensionRefs.current[index];
      if (!feature || !kpi || !dimension) return;

      straights.push({
        from: midRight(feature, origin),
        to: midLeft(kpi, origin),
      });
      straights.push({
        from: midRight(kpi, origin),
        to: midLeft(dimension, origin),
      });

      const from = midRight(dimension, origin);
      const to = pointOnCircleEdge(from, center, radius);
      const midX = from.x + (to.x - from.x) * 0.55;
      curves.push({
        from,
        to,
        control: {
          x: midX,
          y: from.y + (to.y - from.y) * 0.12,
        },
      });
    });

    setPaths({ straights, curves });
    setSize({ w: origin.width, h: origin.height });
  }, []);

  useLayoutEffect(() => {
    measure();
    const root = rootRef.current;
    if (!root) return;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(measure);
    });
    ro.observe(root);
    window.addEventListener("resize", measure);
    void document.fonts?.ready?.then(measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const rowCount = SHUFFLR_NORTH_STAR_ROWS.length;

  return (
    <div
      ref={rootRef}
      className={clsx(
        "relative w-full min-w-0 max-w-full overflow-hidden bg-transparent py-1 sm:py-2 md:py-4",
        className,
      )}
      role="img"
      aria-label="North star framework: product initiatives feed KPIs and dimensions that drive real hangouts, not just scrolling"
    >
      <div
        className={clsx(
          "grid w-full min-w-0 items-center",
          "grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.75fr)_minmax(3.75rem,0.7fr)]",
          "gap-x-1 gap-y-1.5",
          "sm:grid-cols-[minmax(0,1.3fr)_minmax(0,0.95fr)_minmax(0,0.8fr)_minmax(5rem,0.8fr)]",
          "sm:gap-x-2 sm:gap-y-2",
          "md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.95fr)_minmax(0,0.8fr)_minmax(7.5rem,0.85fr)]",
          "md:gap-x-3.5 md:gap-y-2.5",
          "lg:gap-x-5",
        )}
        style={{
          gridTemplateRows: `auto repeat(${rowCount}, minmax(0, auto))`,
        }}
      >
        <p className="truncate font-['Lucas',sans-serif] text-[9px] font-semibold text-zinc-900 sm:text-[11px] md:text-sm [grid-column:1] [grid-row:1]">
          Product initiatives
        </p>
        <p className="truncate font-['Lucas',sans-serif] text-[9px] font-semibold text-zinc-900 sm:text-[11px] md:text-sm [grid-column:2] [grid-row:1]">
          KPI
        </p>
        <p className="truncate font-['Lucas',sans-serif] text-[9px] font-semibold text-zinc-900 sm:text-[11px] md:text-sm [grid-column:3] [grid-row:1]">
          Dimension
        </p>
        <p className="truncate text-center font-['Lucas',sans-serif] text-[9px] font-semibold text-zinc-900 sm:text-[11px] md:text-sm [grid-column:4] [grid-row:1]">
          North star
        </p>

        {SHUFFLR_NORTH_STAR_ROWS.map((row, index) => {
          const gridRow = index + 2;
          return (
            <div key={row.dimension} className="contents">
              <div
                ref={(el) => {
                  featureRefs.current[index] = el;
                }}
                className="min-w-0 rounded-lg bg-teal-200 px-1.5 py-1 sm:rounded-xl sm:px-2 sm:py-1.5 md:rounded-xl md:px-2.5 md:py-2"
                style={{ gridColumn: 1, gridRow }}
              >
                <p className="font-['Lucas',sans-serif] text-[8px] font-semibold leading-tight text-teal-950 sm:text-[10px] md:text-xs lg:text-[13px]">
                  {row.feature}
                </p>
                <ul className="mt-0.5 space-y-0 sm:mt-1 sm:space-y-0.5">
                  {row.featureBullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-1 font-['Lucas',sans-serif] text-[7px] leading-snug text-teal-900 sm:gap-1.5 sm:text-[9px] md:text-[11px]"
                    >
                      <span className="mt-[0.35em] size-0.5 shrink-0 rounded-full bg-teal-800 sm:size-1" />
                      <span className="min-w-0">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                ref={(el) => {
                  kpiRefs.current[index] = el;
                }}
                className="flex h-full min-h-0 min-w-0 items-center justify-center rounded-full bg-blue-200 px-1 py-0.5 text-center sm:min-h-[36px] sm:px-1.5 sm:py-1.5 md:min-h-[44px] md:px-2 md:py-2"
                style={{ gridColumn: 2, gridRow }}
              >
                <p className="font-['Lucas',sans-serif] text-[7px] font-semibold leading-snug text-blue-950 sm:text-[9px] md:text-[11px] lg:text-xs">
                  {row.kpi}
                </p>
              </div>

              <div
                ref={(el) => {
                  dimensionRefs.current[index] = el;
                }}
                className="flex h-full min-h-0 min-w-0 items-center justify-center rounded-full bg-purple-200 px-1 py-0.5 text-center sm:min-h-[32px] sm:px-1.5 sm:py-1.5 md:min-h-[40px] md:px-2 md:py-2"
                style={{ gridColumn: 3, gridRow }}
              >
                <p className="font-['Lucas',sans-serif] text-[7px] font-semibold leading-snug text-purple-950 sm:text-[9px] md:text-[11px] lg:text-xs">
                  {row.dimension}
                </p>
              </div>
            </div>
          );
        })}

        <div
          className="flex min-w-0 items-center justify-center self-stretch"
          style={{
            gridColumn: 4,
            gridRow: `2 / span ${rowCount}`,
          }}
        >
          <div
            ref={circleRef}
            className="relative flex size-[4.25rem] shrink-0 items-center justify-center rounded-full bg-blue-600 sm:size-[6rem] md:size-[8.25rem] lg:size-[8.75rem]"
          >
            <div className="absolute left-1/2 top-0 z-10 size-5 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-white shadow-sm sm:size-7 md:size-9 lg:size-10">
              <img
                src={STAR_ICON}
                alt=""
                className="size-full object-cover"
              />
            </div>
            <div className="px-1 text-center sm:px-2 md:px-3">
              <p className="font-['Lucas',sans-serif] text-[8px] font-semibold leading-snug text-white sm:text-[11px] md:text-sm lg:text-base">
                Real hangouts
              </p>
              <p className="mt-0.5 font-['Lucas',sans-serif] text-[6px] leading-snug text-blue-100 sm:mt-1 sm:text-[9px] md:text-[11px] lg:text-xs">
                not just scrolling
              </p>
            </div>
          </div>
        </div>
      </div>

      {size.w > 0 && (
        <svg
          className="pointer-events-none absolute inset-0 z-10"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          aria-hidden
        >
          {paths.straights.map((segment, i) => {
            const head = arrowHead(segment.from, segment.to, 5);
            return (
              <g key={`s-${i}`}>
                <line
                  x1={segment.from.x}
                  y1={segment.from.y}
                  x2={segment.to.x}
                  y2={segment.to.y}
                  stroke="#a1a1aa"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <polygon
                  points={`${head[0].x},${head[0].y} ${head[1].x},${head[1].y} ${head[2].x},${head[2].y}`}
                  fill="#a1a1aa"
                />
              </g>
            );
          })}
          {paths.curves.map((curve, i) => {
            const head = curveArrowHead(curve.control, curve.to, 5);
            return (
              <g key={`c-${i}`}>
                <path
                  d={`M ${curve.from.x} ${curve.from.y} Q ${curve.control.x} ${curve.control.y} ${curve.to.x} ${curve.to.y}`}
                  fill="none"
                  stroke="#a1a1aa"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <polygon
                  points={`${head[0].x},${head[0].y} ${head[1].x},${head[1].y} ${head[2].x},${head[2].y}`}
                  fill="#a1a1aa"
                />
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
