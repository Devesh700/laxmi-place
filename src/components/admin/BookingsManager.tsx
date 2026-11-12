"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { createBookingAction, updateBookingStatusAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Booking, BookingStatus } from "@/types/booking";
import type { Room } from "@/types/room";

const STATUS_BADGE: Record<BookingStatus, { label: string; className: string }> = {
  confirmed: { label: "Confirmed", className: "bg-blue-600 text-white" },
  checked_in: { label: "Checked In", className: "bg-emerald-600 text-white" },
  checked_out: { label: "Checked Out", className: "bg-stone-500 text-white" },
  cancelled: { label: "Cancelled", className: "bg-rose-600 text-white" },
};

const PAGE_SIZE = 20;

export function BookingsManager({
  initialBookings,
  rooms,
  configured,
}: {
  initialBookings: Booking[];
  rooms: Room[];
  configured: boolean;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrowStr);
  const [guests, setGuests] = useState("2");
  const [units, setUnits] = useState("1");
  const [notes, setNotes] = useState("");

  const filtered = initialBookings.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.guestName.toLowerCase().includes(q) ||
      b.guestPhone.toLowerCase().includes(q) ||
      b.roomName.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await createBookingAction({
        roomId: roomId || rooms[0]?.id || "",
        guestName,
        guestPhone,
        guestEmail: guestEmail || undefined,
        checkIn,
        checkOut,
        guests: Number(guests),
        units: Number(units),
        status: "confirmed",
        notes: notes || undefined,
      });

      if (res.ok) {
        toast.success("Booking created");
        setDialogOpen(false);
        setGuestName("");
        setGuestPhone("");
        setGuestEmail("");
        setNotes("");
        router.refresh();
      } else {
        toast.error(res.error ?? "Could not create booking");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (bookingId: string, nextStatus: BookingStatus) => {
    const res = await updateBookingStatusAction(bookingId, nextStatus);
    if (res.ok) {
      toast.success(`Status updated to ${STATUS_BADGE[nextStatus].label}`);
      router.refresh();
    } else {
      toast.error(res.error ?? "Status update failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-text">
            Reservations
          </p>
          <h1 className="font-heading text-3xl font-bold text-foreground">Bookings</h1>
        </div>
        <Button
          type="button"
          onClick={() => setDialogOpen(true)}
          disabled={!configured || rooms.length === 0}
        >
          <Plus className="size-4" />
          <span>New Booking</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-3.5 left-3 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search guest, phone, or room..."
            className="h-11 rounded-xl pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "confirmed", "checked_in", "checked_out", "cancelled"] as const).map((st) => (
            <Button
              key={st}
              type="button"
              size="sm"
              variant={statusFilter === st ? "default" : "outline"}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
            >
              {st === "all" ? "All" : STATUS_BADGE[st].label}
            </Button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden rounded-2xl border border-border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No bookings match your filters.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((b) => {
                const badge = STATUS_BADGE[b.status];
                return (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{b.guestName}</div>
                      <div className="text-xs text-muted-foreground">{b.guestPhone}</div>
                    </TableCell>
                    <TableCell>{b.roomName}</TableCell>
                    <TableCell className="text-xs">
                      {format(new Date(b.checkIn), "dd MMM")} →{" "}
                      {format(new Date(b.checkOut), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>{b.units}</TableCell>
                    <TableCell>
                      <Badge className={badge.className}>{badge.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon-sm" aria-label="Booking actions" />
                          }
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(b.id, "confirmed")}>
                            Mark Confirmed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(b.id, "checked_in")}>
                            Check In
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(b.id, "checked_out")}>
                            Check Out
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleStatusChange(b.id, "cancelled")}
                          >
                            Cancel Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {paged.map((b) => {
          const badge = STATUS_BADGE[b.status];
          return (
            <Card key={b.id}>
              <CardContent className="space-y-2.5 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{b.guestName}</p>
                    <p className="text-xs text-muted-foreground">{b.guestPhone}</p>
                  </div>
                  <Badge className={badge.className}>{badge.label}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {b.roomName} · {b.units} unit(s) · {format(new Date(b.checkIn), "dd MMM")} →{" "}
                  {format(new Date(b.checkOut), "dd MMM")}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={() => handleStatusChange(b.id, "checked_in")}
                  >
                    Check In
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={() => handleStatusChange(b.id, "checked_out")}
                  >
                    Check Out
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    variant="destructive"
                    onClick={() => handleStatusChange(b.id, "cancelled")}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Booking Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">New Booking</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="b-room">Room</Label>
              <select
                id="b-room"
                value={roomId || rooms[0]?.id || ""}
                onChange={(e) => setRoomId(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.totalUnits} units)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="b-name">Guest Name</Label>
                <Input
                  id="b-name"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-phone">Guest Phone</Label>
                <Input
                  id="b-phone"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="b-in">Check-in</Label>
                <Input
                  id="b-in"
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-out">Check-out</Label>
                <Input
                  id="b-out"
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="b-guests">Guests</Label>
                <Input
                  id="b-guests"
                  type="number"
                  min={1}
                  required
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-units">Units</Label>
                <Input
                  id="b-units"
                  type="number"
                  min={1}
                  required
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="b-notes">Notes (optional)</Label>
              <Textarea
                id="b-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Checking Availability..." : "Confirm Booking"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
