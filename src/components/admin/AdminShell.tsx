"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  CalendarCheck,
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
} from "lucide-react";
import { logoutAdminAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  const NavContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        <div className="border-b border-border pb-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold-text">
            Room Master
          </p>
          <p className="font-heading text-xl font-bold text-primary">Laxmi Chandra Palace</p>
        </div>

        <nav aria-label="Admin navigation" className="space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 border-t border-border pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex h-10 items-center gap-2.5 rounded-xl px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="size-3.5" />
          <span>View Public Site</span>
        </Link>
        <form action={logoutAdminAction}>
          <Button type="submit" variant="outline" className="w-full justify-start gap-2.5">
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden border-r border-border bg-card lg:block">
        <NavContent />
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Mobile admin header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold-text">
              Room Master
            </p>
            <p className="font-heading text-lg font-bold text-primary">Admin</p>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="outline" size="icon" aria-label="Open admin menu" />}>
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-card p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Admin Navigation</SheetTitle>
              </SheetHeader>
              <NavContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        <main id="main-content" className="flex-1 p-5 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
