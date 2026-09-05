"use client";

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import {
  consumeHomeScrollReturn,
} from "@/components/shared/homeScrollReturn";
import dynamic from "next/dynamic";
import { useNavigate } from "@/lib/navigation";
import {
  bookSlugFromPathname,
  pushPathPreservingSearch,
  replacePathPreservingSearch,
} from "@/lib/shallowPath";
import { X_PROFILE_URL } from "@/lib/site";
import clsx from "clsx";
import { ArrowUpRight } from "../icons/ArrowUpRight";
import { TouchIcon } from "../icons/TouchIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { XLogo } from "../icons/XLogo";
import VideoPlayer from "../shared/VideoPlayer";
import ShimmerImage from "../shared/ShimmerImage";
import ShimmerVideo from "../shared/ShimmerVideo";
import Footer from "../layout/Footer";
import { buttonClassName } from "../shared/Button";
import { TryItOutButton } from "../shared/TryItOutButton";
import {
  getCachedData,
  setCachedData,
  preloadLikelyPages,
  preloadProject,
  WORK_SANITY_PROJECTS_KEY,
  WORK_EXPERIMENT_PROJECTS_KEY,
} from "../../sanity/preload";
import NavigationTabs from "../layout/NavigationTabs";
import WorkHero from "./WorkHero";
import ComingSoonCursor, { useComingSoonCursor } from "./ComingSoonCursor";
import { useScrollLock } from "../../utils/useScrollLock";
import { HorizontalLine } from "../shared/HorizontalLine";
import { muxPosterUrl, posterTimeForProject } from "../../lib/muxPoster";
import { toInternalProjectId, toPublicProjectSlug } from "../../lib/projectSlugs";
import {
  COMING_SOON_LABEL,
  isComingSoonProject,
} from "../../lib/comingSoonProjects";
import { posthog, posthogEnabled } from "../../lib/posthog";
import { useHeroAnimation } from "../../hooks/useHeroAnimation";
import { fadeUpStyles } from "../../styles/animations";
import { client, urlFor } from "../../sanity/client";
import { PROJECTS_QUERY, EXPERIMENT_PROJECTS_QUERY } from "../../sanity/queries";
import type { SanityImage } from "../../sanity/types";

// Keep Work's initial chunk light — these modals (and ExperimentModal's
// eager experiment-page imports) made About → Work wait on ~4k+ lines of JS.
const ExperimentModal = dynamic(() => import("../experiments/ExperimentModal"), {
  ssr: false,
});
const SanityProjectModal = dynamic(() => import("../project/ProjectModal"), {
  ssr: false,
});

// TextScramble is now imported from shared component when needed in this file's scope.
// The HomePageClient doesn't directly render TextScramble — it's used in Footer.

type ToolCategory = {
  label: string;
  tools: string[];
};

type Project = {
  id: string;
  title: string;
  year: string;
  description: string;
  imageSrc: string;
  /** Optional hover media (e.g. GIF) shown over imageSrc while the card is hovered. */
  hoverImageSrc?: string;
  videoSrc?: string;
  /** Uniform scale >1 crops letterboxing / side bars inside the rounded card. */
  mediaZoom?: number;
  /** Full/uncropped Mux assets for ExperimentModal / ExperimentSiteEmbed. */
  popupImageSrc?: string;
  popupVideoSrc?: string;
  xLink?: string;
  tryItOutHref?: string;
  backgroundColor?: string;
  toolCategories?: ToolCategory[];
};

function getMuxUrls(playbackId: string, projectId?: string) {
  return {
    imageSrc: muxPosterUrl(playbackId, { projectId, width: 1920 }),
    videoSrc: `https://stream.mux.com/${playbackId}.m3u8`,
  };
}

function projectForExperimentModal(project: Project): Project {
  return {
    ...project,
    imageSrc: project.popupImageSrc || project.imageSrc,
    videoSrc: project.popupVideoSrc || project.videoSrc,
  };
}

const staticProjects: Project[] = [
  {
    id: "warframe",
    title: "Warframe",
    year: "2026",
    description: COMING_SOON_LABEL,
    imageSrc: "/images/apple-still.jpg",
    hoverImageSrc: "/images/apple-hover.gif",
    videoSrc: "",
  },
  {
    id: "maple-leaf-foods",
    title: "Maple Leaf Foods",
    year: "2024",
    description: "Digitizing decades-old workflows at enterprise scale.",
    imageSrc: "/images/maple-leaf/logo.png",
    videoSrc: "",
  },
  {
    id: "ripple",
    title: "Ripple",
    year: "2026",
    description: "Reimagining a cleaner future with LLMs",
    imageSrc: "",
    videoSrc: "/videos/ripple.mp4",
  },
  {
    id: "shufflr",
    title: "Shufflr",
    year: "2026",
    description:
      "Lowering the activation energy of fun,\nlow-stakes hangout moments!",
    imageSrc: "",
    videoSrc: "/videos/shufflr.mp4",
  },
  {
    id: "parrot",
    title: "Parrot",
    year: "2026",
    description: "Creating the end-to-end experience for an iMessage integration",
    imageSrc: "",
    videoSrc: "/videos/parrot.mp4",
    backgroundColor: "#ffffff",
  },
  {
    id: "creators-collective",
    title: "Creators Collective",
    year: "2026",
    description:
      "Building a online exhibit to flaunt Waterloo's creatives. Keep refreshing the page to see past designs!",
    imageSrc: "",
    videoSrc: "/videos/creators-collective.mp4",
    tryItOutHref: "https://creatorscollective.framer.website/",
    mediaZoom: 1.12,
    backgroundColor: "#ffffff",
    toolCategories: [
      { label: "Design", tools: ["Figma"] },
      { label: "Development", tools: ["Framer"] },
      { label: "Role", tools: ["Web Designer"] },
      { label: "Team", tools: ["4 Web Designers", "1 Design Lead"] },
    ],
  },
];

