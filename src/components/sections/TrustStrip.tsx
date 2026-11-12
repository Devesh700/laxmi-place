import { BadgePercent, Clock, ShieldCheck, Star } from "lucide-react";
import { siteConfig } from "@/config/site";

export function TrustStrip() {
  const ratingText = siteConfig.googleRating.isPlaceholder
    ? "Guest-Loved Hospitality"
    : `${siteConfig.googleRating.score}★ Google Rating`;

  const items = [
    {
      icon: Star,
      title: ratingText,
      subtitle: "Warm & attentive service",
      chipClass: "bg-amber-500/15 text-amber-800 border-amber-500/30",
    },
    {
      icon: Clock,
      title: siteConfig.frontDeskHours,
      subtitle: `Check-in ${siteConfig.checkInTime}`,
      chipClass: "bg-emerald-600/12 text-emerald-800 border-emerald-600/25",
    },
    {
      icon: ShieldCheck,
      title: "Direct Confirmation",
      subtitle: "Pay-at-hotel options",
      chipClass: "bg-primary/10 text-primary border-primary/25",
    },
    {
      icon: BadgePercent,
      title: "Best Direct Rates",
      subtitle: "Zero middleman fees",
      chipClass: "bg-accent/20 text-gold-text border-accent/40",
    },
  ];

  return (
    <section
      id="highlights"
      aria-label="Hospitality highlights"
      className="border-b border-border bg-secondary/70"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-4 px-5 py-7 md:grid-cols-4 md:gap-6 md:px-8">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start gap-3">
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-full border ${item.chipClass}`}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
