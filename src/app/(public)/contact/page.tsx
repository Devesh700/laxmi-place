import type { Metadata } from "next";
import { LocationSection } from "@/components/sections/LocationSection";
import { PageBanner } from "@/components/sections/PageBanner";
import { WhatsAppEnquiryForm } from "@/components/sections/WhatsAppEnquiryForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { getPublicRoomsWithAvailability } from "@/lib/rooms-data";
import { buildBreadcrumbJsonLd } from "@/lib/schema";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact & Location",
  description: `Address, phone, WhatsApp, and directions to ${siteConfig.name}.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const rooms = await getPublicRoomsWithAvailability();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ])}
      />

      <PageBanner
        title="Contact & Directions"
        subtitle="Call us or send a WhatsApp enquiry for direct room bookings and table reservations."
        image="/assets/hotel-01.jpeg"
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Contact" }]}
      />

      <LocationSection />

      <section className="bg-secondary/50 py-14 md:py-20">
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <WhatsAppEnquiryForm roomNames={rooms.map((r) => r.name)} />
        </div>
      </section>
    </>
  );
}
