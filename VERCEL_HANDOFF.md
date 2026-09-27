# Expense Tracker: Vercel handoff

Date: 2026-09-27

## Changes
Correct calendar dates across timezones, month-end and leap-year reminders; reject impossible CSV dates; show recent transactions newest first.

## Local validation
Calendar tests: 4 passed in Asia/Tehran and 4 passed in America/Los_Angeles; production build/typecheck passed.

## Deployment
Release through the existing GitHub main branch / Vercel integration. Confirm the exact commit reaches READY and recheck the public alias before treating deployment as complete.

## Scope
Frontend-local financial demo; optional Firebase requires separate configuration. No real payments were made.

## Recovery
Use the previous Vercel deployment or revert the scoped commit. No database migrations or live data changes are included.
