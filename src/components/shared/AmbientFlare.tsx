type AmbientFlareProps = Readonly<{
  className?: string;
  variant?: "hero" | "banner";
}>;

export default function AmbientFlare({
  className = "",
  variant = "hero",
}: AmbientFlareProps) {
  const flareClassName = [
    "bg-flare",
    `bg-flare--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      aria-hidden="true"
      className={flareClassName}
      data-ambient-flare
      data-variant={variant}
    >
      <span className={`bg-flare__blob bg-flare__blob--${variant}`} />
    </span>
  );
}
