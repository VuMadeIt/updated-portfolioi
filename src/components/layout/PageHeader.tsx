import React from "react";
import { ScrollReveal } from "../shared/ScrollReveal";
import grainTexture from "../../assets/Rectangle Grain 1.png";

type PageHeaderProps = {
  /** Which page is active - affects description content */
  variant: "work" | "art" | "about";
  /** Whether the hero animation has already played */
  heroAnimationPlayed?: boolean;
  /** Custom children to render in the description area */
  children?: React.ReactNode;
  /** Optional additional element (like the "b. 2004" for Art page) */
  nameAddon?: React.ReactNode;
};

export default function PageHeader({
  variant,
  children,
  nameAddon,
}: PageHeaderProps) {
  return (
    <div
      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
      style={{ zIndex: 41 }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${grainTexture})`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          opacity: 0.8,
        }}
      />

      <div className="relative shrink-0 w-full" style={{ zIndex: 2 }}>
        <div className="size-full">
          <div className="content-stretch flex flex-col gap-4 items-start px-16 pt-14 max-md:px-6 max-md:pt-20 md:pt-16 relative w-full max-md:min-h-[210px] md:min-h-[176px]">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <ScrollReveal variant="fade" rootMargin="0px" disabled>
                {nameAddon ? (
                  <div className="flex gap-3 items-baseline w-full">
                    <p className="font-['Lucas',sans-serif] tracking-[0.0125em] font-medium leading-normal text-[#3f3f46] text-4xl max-md:text-4xl">
                      lucas vu
                    </p>
                    {nameAddon}
                  </div>
                ) : (
                  <p className="font-['Lucas',sans-serif] tracking-[0.0125em] font-medium leading-normal relative shrink-0 text-[#3f3f46] text-4xl w-full max-md:text-4xl">
                    lucas vu
                  </p>
                )}
              </ScrollReveal>
              {children && (
                <div
                  key={variant}
                  className="font-['Lucas',sans-serif] font-normal tracking-wide leading-normal text-[#a1a1aa] text-lg max-md:text-base w-full whitespace-pre-wrap mt-1 max-md:mt-1"
                  style={{
                    animation:
                      "projectCardEnter 360ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
                  }}
                >
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
