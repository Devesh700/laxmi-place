"use client";

import { useActionState } from "react";
import { KeyRound, Lock } from "lucide-react";
import { loginAdminAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdminAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Lock className="size-5" />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold-text">
            Room Master
          </p>
          <CardTitle className="font-heading text-3xl">Admin Access</CardTitle>
          <CardDescription>
            Enter your `ADMIN_DEV_TOKEN` to manage rooms and bookings.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="token">Access Token</Label>
              <div className="relative">
                <KeyRound className="absolute top-3.5 left-3 size-4 text-muted-foreground" />
                <Input
                  id="token"
                  name="token"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter admin token"
                  className="h-11 rounded-xl pl-10"
                />
              </div>
            </div>

            {state?.error && (
              <p className="text-sm font-medium text-destructive" role="alert">
                {state.error}
              </p>
            )}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Verifying..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
