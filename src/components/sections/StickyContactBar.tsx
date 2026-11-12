import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function StickyContactBar() {
  const whatsappHref = buildWhatsAppLink({ purpose: "general" });

  return (
    <>
      {/* Mobile sticky bottom contact bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(43,33,24,0.08)] backdrop-blur-md lg:hidden"
        role="region"
        aria-label="Quick contact actions"
      >
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          <a
            href={`tel:${siteConfig.phonePrimary}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-card px-4 text-sm font-medium text-primary transition-colors hover:bg-muted"
          >
            <Phone className="size-4" />
            <span>Call Now</span>
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1E7E45] px-4 text-sm font-medium text-white shadow-xs transition-colors hover:bg-[#186839]"
          >
            <MessageCircle className="size-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Desktop floating WhatsApp button */}
      <div className="fixed right-6 bottom-6 z-40 hidden lg:block">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Book on WhatsApp"
          className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#1E7E45] px-5 text-sm font-medium text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-[#186839]"
        >
          <MessageCircle className="size-5" />
          <span>Book on WhatsApp</span>
        </a>
      </div>
    </>
  );
}
