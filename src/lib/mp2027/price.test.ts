import { test } from "node:test";
import assert from "node:assert/strict";
import { mp2027Total, isHighSeason, isValid2027Date, ROUTES } from "./data.ts";

test("mp2027Total adds 5% card fee", () => {
  assert.deepEqual(mp2027Total(1), { subtotal: 380, fee: 19, total: 399 });
  assert.deepEqual(mp2027Total(3), { subtotal: 1140, fee: 57, total: 1197 });
  assert.throws(() => mp2027Total(0));
  assert.throws(() => mp2027Total(11));
  assert.throws(() => mp2027Total(1.5));
});

test("season and date validation", () => {
  assert.equal(isHighSeason("2027-06-15"), true);
  assert.equal(isHighSeason("2027-11-02"), false);
  assert.equal(isValid2027Date("2026-12-31"), false);
  assert.equal(isValid2027Date("2027-02-28"), true);
  assert.equal(isValid2027Date("2027-02-30"), false);
  assert.equal(isValid2027Date("2027-1-5"), false);
});

test("routes: 10 official routes, mountain routes morning only", () => {
  assert.equal(ROUTES.length, 10);
  for (const r of ROUTES.filter((r) => r.mountain)) {
    assert.ok(r.hours.every((h) => h <= "10:00"));
  }
});
