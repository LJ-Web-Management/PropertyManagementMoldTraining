# Mold Awareness, Prevention & Remediation — Property Management Landing Page

Standalone marketing landing page for the HAZWOPER-OSHA.com course:
[Mold Awareness, Prevention & Remediation Training for Property Management Teams](https://hazwoper-osha.com/online-courses/mold-awareness-prevention-and-remediation-training-for-property-management-teams).

Pure HTML/CSS/JS, no build step, no dependencies. Meant to be tested/previewed on GitHub (e.g. GitHub Pages) before any backend work is wired up.

## Structure

```
index.html      — page markup/content
css/styles.css  — all styling
js/main.js      — mobile nav toggle, FAQ accordion, enroll form UX
```

## Current state

- Static, self-contained landing page only.
- The "Reserve My Seat" form is **front-end only** — it does not submit anywhere or charge anyone. Submitting just swaps in a confirmation message (see `js/main.js`).
- No Stripe, no course-platform API, no auth, no database.

## Planned next steps (not yet implemented)

1. Connect the enroll form to the HAZWOPER-OSHA course/enrollment API.
2. Add Stripe Checkout (or Stripe Elements) for real payment.
3. Point a real domain at this page via GoDaddy DNS + AWS (or chosen host) once it's off GitHub Pages.

## Local preview

Just open `index.html` in a browser, or serve the folder with any static server, e.g.:

```
npx serve .
```