type ProjectMediaProps = {
  imageSrc: string;
  videoSrc?: string;
  hoverImageSrc?: string;
  mediaZoom?: number;
};

const ProjectMedia = React.memo(function ProjectMedia({
  imageSrc,
  videoSrc,
  hoverImageSrc,
  mediaZoom = 1,
}: ProjectMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset image-loaded state when src changes (e.g. when Sanity data swaps in a new URL)
  useEffect(() => {
    setImageLoaded(false);
  }, [imageSrc]);

  // Catch images already cached by the browser, where onLoad may fire before the listener is attached
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [imageSrc]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let readyTimeout: ReturnType<typeof setTimeout> | null = null;
    let idleHandle: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Defer video mount to idle time so multiple cards don't all spin up
            // Mux/HLS players simultaneously and block main-thread input.
            const markReady = () => setVideoReady(true);
            const ric = (window as Window & {
              requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
            }).requestIdleCallback;
            if (typeof ric === "function") {
              idleHandle = ric(markReady, { timeout: 1500 });
            } else {
              readyTimeout = setTimeout(markReady, 600);
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      if (readyTimeout) clearTimeout(readyTimeout);
      if (idleHandle !== null) {
        const cic = (window as Window & {
          cancelIdleCallback?: (handle: number) => void;
        }).cancelIdleCallback;
        if (typeof cic === "function") cic(idleHandle);
      }
    };
  }, []);

  if (videoSrc) {
    const zoomStyle =
      mediaZoom !== 1
        ? { transform: `scale(${mediaZoom})`, transformOrigin: "center center" }
        : undefined;
    return (
      <div
        ref={containerRef}
        className="aspect-[678/367.625] relative isolate rounded-[26px] shrink-0 w-full overflow-hidden bg-[#e4e4e7]"
      >
        {/* High-res thumbnail shown once fully loaded, fades out when video is ready */}
        {imageSrc && (
          <img
            ref={imgRef}
            src={imageSrc}
            alt=""
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            style={zoomStyle}
            className={clsx(
              "absolute max-w-none object-cover size-full rounded-[26px] transition-opacity duration-500 ease-out pointer-events-none z-10",
              videoLoaded ? "opacity-0" : "opacity-100"
            )}
          />
        )}
        {isVisible && videoReady && (!imageSrc || imageLoaded) && (
          <>
            <div className="absolute inset-0" style={zoomStyle}>
              <VideoPlayer
                src={videoSrc}
                className="absolute max-w-none object-cover rounded-[26px] size-full"
                autoPlay
                muted
                loop
                controls={false}
                muxEnvKey="e4cc19a78gcf0tbtfmu4m7ruf"
                onLoaded={() => setVideoLoaded(true)}
              />
            </div>
            <div className="absolute inset-0 z-[2] rounded-[26px] pointer-events-none" />
          </>
        )}
        {/* Shimmer overlay covers progressive decode until the thumbnail (or video, if no thumbnail) is fully ready */}
        <div
          className={clsx(
            "absolute inset-0 rounded-[26px] bg-[#e4e4e7] animate-shimmer transition-opacity duration-500 ease-out pointer-events-none z-20",
            (imageSrc ? imageLoaded : videoLoaded) ? "opacity-0" : "opacity-100"
          )}
        />
      </div>
    );
  }

  if (!imageSrc) {
    return (
      <div 
        ref={containerRef}
        className="aspect-[678/367.625] relative isolate rounded-[26px] shrink-0 w-full overflow-hidden bg-[#e4e4e7]"
      >
        <div className="absolute inset-0 rounded-[26px] bg-[#e4e4e7] animate-shimmer" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="aspect-[678/367.625] relative isolate rounded-[26px] shrink-0 w-full overflow-hidden">
      <ShimmerImage
        alt=""
        className={clsx(
          "absolute max-w-none object-cover size-full transition-opacity duration-300 ease-out",
          hoverImageSrc && "group-hover:opacity-0",
        )}
        wrapperClassName="absolute inset-0"
        rounded="rounded-[26px]"
        src={imageSrc}
        loading="lazy"
      />
      {hoverImageSrc && (
        <img
          src={hoverImageSrc}
          alt=""
          decoding="async"
          loading="lazy"
          className="absolute inset-0 max-w-none object-cover size-full rounded-[26px] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 pointer-events-none"
        />
      )}
    </div>
  );
});

