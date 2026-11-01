# S01E03 — review of support ticket #4471

Local work for the MEGA.dev challenge. The support data and existing KB sources are a course
fixture exported on 2026-10-04, not reports about real customers.

## Evidence and proposals

- `audit.mjs`: reproduce unique report membership using the supplied classifier and tenant directory.
- `drafts/`: three proposed GitHub issue bodies, including a provisional timing investigation.
- `support-kb/src/routes/kb/incidents/4471-review/+page.svx`: signed KB review.
- `support-kb/src/lib/kb/ReviewedReports.svelte`: computed allocation and verbatim timing evidence.

Run `node audit.mjs` from this directory (Node with TypeScript stripping support).
The export contains 427 rows representing 412 unique report IDs. The original classifier
allocates 379 to parser and 33 to hint. Separating five timing anomalies yields the proposed
374 / 33 / 5 ticket allocation, with no report counted twice.

## Render the KB

After installing the declared local development dependencies in `support-kb`, run `npm run build`
there. This compiles the actual .svx and Svelte components and renders HTML to `support-kb/rendered`.
It does not deploy anything. The output is a static rendering: the dedupe explorer shows its
initial computed state, and its controls are not hydrated. The source remains interactive in
the desk's Svelte application. Tables, charts, styles, and the signature stamp render to HTML.

Serve that output locally from its root to follow the KB's absolute navigation links.
The review is at `/kb/incidents/4471-review/`.

No live ticket status, confirmed common cause for the timing anomalies, or support approval
of the proposed triage rule is implied. Reconcile the export with the desk's current queue.
