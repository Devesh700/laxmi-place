import { siteConfig } from "@/config/site";

export interface WhatsAppEnquiryParams {
  room?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number | string;
  name?: string;
  notes?: string;
  purpose?: "room" | "table" | "general";
}

export function buildWhatsAppLink(params: WhatsAppEnquiryParams = {}): string {
  const cleanNumber = siteConfig.whatsappNumber.replace(/\D/g, "");
  const lines: string[] = [];

  if (params.purpose === "table") {
    lines.push(`Hello ${siteConfig.name}, I'd like to reserve a table at ${siteConfig.restaurant.name}.`);
  } else if (params.purpose === "general" && !params.room && !params.checkIn) {
    lines.push(`Hello ${siteConfig.name}, I'd like to enquire about a stay.`);
  } else {
    lines.push(`Hello ${siteConfig.name}, I'd like to enquire about a room.`);
  }

  if (params.room) lines.push(`Room: ${params.room}`);
  if (params.checkIn) lines.push(`Check-in: ${params.checkIn}`);
  if (params.checkOut) lines.push(`Check-out: ${params.checkOut}`);
  if (params.guests) lines.push(`Guests: ${params.guests}`);
  if (params.name) lines.push(`Name: ${params.name}`);
  if (params.notes) lines.push(`Notes: ${params.notes}`);

  const message = lines.join("\n");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
