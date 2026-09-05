"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { useScrollLock } from "../../utils/useScrollLock";
import { useNavigate } from "@/lib/navigation";
import {
  GOODREADS_PROFILE_URL,
  LETTERBOXD_PROFILE_URL,
  letterboxdFilmUrl,
} from "@/lib/site";
import { ScrollReveal } from "../shared/ScrollReveal";
import { useHeroAnimation } from "../../hooks/useHeroAnimation";
import { fadeUpStyles } from "../../styles/animations";
import SectionHeading from "../shared/SectionHeading";
import LoadingSpinner from "../shared/LoadingSpinner";

// Above-the-fold About chrome stays eager; heavier sections load as separate
// chunks so Work → About isn't blocked on Community/Shelf/Lore JS.
import ExperienceCard from "./ExperienceCard";
import AboutSidebar from "./AboutSidebar";
import Footer from "../layout/Footer";
import { ArrowUpRight } from "../icons/ArrowUpRight";
import NavigationTabs from "../layout/NavigationTabs";

import type { AboutCategory, ShelfSubcategory, CommunitySidebarItem } from "./AboutSidebar";
import { SHOW_SHELF_AND_LORE } from "./AboutSidebar";

// Assets
import profilePic from "../../assets/anime-backpacking-trip.png";
import mapPinIcon from "../../assets/map-pin.svg";
import academicCapIcon from "../../assets/academic-cap.svg";
import parrotYcLogo from "../../assets/experience/parrot-yc.png";
import hackCanadaLogo from "../../assets/experience/hack-canada.png";
import waterlooEngineeringLogo from "../../assets/experience/waterloo-engineering.png";
import mapleLeafFoodsLogo from "../../assets/experience/maple-leaf-foods.png";
import localCharityLogo from "../../assets/experience/local-charity.png";
import figmaLogo from "../../assets/community/figma-logo-app.png";
import cadetCommunityLogo from "../../assets/community/cadet-community-logo.png";
import chessPawnLogo from "../../assets/community/chess-pawn-logo.png";
import sidequestersLogo from "../../assets/community/sidequesters-logo.png";
import designersHackThe6ixPhoto from "../../assets/community/hack-the-6ix-2026.png";
import designersSundaySessionsPhoto from "../../assets/community/socratica-sunday-sessions.png";
import designersCreateathonPhoto from "../../assets/community/socratica-create-a-thon.png";
import designersPotteryPhoto from "../../assets/community/pottery-mediums.png";
import cadetRemembranceDayPhoto from "../../assets/community/cadet-remembrance-day-parade.png";
import cadetArmyTruckPhoto from "../../assets/community/cadet-army-truck.png";
import cadetFacePaintPhoto from "../../assets/community/cadet-face-paint-tattoo.png";
import cadetUniformPhoto from "../../assets/community/cadet-uniform-aura.png";
import chessTcdsbPhoto from "../../assets/community/chess-tcdsb-west-end.png";
import chessVolunteerPhoto from "../../assets/community/chess-volunteer-ceremony.png";
import chessFirstAwardPhoto from "../../assets/community/chess-first-award.png";
import chessClubMeetingsPhoto from "../../assets/community/chess-club-meetings.png";
import sidequestersBlueTapePhoto from "../../assets/community/sidequesters-blue-tape.png";
import sidequestersAwesomeViewPhoto from "../../assets/community/sidequesters-awesome-view.png";
import sidequestersBridgeDigitalDividePhoto from "../../assets/community/sidequesters-bridge-digital-divide.png";
import sidequestersCircuitPhoto from "../../assets/community/sidequesters-circuit-rotated.png";
import sidequestersMmaPhoto from "../../assets/community/sidequesters-mma.png";
import sidequestersHackTheRidgePhoto from "../../assets/community/sidequesters-hack-the-ridge.png";
import sidequestersRaftingPhoto from "../../assets/community/sidequesters-rafting.png";
import heartIcon from "../../assets/HeartFill.svg";

// Sanity
import { client, urlFor } from "../../sanity/client";
import {
  COMMUNITIES_QUERY,
  SHELF_ITEMS_QUERY,
  LORE_ITEMS_QUERY,
} from "../../sanity/queries";
import { getCachedData, setCachedData, preloadLikelyPages } from "../../sanity/preload";
import type {
  Community,
  ShelfItem,
  LoreItem,
} from "../../sanity/types";

// Types for component data
import type { ExperienceCardData } from "./ExperienceCard";
import type { CommunityCardData, CommunityPhoto as CommunityPhotoType } from "./CommunityCard";
import type { LoreCardData } from "./LoreCard";
import type { MediaCardData } from "./MediaCard";
import {
  getShelfCoverDateLabel,
  resolveShelfCoverDateRaw,
} from "./shelfCoverDate";
import { Close } from "../icons/Close";
import { ghostIconButtonClass } from "../shared/ghostIconButton";

import DesignPhilosophyPreviewCard from "../design-philosophy/DesignPhilosophyPreviewCard";
import KnownAsHeading from "./KnownAsHeading";

