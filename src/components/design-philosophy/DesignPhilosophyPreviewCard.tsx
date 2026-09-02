import clsx from "clsx";
import { ArrowUpRight } from "../icons/ArrowUpRight";
import { DESIGN_PHILOSOPHY_META } from "./content";

type DesignPhilosophyPreviewCardProps = {
  className?: string;
  onClick?: () => void;
};

export default function DesignPhilosophyPreviewCard({
  className,
  onClick,
}: DesignPhilosophyPreviewCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "group flex w-full flex-col items-start rounded-3xl border border-zinc-100 bg-white text-left shadow-default transition-shadow duration-200 hover:shadow-default-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-4 px-8 py-10 md:px-12 md:py-12">
        <p className="font-['Lucas',sans-serif] text-sm font-normal text-zinc-400">
          {DESIGN_PHILOSOPHY_META.date}
        </p>

        <div className="flex w-full items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-3">
            <h3 className="text-balance font-['Lucas',sans-serif] text-2xl font-medium text-zinc-700 md:text-3xl">
              {DESIGN_PHILOSOPHY_META.title}
            </h3>
            <p className="text-pretty font-['Lucas',sans-serif] text-base leading-relaxed text-zinc-500">
              {DESIGN_PHILOSOPHY_META.previewExcerpt}
            </p>
          </div>

          <span
            aria-hidden="true"
            className="hidden shrink-0 pt-1 text-zinc-700 opacity-0 transition-opacity duration-200 ease-out md:inline md:group-hover:opacity-100"
          >
            <ArrowUpRight />
          </span>
        </div>
      </div>
    </button>
  );
}
