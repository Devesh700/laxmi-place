import type { Metadata } from "next";
import Image from "next/image";
import { Clock, MessageCircle, Phone } from "lucide-react";
import { PageBanner } from "@/components/sections/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/config/site";
import { buildBreadcrumbJsonLd } from "@/lib/schema";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: siteConfig.restaurant.name,
  description: siteConfig.restaurant.description,
  alternates: { canonical: "/restaurant" },
};

export default function RestaurantPage() {
  const { restaurant } = siteConfig;
  const reserveHref = buildWhatsAppLink({ purpose: "table" });
  const categories = Array.from(new Set(restaurant.menuHighlights.map((m) => m.category)));

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Restaurant", href: "/restaurant" },
        ])}
      />

      <PageBanner
        title={restaurant.name}
        subtitle={restaurant.tagline}
        image={restaurant.heroImage}
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Restaurant" }]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] space-y-16 px-5 md:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-5">
              <SectionHeading
                eyebrow="In-House Kitchen"
                title="Freshly Prepared Every Day"
                subtitle={restaurant.description}
              />

              <div className="flex flex-wrap gap-2">
                {restaurant.cuisines.map((c) => (
                  <Badge key={c} variant="secondary" className="border border-border px-3 py-1">
                    {c}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4 text-primary" />
                <span>{restaurant.openingHoursDisplay}</span>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={reserveHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1E7E45] px-5 text-sm font-medium text-white hover:bg-[#186839]"
                >
                  <MessageCircle className="size-4" />
                  <span>Reserve a Table on WhatsApp</span>
                </a>
                <a
                  href={`tel:${siteConfig.phonePrimary}`}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-primary/30 bg-card px-5 text-sm font-medium text-primary hover:bg-muted"
                >
                  <Phone className="size-4" />
                  <span>Call for Room Service</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border">
                <Image
                  src="/assets/hotel-05.jpeg"
                  alt={`${restaurant.name} dining hall`}
                  fill
                  sizes="(max-width: 1024px) 45vw, 280px"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border">
                <Image
                  src="/assets/hotel-14.jpeg"
                  alt={`${restaurant.name} table setting`}
                  fill
                  sizes="(max-width: 1024px) 45vw, 280px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div id="menu" className="space-y-6">
            <SectionHeading eyebrow="Menu Highlights" title="From Our Kitchen" />

            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="sticky top-20 z-20 flex-wrap bg-secondary p-1">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map((cat) => (
                  <TabsTrigger key={cat} value={cat}>
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {restaurant.menuHighlights.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block size-2.5 rounded-full ${
                            item.isVeg ? "bg-emerald-600" : "bg-rose-600"
                          }`}
                          aria-label={item.isVeg ? "Vegetarian" : "Non-vegetarian"}
                        />
                        <h3 className="font-heading text-xl font-semibold text-foreground">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <p className="shrink-0 font-semibold text-primary">₹{item.priceInr}</p>
                  </div>
                ))}
              </TabsContent>

              {categories.map((cat) => (
                <TabsContent key={cat} value={cat} className="space-y-3">
                  {restaurant.menuHighlights
                    .filter((m) => m.category === cat)
                    .map((item) => (
                      <div
                        key={item.name}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block size-2.5 rounded-full ${
                                item.isVeg ? "bg-emerald-600" : "bg-rose-600"
                              }`}
                            />
                            <h3 className="font-heading text-xl font-semibold text-foreground">
                              {item.name}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <p className="shrink-0 font-semibold text-primary">₹{item.priceInr}</p>
                      </div>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>
    </>
  );
}
