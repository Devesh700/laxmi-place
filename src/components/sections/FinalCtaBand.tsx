import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function FinalCtaBand() {
  const whatsappHref = buildWhatsAppLink({ purpose: "general" });

  return (
    <section className="relative overflow-hidden py-20 text-white md:py-28">
      <Image
        src="/assets/hotel-18.jpeg"
        alt={`${siteConfig.name} heritage hospitality`}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#1F3D2F]/92 via-[#1F3D2F]/82 to-[#16281F]/88"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-[900px] space-y-6 px-5 text-center md:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#E6C992]">
          Direct Reservations
        </p>
        <h2 className="font-heading font-bold text-white">
          Your stay in {siteConfig.address.locality} starts with a message
        </h2>
        <p className="mx-auto max-w-xl text-base text-white/85">
          Speak directly with our front desk for instant room availability, family packages, and
          table reservations.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#1E7E45] px-6 text-base font-medium text-white shadow-md transition-colors hover:bg-[#186839]"
          >
            <MessageCircle className="size-5" />
            <span>Book on WhatsApp</span>
          </a>
          <a
            href={`tel:${siteConfig.phonePrimary}`}
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/60 bg-white/15 px-6 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <Phone className="size-5" />
            <span>Call {siteConfig.phonePrimary}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
