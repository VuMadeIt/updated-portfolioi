import clsx from "clsx";

type CornerPlaybackControlProps = {
  isPlaying: boolean;
  className?: string;
};

function PlayGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="ml-0.5 size-[42%] fill-current"
    >
      <path d="M8 5.14v13.72L19.5 12 8 5.14z" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[42%] fill-current"
    >
      <path d="M7 5h3.5v14H7V5zm6.5 0H17v14h-3.5V5z" />
    </svg>
  );
}

/**
 * Dark rounded-square play/pause control — top-right corner overlay
 * (Revision Dojo–style sticky-board pause chip).
 */
export function CornerPlaybackControl({
  isPlaying,
  className,
}: CornerPlaybackControlProps) {
  return (
    <span
      className={clsx(
        "pointer-events-none absolute top-3 right-3 z-10 flex size-10 items-center justify-center rounded-[12px] bg-zinc-800 text-white sm:top-3.5 sm:right-3.5 sm:size-11 sm:rounded-[14px]",
        className,
      )}
      aria-hidden="true"
    >
      {isPlaying ? <PauseGlyph /> : <PlayGlyph />}
    </span>
  );
}
