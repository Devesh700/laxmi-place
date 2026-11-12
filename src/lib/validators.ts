import { z } from "zod";

export const whatsappEnquirySchema = z
  .object({
    name: z.string().trim().max(80).optional(),
    checkIn: z.string().min(1, "Please select a check-in date"),
    checkOut: z.string().min(1, "Please select a check-out date"),
    guests: z.coerce.number().int().min(1, "At least 1 guest").max(12, "Maximum 12 guests"),
    room: z.string().trim().max(100).optional(),
    notes: z.string().trim().max(300).optional(),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "Check-out date must be after check-in date",
    path: ["checkOut"],
  });

export const roomFormSchema = z.object({
  name: z.string().trim().min(2, "Room name is required").max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1500),
  type: z.string().trim().min(2, "Room type is required").max(60),
  pricePerNight: z.coerce.number().int().min(100, "Price must be at least 100 INR"),
  capacity: z.coerce.number().int().min(1).max(12),
  bedType: z.string().trim().min(2, "Bed type is required").max(80),
  sizeSqFt: z.coerce.number().int().min(50).max(5000),
  amenities: z.array(z.string().trim().min(1)).default([]),
  totalUnits: z.coerce.number().int().min(1).max(100),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).default(1),
});

export const bookingFormSchema = z
  .object({
    roomId: z.string().trim().min(1, "Room is required"),
    guestName: z.string().trim().min(2, "Guest name is required").max(100),
    guestPhone: z.string().trim().min(7, "Valid phone number is required").max(20),
    guestEmail: z.string().trim().email("Invalid email").optional().or(z.literal("")),
    checkIn: z.string().min(1, "Check-in date is required"),
    checkOut: z.string().min(1, "Check-out date is required"),
    guests: z.coerce.number().int().min(1).max(20),
    units: z.coerce.number().int().min(1).max(20),
    status: z.enum(["confirmed", "checked_in", "checked_out", "cancelled"]).default("confirmed"),
    totalAmount: z.coerce.number().min(0).optional(),
    advancePaid: z.coerce.number().min(0).optional(),
    notes: z.string().trim().max(500).optional(),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });
