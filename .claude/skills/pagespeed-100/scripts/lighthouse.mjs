// Runs Lighthouse (performance) N times against a URL and prints, per run, the score, the
// five metrics with their sub-scores, the observed (unsimulated) FCP/LCP and the LCP
// breakdown, then the LCP element and the first requests of the waterfall of the last run.
//   node .claude/skills/pagespeed-100/scripts/lighthouse.mjs <url> [runs=3] [mobile|desktop]
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url = 'https://diputnam-ten.vercel.app/', runsArg = '3', form = 'mobile'] = process.argv.slice(2);
const runs = Number(runsArg);
const dir = mkdtempSync(join(tmpdir(), 'lh-'));
const metricKeys = { 'first-contentful-paint': 'FCP', 'largest-contentful-paint': 'LCP', 'total-blocking-time': 'TBT', 'cumulative-layout-shift': 'CLS', 'speed-index': 'SI' };
let last;
for (let n = 1; n <= runs; n++) {
  const out = join(dir, `run-${n}.json`);
  const args = ['--yes', 'lighthouse@latest', url, `--form-factor=${form}`, '--only-categories=performance', '--output=json', `--output-path=${out}`, '--chrome-flags=--headless=new --no-sandbox', '--quiet'];
  if (form === 'mobile') args.push('--screenEmulation.mobile'); else args.push('--screenEmulation.disabled', '--preset=desktop');
  try { execFileSync('npx', args, { stdio: 'ignore', timeout: 300_000 }); } catch { /* lighthouse exits non-zero on trace-engine warnings; the JSON is still written */ }
  const report = JSON.parse(readFileSync(out, 'utf8'));
  last = report;
  const a = report.audits;
  const m = a.metrics?.details?.items?.[0] ?? {};
  const score = Math.round((report.categories.performance.score ?? 0) * 100);
  const metrics = Object.entries(metricKeys).map(([k, label]) => `${label} ${a[k].displayValue} (${a[k].score})`).join('  ');
  const breakdown = (a['lcp-breakdown-insight']?.details?.items?.[0]?.items ?? []).map((it) => `${it.label.replace('Resource load ', 'load ').replace('Element render delay', 'render')} ${Math.round(it.duration)}`).join(' | ');
  console.log(`run ${n}: ${score}  ${metrics}\n        observed FCP ${m.observedFirstContentfulPaint} LCP ${m.observedLargestContentfulPaint}  |  LCP ms: ${breakdown || 'n/a'}`);
}
const a = last.audits;
const node = (a['lcp-discovery-insight']?.details?.items ?? []).find((it) => it.type === 'node');
if (node) console.log(`\nLCP element: ${node.snippet?.slice(0, 160)}`);
console.log('\nwaterfall (first 10):');
for (const r of (a['network-requests']?.details?.items ?? []).slice(0, 10)) {
  console.log(`  ${Math.round(r.networkRequestTime).toString().padStart(5)}→${Math.round(r.networkEndTime).toString().padStart(5)}  ${String(r.transferSize ?? 0).padStart(6)}B  ${(r.priority ?? '').padEnd(8)} ${(r.resourceType ?? '').padEnd(8)} ${r.url.slice(0, 90)}`);
}
console.log(`\nreports in ${dir}`);
