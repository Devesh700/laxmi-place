import type { Metadata } from "next";
import { GalleryPageClient } from "@/components/sections/GalleryPageClient";
import { PageBanner } from "@/components/sections/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { buildBreadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: `View photos of rooms, dining, and spaces at ${siteConfig.name}.`,
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Gallery", href: "/gallery" },
        ])}
      />

      <PageBanner
        title="Photo Gallery"
        subtitle="Explore our rooms, dining spaces, and property architecture."
        image="/assets/hotel-12.jpeg"
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Gallery" }]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-5 md:px-8">
          <GalleryPageClient images={siteConfig.gallery} />
        </div>
      </section>
    </>
  );
}
