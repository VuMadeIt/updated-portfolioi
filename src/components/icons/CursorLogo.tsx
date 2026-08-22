export type CursorLogoProps = {
  className?: string;
  size?: string;
};

/**
 * Official Cursor mark (Simple Icons paths), used in the footer credit.
 */
export function CursorLogo({ className = "", size }: CursorLogoProps) {
  const dim = size ?? "1em";
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      style={{ verticalAlign: "middle" }}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M11.925 24l10.425-6-10.425-6L1.5 18l10.425 6z"
      />
      <path
        fill="currentColor"
        opacity=".8"
        d="M22.35 18V6L11.925 0v12l10.425 6z"
      />
      <path
        fill="currentColor"
        opacity=".55"
        d="M11.925 0L1.5 6v12l10.425-6V0z"
      />
      <path fill="currentColor" d="M22.35 6L11.925 24V12L22.35 6z" />
      <path
        fill="currentColor"
        opacity=".7"
        d="M22.35 6l-10.425 6L1.5 6h20.85z"
      />
    </svg>
  );
}

export default CursorLogo;
