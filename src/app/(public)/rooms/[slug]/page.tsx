import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BedDouble, CheckCircle2, Maximize, MessageCircle, Phone, Users } from "lucide-react";
import { PageBanner } from "@/components/sections/PageBanner";
import { RoomImageCarousel } from "@/components/sections/RoomImageCarousel";
import { WhatsAppEnquiryForm } from "@/components/sections/WhatsAppEnquiryForm";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { getPublicRoomBySlug, getPublicRoomsWithAvailability } from "@/lib/rooms-data";
import { buildBreadcrumbJsonLd } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const revalidate = 3600;

export async function generateStaticParams() {
  const rooms = await getPublicRoomsWithAvailability();
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const room = await getPublicRoomBySlug(slug);
  if (!room) {
    return { title: "Room Not Found" };
  }
  return {
    title: room.name,
    description: room.description,
    alternates: { canonical: `/rooms/${room.slug}` },
  };
}

const availabilityBadge = {
  available: { label: "Available Tonight", className: "bg-emerald-600 text-white" },
  limited: { label: "Limited Tonight", className: "bg-amber-500 text-stone-950" },
  sold_out: { label: "Sold Out Tonight", className: "bg-rose-600 text-white" },
};

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const room = await getPublicRoomBySlug(slug);
  if (!room) notFound();

  const badge = availabilityBadge[room.tonightStatus];
  const whatsappHref = buildWhatsAppLink({ room: room.name });

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Rooms", href: "/rooms" },
          { name: room.name, href: `/rooms/${room.slug}` },
        ])}
      />

      <PageBanner
        title={room.name}
        subtitle={`${room.type} · Up to ${room.capacity} Guests · ${room.bedType}`}
        image={room.images[0]?.url ?? "/assets/hotel-02.jpeg"}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Rooms", href: "/rooms" },
          { name: room.name },
        ]}
      />

      <section className="py-12 md:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 md:px-8 lg:grid-cols-[1.45fr_1fr] lg:items-start">
          <div className="space-y-10">
            <RoomImageCarousel images={room.images} />

            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
                About This Room
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">{room.description}</p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                Included Amenities
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-3 text-sm text-foreground"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                Stay Policies
              </h2>
              <Accordion className="space-y-2.5">
                <AccordionItem
                  value="checkin"
                  className="rounded-xl border border-border bg-card px-4"
                >
                  <AccordionTrigger className="py-3.5 text-sm font-semibold">
                    Check-in &amp; Check-out
                  </AccordionTrigger>
                  <AccordionContent className="pb-3.5 text-sm text-muted-foreground">
                    Check-in from {siteConfig.checkInTime}, Check-out by {siteConfig.checkOutTime}.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="cancellation"
                  className="rounded-xl border border-border bg-card px-4"
                >
                  <AccordionTrigger className="py-3.5 text-sm font-semibold">
                    Cancellation &amp; ID Proof
                  </AccordionTrigger>
                  <AccordionContent className="pb-3.5 text-sm text-muted-foreground space-y-1">
                    <p>{siteConfig.policies.cancellation}</p>
                    <p>{siteConfig.policies.idProof}</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-28">
            <Card>
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge className={cn("px-3 py-1 text-xs", badge.className)}>{badge.label}</Badge>
                  <span className="text-xs uppercase tracking-[0.16em] text-gold-text">
                    {room.type}
                  </span>
                </div>
                <CardTitle className="font-heading text-3xl text-foreground">
                  ₹{room.pricePerNight.toLocaleString("en-IN")}{" "}
                  <span className="font-sans text-sm font-normal text-muted-foreground">
                    / night
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-secondary/60 p-3 text-center text-xs">
                  <div className="space-y-1">
                    <Users className="mx-auto size-4 text-primary" />
                    <p className="font-medium text-foreground">{room.capacity} Guests</p>
                  </div>
                  <div className="space-y-1">
                    <BedDouble className="mx-auto size-4 text-primary" />
                    <p className="font-medium text-foreground">{room.bedType}</p>
                  </div>
                  <div className="space-y-1">
                    <Maximize className="mx-auto size-4 text-primary" />
                    <p className="font-medium text-foreground">{room.sizeSqFt} sq ft</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1E7E45] px-5 text-sm font-medium text-white transition-colors hover:bg-[#186839]"
                  >
                    <MessageCircle className="size-4" />
                    <span>Book on WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${siteConfig.phonePrimary}`}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-card px-5 text-sm font-medium text-primary transition-colors hover:bg-muted"
                  >
                    <Phone className="size-4" />
                    <span>Call Front Desk</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            <WhatsAppEnquiryForm
              roomNames={[room.name]}
              defaultRoom={room.name}
              title={`Enquire for ${room.name}`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
