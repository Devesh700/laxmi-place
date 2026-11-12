import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY.");
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

const db = getFirestore();

// NOTE: Sample placeholder rooms — replace with real hotel inventory in Room Master (/admin/rooms)
const sampleRooms = [
  {
    name: "Deluxe Heritage Room",
    slug: "deluxe-heritage-room",
    description:
      "SAMPLE DATA: Comfortable air-conditioned room with queen bed, warm lighting, and attached bath.",
    type: "Deluxe",
    pricePerNight: 2499,
    capacity: 2,
    bedType: "Queen Bed",
    sizeSqFt: 240,
    amenities: ["Free Wi-Fi", "Air Conditioning", "LED TV", "24x7 Room Service"],
    images: [
      { url: "/assets/hotel-02.jpeg", path: "local/hotel-02.jpeg", alt: "Deluxe Heritage Room" },
      { url: "/assets/hotel-03.jpeg", path: "local/hotel-03.jpeg", alt: "Deluxe Room interior" },
    ],
    totalUnits: 6,
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Super Deluxe Twin / King",
    slug: "super-deluxe-room",
    description:
      "SAMPLE DATA: Spacious room ideal for families or business travellers with quiet seating.",
    type: "Super Deluxe",
    pricePerNight: 3299,
    capacity: 3,
    bedType: "King Bed",
    sizeSqFt: 310,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Tea/Coffee Maker", "Work Desk"],
    images: [
      { url: "/assets/hotel-04.jpeg", path: "local/hotel-04.jpeg", alt: "Super Deluxe Room" },
      { url: "/assets/hotel-11.jpeg", path: "local/hotel-11.jpeg", alt: "Super Deluxe furnishings" },
    ],
    totalUnits: 4,
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Palace Family Suite",
    slug: "palace-family-suite",
    description:
      "SAMPLE DATA: Largest suite designed for family stays with a separate lounge corner.",
    type: "Suite",
    pricePerNight: 4499,
    capacity: 4,
    bedType: "1 King + Lounge",
    sizeSqFt: 420,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Lounge Area", "Mini Fridge", "Parking"],
    images: [
      { url: "/assets/hotel-13.jpeg", path: "local/hotel-13.jpeg", alt: "Palace Family Suite" },
      { url: "/assets/hotel-17.jpeg", path: "local/hotel-17.jpeg", alt: "Palace Suite view" },
    ],
    totalUnits: 2,
    isActive: true,
    sortOrder: 3,
  },
];

async function main() {
  const now = new Date().toISOString();
  for (const room of sampleRooms) {
    await db
      .collection("rooms")
      .doc(room.slug)
      .set({ ...room, createdAt: now, updatedAt: now }, { merge: true });
    console.log(`Seeded room: ${room.name}`);
  }
  console.log("Done seeding 3 sample rooms.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
