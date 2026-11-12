import { AboutSection } from "@/components/sections/AboutSection";
import { AmenitiesSection } from "@/components/sections/AmenitiesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FeaturedRoomsSection } from "@/components/sections/FeaturedRoomsSection";
import { FinalCtaBand } from "@/components/sections/FinalCtaBand";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { HeroSection } from "@/components/sections/HeroSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { RestaurantTeaser } from "@/components/sections/RestaurantTeaser";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublicRoomsWithAvailability } from "@/lib/rooms-data";
import { buildFaqJsonLd } from "@/lib/schema";

export const revalidate = 3600;

export default async function HomePage() {
  const rooms = await getPublicRoomsWithAvailability();

  return (
    <>
      <JsonLd data={buildFaqJsonLd()} />
      <HeroSection />
      <TrustStrip />
      <AboutSection roomCount={rooms.length} />
      <div className="gold-divider" />
      <FeaturedRoomsSection rooms={rooms} />
      <AmenitiesSection />
      <RestaurantTeaser />
      <GalleryPreview />
      <TestimonialsSection />
      <FaqSection />
      <LocationSection />
      <FinalCtaBand />
    </>
  );
}
