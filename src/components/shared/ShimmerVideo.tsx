"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ComponentProps,
} from "react";
import clsx from "clsx";
import { CornerPlaybackControl } from "./CornerPlaybackControl";
import VideoPlayer from "./VideoPlayer";

type ShimmerVideoProps = ComponentProps<typeof VideoPlayer> & {
  /** Extra classes for the outer wrapper div */
  wrapperClassName?: string;
  /** Border radius class applied to the shimmer overlay */
  rounded?: string;
  /** Suppress the gray shimmer overlay (e.g. when a poster / fallback image already covers the loading state). */
  disableShimmer?: boolean;
};

const hasPositionClass = (cls?: string) =>
  !!cls && /\b(absolute|fixed|sticky)\b/.test(cls);

export default function ShimmerVideo({
  wrapperClassName,
  rounded,
  onLoaded,
  disableShimmer,
  autoPlay = true,
  loop = true,
  ...props
}: ShimmerVideoProps) {
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(!!autoPlay);
  const checkTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const hasCalledOnLoaded = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Click-to-play videos (not muted autoplay loops) get the corner control.
  const showPlaybackToggle = autoPlay === false;

  const handleLoaded = useCallback(() => {
    if (!hasCalledOnLoaded.current) {
      hasCalledOnLoaded.current = true;
      setLoaded(true);
      onLoaded?.();
    }
  }, [onLoaded]);

  const handleVideoReady = useCallback(
    (videoElement?: HTMLVideoElement) => {
      if (videoElement && videoElement.readyState >= 3) {
        handleLoaded();
      } else {
        checkTimeoutRef.current = setTimeout(() => {
          handleLoaded();
        }, 1000);
      }
    },
    [handleLoaded],
  );

  useEffect(() => {
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showPlaybackToggle) return;
    const video = rootRef.current?.querySelector("video");
    if (!video) return;

    const sync = () => setIsPlaying(!video.paused);
    sync();
    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    video.addEventListener("ended", sync);
    return () => {
      video.removeEventListener("play", sync);
      video.removeEventListener("pause", sync);
      video.removeEventListener("ended", sync);
    };
  }, [showPlaybackToggle, loaded, props.src]);

  const togglePlayback = useCallback(async () => {
    const video = rootRef.current?.querySelector("video");
    if (!video) return;

    if (video.paused) {
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
    <div
      ref={rootRef}
      className={clsx(!hasPositionClass(wrapperClassName) && "relative", wrapperClassName)}
    >
      {!disableShimmer && (
        <div
          className={clsx(
            "absolute inset-0 z-[1] animate-shimmer pointer-events-none transition-opacity duration-700 ease-out",
            loaded ? "opacity-0" : "opacity-100",
            rounded,
          )}
        />
      )}
      <VideoPlayer
        {...props}
        autoPlay={autoPlay}
        loop={loop}
        onLoaded={handleVideoReady}
      />
      {/* Transparent overlay to block iOS native video controls from showing */}
      <div className="pointer-events-none absolute inset-0 z-[2]" />
      {showPlaybackToggle && (
        <>
          <button
            type="button"
            className="absolute inset-0 z-[3] cursor-pointer border-0 bg-transparent p-0"
            aria-label={isPlaying ? "Pause video" : "Play video"}
            onClick={(event) => {
              event.stopPropagation();
              void togglePlayback();
            }}
          />
          <CornerPlaybackControl isPlaying={isPlaying} className="z-[4]" />
        </>
      )}
    </div>
  );
}
