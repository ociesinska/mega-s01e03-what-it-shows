import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { causeOf, uniqueById } from './support-kb/src/lib/kb/causes.ts';

const root = path.dirname(fileURLToPath(import.meta.url));
const data = path.join(root, 'support-kb/src/lib/data');
const read = name => JSON.parse(fs.readFileSync(path.join(data, name), 'utf8'));
const rows = read('reports-4471.json');
const reports = uniqueById(rows).filter(r => r.mergedInto === 4471);
const tenants = new Map(fs.readdirSync(path.join(data, 'tenants')).map(name => {
  const tenant = read(`tenants/${name}`);
  return [tenant.handle, tenant];
}));
const anomalies = new Set(read('desk-notes.json').oneDayMove);
const groups = { parser: [], hint: [], timing: [], unplaced: [] };
const classifierCounts = {};
for (const r of reports) {
  const computed = causeOf(r, tenants.get(r.tenant)) ?? 'unplaced';
  classifierCounts[computed] = (classifierCounts[computed] ?? 0) + 1;
  // The existing classifier never reads report bodies. Preserve its result above,
  // but keep the desk's explicit timing anomalies separate for investigation.
  groups[anomalies.has(r.id) ? 'timing' : computed].push(r);
}
const summary = {
  rawRows: rows.length,
  uniqueReports: reports.length,
  classifierCounts,
  proposedTickets: Object.fromEntries(Object.entries(groups).map(([name, rs]) => [name, {
    count: rs.length,
    reportIds: rs.map(r => r.id),
    firstReceived: rs.map(r => r.receivedAt).sort()[0] ?? null,
    lastReceived: rs.map(r => r.receivedAt).sort().at(-1) ?? null,
  }])),
  caveat: 'Timing is a provisional symptom group, not a proven common root cause. Counts describe the 2026-10-04 export only.',
};
const total = Object.values(groups).reduce((n, rs) => n + rs.length, 0);
if (total !== reports.length || groups.unplaced.length) throw new Error('Reports are missing or unplaced');
process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
