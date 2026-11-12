export interface RoomImage {
  url: string;
  path: string;
  alt: string;
}

export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  bedType: string;
  sizeSqFt: number;
  amenities: string[];
  images: RoomImage[];
  totalUnits: number;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export type AvailabilityBadgeStatus = "available" | "limited" | "sold_out";
