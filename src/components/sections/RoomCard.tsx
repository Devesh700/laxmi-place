import Image from "next/image";
import Link from "next/link";
import { BedDouble, Maximize, MessageCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { RoomWithAvailability } from "@/lib/rooms-data";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const availabilityStyles = {
  available: {
    label: "Available",
    className: "bg-emerald-600 text-white border-emerald-700",
  },
  limited: {
    label: "Limited Rooms",
    className: "bg-amber-500 text-stone-950 border-amber-600",
  },
  sold_out: {
    label: "Sold Out Tonight",
    className: "bg-rose-600 text-white border-rose-700",
  },
};

export function RoomCard({ room }: { room: RoomWithAvailability }) {
  const badge = availabilityStyles[room.tonightStatus];
  const primaryImage = room.images[0]?.url ?? "/assets/hotel-02.jpeg";
  const primaryAlt = room.images[0]?.alt ?? `${room.name} interior`;
  const whatsappHref = buildWhatsAppLink({ room: room.name });

  return (
    <Card interactive className="flex h-full flex-col pt-0">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={primaryImage}
          alt={primaryAlt}
          fill
          sizes="(max-width: 768px) 85vw, 380px"
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
          aria-hidden="true"
        />
        <Badge className={cn("absolute top-3 left-3 border px-2.5 py-1 text-xs font-medium", badge.className)}>
          {badge.label}
        </Badge>
        <div className="absolute right-3 bottom-3 rounded-full border border-accent/50 bg-primary/95 px-3.5 py-1 text-xs font-semibold text-primary-foreground shadow-sm backdrop-blur-sm">
          From ₹{room.pricePerNight.toLocaleString("en-IN")} / night
        </div>
      </div>

      <CardHeader className="pb-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold-text">
          {room.type}
        </p>
        <CardTitle className="font-heading text-2xl font-semibold text-foreground">
          {room.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5 text-primary" />
            Up to {room.capacity} Guests
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="size-3.5 text-primary" />
            {room.bedType}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Maximize className="size-3.5 text-primary" />
            {room.sizeSqFt} sq ft
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {room.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] text-foreground"
            >
              {amenity}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="gap-2.5">
        <Link
          href={`/rooms/${room.slug}`}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          View Details
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Enquire about ${room.name} on WhatsApp`}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#1E7E45] text-white transition-colors hover:bg-[#186839]"
        >
          <MessageCircle className="size-5" />
        </a>
      </CardFooter>
    </Card>
  );
}
