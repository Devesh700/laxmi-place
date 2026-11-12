"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";

const GalleryLightboxGrid = dynamic(
  () => import("@/components/sections/GalleryLightbox").then((m) => m.GalleryLightboxGrid),
  {
    loading: () => (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-2xl" />
        ))}
      </div>
    ),
  }
);

export function GalleryPreview() {
  const previewImages = siteConfig.gallery.slice(0, 6);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] space-y-10 px-5 md:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Visual Tour"
            title="Inside Our Property"
            subtitle="Explore our rooms, dining spaces, and warm hospitality corners."
          />
          <Link
            href="/gallery"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-primary/30 bg-card px-5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <GalleryLightboxGrid images={previewImages} />
      </div>
    </section>
  );
}
