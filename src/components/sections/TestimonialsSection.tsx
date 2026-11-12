import { Quote, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

export function TestimonialsSection() {
  if (!siteConfig.showTestimonials || siteConfig.testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-secondary/60 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] space-y-10 px-5 md:px-8">
        <SectionHeading
          eyebrow="Guest Stories"
          title="Words from Our Guests"
          align="center"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {siteConfig.testimonials.map((t) => (
            <Card key={t.author} className="h-full">
              <CardContent className="flex h-full flex-col justify-between space-y-4 pt-1">
                <div className="space-y-3">
                  <Quote className="size-6 text-accent" />
                  <div className="flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="size-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="border-t border-border pt-3 text-xs">
                  <p className="font-semibold text-foreground">{t.author}</p>
                  <p className="text-muted-foreground">{t.source}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