// SocialLinksBackgroundImage and LinksBackgroundImageAndText are now in src/components/SocialLinks.tsx

function getExperimentLink(projectId: string): { href: string; label: string; external: boolean } | null {
  switch (projectId) {
    case 'polaroid': return { href: '/polaroid', label: 'Try It Out!', external: false };
    case 'sketchbook': return { href: '/sketchbook', label: 'Try It Out!', external: false };
    case 'library': return { href: '/library', label: 'Try It Out!', external: false };
    case 'film': return { href: '/film', label: 'Try It Out!', external: false };
    case 'creators-collective': return null;
    default: return null;
  }
}

type ProjectCardProps = {
  project: Project;
  onProjectClick: (projectId: string) => void;
  featured?: boolean;
  /** Order index used to stagger the entrance animation */
  index?: number;
};

const SIDE_PROJECT_IDS = ["parrot", "creators-collective"];
/** Experiments kept in data/routes but omitted from the home experiments grid. */
const HIDDEN_EXPERIMENT_IDS: string[] = [];
const MAIN_PROJECT_IDS = ["warframe", "maple-leaf-foods", "ripple", "shufflr"];

function isVisibleOnHomeGrid(project: Project): boolean {
  return !HIDDEN_EXPERIMENT_IDS.includes(project.id);
}

function projectsForMobileHomeGrid(projects: Project[]): Project[] {
  return projects.filter(isVisibleOnHomeGrid);
}

