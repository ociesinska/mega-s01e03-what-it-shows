# Shared parser swaps day and month for day-first tenant input

Reports covered: **374** unique reports from #4471 in the 2026-10-04 export.

The shared parser reads input month first, although these tenants use day-first dates.
Example: R-41200 (harbour.dental, app) reports 7 April becoming 4 July;
R-41203 (lantern.row, app) reports 2 December becoming 12 February.

Expected: preserve the intended calendar date according to the channel's documented input
contract. Actual: day and month swap on ambiguous numeric dates.

Reproduce with a day-first tenant, e.g. en-GB, and submit 07/04/2026 through an affected
channel. Check the parsed date and generated invite, not just the input field. Include
unambiguous dates with days above 12 and a month-first locale as regression cases.

Allocation: deduplicate by report ID, restrict to mergedInto=4471, derive the cause from the
tenant directory and causes.ts, then exclude the five explicitly identified timing anomalies.
The existing classifier's parser total is 379 before that exclusion. Counts and complete ID
membership are reproducible with `node audit.mjs` and in the signed KB review.

Do not include the 33 booking-v3 form-hint reports or the five provisional timing reports.
Fixing this parser does not establish that those investigations are resolved. Verify against
the live queue before treating the snapshot count as current.

Proposed acceptance: document the date-input contract; parse consistently with it; test the
resulting invite and reject unsupported input rather than silently interpreting it differently.
