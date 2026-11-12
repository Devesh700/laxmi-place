import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

export function AboutSection({ roomCount }: { roomCount: number }) {
  const stats = [
    { label: "Room Categories", value: `${roomCount}+` },
    { label: "Front Desk", value: "24×7" },
    { label: "In-House Dining", value: "Daily" },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Our Heritage & Warmth"
            title={`Welcome to ${siteConfig.name}`}
            subtitle={siteConfig.description}
          />

          <div className="grid grid-cols-3 gap-3 pt-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card p-4 text-center shadow-[0_6px_20px_rgba(43,33,24,0.05)]"
              >
                <p className="font-heading text-2xl font-bold text-primary md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-primary/30 bg-card px-5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <span>Discover Our Story</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md pb-8 md:pb-12">
          <div className="relative aspect-[4/5] w-4/5 overflow-hidden rounded-2xl border-2 border-accent/50 shadow-[0_14px_40px_rgba(43,33,24,0.12)]">
            <Image
              src="/assets/hotel-06.jpeg"
              alt={`${siteConfig.name} reception and lounge`}
              fill
              sizes="(max-width: 768px) 75vw, 380px"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-0 aspect-[4/3] w-3/5 overflow-hidden rounded-2xl border-4 border-background shadow-[0_16px_40px_rgba(31,61,47,0.2)]">
            <Image
              src="/assets/hotel-07.jpeg"
              alt={`${siteConfig.name} guest corridor and rooms`}
              fill
              sizes="(max-width: 768px) 55vw, 280px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
