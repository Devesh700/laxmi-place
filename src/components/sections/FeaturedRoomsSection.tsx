import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RoomCard } from "@/components/sections/RoomCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHeading } from "@/components/ui/section-heading";
import type { RoomWithAvailability } from "@/lib/rooms-data";

export function FeaturedRoomsSection({ rooms }: { rooms: RoomWithAvailability[] }) {
  const featured = rooms.slice(0, 3);

  return (
    <section className="bg-secondary/50 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] space-y-10 px-5 md:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Accommodations"
            title="Rooms & Suites"
            subtitle="Thoughtfully appointed rooms designed for restful nights, family comfort, and business stays."
          />
          <Link
            href="/rooms"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-primary/30 bg-card px-5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <span>All Rooms</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Mobile snap carousel */}
        <div className="md:hidden">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="-ml-3">
              {featured.map((room) => (
                <CarouselItem key={room.id} className="basis-[86%] pl-3">
                  <RoomCard room={room} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-4 flex justify-end gap-2">
              <CarouselPrevious className="static translate-y-0 size-11" />
              <CarouselNext className="static translate-y-0 size-11" />
            </div>
          </Carousel>
        </div>

        {/* Tablet/Desktop 3-column grid */}
        <div className="hidden gap-6 md:grid md:grid-cols-3">
          {featured.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </section>
  );
}
