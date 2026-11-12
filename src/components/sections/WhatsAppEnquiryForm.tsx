"use client";

import { useState } from "react";
import { addDays, format } from "date-fns";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { whatsappEnquirySchema } from "@/lib/validators";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface WhatsAppEnquiryFormProps {
  roomNames?: string[];
  defaultRoom?: string;
  title?: string;
}

export function WhatsAppEnquiryForm({
  roomNames = [],
  defaultRoom = "",
  title = "Send a Quick Enquiry",
}: WhatsAppEnquiryFormProps) {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const [name, setName] = useState("");
  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrowStr);
  const [guests, setGuests] = useState("2");
  const [room, setRoom] = useState(defaultRoom);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = whatsappEnquirySchema.safeParse({
      name: name || undefined,
      checkIn,
      checkOut,
      guests,
      room: room || undefined,
      notes: notes || undefined,
    });

    if (!parsed.success) {
      const firstErr = parsed.error.issues[0]?.message ?? "Please check your enquiry details.";
      setError(firstErr);
      toast.error(firstErr);
      return;
    }

    const href = buildWhatsAppLink({
      name: parsed.data.name,
      checkIn: format(new Date(parsed.data.checkIn), "dd MMM yyyy"),
      checkOut: format(new Date(parsed.data.checkOut), "dd MMM yyyy"),
      guests: parsed.data.guests,
      room: parsed.data.room,
      notes: parsed.data.notes,
    });

    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <Card>
      <CardHeader>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold-text">
          WhatsApp Direct
        </p>
        <CardTitle className="font-heading text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="enq-name">Your Name (optional)</Label>
              <Input
                id="enq-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="enq-guests">Guests</Label>
              <Input
                id="enq-guests"
                type="number"
                min={1}
                max={12}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="enq-checkin">Check-in Date</Label>
              <Input
                id="enq-checkin"
                type="date"
                min={todayStr}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="enq-checkout">Check-out Date</Label>
              <Input
                id="enq-checkout"
                type="date"
                min={checkIn || todayStr}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          {roomNames.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="enq-room">Preferred Room</Label>
              <select
                id="enq-room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground"
              >
                <option value="">Any Available Room</option>
                {roomNames.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="enq-notes">Special Requests (optional)</Label>
            <Textarea
              id="enq-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Early check-in, extra bed, airport pickup, etc."
              className="rounded-xl"
            />
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <Button type="submit" variant="whatsapp" size="lg" className="w-full">
            <MessageCircle className="size-5" />
            <span>Send Enquiry on WhatsApp</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
