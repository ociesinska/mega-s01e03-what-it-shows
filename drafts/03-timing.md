# Investigate timing anomalies merged into #4471 (root cause unconfirmed)

Reports covered: **5** unique reports in the 2026-10-04 export, grouped provisionally.

These symptoms are not explained by the documented month/day swap:

| Report | Tenant / channel | Evidence |
| --- | --- | --- |
| R-41202 | kettle.books / email | Invite says 12 May; calendar says 11 May. |
| R-41209 | alder.physio / app | Every June booking is one day off; only June. |
| R-41236 | nine.lanterns / app | Invite arrived before the booking was made. |
| R-41344 | pale.harbour / email | Same meeting shows Tuesday in Lisbon and Monday in Toronto. |
| R-41620 | lantern.row / email | Tuesday 6 October appeared as Monday. |

Expected: the intended event date survives display and delivery; an invite corresponds to an
existing booking. Establish exact expected behavior from each reporter and the product contract.

Time-zone conversion, date-only handling, scheduling, or delivery ordering are hypotheses.
There is insufficient evidence to establish one common cause or a reliable reproduction.
In particular, early invite delivery may need its own ticket once investigated.

Request booking/event IDs, creation and send timestamps with UTC offsets, tenant/recipient
time zones, original invite payloads, calendar settings, and delivery logs. Reproduce all five
symptoms, including June-only behavior, before selecting a fix. Split into linked tickets if
different mechanisms are demonstrated.

The five IDs are listed in desk-notes.json. causes.ts places them in parser because it never
reads bodies. Exclude them from the parser ticket to avoid double counting: 374 + 33 + 5 = 412.
This is an investigation bucket, not a confirmed timezone defect. The desk's live state may
have changed since the export.
