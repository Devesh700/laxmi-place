import type { ReactNode } from "react";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { StickyContactBar } from "@/components/sections/StickyContactBar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
      <SiteFooter />
      <StickyContactBar />
    </>
  );
}
