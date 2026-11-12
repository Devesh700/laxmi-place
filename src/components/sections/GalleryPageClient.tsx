"use client";

import { useState } from "react";
import { GalleryLightboxGrid } from "@/components/sections/GalleryLightbox";
import { Button } from "@/components/ui/button";
import type { GalleryImageConfig } from "@/types/site";

const CATEGORIES: Array<{ id: "all" | GalleryImageConfig["category"]; label: string }> = [
  { id: "all", label: "All Photos" },
  { id: "rooms", label: "Rooms" },
  { id: "restaurant", label: "Dining" },
  { id: "exterior", label: "Exterior" },
  { id: "common", label: "Common Spaces" },
];

export function GalleryPageClient({ images }: { images: GalleryImageConfig[] }) {
  const [category, setCategory] = useState<"all" | GalleryImageConfig["category"]>("all");

  const filtered =
    category === "all" ? images : images.filter((img) => img.category === category);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            type="button"
            variant={category === cat.id ? "default" : "outline"}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <GalleryLightboxGrid images={filtered} />
    </div>
  );
}
