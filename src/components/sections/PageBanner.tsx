import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbStep {
  name: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  subtitle?: string;
  image?: string;
  breadcrumbs: BreadcrumbStep[];
}

export function PageBanner({
  title,
  subtitle,
  image = "/assets/hotel-18.jpeg",
  breadcrumbs,
}: PageBannerProps) {
  return (
    <section className="relative overflow-hidden pt-28 pb-12 text-white md:pt-36 md:pb-16">
      <Image
        src={image}
        alt={title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#240B03]/85 via-[#5C1C07]/80 to-[#240B03]/90"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-[1200px] space-y-3 px-5 md:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-[#E5B25D]">
          {breadcrumbs.map((step, idx) => (
            <span key={step.name} className="inline-flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="size-3.5 text-white/60" />}
              {step.href ? (
                <Link href={step.href} className="hover:underline">
                  {step.name}
                </Link>
              ) : (
                <span className="text-white/90">{step.name}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="font-heading font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="max-w-2xl text-sm text-white/85 md:text-base">{subtitle}</p>}
      </div>
    </section>
  );
}
