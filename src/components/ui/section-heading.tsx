import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "space-y-3",
        isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-[0.2em]",
            isDark ? "text-[#D8B982]" : "text-gold-text"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-heading font-semibold tracking-tight",
          isDark ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-base leading-relaxed",
            isDark ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
