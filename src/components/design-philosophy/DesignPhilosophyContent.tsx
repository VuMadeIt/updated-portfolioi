"use client";

import { useCallback, useRef, useState } from "react";
import clsx from "clsx";
import { DESIGN_PHILOSOPHY_META } from "./content";

function ArticleVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = false;
      video.volume = 1;
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
    setIsPlaying(false);
  }, []);

  return (
    <div className={clsx("w-full", className)}>
      <button
        type="button"
        className="relative w-full overflow-hidden rounded-2xl bg-zinc-100 sm:rounded-3xl"
        aria-label={isPlaying ? "Pause hummingbird video" : "Play hummingbird video"}
        onClick={(event) => {
          event.stopPropagation();
          void togglePlayback();
        }}
      >
        <video
          ref={videoRef}
          className="pointer-events-none aspect-[9/16] w-full object-contain"
          src={src}
          poster={poster}
          playsInline
          preload="metadata"
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
        {!isPlaying && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-zinc-900/20">
            <span className="flex size-12 items-center justify-center rounded-full bg-white">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="ml-0.5 size-5 fill-zinc-700"
              >
                <path d="M8 5.14v13.72L19.5 12 8 5.14z" />
              </svg>
            </span>
          </span>
        )}
      </button>
    </div>
  );
}

type DesignPhilosophyContentProps = {
  variant?: "page" | "modal";
  className?: string;
};

export default function DesignPhilosophyContent({
  variant = "page",
  className,
}: DesignPhilosophyContentProps) {
  const isModal = variant === "modal";

  return (
    <article
      className={clsx(
        "w-full",
        isModal
          ? "px-16 pb-20 pt-32 md:px-36 lg:px-48"
          : "mx-auto max-w-5xl px-12 py-16 md:px-32 lg:px-40 md:py-20",
        className,
      )}
    >
      <header className={clsx("flex flex-col gap-4", isModal ? "mb-8" : "mb-10")}>
        <p className="font-['Lucas',sans-serif] text-sm font-normal text-zinc-400">
          {DESIGN_PHILOSOPHY_META.date}
        </p>
        <h1
          className={clsx(
            "text-balance font-['Lucas',sans-serif] font-medium text-zinc-700",
            "text-3xl md:text-4xl",
          )}
        >
          {DESIGN_PHILOSOPHY_META.title}
        </h1>
      </header>

      <div className="flex flex-col gap-6 font-['Lucas',sans-serif] text-base leading-relaxed text-zinc-600">
        <p className="text-pretty">
          I woke at 4:00am for something I hadn&apos;t earned yet. With 5-inch green pumpkin senkos
          in my tackle box, a weedless rig tied by hand the night before, and the fishing rods I
          borrowed from a friend, I was certain that wanting something badly enough, studying how
          to catch one and dedicating the time to go out there was enough to catch that big fish.
        </p>
        <p className="text-pretty">
          That&apos;s the first lie every beginner tells himself: that the thing exists already…
          and the only work left is the reeling in.
        </p>
        <p className="text-pretty">
          Three hours passed in silence before anything was answered. And in that silence, sitting
          alone on the shore before the world woke up, my mind wandered somewhere I hadn&apos;t
          planned for it to go. I began thinking about my future; towards the rest of my life.
          I&apos;d always told myself I was an entrepreneur at heart, that building and disrupting
          was the whole point. But after becoming an operations coordinator for a charity, I
          realized running the machine never made my legs bounce under the desk. What does is the
          quieter thing, sitting down and making a product that actually reaches someone, that
          changes their morning the way mine was being changed by nothing but water and waiting. I
          hadn&apos;t gone there to figure that out. But the water doesn&apos;t ask what you came
          for before it gives you something anyway.
        </p>
        <div className="grid w-full grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,1fr)_min(30%,220px)] md:gap-10">
          <p className="text-pretty">
            A hummingbird came by while I sat there, and hovered over the red tip of my rod like it
            had found a flower. It hung there for a second, waiting for a sweetness that wasn&apos;t
            there, before realizing it had been fooled by paint and darting away. I think about that
            a lot. Like the bird, it&apos;s so easy to chase bright appearances over actual
            substance, to go after the shiny shell of a title, like entrepreneur, instead of the
            craft that actually feeds you. But the bird&apos;s real wisdom wasn&apos;t in avoiding
            the mistake; it was in refusing to stay tricked. It didn&apos;t waste time trying to
            drink from plastic or feeling foolish for being fooled. It recognized a dead end,
            pivoted instantly, and went looking for the real thing. That felt like something worth
            learning from a creature with a brain the size of a seed.
          </p>

          <ArticleVideo
            src={DESIGN_PHILOSOPHY_META.videoSrc}
            poster={DESIGN_PHILOSOPHY_META.videoPoster}
            className="justify-self-stretch"
          />
        </div>

        <p className="text-pretty">
          So when I think about why design is the thing, not entrepreneurship, not operations, but
          actually building the product and shipping the features people touch, I think about that
          morning by the water. There is a profound beauty in the realization that the title you
          spent your life chasing is sometimes just the painted red tip of a fishing rod, and the
          work you actually crave is the quiet, deliberate act of making something real. For me,
          it is the thrill of stepping into a blank canvas to map out the exact mechanics of a
          multiplayer experience, or watching someone interact with a prototype and having them
          find it intuitive. That is the actual, sustaining sweetness I was looking for.
        </p>
        <p className="text-pretty">
          I think about London, a week out from now, where I&apos;ll finally get to build game
          assets and a website for a studio I&apos;ve dreamed about working for since I was a kid,
          and how none of that path was a straight cast either. The casts that didn&apos;t land
          and the operations roles that felt hollow were just the necessary silence before the
          water answered.
        </p>
        <p className="text-pretty">And for that, I am forever grateful.</p>
      </div>
    </article>
  );
}
