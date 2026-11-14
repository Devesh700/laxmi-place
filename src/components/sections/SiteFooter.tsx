import Image from "next/image";
import Link from "next/link";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms & Suites" },
  { href: "/restaurant", label: "In-House Restaurant" },
  { href: "/gallery", label: "Photo Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact & Directions" },
];

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-accent/60 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1200px] px-5 py-14 md:px-8 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border border-accent/60 bg-white/95 p-1 shadow-md">
                <Image
                  src={siteConfig.logo}
                  alt={`${siteConfig.name} logo`}
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-heading text-xl font-bold tracking-tight">{siteConfig.name}</p>
                <p className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-[#E5B25D]">
                  {siteConfig.address.locality}
                </p>
              </div>
            </div>
            <p className="font-serif italic text-base text-[#FCE8B8]">
              &ldquo;{siteConfig.tagline}&rdquo;
            </p>
            <p className="text-sm leading-relaxed text-primary-foreground/80">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-3 pt-1">
              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex size-11 items-center justify-center rounded-xl border border-primary-foreground/20 bg-white/5 text-primary-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <Instagram className="size-4" />
                </a>
              )}
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex size-11 items-center justify-center rounded-xl border border-primary-foreground/20 bg-white/5 text-primary-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <Facebook className="size-4" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-[#E5B25D]">Explore</h2>
            <ul className="space-y-2 text-sm text-primary-foreground/85">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block py-0.5 transition-colors hover:text-accent hover:underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-[#E5B25D]">Contact</h2>
            <ul className="space-y-2.5 text-sm text-primary-foreground/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>
                  {siteConfig.address.streetAddress}, {siteConfig.address.locality},{" "}
                  {siteConfig.address.region} {siteConfig.address.postalCode}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-accent" />
                <a href={`tel:${siteConfig.phonePrimary}`} className="hover:underline">
                  {siteConfig.phonePrimary}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-accent" />
                <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-[#E5B25D]">Timings &amp; Policies</h2>
            <ul className="space-y-2 text-sm text-primary-foreground/85">
              <li className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-accent" />
                <span>Check-in: {siteConfig.checkInTime}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-accent" />
                <span>Check-out: {siteConfig.checkOutTime}</span>
              </li>
              <li className="pt-1 text-primary-foreground/75">
                Restaurant: {siteConfig.restaurant.openingHoursDisplay}
              </li>
              <li className="pt-1">
                <Link href="/about#policies" className="text-xs underline underline-offset-4 hover:text-accent">
                  Guest &amp; Cancellation Policies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/70 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Direct bookings via Phone &amp; WhatsApp — best rate guaranteed.</p>
        </div>
      </div>
    </footer>
  );
}
