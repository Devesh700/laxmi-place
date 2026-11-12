"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { GalleryImageConfig } from "@/types/site";

export function GalleryLightboxGrid({ images }: { images: GalleryImageConfig[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : (prev - 1 + images.length) % images.length
    );
  }, [images.length]);

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, goPrev, goNext]);

  const active = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <>
      <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[210px] md:grid-cols-4 md:gap-4">
        {images.map((img, idx) => {
          const spanClass =
            idx === 0
              ? "col-span-2 row-span-2"
              : idx === 3
                ? "md:col-span-2"
                : "";

          return (
            <button
              key={img.src}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-muted text-left focus-visible:ring-2 focus-visible:ring-accent ${spanClass}`}
              aria-label={`View ${img.caption}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 320px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
              <span className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-xs transition-transform group-hover:scale-105">
                <Expand className="size-4" />
              </span>
              <span className="absolute right-3 bottom-3 left-3 truncate text-xs font-medium text-white">
                {img.caption}
              </span>
            </button>
          );
        })}
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        <DialogContent className="max-w-4xl border-border bg-background p-3 sm:p-5">
          <DialogTitle className="sr-only">
            {active?.caption ?? "Gallery photo"}
          </DialogTitle>
          {active && (
            <div className="space-y-3">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="(max-width: 1024px) 95vw, 880px"
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  aria-label="Close lightbox"
                  className="absolute top-3 right-3 inline-flex size-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous photo"
                  className="absolute top-1/2 left-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next photo"
                  className="absolute top-1/2 right-3 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
              <div className="flex items-center justify-between px-1 text-sm">
                <p className="font-medium text-foreground">{active.caption}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedIndex ?? 0) + 1} / {images.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
