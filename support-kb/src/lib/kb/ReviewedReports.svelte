<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { causeOf, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const merged = uniqueById(reports as Report[]).filter(r => r.mergedInto === 4471);
  const timingIds = new Set(notes.oneDayMove);
  const timing = merged.filter(r => timingIds.has(r.id));
  const ordinary = merged.filter(r => !timingIds.has(r.id));
  const groups = [
    { name: 'Parser reads day-first input month first', reports: ordinary.filter(r => causeOf(r, tenantOf(r)) === 'parser') },
    { name: 'booking-v3 hint conflicts with the tenant date order', reports: ordinary.filter(r => causeOf(r, tenantOf(r)) === 'hint') },
    { name: 'Timing anomalies — provisional investigation', reports: timing },
  ];
  const placed = new Set(groups.flatMap(g => g.reports.map(r => r.id)));
  const unplaced = merged.filter(r => !placed.has(r.id));
  const days = merged.map(r => r.receivedAt.slice(0, 10)).sort();
</script>

<p>Export rows: <strong>{reports.length}</strong>; unique reports merged into #4471:
  <strong>{merged.length}</strong>. Received {days[0]} through {days.at(-1)}.</p>

<table>
  <thead><tr><th>Proposed ticket</th><th>Reports</th><th>Distinct tenants</th></tr></thead>
  <tbody>
    {#each groups as g}
      <tr><td>{g.name}</td><td>{g.reports.length}</td><td>{new Set(g.reports.map(r => r.tenant)).size}</td></tr>
    {/each}
  </tbody>
</table>

<p>Unplaced reports: {unplaced.length}. Each report belongs to one proposed ticket.
  The timing group takes precedence over the locale-based classifier; it does not establish a common root cause.</p>

<h3>The timing evidence</h3>
<table>
  <thead><tr><th>ID / received</th><th>Tenant / channel</th><th>Report body, verbatim</th></tr></thead>
  <tbody>
    {#each timing as r}
      <tr><td>{r.id}<br />{r.receivedAt.slice(0, 10)}</td><td>{r.tenant}<br />{r.channel}</td><td>{r.body}</td></tr>
    {/each}
  </tbody>
</table>

<details>
  <summary>Report IDs assigned to each ticket</summary>
  {#each groups as g}
    <h3>{g.name}</h3>
    <p>{g.reports.map(r => r.id).join(', ')}</p>
  {/each}
</details>
