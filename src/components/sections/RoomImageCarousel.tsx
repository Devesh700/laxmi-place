"use client";

import { useState } from "react";
import Image from "next/image";
import type { RoomImage } from "@/types/room";
import { cn } from "@/lib/utils";

export function RoomImageCarousel({ images }: { images: RoomImage[] }) {
  const safeImages =
    images.length > 0
      ? images
      : [{ url: "/assets/hotel-02.jpeg", path: "local", alt: "Guest room" }];

  const [activeIdx, setActiveIdx] = useState(0);
  const current = safeImages[activeIdx] ?? safeImages[0]!;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_8px_30px_rgba(43,33,24,0.06)]">
        <Image
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 720px"
          className="object-cover"
        />
      </div>

      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5">
          {safeImages.map((img, idx) => (
            <button
              key={img.url + idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              aria-label={`View photo ${idx + 1}: ${img.alt}`}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all",
                idx === activeIdx
                  ? "border-accent ring-2 ring-accent/40"
                  : "border-border opacity-75 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="140px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
