import {
  AirVent,
  Car,
  Clock,
  Coffee,
  ConciergeBell,
  Luggage,
  ShieldCheck,
  ShowerHead,
  Snowflake,
  Sparkles,
  Tv,
  UtensilsCrossed,
  Waves,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

const AMENITY_ICON_MAP: Record<string, LucideIcon> = {
  Wifi,
  Car,
  UtensilsCrossed,
  Utensils: UtensilsCrossed,
  Snowflake,
  AirVent,
  Tv,
  ConciergeBell,
  Waves,
  ShowerHead,
  Coffee,
  ShieldCheck,
  Luggage,
  Sparkles,
  Clock,
  Zap,
};

export function AmenitiesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] space-y-10 px-5 md:px-8">
        <SectionHeading
          eyebrow="Guest Comforts"
          title="Amenities & Services"
          subtitle="Everything you need for a peaceful, connected, and memorable stay."
          align="center"
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          {siteConfig.amenities.map((amenity, idx) => {
            const Icon = AMENITY_ICON_MAP[amenity.iconName] ?? Sparkles;
            const isGold = idx % 2 === 1;
            return (
              <Card key={amenity.id} interactive className="h-full">
                <CardContent className="flex flex-col items-start gap-3 pt-1">
                  <div
                    className={`flex size-12 items-center justify-center rounded-2xl border ${
                      isGold
                        ? "border-accent/40 bg-accent/15 text-gold-text"
                        : "border-primary/20 bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">
                      {amenity.label}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {amenity.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