const ProjectCard = React.memo(function ProjectCard({ project, onProjectClick, featured = false, index = 0 }: ProjectCardProps) {
  const experimentLink = getExperimentLink(project.id);
  const hasTryItOut = experimentLink !== null;
  const isComingSoon = isComingSoonProject(project.id);
  const displayDescription = isComingSoon ? COMING_SOON_LABEL : project.description;
  const { cursor, handlers: comingSoonHandlers } = useComingSoonCursor(isComingSoon);
  
  const handleClick = () => {
    if (isComingSoon) return;

    const isDesktop = window.innerWidth >= 768;
    
    if (experimentLink && !experimentLink.external && !isDesktop) {
      window.location.href = experimentLink.href;
    } else {
      onProjectClick(project.id);
    }
  };

  const warmProject = () => {
    if (isComingSoon) return;
    if (
      process.env.NODE_ENV !== "development" &&
      MAIN_PROJECT_IDS.includes(project.id)
    ) {
      void preloadProject(project.id);
    }
  };

  const enterStyle = { animationDelay: `${Math.min(index * 60, 300)}ms` };
  const cardClassName = clsx(
    "content-stretch flex flex-col gap-3 items-start relative shrink-0 w-full group project-card",
    isComingSoon ? "cursor-none max-md:cursor-default" : "cursor-pointer",
  );
  const sharedCardProps = {
    style: enterStyle,
    className: cardClassName,
    ...(isComingSoon
      ? {
          role: "group" as const,
          "aria-label": `${project.title} — ${COMING_SOON_LABEL}`,
          ...comingSoonHandlers,
        }
      : {
          type: "button" as const,
          onClick: handleClick,
          onMouseEnter: warmProject,
          onFocus: warmProject,
          onTouchStart: warmProject,
        }),
  };

  if (featured) {
    const CardTag = isComingSoon ? "div" : "button";

    return (
      <>
        <ComingSoonCursor active={cursor.active} x={cursor.x} y={cursor.y} />
        <CardTag {...sharedCardProps}>
        <div 
          className="content-stretch flex flex-col items-start justify-end overflow-clip relative rounded-[26px] shrink-0 w-full transition-transform duration-300 group-hover:scale-[0.99]"
        >
          <ProjectMedia
            imageSrc={project.imageSrc}
            videoSrc={project.videoSrc}
            hoverImageSrc={project.hoverImageSrc}
            mediaZoom={project.mediaZoom}
          />
          <div aria-hidden="true" className="absolute border border-zinc-100 inset-0 pointer-events-none rounded-[26px]" />
          <div className="absolute bottom-0 left-0 p-3 hidden md:block">
            <div className="bg-white border border-[#f4f4f5] border-solid flex items-center justify-center px-3 pt-[5px] pb-[4.8px] rounded-full">
              <p className="font-['Lucas',sans-serif] font-medium tracking-[0.005em] leading-snug text-[#18181b] text-base">
                <span>{project.title}</span>
                {!hasTryItOut && (
                  <span className="text-[#a1a1aa]"> • {project.year}</span>
                )}
                {hasTryItOut && (
                  <>
                    <span className="text-[#a1a1aa] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"> • </span>
                    <a
                      href={experimentLink!.href}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-end gap-1 align-baseline leading-none text-blue-400 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                      {...(experimentLink!.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {experimentLink!.label}{experimentLink!.external && <ArrowUpRight />}
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex content-stretch items-start px-[13px] py-0 -mt-1.5 -mb-0.5 relative shrink-0 w-full">
          <p className="whitespace-pre-line font-['Lucas',sans-serif] font-normal leading-snug text-[#a1a1aa] text-base tracking-[0.005em] text-left project-hover-text">{displayDescription}</p>
        </div>
        <div className="md:hidden content-stretch flex flex-col font-['Lucas',sans-serif] font-normal items-start leading-snug px-[13px] py-0 relative shrink-0 text-base tracking-[0.01em] gap-1">
          <div className="flex items-center w-full">
            <p className="relative shrink-0 text-[#18181b] text-left project-hover-text">
              <span>{project.title}</span>
              {!hasTryItOut && (
                <span className="text-[#a1a1aa]"> • {project.year}</span>
              )}
            </p>
            {hasTryItOut && (
              <a
                href={experimentLink!.href}
                onClick={(e) => e.stopPropagation()}
                className="ml-auto inline-flex items-center shrink-0 text-zinc-400 hover:text-zinc-500"
                aria-label={experimentLink!.label}
                {...(experimentLink!.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {experimentLink!.external ? (
                  <LinkIcon className="text-zinc-500" />
                ) : (
                  <TouchIcon />
                )}
              </a>
            )}
          </div>
          <p className="relative shrink-0 text-[#a1a1aa] w-full text-left font-normal leading-tight">{displayDescription}</p>
        </div>
        </CardTag>
      </>
    );
  }

  const CardTag = isComingSoon ? "div" : "button";

  return (
    <>
      <ComingSoonCursor active={cursor.active} x={cursor.x} y={cursor.y} />
      <CardTag {...sharedCardProps}>
      <div 
        className="content-stretch flex flex-col items-start overflow-clip relative rounded-[26px] shrink-0 w-full transition-transform duration-300 group-hover:scale-[0.99]"
      >
        <ProjectMedia
          imageSrc={project.imageSrc}
          videoSrc={project.videoSrc}
          hoverImageSrc={project.hoverImageSrc}
          mediaZoom={project.mediaZoom}
        />
        <div aria-hidden="true" className="absolute border border-zinc-100 inset-0 pointer-events-none rounded-[26px]" />
      </div>
      <div className="content-stretch flex font-['Lucas',sans-serif] md:-mt-1.5 md:-mb-0.5 font-normal items-start leading-snug px-[13px] py-0 relative shrink-0 text-base tracking-[0.005em] w-full project-hover-text">
        <p className="relative text-[#18181b] text-left">
          <span>{project.title}</span>
          <span className="text-[#a1a1aa]"> • {project.year}</span>
        </p>
        {hasTryItOut && (
          <a
            href={experimentLink!.href}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-start ml-auto shrink-0 text-zinc-400 hover:text-zinc-500 md:text-blue-400 md:hover:text-blue-300"
            {...(experimentLink!.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            aria-label={experimentLink!.label}
          >
            {experimentLink!.external ? (
              <LinkIcon className="text-zinc-500 md:text-inherit" />
            ) : (
              <TouchIcon />
            )}
          </a>
        )}
      </div>
      </CardTag>
    </>
  );
});

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
};

function ToolsSection({ categories }: { categories: ToolCategory[] }) {
  if (!categories || categories.length === 0) return null;
  
  return (
    <div className="flex w-full flex-col gap-2">
      <HorizontalLine />
      <div className={clsx(
        "font-['Lucas',sans-serif] font-normal gap-4 relative shrink-0 text-base w-full hidden md:grid",
        categories.length >= 5 ? "md:grid-cols-5" : "md:grid-cols-4",
      )}>
        {categories.map((category, idx) => (
          <div key={idx} className="content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0">
            <p className="leading-normal relative shrink-0 text-[#a1a1aa]">
              {category.label}
            </p>
            <div className="content-stretch flex flex-col items-start relative shrink-0 text-[#52525b] tracking-[0.005em]">
              {category.tools.map((tool, toolIdx) => (
                <div key={toolIdx} className="flex flex-col justify-center relative shrink-0">
                  <p className="leading-normal whitespace-nowrap">{tool}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="font-['Lucas',sans-serif] font-normal flex flex-col gap-1.5 relative shrink-0 text-sm w-full md:hidden">
        {categories.map((category, idx) => (
          <div key={idx} className="flex items-baseline gap-6">
            <p className="leading-normal shrink-0 text-[#a1a1aa] w-[72px]">
              {category.label}
            </p>
            <p className="leading-normal text-[#52525b] tracking-[0.005em]">
              {category.tools.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleProjectModal({ project, onClose }: ProjectModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useScrollLock();

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
    const timer = setTimeout(() => {
      setVideoReady(true);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-8">
      <div 
        className={`absolute inset-0 bg-zinc-900/20 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={handleClose} 
      />
      
      <div 
        className={clsx(
          "relative bg-white rounded-[26px] flex flex-col w-[calc(100%*10/12)] max-md:w-full max-h-[90vh] overflow-hidden transition-all duration-300 ease-out",
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : isClosing 
              ? 'opacity-0 translate-y-4' 
              : 'opacity-0 translate-y-8'
        )}
      >
        {/* Top white gradient overlay - desktop only */}
        <div className="hidden md:block absolute top-0 left-0 right-0 h-32 pointer-events-none z-20" style={{
          background: 'linear-gradient(180deg, hsla(0,0%,100%,.5) 0%, hsla(0,0%,100%,.369) 19%, hsla(0,0%,100%,.271) 34%, hsla(0,0%,100%,.191) 47%, hsla(0,0%,100%,.139) 56.5%, hsla(0,0%,100%,.097) 65%, hsla(0,0%,100%,.063) 73%, hsla(0,0%,100%,.038) 80.2%, hsla(0,0%,100%,.021) 86.1%, hsla(0,0%,100%,.011) 91%, hsla(0,0%,100%,.004) 95.2%, hsla(0,0%,100%,.001) 98.2%, transparent 100%)'
        }} />

        <div className="flex flex-col flex-1 min-h-0 pt-6 max-md:pt-4">
          <div className="overflow-y-auto flex-1">
            <div className="content-stretch flex flex-col gap-5 items-start px-44 max-md:px-10 pt-16 max-md:pt-4 pb-8 max-md:pb-10 relative shrink-0 w-full">
          <div className="hidden md:flex gap-2 items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative shrink-0">
              <div className="content-stretch flex items-start relative shrink-0 w-full">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
                  <p className="font-['Lucas',sans-serif] font-normal leading-normal relative shrink-0 text-xl text-zinc-900">
                    {project.title}
                  </p>
                  <p className="font-['Lucas',sans-serif] font-medium leading-snug relative shrink-0 text-[#a1a1aa] text-base tracking-[0.005em]">
                    •
                  </p>
                  <p className="font-['Lucas',sans-serif] font-normal leading-normal relative shrink-0 text-[#a1a1aa] text-xl">
                    {project.year}
                  </p>
                </div>
              </div>
              
              <div className="content-stretch flex gap-2 items-start relative w-full">
                <p className="whitespace-pre-line font-['Lucas',sans-serif] font-normal leading-normal relative text-[#71717a] text-base tracking-[0.005em]">
                  {project.description}
                </p>
              </div>
            </div>

            {(project.id === 'polaroid' || project.id === 'library' || project.id === 'screentime' || project.id === 'sketchbook') && (
              <TryItOutButton href={project.id === 'polaroid' ? '/polaroid' : project.id === 'screentime' ? '/screentime' : project.id === 'sketchbook' ? '/sketchbook' : '/library'} />
            )}
          </div>

          <div className="md:hidden flex flex-col gap-3 items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex items-start relative shrink-0 w-full">
                <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
                  <p className="font-['Lucas',sans-serif] font-normal leading-normal relative shrink-0 text-xl text-zinc-900">
                    {project.title}
                  </p>
                  <p className="font-['Lucas',sans-serif] font-medium leading-snug relative shrink-0 text-[#a1a1aa] text-base tracking-[0.005em]">
                    •
                  </p>
                  <p className="font-['Lucas',sans-serif] font-normal leading-normal relative shrink-0 text-[#a1a1aa] text-xl">
                    {project.year}
                  </p>
                </div>
              </div>
              
              <div className="content-stretch flex gap-2 items-start relative w-full">
                <p className="whitespace-pre-line font-['Lucas',sans-serif] font-normal leading-normal relative text-[#71717a] text-base tracking-[0.005em]">
                  {project.description}
                </p>
              </div>
            </div>

            {(project.id === 'polaroid' || project.id === 'library' || project.id === 'screentime' || project.id === 'sketchbook') && (
              <TryItOutButton href={project.id === 'polaroid' ? '/polaroid' : project.id === 'screentime' ? '/screentime' : project.id === 'sketchbook' ? '/sketchbook' : '/library'} />
            )}
          </div>

          {project.xLink && (
            <a
              href={project.xLink}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName({
                variant: "primary",
                size: "md",
                className: "relative mt-1 gap-1 whitespace-nowrap",
              })}
            >
              <span className="relative shrink-0 leading-normal tracking-[0.005em] whitespace-nowrap">
                View on
              </span>
              <XLogo size="14px" className="text-white" />
              <span className="inline-flex items-center text-white">
                <ArrowUpRight size="14px" />
              </span>
            </a>
          )}

          {project.toolCategories && project.toolCategories.length > 0 && (
            <ToolsSection categories={project.toolCategories} />
          )}

          <div className="relative rounded-2xl w-full aspect-[1097/616] overflow-hidden bg-zinc-100 shrink-0 mt-3">
            <ShimmerImage
              alt=""
              className="absolute object-cover size-full"
              wrapperClassName="absolute inset-0"
              rounded="rounded-2xl"
              src={project.imageSrc}
            />
            {project.videoSrc && videoReady && (
              <ShimmerVideo
                key={project.id}
                src={project.videoSrc}
                className="absolute object-cover size-full rounded-2xl"
                wrapperClassName="absolute inset-0"
                rounded="rounded-2xl"
                autoPlay
                muted
                loop
                controls={false}
                muxEnvKey="e4cc19a78gcf0tbtfmu4m7ruf"
              />
            )}
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type SanityProject = {
  company: string;
  heroVideo?: string;
};

type SanityExperimentProject = {
  _id: string;
  projectId: string;
  title: string;
  year: string;
  description: string;
  muxPlaybackIdClip?: string;
  muxPlaybackId?: string;
  fallbackThumbnail?: SanityImage;
  xLink?: string;
  tryItOutHref?: string;
  backgroundColor?: string;
  toolCategories?: ToolCategory[];
};

function mergeWorkProjects(
  sanityProjects: SanityProject[],
  experimentProjects: SanityExperimentProject[],
): Project[] {
  const heroVideoMap: Record<string, string> = {};
  sanityProjects.forEach((sp) => {
    if (sp.company && sp.heroVideo) {
      heroVideoMap[sp.company] = sp.heroVideo;
    }
  });

  const experimentMap: Record<string, SanityExperimentProject> = {};
  experimentProjects.forEach((ep) => {
    if (ep.projectId) {
      experimentMap[ep.projectId] = ep;
    }
  });

  return staticProjects.map((project) => {
    if (MAIN_PROJECT_IDS.includes(project.id)) {
      // Keep hardcoded local hero videos (Ripple / Shufflr) instead of Sanity Mux.
      if (project.videoSrc && !project.videoSrc.includes("stream.mux.com")) {
        return project;
      }
      // Keep local still + hover GIF (Apple) instead of Sanity Mux.
      if (
        project.hoverImageSrc ||
        (project.imageSrc.startsWith("/") && !project.imageSrc.includes("image.mux.com"))
      ) {
        return project;
      }
      const internalId = toInternalProjectId(project.id);
      const heroVideo = heroVideoMap[internalId] ?? heroVideoMap[project.id];
      if (heroVideo) {
        const muxUrls = getMuxUrls(heroVideo);
        return {
          ...project,
          imageSrc: muxUrls.imageSrc,
          videoSrc: muxUrls.videoSrc,
        };
      }
    }

    if (SIDE_PROJECT_IDS.includes(project.id)) {
      // Keep local hero videos (Parrot / Creators Collective) instead of Sanity Mux.
      if (project.videoSrc && !project.videoSrc.includes("stream.mux.com")) {
        const experimentData = experimentMap[project.id];
        if (!experimentData) return project;
        return {
          ...project,
          title: experimentData.title || project.title,
          year: experimentData.year || project.year,
          description: project.description || experimentData.description,
          xLink: experimentData.xLink || project.xLink,
          tryItOutHref:
            experimentData.tryItOutHref || project.tryItOutHref,
          backgroundColor:
            experimentData.backgroundColor || project.backgroundColor,
          toolCategories:
            project.toolCategories || experimentData.toolCategories,
        };
      }
      const experimentData = experimentMap[project.id];
      if (experimentData) {
        const clipPlaybackId =
          experimentData.muxPlaybackIdClip || experimentData.muxPlaybackId;
        const fullPlaybackId =
          experimentData.muxPlaybackId || clipPlaybackId;
        const muxUrls = clipPlaybackId
          ? getMuxUrls(clipPlaybackId, project.id)
          : { imageSrc: project.imageSrc, videoSrc: project.videoSrc };
        const popupMuxUrls = fullPlaybackId
          ? getMuxUrls(fullPlaybackId, project.id)
          : {
              imageSrc: project.popupImageSrc || muxUrls.imageSrc,
              videoSrc: project.popupVideoSrc || muxUrls.videoSrc,
            };
        const fallbackUrl = experimentData.fallbackThumbnail
          ? urlFor(experimentData.fallbackThumbnail).width(1920).url()
          : undefined;
        // Pinned first-frame posters must not be replaced by a settled CMS screenshot.
        const imageSrc =
          posterTimeForProject(project.id) !== undefined
            ? muxUrls.imageSrc
            : fallbackUrl || muxUrls.imageSrc;
        return {
          ...project,
          title: experimentData.title,
          year: experimentData.year,
          description: project.description || experimentData.description,
          imageSrc,
          videoSrc: muxUrls.videoSrc,
          popupImageSrc: popupMuxUrls.imageSrc,
          popupVideoSrc: popupMuxUrls.videoSrc,
          xLink: experimentData.xLink || project.xLink,
          tryItOutHref:
            experimentData.tryItOutHref || project.tryItOutHref,
          backgroundColor:
            experimentData.backgroundColor || project.backgroundColor,
          toolCategories:
            project.toolCategories || experimentData.toolCategories,
        };
      }
    }

    return project;
  });
}


type HomePageClientProps = {
  slug?: string;
  mode?: string;
  bookSlug?: string;
};

export default function HomePageClient({ slug, mode, bookSlug }: HomePageClientProps) {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>(staticProjects);

  const heroAnimationPlayed = useHeroAnimation();

  useEffect(() => {
    async function fetchSanityProjects() {
      try {
        const cachedProjects = getCachedData<SanityProject[]>(
          WORK_SANITY_PROJECTS_KEY,
        );
        const cachedExperiments = getCachedData<SanityExperimentProject[]>(
          WORK_EXPERIMENT_PROJECTS_KEY,
        );

        // Already hydrated from preload — skip the network round-trip.
        if (cachedProjects && cachedExperiments) {
          setProjects(mergeWorkProjects(cachedProjects, cachedExperiments));
          return;
        }

        const [sanityProjects, experimentProjects] = await Promise.all([
          cachedProjects ??
            client.fetch<SanityProject[]>(PROJECTS_QUERY).catch((error) => {
              console.warn("Error fetching Sanity work projects:", error);
              return [] as SanityProject[];
            }),
          cachedExperiments ??
            client
              .fetch<SanityExperimentProject[]>(EXPERIMENT_PROJECTS_QUERY)
              .catch((error) => {
                console.warn("Error fetching experiment projects:", error);
                return [] as SanityExperimentProject[];
              }),
        ]);

        if (!cachedProjects) {
          setCachedData(WORK_SANITY_PROJECTS_KEY, sanityProjects);
        }
        if (!cachedExperiments) {
          setCachedData(WORK_EXPERIMENT_PROJECTS_KEY, experimentProjects);
        }

        setProjects(mergeWorkProjects(sanityProjects, experimentProjects));
      } catch (error) {
        console.error("Error fetching Sanity projects:", error);
      }
    }

    fetchSanityProjects();
  }, []);

  useEffect(() => {
    preloadLikelyPages();
  }, []);

  /*
   * Fallback for the reload route out of Gallery (extra history entries, so
   * back was not available). Never touch `history.scrollRestoration` here —
   * that is per-entry state, and forcing it to manual would stop the browser
   * restoring this page on the back route, which is the no-flash path.
   */
  useLayoutEffect(() => {
    const y = consumeHomeScrollReturn();
    if (y == null) return;
    window.scrollTo(0, y);
    // Cards settle as media resolves; re-assert once after that first layout.
    const id = window.requestAnimationFrame(() => window.scrollTo(0, y));
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Local slug for instant modal open — set immediately on click, URL syncs in background
  const [localSlug, setLocalSlug] = useState(slug);

  // Sync when the Next.js router eventually catches up (e.g. back/forward navigation)
  useEffect(() => {
    setLocalSlug(slug);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const publicSlug = toPublicProjectSlug(slug);
    if (publicSlug === slug) return;
    setLocalSlug(publicSlug);
    const nextPath = mode === "full" ? `/project/${publicSlug}/full` : `/project/${publicSlug}`;
    navigate(nextPath, { replace: true });
  }, [slug, mode, navigate]);

  const selectedProject = localSlug
    ? projects.find((p) => p.id === localSlug || p.id === toPublicProjectSlug(localSlug)) || null
    : null;

  // Local fullscreen state for instant expand/collapse; URL syncs in background
  const [localFullscreen, setLocalFullscreen] = useState(mode === "full");
  const [localBookSlug, setLocalBookSlug] = useState(() => {
    if (typeof window !== "undefined" && slug) {
      return (
        bookSlugFromPathname(
          window.location.pathname,
          slug,
          window.location.pathname.includes("/full"),
        ) ?? bookSlug
      );
    }
    return bookSlug;
  });

  // Sync when the Next.js router eventually catches up
  useEffect(() => {
    setLocalFullscreen(mode === "full");
  }, [mode]);

  useEffect(() => {
    setLocalBookSlug(bookSlug);
  }, [bookSlug]);

  // Keep local book state in sync with back/forward after shallow history updates.
  useEffect(() => {
    const onPopState = () => {
      if (!localSlug || !SIDE_PROJECT_IDS.includes(localSlug)) return;
      const fullscreen = window.location.pathname.includes("/full");
      setLocalFullscreen(fullscreen);
      setLocalBookSlug(
        bookSlugFromPathname(window.location.pathname, localSlug, fullscreen),
      );
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [localSlug]);

  /*
   * Deep links to /project/gallery are retired — send visitors home.
   */
  useEffect(() => {
    if (slug === "gallery" || localSlug === "gallery") {
      setLocalSlug(undefined);
      setLocalFullscreen(false);
      setLocalBookSlug(undefined);
      navigate("/", { replace: true });
    }
  }, [slug, localSlug, navigate]);

  useEffect(() => {
    const blockedSlug = slug || localSlug;
    if (!blockedSlug) return;
    const publicSlug = toPublicProjectSlug(blockedSlug);
    if (!isComingSoonProject(publicSlug) && !isComingSoonProject(blockedSlug)) return;

    setLocalSlug(undefined);
    setLocalFullscreen(false);
    setLocalBookSlug(undefined);
    navigate("/", { replace: true });
  }, [slug, localSlug, navigate]);

  const isFullscreenFromUrl = localFullscreen;

  const handleProjectClick = useCallback((projectId: string) => {
    if (isComingSoonProject(projectId)) return;

    const isMobile = window.innerWidth < 768;
    const shouldGoFullscreen = projectId === 'film' || (isMobile && projectId !== 'sketchbook' && projectId !== 'creators-collective');

    if (posthogEnabled) {
      posthog.capture("project_opened", {
        project_id: projectId,
        view_mode: shouldGoFullscreen ? "fullscreen" : "popup",
      });
    }

    if (shouldGoFullscreen) {
      setLocalSlug(projectId);
      setLocalFullscreen(true);
      setLocalBookSlug(undefined);
      navigate(projectId === 'film' ? '/film' : `/project/${projectId}/full`);
    } else {
      setLocalSlug(projectId);
      setLocalFullscreen(false);
      setLocalBookSlug(undefined);
      navigate(projectId === 'film' ? '/film/popup' : `/project/${projectId}`);
    }
  }, [navigate]);

  const handleModalClose = () => {
    setLocalSlug(undefined);
    setLocalFullscreen(false);
    setLocalBookSlug(undefined);
    navigate("/");
  };

  const handleExpandToFullscreen = () => {
    if (localSlug) {
      setLocalFullscreen(true);
      setLocalBookSlug(undefined);
      navigate(localSlug === 'film' ? '/film' : `/project/${localSlug}/full`);
    }
  };

  const handleExpandExperimentToFullscreen = (bookSlug?: string) => {
    if (localSlug) {
      setLocalFullscreen(true);
      setLocalBookSlug(bookSlug);
      const nextPath = bookSlug
        ? `/project/${localSlug}/full/${encodeURIComponent(bookSlug)}`
        : (localSlug === 'film' ? '/film' : `/project/${localSlug}/full`);
      // Preserve ?shelf= so the library filter doesn't bounce through a second nav.
      navigate(
        typeof window !== "undefined"
          ? `${nextPath}${window.location.search}`
          : nextPath,
      );
    }
  };

  const handleCollapseFromFullscreen = () => {
    if (localSlug) {
      setLocalFullscreen(false);
      setLocalBookSlug(undefined);
      navigate(localSlug === 'film' ? '/film/popup' : `/project/${localSlug}`);
    }
  };

  const handleExperimentBookSlugChange = (nextBookSlug?: string, options?: { replace?: boolean }) => {
    if (!localSlug) return;

    const basePath = localFullscreen
      ? (localSlug === 'film' ? '/film' : `/project/${localSlug}/full`)
      : (localSlug === 'film' ? '/film/popup' : `/project/${localSlug}`);
    const nextPath = nextBookSlug
      ? `${basePath}/${encodeURIComponent(nextBookSlug)}`
      : basePath;

    // Local state opens the modal immediately. Soft-update the URL with the
    // History API so Next doesn't remount the library across the bookSlug
    // page segment (that remount is the flicker when clicking books).
    setLocalBookSlug(nextBookSlug);
    if (options?.replace) {
      replacePathPreservingSearch(nextPath);
    } else {
      pushPathPreservingSearch(nextPath);
    }
  };

  const handleProjectSwitch = (projectId: string) => {
    if (isComingSoonProject(projectId)) return;

    const publicSlug = toPublicProjectSlug(projectId);
    setLocalSlug(publicSlug);
    setLocalBookSlug(undefined);
    const newPath = isFullscreenFromUrl
      ? (publicSlug === 'film' ? '/film' : `/project/${publicSlug}/full`)
      : (publicSlug === 'film' ? '/film/popup' : `/project/${publicSlug}`);
    navigate(newPath);
  };

  const handleViewAllProjects = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full min-h-screen">
      <style>{fadeUpStyles}</style>

      <NavigationTabs activeTab="work" heroAnimationPlayed={heroAnimationPlayed} />
      <WorkHero />

      <div className="hidden md:grid gap-6 grid-cols-2 px-16 max-md:px-8 pt-2.5 pb-2 relative shrink-0 w-full">
          {projects.filter(isVisibleOnHomeGrid).map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onProjectClick={handleProjectClick}
              featured={index < 4}
              index={Math.floor(index / 2)}
            />
          ))}
        </div>

        <div className="md:hidden flex flex-col gap-8 px-6 py-4 relative shrink-0 w-full">
          {projectsForMobileHomeGrid(projects).map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onProjectClick={handleProjectClick}
              featured={index < 4}
              index={index}
            />
          ))}
        </div>

      <Footer />

      {selectedProject &&
        !isComingSoonProject(selectedProject.id) && (
        SIDE_PROJECT_IDS.includes(selectedProject.id) ? (
          <ExperimentModal 
            key={selectedProject.id}
            projectId={selectedProject.id}
            project={projectForExperimentModal(selectedProject)} 
            onClose={handleModalClose}
            onExpandToFullscreen={handleExpandExperimentToFullscreen}
            onCollapseFromFullscreen={handleCollapseFromFullscreen}
            bookSlug={localBookSlug}
            onBookSlugChange={handleExperimentBookSlugChange}
            initialFullscreen={isFullscreenFromUrl}
          />
        ) : (
          <SanityProjectModal
            key={selectedProject.id}
            projectId={selectedProject.id}
            onClose={handleModalClose}
            onBack={isFullscreenFromUrl ? handleCollapseFromFullscreen : handleModalClose}
            onExpandToFullscreen={handleExpandToFullscreen}
            onCollapseFromFullscreen={handleCollapseFromFullscreen}
            initialFullscreen={isFullscreenFromUrl}
            onProjectClick={(projectId) => {
              handleProjectSwitch(projectId);
            }}
            onViewAllProjects={handleViewAllProjects}
            portfolioProjects={projects}
          />
        )
      )}
    </div>
  );
}
