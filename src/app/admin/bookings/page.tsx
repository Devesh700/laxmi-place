import { BookingsManager } from "@/components/admin/BookingsManager";
import { getAdminData } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const { configured, rooms, bookings } = await getAdminData();
  return <BookingsManager initialBookings={bookings} rooms={rooms} configured={configured} />;
}
