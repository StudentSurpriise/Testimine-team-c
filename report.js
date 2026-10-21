// Builds a human-readable test report (Markdown) from Playwright's JSON output.
//
//   npx playwright test            → writes test-results/results.json (see playwright.config.ts → reporter json)
//   node report.js                 → writes TEST-REPORT.md and prints it
//   node report.js --short         → only the summary block (for a PR comment or CI summary)
//
// The script answers three questions a manager asks: how many tests, how many red, what exactly is red.
// Everything in the report comes from results.json – nothing is typed by hand.

const fs = require('fs');

const file = 'test-results/results.json';
if (!fs.existsSync(file)) {
  console.error(`No ${file}. Run "npx playwright test" first.`);
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const short = process.argv.includes('--short');

// 1. Flatten the suite tree into a list of test results.
const strip = (text) => text.replace(/\u001b\[[0-9;]*m/g, '');   // remove terminal colour codes
// 'Expected: 404 / Received: 200' is what a reader needs – not the whole stack trace.
function summarizeError(message) {
  const clean = strip(message).split('\n').map((l) => l.trim());
  const exp = clean.find((l) => /^Expected:/.test(l));
  const rec = clean.find((l) => /^Received:/.test(l));
  if (exp && rec) return `${exp} · ${rec}`;
  // diff-style output ("- Expected substring" / "+ Received string"): take the first - and + lines with content
  const minus = clean.find((l) => /^-\s+\S/.test(l) && !/^- Expected/.test(l));
  const plus = clean.find((l) => /^\+\s+\S/.test(l) && !/^\+ Received/.test(l));
  if (minus && plus) return `Expected: ${minus.slice(1).trim()} · Received: ${plus.slice(1).trim()}`;
  return clean[0];
}

const tests = [];
function walk(suite, path) {
  for (const spec of suite.specs || []) {
    for (const t of spec.tests) {
      const last = t.results[t.results.length - 1];
      tests.push({
        file: spec.file,
        title: [...path, spec.title].join(' › '),
        id: (spec.title.match(/^(TC|UI|FLAKY)-\d+/) || [''])[0],
        project: t.projectName,
        status: t.status,                 // expected | unexpected | flaky | skipped
        outcome: last.status,             // passed | failed | timedOut | skipped
        duration: last.duration,
        retries: t.results.length - 1,
        error: last.error ? summarizeError(last.error.message) : '',
      });
    }
  }
  for (const child of suite.suites || []) walk(child, [...path, child.title]);
}
for (const s of data.suites) walk(s, []);

// 2. Numbers.
const { expected, unexpected, flaky, skipped, duration } = data.stats;
const total = expected + unexpected + flaky + skipped;
const passRate = total ? Math.round((100 * (expected + flaky)) / total) : 0;
const verdict = unexpected === 0 ? 'GREEN – release candidate' : `RED – ${unexpected} failing test(s), do not release`;
const byProject = {};
for (const t of tests) {
  const p = (byProject[t.project] ||= { passed: 0, failed: 0, flaky: 0, skipped: 0 });
  if (t.status === 'expected') p.passed++;
  else if (t.status === 'unexpected') p.failed++;
  else if (t.status === 'flaky') p.flaky++;
  else p.skipped++;
}
const failed = tests.filter((t) => t.status === 'unexpected');
const slowest = [...tests].sort((a, b) => b.duration - a.duration).slice(0, 3);
const sec = (ms) => (ms / 1000).toFixed(1) + ' s';
const when = new Date(data.stats.startTime).toLocaleString('en-GB', { timeZone: 'Europe/Tallinn' });

// 3. Markdown.
const lines = [];
lines.push(`# Test report – ${when}`, '');
lines.push(`**Verdict: ${verdict}**`, '');
lines.push('| Total | Passed | Failed | Flaky | Skipped | Pass rate | Duration |');
lines.push('|---|---|---|---|---|---|---|');
lines.push(`| ${total} | ${expected} | ${unexpected} | ${flaky} | ${skipped} | ${passRate} % | ${sec(duration)} |`, '');

if (!short) {
  lines.push('## By project', '');
  lines.push('| Project | Passed | Failed | Flaky | Skipped |');
  lines.push('|---|---|---|---|---|');
  for (const [name, p] of Object.entries(byProject)) lines.push(`| ${name} | ${p.passed} | ${p.failed} | ${p.flaky} | ${p.skipped} |`);
  lines.push('');
}

lines.push(`## Failed tests (${failed.length})`, '');
if (failed.length === 0) lines.push('None.', '');
else {
  lines.push('| ID | Test | Project | File | Error |');
  lines.push('|---|---|---|---|---|');
  for (const t of failed) lines.push(`| ${t.id} | ${t.title} | ${t.project} | ${t.file} | ${t.error.replace(/\|/g, '\\|')} |`);
  lines.push('');
}

if (!short) {
  const flakyTests = tests.filter((t) => t.status === 'flaky');
  if (flakyTests.length) {
    lines.push(`## Flaky tests (${flakyTests.length}) – passed only after a retry`, '');
    for (const t of flakyTests) lines.push(`- ${t.id} ${t.title} [${t.project}] – ${t.retries} retry`);
    lines.push('');
  }
  lines.push('## Slowest tests', '');
  for (const t of slowest) lines.push(`- ${sec(t.duration)} – ${t.title} [${t.project}]`);
  lines.push('');
  lines.push('## Evidence', '');
  lines.push('- HTML report with traces and screenshots: `playwright-report/index.html` (`npm run report`)');
  lines.push('- Machine-readable: `test-results/junit.xml`, `test-results/results.json`');
  lines.push('');
}

const md = lines.join('\n');
fs.writeFileSync('TEST-REPORT.md', md);
console.log(md);
