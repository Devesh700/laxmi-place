import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PageBanner } from "@/components/sections/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { buildBreadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about the story, hospitality, and guest policies at ${siteConfig.name}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ])}
      />

      <PageBanner
        title={`About ${siteConfig.name}`}
        subtitle="Warm hospitality, thoughtful comfort, and in-house dining under one roof."
        image="/assets/hotel-06.jpeg"
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "About" }]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] space-y-16 px-5 md:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-5">
              <SectionHeading
                eyebrow="Our Story"
                title="A Welcoming Stay for Every Guest"
                subtitle={siteConfig.description}
              />

              <ul className="space-y-2.5 pt-2">
                {siteConfig.trustHighlights.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Link
                  href="/rooms"
                  className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Explore Our Rooms
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-[0_12px_36px_rgba(43,33,24,0.1)]">
              <Image
                src="/assets/hotel-19.jpeg"
                alt={`${siteConfig.name} hospitality`}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          </div>

          <div id="policies" className="space-y-6">
            <SectionHeading eyebrow="Guest Information" title="Hotel Policies" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="space-y-1.5 pt-1">
                  <h3 className="font-heading text-xl font-semibold">Cancellation Policy</h3>
                  <p className="text-sm text-muted-foreground">{siteConfig.policies.cancellation}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-1.5 pt-1">
                  <h3 className="font-heading text-xl font-semibold">ID Proof</h3>
                  <p className="text-sm text-muted-foreground">{siteConfig.policies.idProof}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-1.5 pt-1">
                  <h3 className="font-heading text-xl font-semibold">Children &amp; Extra Bed</h3>
                  <p className="text-sm text-muted-foreground">{siteConfig.policies.children}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-1.5 pt-1">
                  <h3 className="font-heading text-xl font-semibold">Pets</h3>
                  <p className="text-sm text-muted-foreground">{siteConfig.policies.pets}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
