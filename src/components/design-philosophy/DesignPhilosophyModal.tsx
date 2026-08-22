"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useNavigate } from "@/lib/navigation";
import { useScrollLock } from "../../utils/useScrollLock";
import Tooltip from "../shared/Tooltip";
import { Expand } from "../icons/Expand";
import DesignPhilosophyContent from "./DesignPhilosophyContent";

const TOP_GRADIENT =
  "linear-gradient(180deg, hsla(0,0%,100%,.5) 0%, hsla(0,0%,100%,.369) 19%, hsla(0,0%,100%,.271) 34%, hsla(0,0%,100%,.191) 47%, hsla(0,0%,100%,.139) 56.5%, hsla(0,0%,100%,.097) 65%, hsla(0,0%,100%,.063) 73%, hsla(0,0%,100%,.038) 80.2%, hsla(0,0%,100%,.021) 86.1%, hsla(0,0%,100%,.011) 91%, hsla(0,0%,100%,.004) 95.2%, hsla(0,0%,100%,.001) 98.2%, transparent 100%)";

type DesignPhilosophyModalProps = {
  onClose: () => void;
};

export default function DesignPhilosophyModal({ onClose }: DesignPhilosophyModalProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useScrollLock();

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setIsVisible(false);
    window.setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      scrollContainer.classList.add("is-scrolling");
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollContainer.classList.remove("is-scrolling");
      }, 1000);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const handleExpand = () => {
    navigate("/design-philosophy");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-8 transition-all duration-400 ease-out">
      <div
        className={clsx(
          "absolute inset-0 bg-zinc-900/20 transition-opacity duration-400",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        onClick={handleClose}
      />

      <div
        className={clsx(
          "relative flex min-h-[80vh] max-h-[80vh] w-[calc(100%*10/12)] max-w-none flex-col overflow-hidden rounded-[26px] bg-white transition-all duration-400 ease-out sm:min-h-[90vh] sm:max-h-[90vh] max-md:w-full",
          isVisible
            ? "translate-y-0 opacity-100"
            : isClosing
              ? "translate-y-4 opacity-0"
              : "translate-y-8 opacity-0",
        )}
      >
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-20 hidden h-32 md:block"
          style={{ background: TOP_GRADIENT }}
        />

        <div className="absolute left-0 right-0 top-0 z-30 flex items-start justify-start pb-3 pl-6 pr-7 pt-6">
          <Tooltip label="Expand" portal>
            <button
              type="button"
              onClick={handleExpand}
              className="relative flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#a1a1aa] transition-colors duration-200 ease-out hover:bg-zinc-200"
              aria-label="Expand to full page"
            >
              <Expand size="18px" />
            </button>
          </Tooltip>
        </div>

        <div
          ref={scrollContainerRef}
          className="modal-scroll-container flex-1 overflow-y-auto overflow-x-hidden rounded-t-[26px]"
        >
          <DesignPhilosophyContent variant="modal" />
        </div>
      </div>
    </div>
  );
}
