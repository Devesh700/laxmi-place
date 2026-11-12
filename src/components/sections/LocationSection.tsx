import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { MapFacade } from "@/components/sections/MapFacade";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";

export function LocationSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] space-y-10 px-5 md:px-8">
        <SectionHeading
          eyebrow="Find Us"
          title="Location & Contact"
          subtitle="Reach out directly for room enquiries, group stays, or dining reservations."
        />

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4">
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Card>
                <CardContent className="flex items-start gap-3 pt-1">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="size-5" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="mt-1 text-muted-foreground">
                      {siteConfig.address.streetAddress}, {siteConfig.address.locality},{" "}
                      {siteConfig.address.region} {siteConfig.address.postalCode}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-start gap-3 pt-1">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/12 text-emerald-800">
                    <Phone className="size-5" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="mt-1">
                      <a href={`tel:${siteConfig.phonePrimary}`} className="text-primary underline">
                        {siteConfig.phonePrimary}
                      </a>
                    </p>
                    {siteConfig.phoneSecondary && (
                      <p>
                        <a
                          href={`tel:${siteConfig.phoneSecondary}`}
                          className="text-muted-foreground hover:underline"
                        >
                          {siteConfig.phoneSecondary}
                        </a>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-start gap-3 pt-1">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-gold-text">
                    <Mail className="size-5" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="mt-1 break-all">
                      <a href={`mailto:${siteConfig.email}`} className="text-primary underline">
                        {siteConfig.email}
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-start gap-3 pt-1">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800">
                    <Clock className="size-5" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">Check-in / Out</p>
                    <p className="mt-1 text-muted-foreground">
                      In: {siteConfig.checkInTime} · Out: {siteConfig.checkOutTime}
                    </p>
                    <p className="text-xs text-muted-foreground">{siteConfig.frontDeskHours}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {siteConfig.nearbyAttractions.length > 0 && (
              <Card>
                <CardContent className="space-y-3 pt-1">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-gold-text">
                    Nearby Landmarks
                  </p>
                  <ul className="divide-y divide-border text-sm">
                    {siteConfig.nearbyAttractions.map((place) => (
                      <li key={place.name} className="flex items-center justify-between py-2">
                        <span className="inline-flex items-center gap-2 text-foreground">
                          <MapPin className="size-3.5 text-accent" />
                          {place.name}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {place.distance}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-3">
            <MapFacade />
            <div className="flex justify-end">
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Navigation className="size-4" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
