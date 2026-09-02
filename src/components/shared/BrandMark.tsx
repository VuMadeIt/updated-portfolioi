import clsx from "clsx";

type BrandMarkProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClass = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
} as const;

export default function BrandMark({ className, size = "md" }: BrandMarkProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center font-['Lucas',sans-serif] font-black uppercase leading-none tracking-[-0.06em] text-zinc-800",
        sizeClass[size],
        className,
      )}
      aria-hidden="true"
    >
      lv
    </span>
  );
}
