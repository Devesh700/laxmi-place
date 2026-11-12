"use client";

import { useState } from "react";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function QuickEnquiryBar() {
  const [checkIn, setCheckIn] = useState<Date | undefined>(() => new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>(() => addDays(new Date(), 1));
  const [guests, setGuests] = useState<string>("2");

  const handleCheckWhatsApp = () => {
    const href = buildWhatsAppLink({
      checkIn: checkIn ? format(checkIn, "dd MMM yyyy") : undefined,
      checkOut: checkOut ? format(checkOut, "dd MMM yyyy") : undefined,
      guests,
    });
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border border-white/30 bg-background/95 p-4 shadow-[0_18px_50px_rgba(31,61,47,0.22)] backdrop-blur-md md:p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.85fr_auto] lg:items-end">
        <div className="space-y-1.5 text-left">
          <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-gold-text">
            Check-in
          </span>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start bg-card text-left font-normal",
                    !checkIn && "text-muted-foreground"
                  )}
                />
              }
            >
              <CalendarIcon className="size-4 text-primary" />
              <span>{checkIn ? format(checkIn, "dd MMM yyyy") : "Select date"}</span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={(date) => {
                  setCheckIn(date);
                  if (date && (!checkOut || checkOut <= date)) {
                    setCheckOut(addDays(date, 1));
                  }
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5 text-left">
          <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-gold-text">
            Check-out
          </span>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start bg-card text-left font-normal",
                    !checkOut && "text-muted-foreground"
                  )}
                />
              }
            >
              <CalendarIcon className="size-4 text-primary" />
              <span>{checkOut ? format(checkOut, "dd MMM yyyy") : "Select date"}</span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) =>
                  date <= (checkIn ?? new Date(new Date().setHours(0, 0, 0, 0)))
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5 text-left">
          <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-gold-text">
            Guests
          </span>
          <Select value={guests} onValueChange={(v) => setGuests(v ?? "2")}>
            <SelectTrigger className="h-11 w-full rounded-xl bg-card text-foreground">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <SelectValue placeholder="Guests" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? "Guest" : "Guests"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="whatsapp"
          size="lg"
          onClick={handleCheckWhatsApp}
          className="w-full lg:w-auto"
        >
          <MessageCircle className="size-4" />
          <span>Check on WhatsApp</span>
        </Button>
      </div>
    </div>
  );
}
