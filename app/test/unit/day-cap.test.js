import test from "node:test";
import assert from "node:assert/strict";
import { createDayCap, DAY_CAP, dayKey } from "../../src/day-cap.js";

test("charges recorded for a day reduce what is left of the cap", () => {
  const ledger = createDayCap();
  ledger.record("rider-1", "2026-09-16T08:00:00Z", 12000);
  assert.ok(ledger.remaining("rider-1", "2026-09-16T12:00:00Z") < DAY_CAP);
});

test("the day of a ride is the date of its pickup", () => {
  assert.equal(dayKey("2026-09-16T08:00:00Z"), "2026-09-16");
});

// --- Strengthened after the mutation run (Task C) ---

test("nothing is charged on a day with no rides", () => {
  const ledger = createDayCap();
  assert.equal(ledger.chargedOn("rider-1", "2026-09-16"), 0);
  ledger.record("rider-1", "2026-09-16T08:00:00Z", 12000);
  assert.equal(ledger.chargedOn("rider-2", "2026-09-16"), 0);
  assert.equal(ledger.chargedOn("rider-1", "2026-09-17"), 0);
});

test("charges add up per rider and day; remaining is the cap minus them, never below 0", () => {
  const ledger = createDayCap();
  ledger.record("rider-1", "2026-09-16T08:00:00Z", 12000);
  ledger.record("rider-1", "2026-09-16T12:00:00Z", 8000);
  assert.equal(ledger.chargedOn("rider-1", "2026-09-16"), 20000);
  assert.equal(ledger.remaining("rider-1", "2026-09-16T15:00:00Z"), DAY_CAP - 20000);
  ledger.record("rider-1", "2026-09-16T15:00:00Z", 20000);
  assert.equal(ledger.remaining("rider-1", "2026-09-16T18:00:00Z"), 0);
});
