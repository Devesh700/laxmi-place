import type { AvailabilityBadgeStatus, Room } from "@/types/room";
import { calculateAvailableUnits, getAvailabilityBadgeStatus } from "@/lib/availability";
import type { BookingStatus } from "@/types/booking";

export interface RoomWithAvailability extends Room {
  tonightStatus: AvailabilityBadgeStatus;
}

/**
 * Sample fallback rooms (used when Firestore env vars are not yet configured).
 * Marked clearly so the site builds and renders with real local images.
 */
export const SAMPLE_ROOMS: Room[] = [
  {
    id: "sample-deluxe",
    name: "Deluxe Heritage Room", // TODO(owner): Replace with actual room name
    slug: "deluxe-heritage-room",
    description:
      "TODO(owner): Warm, air-conditioned guest room featuring comfortable bedding, soft lighting, and attached modern bath.",
    type: "Deluxe",
    pricePerNight: 2499, // TODO(owner): Replace with actual INR tariff
    capacity: 2,
    bedType: "Queen Bed",
    sizeSqFt: 240,
    amenities: ["Free Wi-Fi", "Air Conditioning", "LED TV", "24x7 Room Service"],
    images: [
      {
        url: "/assets/hotel-02.jpeg",
        path: "local/hotel-02.jpeg",
        alt: "Deluxe Heritage Room main view",
      },
      {
        url: "/assets/hotel-03.jpeg",
        path: "local/hotel-03.jpeg",
        alt: "Deluxe Heritage Room interior detail",
      },
      {
        url: "/assets/hotel-10.jpeg",
        path: "local/hotel-10.jpeg",
        alt: "Deluxe Heritage Room seating and lighting",
      },
    ],
    totalUnits: 6,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "sample-super-deluxe",
    name: "Super Deluxe Twin / King", // TODO(owner): Replace with actual room name
    slug: "super-deluxe-room",
    description:
      "TODO(owner): Spacious room ideal for families or business travellers, with extra seating and quiet courtyard views.",
    type: "Super Deluxe",
    pricePerNight: 3299, // TODO(owner): Replace with actual INR tariff
    capacity: 3,
    bedType: "King Bed",
    sizeSqFt: 310,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Tea/Coffee Maker", "Work Desk", "Hot Shower"],
    images: [
      {
        url: "/assets/hotel-04.jpeg",
        path: "local/hotel-04.jpeg",
        alt: "Super Deluxe Room spacious layout",
      },
      {
        url: "/assets/hotel-11.jpeg",
        path: "local/hotel-11.jpeg",
        alt: "Super Deluxe Room furnishings",
      },
      {
        url: "/assets/hotel-15.jpeg",
        path: "local/hotel-15.jpeg",
        alt: "Super Deluxe Room bedding",
      },
    ],
    totalUnits: 4,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "sample-family-suite",
    name: "Palace Family Suite", // TODO(owner): Replace with actual room name
    slug: "palace-family-suite",
    description:
      "TODO(owner): Our largest suite designed for family stays, featuring a separate lounge corner and priority dining service.",
    type: "Suite",
    pricePerNight: 4499, // TODO(owner): Replace with actual INR tariff
    capacity: 4,
    bedType: "1 King + Lounge",
    sizeSqFt: 420,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Lounge Area", "Mini Fridge", "Parking Included"],
    images: [
      {
        url: "/assets/hotel-13.jpeg",
        path: "local/hotel-13.jpeg",
        alt: "Palace Family Suite lounge and bedroom",
      },
      {
        url: "/assets/hotel-17.jpeg",
        path: "local/hotel-17.jpeg",
        alt: "Palace Family Suite spacious view",
      },
      {
        url: "/assets/hotel-16.jpeg",
        path: "local/hotel-16.jpeg",
        alt: "Palace Family Suite corridor access",
      },
    ],
    totalUnits: 2,
    isActive: true,
    sortOrder: 3,
  },
];

export async function getPublicRoomsWithAvailability(): Promise<RoomWithAvailability[]> {
  try {
    const { isFirebaseConfigured, getAdminDb } = await import("@/lib/firebase-admin");
    if (!isFirebaseConfigured()) {
      return SAMPLE_ROOMS.map((room) => ({ ...room, tonightStatus: "available" }));
    }

    const db = getAdminDb();
    const roomsSnap = await db
      .collection("rooms")
      .where("isActive", "==", true)
      .orderBy("sortOrder", "asc")
      .get();

    if (roomsSnap.empty) {
      return SAMPLE_ROOMS.map((room) => ({ ...room, tonightStatus: "available" }));
    }

    const now = new Date();
    const tonightStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(tonightStart.getTime() + 24 * 60 * 60 * 1000);

    const bookingsSnap = await db
      .collection("bookings")
      .where("status", "in", ["confirmed", "checked_in"])
      .get();

    const bookingsByRoom = new Map<
      string,
      Array<{ checkIn: Date; checkOut: Date; units: number; status: BookingStatus }>
    >();

    for (const doc of bookingsSnap.docs) {
      const data = doc.data();
      const checkInDate = data.checkIn?.toDate ? data.checkIn.toDate() : new Date(data.checkIn);
      const checkOutDate = data.checkOut?.toDate ? data.checkOut.toDate() : new Date(data.checkOut);
      const list = bookingsByRoom.get(data.roomId) ?? [];
      list.push({
        checkIn: checkInDate,
        checkOut: checkOutDate,
        units: Number(data.units ?? 1),
        status: data.status as BookingStatus,
      });
      bookingsByRoom.set(data.roomId, list);
    }

    return roomsSnap.docs.map((doc) => {
      const data = doc.data();
      const room: Room = {
        id: doc.id,
        name: String(data.name ?? ""),
        slug: String(data.slug ?? doc.id),
        description: String(data.description ?? ""),
        type: String(data.type ?? "Standard"),
        pricePerNight: Number(data.pricePerNight ?? 0),
        capacity: Number(data.capacity ?? 2),
        bedType: String(data.bedType ?? "Double Bed"),
        sizeSqFt: Number(data.sizeSqFt ?? 200),
        amenities: Array.isArray(data.amenities) ? data.amenities.map(String) : [],
        images: Array.isArray(data.images) ? data.images : [],
        totalUnits: Number(data.totalUnits ?? 1),
        isActive: Boolean(data.isActive ?? true),
        sortOrder: Number(data.sortOrder ?? 1),
      };

      const roomBookings = bookingsByRoom.get(room.id) ?? [];
      const availableTonight = calculateAvailableUnits(
        room.totalUnits,
        roomBookings,
        tonightStart,
        tomorrowStart
      );

      return {
        ...room,
        tonightStatus: getAvailabilityBadgeStatus(room.totalUnits, availableTonight),
      };
    });
  } catch {
    return SAMPLE_ROOMS.map((room) => ({ ...room, tonightStatus: "available" }));
  }
}

export async function getPublicRoomBySlug(slug: string): Promise<RoomWithAvailability | null> {
  const rooms = await getPublicRoomsWithAvailability();
  return rooms.find((room) => room.slug === slug) ?? null;
}
