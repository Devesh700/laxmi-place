import { RoomsManager } from "@/components/admin/RoomsManager";
import { getAdminData } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  const { configured, rooms } = await getAdminData();
  return <RoomsManager initialRooms={rooms} configured={configured} />;
}
