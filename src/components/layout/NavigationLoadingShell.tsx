import grainTexture from "../../assets/Rectangle Grain 1.png";

type NavigationLoadingShellProps = {
  activeTab: "art" | "about";
};

function ArtContentSkeleton() {
  return (
    <>
      <div className="hidden lg:flex flex-col gap-3 w-full">
        <div className="h-6 w-32 animate-pulse rounded bg-zinc-100" />
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="aspect-[3/4] animate-pulse rounded-lg bg-zinc-50" />
          <div className="aspect-[3/4] animate-pulse rounded-lg bg-zinc-50" />
        </div>
        <div className="h-6 w-36 animate-pulse rounded bg-zinc-100 mt-8" />
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="aspect-[3/4] animate-pulse rounded-lg bg-zinc-50" />
          <div className="aspect-[3/4] animate-pulse rounded-lg bg-zinc-50" />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full lg:hidden">
        <div className="h-6 w-28 animate-pulse rounded bg-zinc-100" />
        <div className="aspect-[3/4] w-full animate-pulse rounded-lg bg-zinc-50" />
        <div className="aspect-[3/4] w-full animate-pulse rounded-lg bg-zinc-50" />
      </div>
    </>
  );
}

function AboutContentSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start w-full max-w-5xl">
      <div className="flex flex-col gap-3 w-72 md:w-76 shrink-0">
        <div className="aspect-[304/389] w-full animate-pulse rounded-lg bg-zinc-50" />
        <div className="px-6">
          <div className="mx-auto h-4 w-4/5 animate-pulse rounded bg-zinc-50" />
        </div>
      </div>
      <div className="flex flex-col pt-8 gap-6 flex-1">
        <div className="h-8 w-52 animate-pulse rounded bg-zinc-100" />
        <div className="flex flex-col gap-2 w-full">
          <div className="h-4 w-full max-w-lg animate-pulse rounded bg-zinc-50" />
          <div className="h-4 w-full max-w-md animate-pulse rounded bg-zinc-50" />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div className="h-4 w-full max-w-xl animate-pulse rounded bg-zinc-50" />
          <div className="h-4 w-full max-w-lg animate-pulse rounded bg-zinc-50" />
          <div className="h-4 w-4/5 max-w-md animate-pulse rounded bg-zinc-50" />
        </div>
      </div>
    </div>
  );
}

export default function NavigationLoadingShell({
  activeTab,
}: NavigationLoadingShellProps) {
  return (
    <div
      aria-hidden="true"
      className="bg-white flex flex-col items-center relative size-full min-h-screen"
    >
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

        {/* Navigation band */}
        <div className="relative shrink-0 w-full" style={{ zIndex: 3 }}>
          <div className="flex w-full items-center justify-end gap-4 px-16 pb-4 pt-8 max-md:px-6 max-md:pb-3 md:pt-10">
            <div className="flex items-center gap-5">
              <div className="h-4 w-10 animate-pulse rounded bg-zinc-50" />
              <div className="h-4 w-12 animate-pulse rounded bg-zinc-50" />
            </div>
          </div>
        </div>

        {/* Hero band */}
        <div className="relative shrink-0 w-full" style={{ zIndex: 2 }}>
          <div className="size-full">
            <div className="content-stretch flex flex-col items-center px-16 pt-8 pb-6 max-md:px-6 max-md:pb-4 relative w-full">
              <div className="flex flex-col items-start gap-1">
                <div className="h-3 w-40 animate-pulse rounded bg-zinc-50" />
                <div className="h-10 w-56 max-w-[70%] animate-pulse rounded-lg bg-zinc-100" />
              </div>
              <div className="mt-2 h-4 w-72 max-w-[90%] animate-pulse rounded bg-zinc-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-4 items-start px-16 max-md:px-6 pt-2 relative shrink-0 w-full">
        <div className="hidden lg:block w-[202px] shrink-0">
          <div className="flex flex-col gap-3">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-50" />
            <div className="h-4 w-28 animate-pulse rounded bg-zinc-50" />
            <div className="h-4 w-16 animate-pulse rounded bg-zinc-50" />
          </div>
        </div>
        <div className="flex-1 flex justify-center min-w-0 w-full">
          <div
            className={`flex flex-col ${activeTab === "about" ? "gap-20 max-w-[800px]" : "gap-12"} items-start pb-8 w-full`}
          >
            {activeTab === "art" ? <ArtContentSkeleton /> : <AboutContentSkeleton />}
          </div>
        </div>
      </div>
    </div>
  );
}
