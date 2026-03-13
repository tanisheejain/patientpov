# Routing and User Flow

## Routes
- `/`: Main patient home dashboard (single homepage)
- `/intro`: Intro video transition route
- `/report`: Assessment report (severity, triggers, recommendation, scenes, book CTA)
- `/book-appointment`: Therapist booking flow

## Fresh AR user flow
1. Unity AR opens `/intro?next=/report`
2. Intro video plays
3. App redirects to `/report`
4. User continues to `/book-appointment`
5. Confirm booking opens auth modal, then confirmation modal
6. After confirmation, app redirects to `/`

## Returning user flow
1. User opens `/intro?next=/`
2. Intro video plays
3. App redirects to `/`

## Report to booking flow
- `/report` -> CTA to `/book-appointment`
- `/book-appointment` confirm path -> auth -> confirmation -> `router.replace("/")`
