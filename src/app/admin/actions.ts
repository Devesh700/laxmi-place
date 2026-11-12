"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkLoginRateLimit,
  clearAdminSessionCookie,
  isAdminEnabled,
  requireAdminSession,
  setAdminSessionCookie,
  verifyDevToken,
} from "@/lib/auth";
import { calculateAvailableUnits } from "@/lib/availability";
import { getAdminDb, getAdminStorage, isFirebaseConfigured } from "@/lib/firebase-admin";
import { bookingFormSchema, roomFormSchema } from "@/lib/validators";
import type { BookingStatus } from "@/types/booking";
import type { RoomImage } from "@/types/room";

export async function loginAdminAction(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  if (!isAdminEnabled()) {
    return { error: "Admin access is disabled (ADMIN_DEV_TOKEN is not configured)." };
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkLoginRateLimit(ip)) {
    return { error: "Too many login attempts. Please try again in 15 minutes." };
  }

  const token = String(formData.get("token") ?? "").trim();
  if (!verifyDevToken(token)) {
    return { error: "Invalid access token." };
  }

  await setAdminSessionCookie();
  redirect("/admin");
}

export async function logoutAdminAction() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

function revalidatePublicRoomPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/rooms");
  revalidatePath("/contact");
  if (slug) revalidatePath(`/rooms/${slug}`);
}

export async function saveRoomAction(input: {
  id?: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  bedType: string;
  sizeSqFt: number;
  amenities: string[];
  totalUnits: number;
  isActive: boolean;
  sortOrder: number;
  images: RoomImage[];
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  if (!(await requireAdminSession())) {
    return { ok: false, error: "Unauthorized" };
  }
  if (!isFirebaseConfigured()) {
    return { ok: false, error: "Firebase Admin is not configured in .env.local." };
  }

  const parsed = roomFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid room data" };
  }

  const db = getAdminDb();
  const now = new Date().toISOString();
  const payload = {
    ...parsed.data,
    images: input.images,
    updatedAt: now,
  };

  if (input.id) {
    await db.collection("rooms").doc(input.id).update(payload);
    revalidatePublicRoomPaths(parsed.data.slug);
    revalidatePath("/admin/rooms");
    return { ok: true, id: input.id };
  } else {
    const docRef = await db.collection("rooms").add({
      ...payload,
      createdAt: now,
    });
    revalidatePublicRoomPaths(parsed.data.slug);
    revalidatePath("/admin/rooms");
    return { ok: true, id: docRef.id };
  }
}

export async function toggleRoomActiveAction(
  id: string,
  isActive: boolean,
  slug?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!(await requireAdminSession())) return { ok: false, error: "Unauthorized" };
  if (!isFirebaseConfigured()) return { ok: false, error: "Firebase not configured" };

  await getAdminDb().collection("rooms").doc(id).update({
    isActive,
    updatedAt: new Date().toISOString(),
  });
  revalidatePublicRoomPaths(slug);
  revalidatePath("/admin/rooms");
  return { ok: true };
}

export async function reorderRoomAction(
  id: string,
  newOrder: number
): Promise<{ ok: boolean; error?: string }> {
  if (!(await requireAdminSession())) return { ok: false, error: "Unauthorized" };
  if (!isFirebaseConfigured()) return { ok: false, error: "Firebase not configured" };

  await getAdminDb().collection("rooms").doc(id).update({
    sortOrder: newOrder,
    updatedAt: new Date().toISOString(),
  });
  revalidatePublicRoomPaths();
  revalidatePath("/admin/rooms");
  return { ok: true };
}

export async function deleteRoomAction(
  id: string,
  images: RoomImage[],
  slug?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!(await requireAdminSession())) return { ok: false, error: "Unauthorized" };
  if (!isFirebaseConfigured()) return { ok: false, error: "Firebase not configured" };

  const storage = getAdminStorage();
  const bucket = storage.bucket();

  for (const img of images) {
    if (img.path && img.path.startsWith("rooms/")) {
      await bucket.file(img.path).delete({ ignoreNotFound: true }).catch(() => {});
    }
  }

  await getAdminDb().collection("rooms").doc(id).delete();
  revalidatePublicRoomPaths(slug);
  revalidatePath("/admin/rooms");
  return { ok: true };
}

