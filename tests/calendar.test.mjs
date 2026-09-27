import test from "node:test";
import assert from "node:assert/strict";
import { parseCalendarDate, nextReminderDate, toLocalInputDate } from "../src/utils/calendar.ts";

test("rejects impossible dates instead of rolling them into another month", () => {
  assert.equal(parseCalendarDate("2026-02-30"), null);
  assert.equal(parseCalendarDate("2026-02-29"), null);
  assert.ok(parseCalendarDate("2028-02-29"));
});
test("monthly reminders clamp to the end of February", () => {
  assert.equal(nextReminderDate("2026-01-31", "monthly", ""), "2026-02-28");
  assert.equal(nextReminderDate("2028-01-31", "monthly", ""), "2028-02-29");
});
test("yearly reminders handle leap years and weekly reminders cross year boundaries", () => {
  assert.equal(nextReminderDate("2028-02-29", "yearly", ""), "2029-02-28");
  assert.equal(nextReminderDate("2026-12-28", "weekly", ""), "2027-01-04");
});
test("date inputs retain the local calendar day near midnight", () => {
  assert.equal(toLocalInputDate(new Date(2026, 8, 27, 0, 15)), "2026-09-27");
  assert.equal(toLocalInputDate(new Date(2026, 8, 27, 23, 45)), "2026-09-27");
});
