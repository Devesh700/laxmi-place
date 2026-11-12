import type { Metadata } from "next";
import { PageBanner } from "@/components/sections/PageBanner";
import { RoomCard } from "@/components/sections/RoomCard";
import { WhatsAppEnquiryForm } from "@/components/sections/WhatsAppEnquiryForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { getPublicRoomsWithAvailability } from "@/lib/rooms-data";
import { buildBreadcrumbJsonLd } from "@/lib/schema";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Rooms & Tariff",
  description: `Explore comfortable rooms, amenities, and direct booking options at ${siteConfig.name}.`,
  alternates: { canonical: "/rooms" },
};

export default async function RoomsPage() {
  const rooms = await getPublicRoomsWithAvailability();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Rooms", href: "/rooms" },
        ])}
      />

      <PageBanner
        title="Rooms & Suites"
        subtitle="Book directly via phone or WhatsApp for our best rates and instant confirmation."
        image="/assets/hotel-02.jpeg"
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Rooms" }]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] space-y-12 px-5 md:px-8">
          <SectionHeading
            eyebrow="Direct Tariff"
            title="Choose Your Stay"
            subtitle="All rooms include complimentary Wi-Fi, daily housekeeping, and access to our in-house dining."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          <div className="mx-auto max-w-2xl pt-6">
            <WhatsAppEnquiryForm
              roomNames={rooms.map((r) => r.name)}
              title="Enquire About Room Availability"
            />
          </div>
        </div>
      </section>
    </>
  );
}
