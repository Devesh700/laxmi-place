import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminData } from "@/lib/admin-data";
import { calculateAvailableUnits } from "@/lib/availability";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const { rooms, bookings } = await getAdminData();
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-text">
          Monthly Occupancy
        </p>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {format(now, "MMMM yyyy")}
        </h1>
      </div>

      {rooms.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No rooms configured in Firestore yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">Units Available Per Day</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-card px-3 py-2 text-left font-semibold">Room</th>
                  {days.map((d) => (
                    <th key={d.toISOString()} className="px-1.5 py-2 text-center font-medium">
                      {format(d, "d")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => {
                  const roomBookings = bookings
                    .filter((b) => b.roomId === room.id)
                    .map((b) => ({
                      checkIn: new Date(b.checkIn),
                      checkOut: new Date(b.checkOut),
                      units: b.units,
                      status: b.status,
                    }));

                  return (
                    <tr key={room.id} className="border-t border-border">
                      <td className="sticky left-0 bg-card px-3 py-2 font-medium whitespace-nowrap">
                        {room.name}
                      </td>
                      {days.map((day) => {
                        const nextDay = new Date(day.getTime() + 24 * 60 * 60 * 1000);
                        const free = calculateAvailableUnits(
                          room.totalUnits,
                          roomBookings,
                          day,
                          nextDay
                        );
                        const color =
                          free === 0
                            ? "bg-rose-100 text-rose-800"
                            : free < room.totalUnits
                              ? "bg-amber-100 text-amber-900"
                              : "bg-emerald-100 text-emerald-900";
                        return (
                          <td key={day.toISOString()} className="p-1 text-center">
                            <span
                              className={`inline-flex size-6 items-center justify-center rounded-md font-semibold ${color}`}
                            >
                              {free}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
