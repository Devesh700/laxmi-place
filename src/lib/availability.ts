import type { AvailabilityBadgeStatus } from "@/types/room";
import type { BookingStatus } from "@/types/booking";

export interface AvailabilityBookingSlice {
  checkIn: Date;
  checkOut: Date;
  units: number;
  status: BookingStatus;
}

/**
 * Pure overlap check:
 * existing.checkIn < new.checkOut && existing.checkOut > new.checkIn
 * Checkout day is not an occupied night.
 */
export function rangesOverlap(
  existingStart: Date,
  existingEnd: Date,
  newStart: Date,
  newEnd: Date
): boolean {
  return existingStart.getTime() < newEnd.getTime() && existingEnd.getTime() > newStart.getTime();
}

export function calculateAvailableUnits(
  totalUnits: number,
  bookings: AvailabilityBookingSlice[],
  checkIn: Date,
  checkOut: Date
): number {
  if (totalUnits <= 0) return 0;
  if (checkIn.getTime() >= checkOut.getTime()) return 0;

  const occupiedUnits = bookings.reduce((sum, booking) => {
    if (booking.status === "cancelled") return sum;
    if (rangesOverlap(booking.checkIn, booking.checkOut, checkIn, checkOut)) {
      return sum + Math.max(1, booking.units);
    }
    return sum;
  }, 0);

  return Math.max(0, totalUnits - occupiedUnits);
}

export function getAvailabilityBadgeStatus(
  totalUnits: number,
  availableUnits: number
): AvailabilityBadgeStatus {
  if (availableUnits <= 0) return "sold_out";
  if (availableUnits === 1 || availableUnits < Math.ceil(totalUnits / 2)) {
    return "limited";
  }
  return "available";
}
