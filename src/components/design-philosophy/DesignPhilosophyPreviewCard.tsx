import clsx from "clsx";
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
        "group flex w-full overflow-hidden rounded-3xl border border-zinc-100 bg-white text-left shadow-default transition-shadow duration-200 hover:shadow-default-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
        className,
      )}
    >
      <div className="flex w-full flex-col overflow-hidden md:h-[210px] md:flex-row">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 px-6 py-6 md:px-8 md:py-6">
          <p className="font-['Lucas',sans-serif] text-sm font-normal text-zinc-400">
            {DESIGN_PHILOSOPHY_META.cardDate}
          </p>
          <h3 className="text-balance font-['Lucas',sans-serif] text-xl font-medium text-zinc-700 md:text-2xl">
            {DESIGN_PHILOSOPHY_META.title}
          </h3>
          <p className="line-clamp-3 text-pretty font-['Lucas',sans-serif] text-sm leading-relaxed text-zinc-500">
            {DESIGN_PHILOSOPHY_META.previewExcerpt}
          </p>
        </div>

        <div className="relative h-44 w-full shrink-0 overflow-hidden bg-white md:h-full md:w-[40%]">
          <img
            src={DESIGN_PHILOSOPHY_META.coverImage}
            alt={DESIGN_PHILOSOPHY_META.coverAlt}
            className="absolute inset-0 size-full object-cover object-right-top"
          />
        </div>
      </div>
    </button>
  );
}