const CommunityCard = dynamic(() => import("./CommunityCard"));
const ShelfSection = dynamic(() => import("./ShelfSection"));
const LoreCard = dynamic(() => import("./LoreCard"));
const DesignPhilosophyModal = dynamic(
  () => import("../design-philosophy/DesignPhilosophyModal"),
  { ssr: false },
);
const LUCAS_EXPERIENCES: ExperienceCardData[] = [
  {
    id: "parrot-yc",
    logoSrc: parrotYcLogo,
    company: "Parrot YC",
    role: "Design Engineer (Contract)",
    period: "2026",
  },
  {
    id: "hack-canada",
    logoSrc: hackCanadaLogo,
    company: "Hack Canada",
    role: "Product Design Lead",
    period: "2026",
  },
  {
    id: "waterloo-engsoc",
    logoSrc: waterlooEngineeringLogo,
    company: "Waterloo Engineering Society",
    role: "Figma Design Director",
    period: "2026",
  },
  {
    id: "maple-leaf-foods",
    logoSrc: mapleLeafFoodsLogo,
    company: "Maple Leaf Foods",
    role: "Digital Product Manager",
    period: "2026",
  },
  {
    id: "local-charity",
    logoSrc: localCharityLogo,
    company: "The Local Charity",
    role: "Systems Design and Ops Coordinator",
    period: "2025",
  },
];

const THE_DESIGNERS_COMMUNITY: CommunityCardData = {
  id: "the-designers",
  logoSrc: figmaLogo,
  title: "the designers!",
  sidebarName: "the designers!",
  description:
    "If there's a design related event at Waterloo, you'll see me there. From Socratica ⁂ to UW/UX and Blueprint, I am SO FREAKING proud to be part of a global community of makers, artists, and builders who simply work on their passions.",
  photos: [
    {
      id: "designers-hack-the-6ix",
      imageSrc: designersHackThe6ixPhoto,
      caption: "Winning $1400 USD at Hack the 6ix 2026!",
      orientation: "horizontal",
      rotation: 3,
    },
    {
      id: "designers-sunday-sessions",
      imageSrc: designersCreateathonPhoto,
      caption: "Socratica Sunday Sessions >>",
      orientation: "horizontal",
    },
    {
      id: "designers-create-a-thon",
      imageSrc: designersSundaySessionsPhoto,
      caption: "Getting FREE Claude Opus at Socratica's Create-a-thon (hehe)",
      orientation: "horizontal",
      rotation: 2,
    },
    {
      id: "designers-pottery",
      imageSrc: designersPotteryPhoto,
      caption: "Switching up artistic mediums!",
      orientation: "horizontal",
    },
  ],
};

const THE_CADET_COMMUNITY: CommunityCardData = {
  id: "the-cadet-community",
  logoSrc: cadetCommunityLogo,
  title: "the cadet community!",
  sidebarName: "the cadet community!",
  description:
    "This was by far the most defining part of my childhood. Week-long camping trips, instructing classes to 70+ people, parading in the snow, and fundraising for veterans has shaped me in ways I could never imagine, both physically and mentally. Since entering the program as an attempt to overcome my anxiety, I will never stop advocating for this amazing experience.",
  photos: [
    {
      id: "cadet-remembrance-day",
      imageSrc: cadetRemembranceDayPhoto,
      caption: "Remembrance Day Parade in the Snow",
      orientation: "horizontal",
      rotation: 3,
    },
    {
      id: "cadet-army-truck",
      imageSrc: cadetArmyTruckPhoto,
      caption: "Riding in the back of an Army Truck!!",
      orientation: "horizontal",
    },
    {
      id: "cadet-face-paint",
      imageSrc: cadetFacePaintPhoto,
      caption: "The GGHG Tattoo",
      orientation: "vertical",
    },
    {
      id: "cadet-uniform-aura",
      imageSrc: cadetUniformPhoto,
      caption: "Walking around school in this uniform is PEAK aura farming",
      orientation: "vertical",
      rotation: 2,
    },
  ],
};

const THE_CHESS_PLAYERS_COMMUNITY: CommunityCardData = {
  id: "the-chess-players",
  logoSrc: chessPawnLogo,
  title: "the chess players!",
  sidebarName: "the chess players!",
  description:
    "They don't call me \"Chess Jesus\" for no reason… In all seriousness, chess was the connecting thread which allowed me to make friends in high school before I overcame my anxiety. Since then, I founded a chess program at The Village of Humber Heights where highschoolers are connected with elderly residents to combat Alzheimer's and other cognitive illnesses!",
  photos: [
    {
      id: "chess-tcdsb-west-end",
      imageSrc: chessTcdsbPhoto,
      caption:
        "My Last Time Playing in the TCDSB West-End Division, leaving with a record of 13-1-2",
      orientation: "horizontal",
      rotation: 3,
    },
    {
      id: "chess-volunteer-ceremony",
      imageSrc: chessVolunteerPhoto,
      caption: "This was after my 15-min speech at the Volunteer Appreciation Ceremony!!",
      orientation: "horizontal",
    },
    {
      id: "chess-first-award",
      imageSrc: chessFirstAwardPhoto,
      caption: "Winning my First EVER chess award!!",
      orientation: "horizontal",
      rotation: 2,
    },
    {
      id: "chess-club-meetings",
      imageSrc: chessClubMeetingsPhoto,
      caption:
        "I'd always look forward to after-school chess club meetings in high-school :)",
      orientation: "horizontal",
    },
  ],
};

