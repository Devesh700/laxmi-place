export type BookingStatus = "confirmed" | "checked_in" | "checked_out" | "cancelled";

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  checkIn: string; // ISO date string YYYY-MM-DD or ISO timestamp
  checkOut: string;
  guests: number;
  units: number;
  status: BookingStatus;
  totalAmount?: number;
  advancePaid?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
