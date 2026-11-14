import Image from "next/image";
import { ChevronDown, MessageCircle, Phone } from "lucide-react";
import { QuickEnquiryBar } from "@/components/sections/QuickEnquiryBar";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function HeroSection() {
  const whatsappHref = buildWhatsAppLink({ purpose: "general" });

  return (
    <section className="relative flex min-h-[88svh] flex-col justify-end overflow-hidden pt-24 pb-10 md:pt-32 md:pb-14">
      <Image
        src={siteConfig.heroImage}
        alt={`${siteConfig.name} — boutique hotel & dining`}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Rich royal terracotta-to-espresso gradient scrim for AA contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#260B03]/95 via-[#571B06]/75 to-black/45"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 md:px-8 space-y-8">
        <div className="max-w-2xl space-y-4 text-white">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#D49A38]/50 bg-[#7E2905]/80 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#FCE8B8] backdrop-blur-sm">
            Royal Stay · {siteConfig.address.locality}
          </p>
          <h1 className="font-heading font-bold tracking-tight text-white drop-shadow-sm">
            {siteConfig.name}
          </h1>
          <p className="text-base text-white/90 md:text-lg">{siteConfig.tagline}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1E7E45] px-6 text-base font-medium text-white shadow-md transition-colors hover:bg-[#186839]"
            >
              <MessageCircle className="size-5" />
              <span>Enquire on WhatsApp</span>
            </a>
            <a
              href={`tel:${siteConfig.phonePrimary}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/15 px-6 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              <Phone className="size-5" />
              <span>Call Now</span>
            </a>
          </div>
        </div>

        <div className="pt-2">
          <QuickEnquiryBar />
        </div>

        <div className="hidden justify-center pt-1 md:flex">
          <a
            href="#highlights"
            aria-label="Scroll to highlights"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white/90 transition-colors hover:bg-white/20"
          >
            <ChevronDown className="size-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