const THE_SIDEQUESTERS_COMMUNITY: CommunityCardData = {
  id: "the-sidequesters",
  logoSrc: sidequestersLogo,
  title: "the sidequesters!",
  sidebarName: "the sidequesters!",
  collageLayout: "split-overlap",
  description:
    "what's the point in life without occasionally pushing yourself outside your comfort zone!",
  photos: [
    {
      id: "sidequesters-blue-tape",
      imageSrc: sidequestersBlueTapePhoto,
      caption: "getting my first EVER blue tape (V5-7)",
      orientation: "vertical",
      objectPosition: "50% 18%",
      rotation: 3,
    },
    {
      id: "sidequesters-awesome-view",
      imageSrc: sidequestersAwesomeViewPhoto,
      caption: "this view was AWESOME!",
      orientation: "horizontal",
    },
    {
      id: "sidequesters-bridge-digital-divide",
      imageSrc: sidequestersBridgeDigitalDividePhoto,
      caption:
        "Presenting our plan to Bridge the Digital Divide with China's Belt and Road Initiantive",
      orientation: "horizontal",
      frameVariant: "wide",
      rotation: 2,
    },
    {
      id: "sidequesters-circuit",
      imageSrc: sidequestersCircuitPhoto,
      caption: "successfully wiring a circuit (after many, many, many attempts)",
      orientation: "horizontal",
      frameVariant: "wide",
    },
    {
      id: "sidequesters-mma",
      imageSrc: sidequestersMmaPhoto,
      caption: "being a professional MMA fighter",
      orientation: "vertical",
    },
    {
      id: "sidequesters-hack-the-ridge",
      imageSrc: sidequestersHackTheRidgePhoto,
      caption: "representing Waterloo Engineering as a panellist at Hack the Ridge",
      orientation: "horizontal",
    },
    {
      id: "sidequesters-rafting",
      imageSrc: sidequestersRaftingPhoto,
      caption: "rafting with my dear friends!",
      orientation: "horizontal",
    },
  ],
};

function applyLucasCommunityOverrides(
  communities: CommunityCardData[],
): CommunityCardData[] {
  const findExisting = (matcher: (community: CommunityCardData) => boolean) =>
    communities.find(matcher);

  return [
    buildDesignersCommunity(findExisting((community) => community.id === THE_DESIGNERS_COMMUNITY.id)),
    buildCadetCommunity(findExisting((community) => community.id === THE_CADET_COMMUNITY.id)),
    buildChessPlayersCommunity(
      findExisting((community) => community.id === THE_CHESS_PLAYERS_COMMUNITY.id),
    ),
    buildSidequestersCommunity(
      findExisting((community) => community.id === THE_SIDEQUESTERS_COMMUNITY.id),
    ),
  ];
}

function buildDesignersCommunity(
  existing?: CommunityCardData,
): CommunityCardData {
  const photos = THE_DESIGNERS_COMMUNITY.photos?.map((photo, index) => {
    const layout = existing?.photos?.[index];
    return {
      ...photo,
      rotation: layout?.rotation ?? photo.rotation,
      orientation: layout?.orientation ?? photo.orientation,
      yOffset: layout?.yOffset ?? photo.yOffset,
      xOffset: layout?.xOffset ?? photo.xOffset,
    };
  });

  return {
    ...THE_DESIGNERS_COMMUNITY,
    id: existing?.id ?? THE_DESIGNERS_COMMUNITY.id,
    photos,
    instagramUrl: undefined,
  };
}

function buildCadetCommunity(
  existing?: CommunityCardData,
): CommunityCardData {
  const photos = THE_CADET_COMMUNITY.photos?.map((photo, index) => {
    const layout = existing?.photos?.[index];
    return {
      ...photo,
      rotation: layout?.rotation ?? photo.rotation,
      orientation: layout?.orientation ?? photo.orientation,
      yOffset: layout?.yOffset ?? photo.yOffset,
      xOffset: layout?.xOffset ?? photo.xOffset,
    };
  });

  return {
    ...THE_CADET_COMMUNITY,
    id: existing?.id ?? THE_CADET_COMMUNITY.id,
    photos,
    instagramUrl: undefined,
  };
}

function buildChessPlayersCommunity(
  existing?: CommunityCardData,
): CommunityCardData {
  const photos = THE_CHESS_PLAYERS_COMMUNITY.photos?.map((photo, index) => {
    const layout = existing?.photos?.[index];
    return {
      ...photo,
      rotation: layout?.rotation ?? photo.rotation,
      orientation: layout?.orientation ?? photo.orientation,
      yOffset: layout?.yOffset ?? photo.yOffset,
      xOffset: layout?.xOffset ?? photo.xOffset,
    };
  });

  return {
    ...THE_CHESS_PLAYERS_COMMUNITY,
    id: existing?.id ?? THE_CHESS_PLAYERS_COMMUNITY.id,
    photos,
    instagramUrl: undefined,
  };
}

