"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Facebook, Instagram, Menu, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;
  const whatsappHref = buildWhatsAppLink({ purpose: "general" });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        transparent
          ? "bg-gradient-to-b from-black/55 to-transparent text-white"
          : "border-b border-border bg-background/95 text-foreground shadow-[0_4px_24px_rgba(43,33,24,0.06)] backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:h-20 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 font-heading text-xl font-bold tracking-tight md:text-2xl"
        >
          <div className="relative size-11 md:size-12 shrink-0 overflow-hidden rounded-xl border border-accent/60 bg-white/95 p-0.5 shadow-xs">
            <Image
              src={siteConfig.logo}
              alt={`${siteConfig.name} logo`}
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-heading font-bold">{siteConfig.name}</span>
            <span
              className={cn(
                "text-[10px] font-sans font-medium uppercase tracking-[0.25em]",
                transparent ? "text-[#FCE8B8]" : "text-gold-text"
              )}
            >
              {siteConfig.address.locality}
            </span>
          </div>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-1 text-sm font-medium transition-colors",
                  transparent
                    ? "text-white/90 hover:text-white"
                    : "text-muted-foreground hover:text-foreground",
                  active && (transparent ? "text-white" : "text-primary font-semibold")
                )}
              >
                {item.label}
                {active && (
                  <span
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${siteConfig.phonePrimary}`}
            aria-label={`Call ${siteConfig.name}`}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-xl border transition-colors",
              transparent
                ? "border-white/40 text-white hover:bg-white/15"
                : "border-border text-foreground hover:bg-muted"
            )}
          >
            <Phone className="size-4" />
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-accent-foreground shadow-xs transition-colors hover:bg-accent/90"
          >
            <MessageCircle className="size-4" />
            <span>Book on WhatsApp</span>
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={`tel:${siteConfig.phonePrimary}`}
            aria-label={`Call ${siteConfig.name}`}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-xl border transition-colors",
              transparent
                ? "border-white/45 bg-black/20 text-white hover:bg-white/20"
                : "border-border bg-card text-foreground hover:bg-muted"
            )}
          >
            <Phone className="size-5" />
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant={transparent ? "outline-light" : "outline"}
                  size="icon"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="flex w-[86vw] max-w-sm flex-col bg-background p-6">
              <SheetHeader className="border-b border-border pb-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border border-accent/60 bg-white/95 p-1 shadow-xs">
                    <Image
                      src={siteConfig.logo}
                      alt={`${siteConfig.name} logo`}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <SheetTitle className="font-heading text-xl font-bold text-primary">
                      {siteConfig.name}
                    </SheetTitle>
                    <SheetDescription className="text-xs uppercase tracking-[0.2em] text-gold-text font-medium">
                      {siteConfig.address.locality} · Stay Royal
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <nav aria-label="Mobile navigation" className="mt-6 flex flex-1 flex-col gap-1">
                {navLinks.map((item) => {
                  const active =
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-12 items-center justify-between rounded-xl px-3 font-heading text-2xl font-semibold transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="size-5 text-accent" />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto space-y-4 border-t border-border pt-5 text-sm">
                <div className="space-y-1 text-muted-foreground">
                  <p className="font-medium text-foreground">{siteConfig.frontDeskHours}</p>
                  <p>
                    <a href={`tel:${siteConfig.phonePrimary}`} className="hover:underline">
                      {siteConfig.phonePrimary}
                    </a>
                  </p>
                  <p>
                    <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                      {siteConfig.email}
                    </a>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {siteConfig.social.instagram && (
                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:border-accent"
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
                      className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:border-accent"
                    >
                      <Facebook className="size-4" />
                    </a>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
