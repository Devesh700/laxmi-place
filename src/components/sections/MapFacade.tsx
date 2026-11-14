"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function MapFacade() {
  const [loaded, setLoaded] = useState(false);
  const { latitude, longitude } = siteConfig.geo;
  const embedSrc = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-secondary shadow-[0_8px_30px_rgba(43,33,24,0.06)]">
      {loaded ? (
        <iframe
          title={`${siteConfig.name} location map`}
          src={embedSrc}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <>
          <Image
            src="/assets/hotel-12.jpeg"
            alt={`${siteConfig.name} location preview`}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover brightness-75"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#380E02]/65 p-6 text-center text-white backdrop-blur-[2px]">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md">
              <MapPin className="size-6" />
            </div>
            <div className="space-y-1">
              <p className="font-heading text-xl font-semibold">{siteConfig.name}</p>
              <p className="text-xs text-white/85">
                {siteConfig.address.locality}, {siteConfig.address.region}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2.5 pt-1">
              <Button type="button" variant="gold" onClick={() => setLoaded(true)}>
                Load Interactive Map
              </Button>
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/60 bg-white/15 px-4 text-sm font-medium text-white hover:bg-white/25"
              >
                <Navigation className="size-4" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