function buildSidequestersCommunity(
  existing?: CommunityCardData,
): CommunityCardData {
  const photos = THE_SIDEQUESTERS_COMMUNITY.photos?.map((photo, index) => {
    const layout = existing?.photos?.[index];
    return {
      ...photo,
      rotation: layout?.rotation ?? photo.rotation,
      orientation: layout?.orientation ?? photo.orientation,
      yOffset: layout?.yOffset ?? photo.yOffset,
      xOffset: layout?.xOffset ?? photo.xOffset,
    };
  });

  return {
    ...THE_SIDEQUESTERS_COMMUNITY,
    id: existing?.id ?? THE_SIDEQUESTERS_COMMUNITY.id,
    photos,
    instagramUrl: undefined,
  };
}

// fadeUpStyles imported from shared animations
type ProfilePhotoProps = {
  imageSrc?: string;
  date?: string;
  caption?: string;
};

function ProfilePolaroidFrame({
  imageSrc,
  date,
  caption,
  className,
  imageClassName,
  onClick,
}: ProfilePhotoProps & {
  className?: string;
  imageClassName?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={clsx(
        "flex w-[17.5rem] rotate-[-4deg] flex-col border border-zinc-100 bg-white p-3 pb-0 shadow-media transition-transform duration-200 ease-out md:w-[19rem]",
        onClick && "cursor-zoom-in hover:scale-[0.99]",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="overflow-hidden rounded-sm bg-zinc-100">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Lucas Vu"
            decoding="async"
            width={304}
            height={389}
            className={clsx("block h-auto w-full object-contain", imageClassName)}
          />
        ) : (
          <div className="aspect-[3/4] w-full bg-zinc-200" />
        )}
      </div>

      {(date || caption) && (
        <div className="px-1.5 pb-8 pt-5 text-left">
          {date && (
            <p className="font-['Lucas',sans-serif] text-sm font-medium tabular-nums text-zinc-600">
              {date}
            </p>
          )}
          {caption && (
            <p className="font-['Lucas',sans-serif] text-sm font-normal lowercase text-zinc-400">
              {caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ProfilePhoto({ imageSrc, date, caption }: ProfilePhotoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useScrollLock(isExpanded);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
    }, 200);
  }, [isClosing]);

  useEffect(() => {
    if (!isExpanded) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isExpanded, handleClose]);

  return (
    <>
      <ProfilePolaroidFrame
        imageSrc={imageSrc}
        date={date}
        caption={caption}
        onClick={imageSrc ? () => setIsExpanded(true) : undefined}
      />

      {isExpanded && imageSrc && createPortal(
        <div
          className={`fixed inset-0 z-[99999] isolate flex items-center justify-center p-4 transition-opacity duration-200 ease-out ${isClosing ? 'opacity-0' : 'animate-[fadeIn_200ms_ease-out]'}`}
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-zinc-100/95" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className={`${ghostIconButtonClass("sm", "fixed right-4 top-4 z-10 text-zinc-500")} ${isClosing ? '' : 'animate-[fadeSlideDown_300ms_ease-out]'}`}
            aria-label="Close expanded photo"
          >
            <Close size="12px" />
          </button>

          <div
            className={`relative z-10 flex max-h-[85vh] max-w-[90vw] flex-col items-center transition-all duration-200 ease-out ${isClosing ? 'opacity-0 scale-95' : 'animate-[scaleIn_300ms_ease-out]'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <ProfilePolaroidFrame
              imageSrc={imageSrc}
              date={date}
              caption={caption}
              className="rotate-0 max-h-[75vh] w-auto max-w-[min(90vw,22rem)]"
              imageClassName="max-h-[58vh] w-auto object-contain"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

// Transform functions for Sanity data
function transformCommunities(data: Community[]): CommunityCardData[] {
  return applyLucasCommunityOverrides(
    data.map((community) => ({
      id: community._id,
      logoSrc: community.logo ? urlFor(community.logo).width(200).url() : undefined,
      title: community.title,
      sidebarName: community.sidebarName,
      description: community.description,
      instagramUrl: community.instagramUrl,
      photos: community.photos?.map((photo): CommunityPhotoType => ({
        id: photo._key,
        imageSrc: photo.image ? urlFor(photo.image).width(1200).quality(90).url() : "",
        caption: photo.caption,
        rotation: photo.rotation,
        orientation: photo.orientation,
        yOffset: photo.yOffset,
        xOffset: photo.xOffset,
      })),
    })),
  );
}

function transformShelfItems(data: ShelfItem[]): MediaCardData[] {
  return data.map((item) => {
    const type =
      item.mediaType === "book"
        ? "Book"
        : item.mediaType === "music"
          ? "Music"
          : item.mediaType === "movie"
            ? "Movie"
            : "Book";

    const coverDateInput = {
      mediaType: item.mediaType,
      dateRead: item.dateRead,
      dateStarted: item.dateStarted,
      dateWatched: item.dateWatched,
      _createdAt: item._createdAt,
    };
    const coverDateRaw = resolveShelfCoverDateRaw(coverDateInput);
    const coverDateLabel = getShelfCoverDateLabel(coverDateInput);

    return {
      id: item._id,
      imageSrc: item.cover
        ? urlFor(item.cover).width(300).url()
        : item.externalCoverUrl || undefined,
      title: item.title,
      type,
      year: item.year,
      isFeatured: item.isFeatured,
      goodreadsUrl: item.goodreadsUrl,
      letterboxdSlug: item.letterboxdSlug,
      spotifyUrl: item.spotifyUrl,
      ...(coverDateRaw ? { coverDateRaw } : {}),
      ...(coverDateLabel ? { coverDateLabel } : {}),
    };
  });
}

function transformLoreItems(data: LoreItem[]): LoreCardData[] {
  return data.map((item) => ({
    id: item._id,
    imageSrc: item.image ? urlFor(item.image).width(600).url() : undefined,
    imageBackground: item.imageBackground,
    headline: item.headline,
    date: item.date,
    description: item.description,
    link: item.link,
  }));
}

function readCachedAboutPage(): {
  communities: CommunityCardData[];
  shelfItems: MediaCardData[];
  loreItems: LoreCardData[];
} | null {
  const communities = getCachedData<Community[]>("about:communities");
  const shelfItems = getCachedData<ShelfItem[]>("about:shelfItems");
  const loreItems = getCachedData<LoreItem[]>("about:loreItems");
  if (!communities || !shelfItems || !loreItems) {
    return null;
  }

  return {
    communities: transformCommunities(communities),
    shelfItems: transformShelfItems(shelfItems),
    loreItems: transformLoreItems(loreItems),
  };
}

export default function AboutPage() {
  const navigate = useNavigate();

  const heroAnimationPlayed = useHeroAnimation();

  // Active category for sidebar
  const [activeCategory, setActiveCategory] = useState<AboutCategory>("hi");

  // Section refs for scrolling
  const hiRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);
  const loreRef = useRef<HTMLDivElement>(null);
  
  // Individual community card refs (for scrolling to specific communities)
  const communityRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Shelf subcategory refs
  const booksRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLDivElement>(null);
  const moviesRef = useRef<HTMLDivElement>(null);
  
  // Active community ID state (will be set to first community when data loads)
  const [activeCommunityId, setActiveCommunityId] = useState<string | undefined>();
  
  // Active shelf subcategory state
  const [activeShelfSubcategory, setActiveShelfSubcategory] = useState<ShelfSubcategory>("books");
  const [isDesignPhilosophyOpen, setIsDesignPhilosophyOpen] = useState(false);

  // Sanity data state — hydrate synchronously from preload cache when warm
  const [cachedInitial] = useState(readCachedAboutPage);
  const [experiences] = useState<ExperienceCardData[]>(LUCAS_EXPERIENCES);
  const [communities, setCommunities] = useState<CommunityCardData[]>(
    () => cachedInitial?.communities ?? [],
  );
  const [shelfItems, setShelfItems] = useState<MediaCardData[]>(
    () => cachedInitial?.shelfItems ?? [],
  );
  const [loreItems, setLoreItems] = useState<LoreCardData[]>(
    () => cachedInitial?.loreItems ?? [],
  );
  const [isLoading, setIsLoading] = useState(() => cachedInitial === null);

  // Shelf year filter state (for books, music, and movies)
  const [activeBooksYear, setActiveBooksYear] = useState<string | undefined>();
  const [activeMusicYear, setActiveMusicYear] = useState<string | undefined>();
  const [activeMoviesYear, setActiveMoviesYear] = useState<string | undefined>();

  useEffect(() => {
    preloadLikelyPages();
  }, []);

  // Fetch data from Sanity (uses preloaded cache if available)
  useEffect(() => {
    async function fetchAboutData() {
      try {
        const cachedCommunities = getCachedData<Community[]>("about:communities");
        const cachedShelfItems = getCachedData<ShelfItem[]>("about:shelfItems");
        const cachedLoreItems = getCachedData<LoreItem[]>("about:loreItems");
        const hasFullCache = !!(
          cachedCommunities &&
          cachedShelfItems &&
          cachedLoreItems
        );

        // Only show spinner when we have nothing to render yet
        if (!hasFullCache) setIsLoading(true);

        const [communitiesData, shelfItemsData, loreItemsData] = await Promise.all([
          cachedCommunities ?? client.fetch<Community[]>(COMMUNITIES_QUERY),
          cachedShelfItems ?? client.fetch<ShelfItem[]>(SHELF_ITEMS_QUERY),
          cachedLoreItems ?? client.fetch<LoreItem[]>(LORE_ITEMS_QUERY),
        ]);

        if (!cachedCommunities && communitiesData) {
          setCachedData("about:communities", communitiesData);
        }
        if (!cachedShelfItems && shelfItemsData) {
          setCachedData("about:shelfItems", shelfItemsData);
        }
        if (!cachedLoreItems && loreItemsData) {
          setCachedData("about:loreItems", loreItemsData);
        }

        setCommunities(transformCommunities(communitiesData || []));
        setShelfItems(transformShelfItems(shelfItemsData || []));
        setLoreItems(transformLoreItems(loreItemsData || []));
      } catch (err) {
        console.error("Error fetching about data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAboutData();
  }, []);

  // Warm shelf images after first paint — don't compete with About mount.
  useEffect(() => {
    if (shelfItems.length === 0) return;

    const warm = () => {
      for (const item of shelfItems) {
        if (!item.imageSrc) continue;
        const img = new Image();
        img.src = item.imageSrc;
      }
    };

    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(warm, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }

    const timeout = setTimeout(warm, 800);
    return () => clearTimeout(timeout);
  }, [shelfItems]);

  // Set first community as active when communities load
  useEffect(() => {
    if (communities.length > 0 && !activeCommunityId) {
      const firstWithSidebarName = communities.find(c => c.sidebarName);
      if (firstWithSidebarName) {
        setActiveCommunityId(firstWithSidebarName.id);
      }
    }
  }, [communities, activeCommunityId]);

  // Handle category click - scroll to section
  const handleCategoryClick = (category: AboutCategory) => {
    setActiveCategory(category);
    const refMap: Record<AboutCategory, React.RefObject<HTMLDivElement | null>> = {
      hi: hiRef,
      experience: experienceRef,
      community: communityRef,
      philosophy: philosophyRef,
      shelf: shelfRef,
      lore: loreRef,
    };
    const ref = refMap[category];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handle community click - scroll to specific community card
  const handleCommunityClick = (communityId: string) => {
    setActiveCommunityId(communityId);
    // Scroll to the specific community card
    const communityElement = communityRefs.current[communityId];
    if (communityElement) {
      communityElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (communityRef?.current) {
      // Fallback to section scroll if specific ref not found
      communityRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handle shelf subcategory click - scroll to specific shelf section
  const handleShelfSubcategoryClick = (subcategory: ShelfSubcategory) => {
    setActiveShelfSubcategory(subcategory);
    const refMap: Record<ShelfSubcategory, React.RefObject<HTMLDivElement | null>> = {
      books: booksRef,
      music: musicRef,
      movies: moviesRef,
    };
    const ref = refMap[subcategory];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Track scroll position to update active category
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "hi" as AboutCategory, ref: hiRef },
        { id: "experience" as AboutCategory, ref: experienceRef },
        { id: "community" as AboutCategory, ref: communityRef },
        { id: "philosophy" as AboutCategory, ref: philosophyRef },
        ...(SHOW_SHELF_AND_LORE
          ? [
              { id: "shelf" as AboutCategory, ref: shelfRef },
              { id: "lore" as AboutCategory, ref: loreRef },
            ]
          : []),
      ];

      const viewportThreshold = 250;
      let activeSection: AboutCategory | null = null;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= viewportThreshold) {
            activeSection = section.id;
            break;
          }
        }
      }

      if (!activeSection) {
        for (const section of sections) {
          if (section.ref.current) {
            const rect = section.ref.current.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              activeSection = section.id;
              break;
            }
          }
        }
      }

      if (activeSection) {
        setActiveCategory(activeSection);
        
        // If community is active, also track which community is in view
        if (activeSection === "community") {
          const visibleCommunities = communities.filter(c => c.sidebarName);
          let activeCommunity: string | null = null;
          
          // Check from bottom to top to find the one that's scrolled past the threshold
          for (let i = visibleCommunities.length - 1; i >= 0; i--) {
            const community = visibleCommunities[i];
            const element = communityRefs.current[community.id];
            if (element) {
              const rect = element.getBoundingClientRect();
              if (rect.top <= viewportThreshold) {
                activeCommunity = community.id;
                break;
              }
            }
          }
          
          // Fallback: find first one in viewport
          if (!activeCommunity) {
            for (const community of visibleCommunities) {
              const element = communityRefs.current[community.id];
              if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                  activeCommunity = community.id;
                  break;
                }
              }
            }
          }
          
          if (activeCommunity) {
            setActiveCommunityId(activeCommunity);
          }
        }
        
        // If shelf is active, also track which shelf subcategory is in view
        if (activeSection === "shelf") {
          const shelfSubsections = [
            { id: "books" as ShelfSubcategory, ref: booksRef },
            { id: "music" as ShelfSubcategory, ref: musicRef },
            { id: "movies" as ShelfSubcategory, ref: moviesRef },
          ];
          
          let activeSubcategory: ShelfSubcategory | null = null;
          
          for (let i = shelfSubsections.length - 1; i >= 0; i--) {
            const subsection = shelfSubsections[i];
            if (subsection.ref.current) {
              const rect = subsection.ref.current.getBoundingClientRect();
              if (rect.top <= viewportThreshold) {
                activeSubcategory = subsection.id;
                break;
              }
            }
          }
          
          if (!activeSubcategory) {
            for (const subsection of shelfSubsections) {
              if (subsection.ref.current) {
                const rect = subsection.ref.current.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                  activeSubcategory = subsection.id;
                  break;
                }
              }
            }
          }
          
          if (activeSubcategory) {
            setActiveShelfSubcategory(activeSubcategory);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [communities]);

  // Filter shelf items by media type
  const bookItems = shelfItems.filter((item) => item.type === "Book");
  const musicItems = shelfItems.filter((item) => item.type === "Music");
  const movieItems = shelfItems.filter((item) => item.type === "Movie");

  // Get unique years for filtering (from the year field on items)
  const getYearsWithCounts = (items: MediaCardData[]) => {
    const yearCounts: Record<string, number> = {};
    items.forEach((item) => {
      if (item.year) {
        yearCounts[item.year] = (yearCounts[item.year] || 0) + 1;
      }
    });
    return Object.entries(yearCounts)
      .filter(([year]) => Number(year) >= 2020) // Only show 2020 and newer
      .sort(([a], [b]) => Number(b) - Number(a)) // Sort descending
      .map(([year, count]) => ({ year, count }));
  };

  const bookYears = getYearsWithCounts(bookItems);
  const musicYears = getYearsWithCounts(musicItems);
  const movieYears = getYearsWithCounts(movieItems);

  return (
    <div className="bg-white flex flex-col items-center relative size-full min-h-screen">
      {/* Inject fade up animation styles */}
      <style>{fadeUpStyles}</style>

      {/* Navigation */}
      <NavigationTabs activeTab="about" heroAnimationPlayed={heroAnimationPlayed} />

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-4 items-start px-4 sm:px-6 md:px-10 lg:px-16 pt-2 relative shrink-0 w-full">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden lg:block lg:sticky lg:top-8 pb-4 lg:pb-8 w-[202px] shrink-0 z-50">
          <AboutSidebar
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
            communityItems={communities
              .filter(c => c.sidebarName)
              .map(c => ({ id: c.id, sidebarName: c.sidebarName! }))}
            activeCommunityId={activeCommunityId}
            onCommunityClick={handleCommunityClick}
            activeShelfSubcategory={activeShelfSubcategory}
            onShelfSubcategoryClick={handleShelfSubcategoryClick}
            shelfCounts={{
              books: bookItems.length,
              music: musicItems.length,
              movies: movieItems.length,
            }}
          />
        </div>

        {/* Main Content — left-aligned like prod on laptop; on large monitors, center an 800px column beside the sidebar */}
        <div className="flex-1 flex min-w-0 w-full min-[1920px]:justify-center">
          <div className="flex flex-col gap-20 items-start pb-8 w-full min-w-0 min-[1920px]:max-w-[800px]">
          {/* HI! Section - Hardcoded */}
          <section ref={hiRef} className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start w-full max-w-5xl min-w-0 scroll-mt-8">
            {/* Profile Photo */}
            <ScrollReveal delay={100}>
              <div className="shrink-0">
                <ProfilePhoto
                    imageSrc={profilePic}
                    date="01/08/26"
                    caption="a solo backpacking trip in anime land!"
                  />
              </div>
            </ScrollReveal>

            {/* Bio Content */}
            <div className="flex w-full min-w-0 flex-1 flex-col gap-6 pt-4 sm:pt-8 max-w-xl">
              <ScrollReveal variant="fade" delay={150}>
                <KnownAsHeading />
              </ScrollReveal>

              {/* Location & Education */}
              <ScrollReveal variant="fade" delay={200}>
                <div className="flex flex-col gap-3 text-base tracking-[0.005em] text-zinc-400 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <img src={mapPinIcon} alt="" className="size-4 shrink-0" />
                    <span className="text-zinc-400">Toronto</span>
                  </div>
                  <div className="flex min-w-0 items-start gap-2">
                    <img src={academicCapIcon} alt="" className="mt-0.5 size-4 shrink-0" />
                    <span className="text-pretty break-words text-zinc-400">
                      Systems Design Engineer, University of Waterloo
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Bio Paragraphs */}
              <ScrollReveal variant="fade" delay={250}>
                <div className="flex flex-col gap-4 text-pretty text-base leading-relaxed tracking-[0.005em] text-zinc-600">
                  <p>
                    What truly defines me is my passion to constantly try new things. Whether it
                    be soccer, fishing, martial arts, dancing, or jumping on project ideas,
                    trying new things is a big part of who I am.
                  </p>
                  <p>
                    But one thing that seems to be concrete is my passion for human connection,
                    building and design. I find that creating extraordinary products for people,
                    and communities that I can relate to, is something I was made to do! And that
                    isn&apos;t going anywhere anytime soon :)
                  </p>
                </div>
              </ScrollReveal>

            </div>
          </section>

          {/* Experience Section */}
          <section ref={experienceRef} className="flex flex-col gap-16 md:flex-row md:justify-between md:gap-0 w-full scroll-mt-8">
            <ScrollReveal variant="fade">
              <div className="flex flex-col">
                <h2 className="font-['Lucas',sans-serif] font-medium text-zinc-700 text-3xl leading-normal shrink-0">
                  experience
                </h2>
              </div>
            </ScrollReveal>
            <div className="flex flex-col gap-10 md:gap-12 md:pt-1.5 md:w-1/2 md:shrink-0">
                {experiences.map((exp, index) => (
                  <ScrollReveal
                    key={exp.id}
                    delay={index * 80}
                  >
                    <ExperienceCard data={exp} />
                  </ScrollReveal>
                ))}
              </div>
          </section>

          {/* Community Section */}
          <section ref={communityRef} className="flex flex-col gap-8 w-full scroll-mt-8 max-md:mt-10">
            <ScrollReveal variant="fade">
              <div className="flex flex-col">
                <h2 className="font-['Lucas',sans-serif] font-medium text-zinc-600 text-3xl leading-normal shrink-0">
                  community
                </h2>
                <p className="font-['Lucas',sans-serif] tracking-wide font-normal text-zinc-400 text-lg flex items-center gap-1.5">
                  The people who make it all worth it
                  <img src={heartIcon} alt="" className="w-[12px] h-[12px]" style={{ filter: 'brightness(0) saturate(100%) invert(83%) sepia(8%) saturate(293%) hue-rotate(177deg) brightness(91%) contrast(87%)' }} />
                </p>
              </div>
            </ScrollReveal>
            {isLoading ? (
              <LoadingSpinner label="Loading..." className="py-4" />
            ) : communities.length > 0 ? (
              <div className="flex flex-col gap-12 pt-4">
                {communities.map((community, index) => (
                  <div
                    key={community.id}
                    ref={(el) => {
                      communityRefs.current[community.id] = el;
                    }}
                    className="scroll-mt-8"
                  >
                    <ScrollReveal delay={index * 100}>
                      <CommunityCard data={community} />
                      {/* Horizontal divider between communities */}
                      {index < communities.length - 1 && (
                        <div className="mt-12 h-px w-full bg-zinc-100" />
                      )}
                    </ScrollReveal>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400 text-sm py-4">Add community items in Sanity Studio.</p>
            )}
          </section>

          {/* Philosophy Section */}
          <section ref={philosophyRef} className="flex flex-col gap-12 w-full scroll-mt-8">
            <ScrollReveal variant="fade">
              <SectionHeading
                title="why design"
                subtitle="the reason why design serves as (one of) my life's purposes"
              />
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <DesignPhilosophyPreviewCard onClick={() => setIsDesignPhilosophyOpen(true)} />
            </ScrollReveal>
          </section>

          {SHOW_SHELF_AND_LORE && (
            <>
          {/* Shelf Section */}
          <section ref={shelfRef} className="flex flex-col gap-6 w-full scroll-mt-8">
            <ScrollReveal variant="fade">
              <SectionHeading title="Shelf" subtitle="★ - Favorites" />
            </ScrollReveal>
            
            {isLoading ? (
              <LoadingSpinner label="Loading..." className="py-4" />
            ) : (
              <div className="flex flex-col gap-8">
                {/* Books Shelf */}
                <div ref={booksRef} className="scroll-mt-8">
                  <ScrollReveal delay={100}>
                    <ShelfSection
                      title="★ Books"
                      count={bookItems.filter(item => item.isFeatured).length}
                      mediaType="book"
                      yearFilters={bookYears}
                      activeYear={activeBooksYear}
                      onYearChange={(year) => setActiveBooksYear(year || undefined)}
                      externalLink={{ label: "Goodreads", href: GOODREADS_PROFILE_URL }}
                      items={bookItems}
                      itemCount={5}
                      onItemClick={(item) => console.log("Book clicked:", item)}
                    />
                  </ScrollReveal>
                </div>

                {/* Music Shelf */}
                <div ref={musicRef} className="scroll-mt-8">
                  <ScrollReveal delay={200}>
                    <ShelfSection
                      title="★ Music"
                      count={musicItems.filter(item => item.isFeatured).length}
                      mediaType="music"
                      yearFilters={musicYears}
                      activeYear={activeMusicYear}
                      onYearChange={(year) => setActiveMusicYear(year || undefined)}
                      items={musicItems}
                      itemCount={5}
                      onItemClick={(item) => console.log("Music clicked:", item)}
                    />
                  </ScrollReveal>
                </div>

                {/* Movies Shelf */}
                <div ref={moviesRef} className="scroll-mt-8">
                  <ScrollReveal delay={300}>
                    <ShelfSection
                      title="★ Movies"
                      count={movieItems.filter(item => item.isFeatured).length}
                      mediaType="movie"
                      yearFilters={movieYears}
                      activeYear={activeMoviesYear}
                      onYearChange={(year) => setActiveMoviesYear(year || undefined)}
                      externalLink={{ label: "Letterboxd", href: LETTERBOXD_PROFILE_URL }}
                      items={movieItems}
                      itemCount={5}
                      onItemClick={(item) => {
                        if (item.letterboxdSlug) {
                          window.open(letterboxdFilmUrl(item.letterboxdSlug), '_blank');
                        }
                      }}
                    />
                  </ScrollReveal>
                </div>
              </div>
            )}
          </section>

          {/* Lore Section */}
          <section ref={loreRef} className="flex flex-col gap-12 w-full scroll-mt-8">
            <ScrollReveal variant="fade">
              <SectionHeading title="Lore ⟡˙⋆" subtitle="Fun snippets from past lives" />
            </ScrollReveal>
            {isLoading ? (
              <LoadingSpinner label="Loading..." className="py-4" />
            ) : loreItems.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 md:gap-y-5 md:gap-x-6">
                {loreItems.map((lore, index) => (
                  <ScrollReveal key={lore.id} delay={index * 80}>
                    <LoreCard
                      data={lore}
                      onClick={() => console.log("Lore clicked:", lore)}
                    />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400 text-sm py-4">Add lore items in Sanity Studio.</p>
            )}
          </section>
            </>
          )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {isDesignPhilosophyOpen && (
        <DesignPhilosophyModal onClose={() => setIsDesignPhilosophyOpen(false)} />
      )}
    </div>
  );
}
