# booking-v3 displays a month-first hint for day-first tenants

Reports covered: **33** unique reports from #4471 in the 2026-10-04 export.

For day-first tenants, booking-v3 prints MM/DD/YYYY while the form reads tenant-order dates.
People who follow the hint can therefore receive a booking with day and month swapped.
The affected form tenants in the directory are alder.physio, copper.studio, and pale.harbour.

Example: R-41230 (copper.studio, form) reports 6 January versus 1 June. Its intake tag says
parser, but its tenant/form/channel combination points to the misleading hint.

Expected: the displayed format and the parser agree with the tenant's date convention.
Reproduce in a day-first booking-v3 tenant by entering an ambiguous date according to the
displayed hint; compare the submitted value, stored date, and resulting invite.

Allocation: deduplicate IDs, restrict to mergedInto=4471, and evaluate causes.ts using the
tenant directory: day-first locale, form channel, booking-v3. Do not count browser locale
or intake tags as authoritative. Reproduce counts and ID membership with `node audit.mjs`.

Proposed acceptance: localize the hint and parsing contract together; verify booking-v2 and
booking-v3, day-first and month-first locales, ambiguous and unambiguous dates. Track the
shared-parser and timing investigations separately. Reconcile this snapshot with the live queue.
