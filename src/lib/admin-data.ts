import "server-only";
import { getAdminDb, isFirebaseConfigured } from "@/lib/firebase-admin";
import type { Booking, BookingStatus } from "@/types/booking";
import type { Room } from "@/types/room";

export async function getAdminData(): Promise<{
  configured: boolean;
  rooms: Room[];
  bookings: Booking[];
}> {
  if (!isFirebaseConfigured()) {
    return { configured: false, rooms: [], bookings: [] };
  }

  const db = getAdminDb();
  const [roomsSnap, bookingsSnap] = await Promise.all([
    db.collection("rooms").orderBy("sortOrder", "asc").get(),
    db.collection("bookings").orderBy("checkIn", "desc").get(),
  ]);

  const rooms: Room[] = roomsSnap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      name: String(d.name ?? ""),
      slug: String(d.slug ?? doc.id),
      description: String(d.description ?? ""),
      type: String(d.type ?? "Standard"),
      pricePerNight: Number(d.pricePerNight ?? 0),
      capacity: Number(d.capacity ?? 2),
      bedType: String(d.bedType ?? "Double Bed"),
      sizeSqFt: Number(d.sizeSqFt ?? 200),
      amenities: Array.isArray(d.amenities) ? d.amenities.map(String) : [],
      images: Array.isArray(d.images) ? d.images : [],
      totalUnits: Number(d.totalUnits ?? 1),
      isActive: Boolean(d.isActive ?? true),
      sortOrder: Number(d.sortOrder ?? 1),
      createdAt: d.createdAt ? String(d.createdAt) : undefined,
      updatedAt: d.updatedAt ? String(d.updatedAt) : undefined,
    };
  });

  const bookings: Booking[] = bookingsSnap.docs.map((doc) => {
    const d = doc.data();
    const checkInDate = d.checkIn?.toDate ? d.checkIn.toDate() : new Date(d.checkIn);
    const checkOutDate = d.checkOut?.toDate ? d.checkOut.toDate() : new Date(d.checkOut);
    return {
      id: doc.id,
      roomId: String(d.roomId ?? ""),
      roomName: String(d.roomName ?? "Room"),
      guestName: String(d.guestName ?? ""),
      guestPhone: String(d.guestPhone ?? ""),
      guestEmail: d.guestEmail ? String(d.guestEmail) : undefined,
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      guests: Number(d.guests ?? 1),
      units: Number(d.units ?? 1),
      status: (d.status as BookingStatus) ?? "confirmed",
      totalAmount: typeof d.totalAmount === "number" ? d.totalAmount : undefined,
      advancePaid: typeof d.advancePaid === "number" ? d.advancePaid : undefined,
      notes: d.notes ? String(d.notes) : undefined,
      createdAt: d.createdAt ? String(d.createdAt) : undefined,
      updatedAt: d.updatedAt ? String(d.updatedAt) : undefined,
    };
  });

  return { configured: true, rooms, bookings };
}
