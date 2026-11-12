import Link from "next/link";
import { AlertTriangle, BedDouble, CalendarCheck, LogIn, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminData } from "@/lib/admin-data";
import { calculateAvailableUnits } from "@/lib/availability";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { configured, rooms, bookings } = await getAdminData();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const totalUnits = rooms.filter((r) => r.isActive).reduce((sum, r) => sum + r.totalUnits, 0);

  const freeUnitsTonight = rooms
    .filter((r) => r.isActive)
    .reduce((sum, room) => {
      const roomBookings = bookings
        .filter((b) => b.roomId === room.id)
        .map((b) => ({
          checkIn: new Date(b.checkIn),
          checkOut: new Date(b.checkOut),
          units: b.units,
          status: b.status,
        }));
      return sum + calculateAvailableUnits(room.totalUnits, roomBookings, todayStart, tomorrowStart);
    }, 0);

  const occupiedUnitsTonight = Math.max(0, totalUnits - freeUnitsTonight);

  const isSameDay = (iso: string) => {
    const d = new Date(iso);
    return (
      d.getFullYear() === todayStart.getFullYear() &&
      d.getMonth() === todayStart.getMonth() &&
      d.getDate() === todayStart.getDate()
    );
  };

  const checkInsToday = bookings.filter(
    (b) => b.status !== "cancelled" && isSameDay(b.checkIn)
  ).length;

  const checkOutsToday = bookings.filter(
    (b) => b.status !== "cancelled" && isSameDay(b.checkOut)
  ).length;

  const stats = [
    {
      label: "Units Free Tonight",
      value: freeUnitsTonight,
      icon: BedDouble,
      chipClass: "bg-emerald-600/12 text-emerald-700 border-emerald-600/25",
    },
    {
      label: "Units Occupied Tonight",
      value: occupiedUnitsTonight,
      icon: CalendarCheck,
      chipClass: "bg-amber-500/15 text-amber-800 border-amber-500/30",
    },
    {
      label: "Check-ins Today",
      value: checkInsToday,
      icon: LogIn,
      chipClass: "bg-blue-600/12 text-blue-700 border-blue-600/25",
    },
    {
      label: "Check-outs Today",
      value: checkOutsToday,
      icon: LogOut,
      chipClass: "bg-primary/10 text-primary border-primary/25",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-text">
            Today&apos;s Snapshot
          </p>
          <h1 className="font-heading text-3xl font-bold text-foreground">Room Master</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/rooms"
            className="inline-flex h-11 items-center rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-muted"
          >
            Manage Rooms
          </Link>
          <Link
            href="/admin/bookings"
            className="inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            New Booking
          </Link>
        </div>
      </div>

      {!configured && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-50 p-4 text-sm text-amber-950">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" />
          <div>
            <p className="font-semibold">Firebase Admin is not configured yet</p>
            <p className="mt-0.5 text-amber-900">
              Add <code>FIREBASE_PROJECT_ID</code>, <code>FIREBASE_CLIENT_EMAIL</code>,{" "}
              <code>FIREBASE_PRIVATE_KEY</code>, and <code>FIREBASE_STORAGE_BUCKET</code> to{" "}
              <code>.env.local</code> to enable persistent rooms and bookings.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3.5 pt-1">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border ${stat.chipClass}`}
                >
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
