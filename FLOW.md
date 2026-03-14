# Routing and User Flow

## Routes
- `/`: Entry gate (first-time user -> `/ar-entry`, completed flow -> home dashboard)
- `/ar-entry`: Dummy AR entry page (temporary Unity handoff)
- `/intro`: Intro video transition route
- `/report`: Assessment report (severity, triggers, recommendation, scenes, book CTA)
- `/report-view`: Report view from Home (read-only + back to home)
- `/book-appointment`: Therapist booking flow

## First-time user flow
1. User opens `/` (Vercel link)
2. App redirects to `/ar-entry`
3. User clicks CTA to `/intro?next=/report`
4. Intro video plays
5. App redirects to `/report`
6. User continues to `/book-appointment`
7. Confirm booking opens auth modal, then confirmation modal
8. After confirmation, app sets completion flag and redirects to `/` (home)

## Fresh AR user flow (direct handoff)
1. Unity AR opens `/ar-entry` or `/intro?next=/report`
2. Intro video plays
3. App redirects to `/report`
4. User continues to `/book-appointment`
5. Confirm booking opens auth modal, then confirmation modal
6. After confirmation, app sets completion flag and redirects to `/`

## Returning user flow
1. User opens `/intro?next=/`
2. Intro video plays
3. App redirects to `/`

## Report to booking flow
- `/report` -> CTA to `/book-appointment`
- `/book-appointment` confirm path -> auth -> confirmation -> `router.replace("/")`
- `/` home -> "View full report" -> `/report-view`