export async function uploadRoomImageAction(formData: FormData): Promise<{
  ok: boolean;
  error?: string;
  image?: RoomImage;
}> {
  if (!(await requireAdminSession())) return { ok: false, error: "Unauthorized" };
  if (!isFirebaseConfigured()) return { ok: false, error: "Firebase not configured" };

  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "Room photo").trim() || "Room photo";

  if (!(file instanceof File)) {
    return { ok: false, error: "No image file provided" };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { ok: false, error: "Only JPEG, PNG, and WebP images are allowed." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "Image must be 5MB or smaller." };
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `rooms/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const bucket = getAdminStorage().bucket();
  const storageFile = bucket.file(path);
  await storageFile.save(buffer, {
    metadata: { contentType: file.type },
    public: true,
  });

  const url = `https://storage.googleapis.com/${bucket.name}/${path}`;
  return { ok: true, image: { url, path, alt } };
}

export async function deleteStorageImageAction(path: string): Promise<{ ok: boolean }> {
  if (!(await requireAdminSession())) return { ok: false };
  if (!isFirebaseConfigured() || !path.startsWith("rooms/")) return { ok: true };

  await getAdminStorage().bucket().file(path).delete({ ignoreNotFound: true }).catch(() => {});
  return { ok: true };
}

export async function createBookingAction(input: {
  roomId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  units: number;
  status: BookingStatus;
  totalAmount?: number;
  advancePaid?: number;
  notes?: string;
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  if (!(await requireAdminSession())) return { ok: false, error: "Unauthorized" };
  if (!isFirebaseConfigured()) return { ok: false, error: "Firebase not configured" };

  const parsed = bookingFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid booking data" };
  }

  const db = getAdminDb();
  const roomDoc = await db.collection("rooms").doc(parsed.data.roomId).get();
  if (!roomDoc.exists) {
    return { ok: false, error: "Selected room does not exist." };
  }

  const roomData = roomDoc.data()!;
  const totalUnits = Number(roomData.totalUnits ?? 1);
  const roomName = String(roomData.name ?? "Room");
  const roomSlug = String(roomData.slug ?? "");

  const newCheckIn = new Date(parsed.data.checkIn);
  const newCheckOut = new Date(parsed.data.checkOut);

  const existingBookingsSnap = await db
    .collection("bookings")
    .where("roomId", "==", parsed.data.roomId)
    .get();

  const slices = existingBookingsSnap.docs.map((doc) => {
    const d = doc.data();
    return {
      checkIn: d.checkIn?.toDate ? d.checkIn.toDate() : new Date(d.checkIn),
      checkOut: d.checkOut?.toDate ? d.checkOut.toDate() : new Date(d.checkOut),
      units: Number(d.units ?? 1),
      status: d.status as BookingStatus,
    };
  });

  const available = calculateAvailableUnits(totalUnits, slices, newCheckIn, newCheckOut);
  if (available < parsed.data.units) {
    return {
      ok: false,
      error: `Only ${available} unit(s) available for ${roomName} on selected dates.`,
    };
  }

  const now = new Date().toISOString();
  const docRef = await db.collection("bookings").add({
    roomId: parsed.data.roomId,
    roomName,
    guestName: parsed.data.guestName,
    guestPhone: parsed.data.guestPhone,
    guestEmail: parsed.data.guestEmail || null,
    checkIn: newCheckIn,
    checkOut: newCheckOut,
    guests: parsed.data.guests,
    units: parsed.data.units,
    status: parsed.data.status,
    totalAmount: parsed.data.totalAmount ?? null,
    advancePaid: parsed.data.advancePaid ?? null,
    notes: parsed.data.notes || null,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePublicRoomPaths(roomSlug);
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
  return { ok: true, id: docRef.id };
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: BookingStatus
): Promise<{ ok: boolean; error?: string }> {
  if (!(await requireAdminSession())) return { ok: false, error: "Unauthorized" };
  if (!isFirebaseConfigured()) return { ok: false, error: "Firebase not configured" };

  await getAdminDb().collection("bookings").doc(bookingId).update({
    status,
    updatedAt: new Date().toISOString(),
  });

  revalidatePublicRoomPaths();
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
  return { ok: true };
}
