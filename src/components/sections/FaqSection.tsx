import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

export function FaqSection() {
  return (
    <section className="bg-secondary/50 py-16 md:py-24">
      <div className="mx-auto max-w-[900px] space-y-10 px-5 md:px-8">
        <SectionHeading
          eyebrow="Good to Know"
          title="Frequently Asked Questions"
          subtitle="Quick answers about check-in, parking, dining, and direct reservations."
          align="center"
        />

        <Accordion className="space-y-3">
          {siteConfig.faqs.map((faq, idx) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${idx}`}
              className="rounded-2xl border border-border bg-card px-5 shadow-[0_4px_18px_rgba(43,33,24,0.04)]"
            >
              <AccordionTrigger className="py-4 text-left font-heading text-lg font-semibold text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
