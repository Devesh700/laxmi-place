import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateAvailableUnits,
  getAvailabilityBadgeStatus,
  rangesOverlap,
} from "../src/lib/availability";

test("rangesOverlap follows half-open [checkIn, checkOut) rule", () => {
  const d10 = new Date("2026-11-10T00:00:00Z");
  const d12 = new Date("2026-11-12T00:00:00Z");
  const d14 = new Date("2026-11-14T00:00:00Z");

  // Checkout day (Nov 12) is not an occupied night for a new check-in on Nov 12
  assert.equal(rangesOverlap(d10, d12, d12, d14), false);
  // Overlapping range
  assert.equal(rangesOverlap(d10, new Date("2026-11-13T00:00:00Z"), d12, d14), true);
});

test("calculateAvailableUnits ignores cancelled bookings and sums overlapping units", () => {
  const checkIn = new Date("2026-11-10T00:00:00Z");
  const checkOut = new Date("2026-11-12T00:00:00Z");

  const available = calculateAvailableUnits(
    5,
    [
      {
        checkIn: new Date("2026-11-09T00:00:00Z"),
        checkOut: new Date("2026-11-11T00:00:00Z"),
        units: 2,
        status: "confirmed",
      },
      {
        checkIn: new Date("2026-11-10T00:00:00Z"),
        checkOut: new Date("2026-11-12T00:00:00Z"),
        units: 2,
        status: "cancelled",
      },
      {
        checkIn: new Date("2026-11-12T00:00:00Z"),
        checkOut: new Date("2026-11-15T00:00:00Z"),
        units: 1,
        status: "checked_in",
      },
    ],
    checkIn,
    checkOut
  );

  assert.equal(available, 3);
});

test("getAvailabilityBadgeStatus maps counts to available / limited / sold_out", () => {
  assert.equal(getAvailabilityBadgeStatus(4, 4), "available");
  assert.equal(getAvailabilityBadgeStatus(4, 1), "limited");
  assert.equal(getAvailabilityBadgeStatus(4, 0), "sold_out");
});
