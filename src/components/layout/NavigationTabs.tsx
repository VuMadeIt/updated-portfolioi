import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import clsx from "clsx";
import { ScrollReveal } from "../shared/ScrollReveal";
import { preloadAboutPage, preloadWorkPage } from "../../sanity/preload";
import { warmWorkPage } from "../shared/doorwayWarm";

type NavigationTab = "work" | "art" | "about";

type NavigationTabsProps = {
  activeTab: NavigationTab;
  heroAnimationPlayed?: boolean;
};

const NAV_LINKS: { id: NavigationTab; label: string; href: string }[] = [
  { id: "work", label: "work", href: "/" },
  { id: "about", label: "about", href: "/about" },
];

const NAV_STATUS = "seeking summer 2027 internships";

export default function NavigationTabs({ activeTab }: NavigationTabsProps) {
  const router = useRouter();
  const prefetchedRef = useRef<Set<string>>(new Set());

  const prefetchTab = useCallback(
    (href: string) => {
      if (process.env.NODE_ENV === "development") return;

      if (href === "/about") {
        void preloadAboutPage();
        void import("../about/AboutPage");
        void import("../about/CommunityCard");
        void import("../about/ShelfSection");
        void import("../about/LoreCard");
        void import("../about/MediaCard");
      } else if (href === "/") {
        warmWorkPage();
        void preloadWorkPage();
      }

      router.prefetch(href);

      if (prefetchedRef.current.has(href)) return;
      prefetchedRef.current.add(href);
    },
    [router],
  );

  return (
    <header className="relative z-50 w-full shrink-0 bg-white pt-8 max-md:pt-8 md:pt-10">
      <ScrollReveal variant="fade" delay={280} rootMargin="0px" className="relative w-full" disabled>
        <div className="flex w-full items-center justify-between gap-4 px-16 pb-4 max-md:px-6 max-md:pb-3">
          <p
            className="flex min-w-0 items-center gap-2 font-['Lucas',sans-serif] text-xs font-normal lowercase tracking-[0.01em] text-zinc-600 md:text-sm"
            aria-label={NAV_STATUS}
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-emerald-400 animate-[blink_1.2s_ease-in-out_infinite]"
            />
            <span className="min-w-0 truncate">{NAV_STATUS}</span>
          </p>

          <nav className="flex shrink-0 items-center gap-5 md:gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  scroll={false}
                  prefetch={false}
                  onMouseEnter={() => prefetchTab(link.href)}
                  onFocus={() => prefetchTab(link.href)}
                  onTouchStart={() => prefetchTab(link.href)}
                  className={clsx(
                    "font-['Lucas',sans-serif] text-sm font-normal lowercase tracking-[0.01em] transition-colors duration-200 ease-out md:text-base",
                    isActive
                      ? "text-zinc-700"
                      : "text-zinc-400 hover:text-zinc-600",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </ScrollReveal>
    </header>
  );
}
