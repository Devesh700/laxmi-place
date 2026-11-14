import Image from "next/image";
import Link from "next/link";
import { Clock, MessageCircle, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function RestaurantTeaser() {
  const { restaurant } = siteConfig;
  const reserveHref = buildWhatsAppLink({ purpose: "table" });

  return (
    <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground md:py-24">
      <div className="mx-auto max-w-[1200px] space-y-12 px-5 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="In-House Dining"
              title={restaurant.name}
              subtitle={restaurant.description}
              tone="dark"
            />

            <div className="flex flex-wrap gap-2">
              {restaurant.cuisines.map((cuisine) => (
                <Badge
                  key={cuisine}
                  className="border border-[#E5B25D]/40 bg-white/10 px-3 py-1 text-xs font-medium text-[#F5E6C8]"
                >
                  {cuisine}
                </Badge>
              ))}
            </div>

            <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-primary-foreground/90">
              <Clock className="size-4 text-accent" />
              <span>{restaurant.openingHoursDisplay}</span>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/restaurant"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                <UtensilsCrossed className="size-4" />
                <span>View Full Menu</span>
              </Link>
              <a
                href={reserveHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                <MessageCircle className="size-4" />
                <span>Reserve a Table</span>
              </a>
            </div>
          </div>

          {/* 1 tall + 2 small image collage */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="relative row-span-2 aspect-[3/4] overflow-hidden rounded-2xl border border-accent/40">
              <Image
                src="/assets/hotel-05.jpeg"
                alt={`${restaurant.name} main dining hall`}
                fill
                sizes="(max-width: 1024px) 45vw, 280px"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-accent/30">
              <Image
                src="/assets/hotel-08.jpeg"
                alt={`${restaurant.name} table seating`}
                fill
                sizes="(max-width: 1024px) 45vw, 260px"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-accent/30">
              <Image
                src="/assets/hotel-09.jpeg"
                alt={`${restaurant.name} freshly prepared service`}
                fill
                sizes="(max-width: 1024px) 45vw, 260px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Signature Dishes Row */}
        <div className="space-y-4 border-t border-white/15 pt-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#E5B25D]">
            Signature Highlights
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {restaurant.menuHighlights.map((dish) => (
              <div
                key={dish.name}
                className="flex flex-col justify-between rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[#E5B25D]">
                      {dish.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                        dish.isVeg ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      <span
                        className={`size-2 rounded-full ${
                          dish.isVeg ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                      />
                      {dish.isVeg ? "Veg" : "Non-Veg"}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-white">{dish.name}</h3>
                  <p className="text-xs text-primary-foreground/75">{dish.description}</p>
                </div>
                <p className="mt-3 text-sm font-semibold text-[#E6C992]">₹{dish.priceInr}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
