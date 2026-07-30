import { readFileSync, writeFileSync } from "fs";

const b1 = JSON.parse(readFileSync("marketing/raw/batch1.json"));
const b2 = JSON.parse(readFileSync("marketing/raw/batch2.json"));
const b3 = JSON.parse(readFileSync("marketing/raw/batch3.json"));
const b4 = JSON.parse(readFileSync("marketing/raw/batch4.json"));
const extras = JSON.parse(readFileSync("marketing/raw/batch5-extras.json"));

const BASE = "https://www.mybearisyellow.me";

function withLink(entries) {
  return entries.map((e) => ({
    ...e,
    link: `${BASE}/${e.section}/${e.slug}/`,
  }));
}

const architecture = withLink(b1.filter((e) => e.section === "architecture-logicielle"));
const designPatternsA = withLink(b1.filter((e) => e.section === "design-patterns"));
const designPatternsB = withLink(b2.filter((e) => e.section === "design-patterns"));
const designPatterns = [...designPatternsA, ...designPatternsB];
const tests = withLink(b2.filter((e) => e.section === "tests"));
const bdd = withLink(b3);
const cloud = withLink(b4);

const launch = extras.find((e) => e.type === "lancement");
const otherExtras = extras.filter((e) => e.type !== "lancement");

// Round-robin interleave across categories so the feed doesn't read as
// "a month of nothing but Design Patterns" followed by "a month of SQL".
const pools = [architecture, designPatterns, tests, bdd, cloud, otherExtras];
const interleaved = [];
let remaining = pools.reduce((n, p) => n + p.length, 0);
while (remaining > 0) {
  for (const pool of pools) {
    if (pool.length) {
      interleaved.push(pool.shift());
      remaining--;
    }
  }
}

const ordered = [launch, ...interleaved];

if (ordered.length !== 56) {
  throw new Error(`Expected 56 posts, got ${ordered.length}`);
}

// Schedule: 3 posts/week on Tue/Thu/Sat, starting Tue 2026-08-04.
const start = new Date("2026-08-04T00:00:00Z");
const offsets = [0, 2, 4]; // Tue, Thu, Sat within a week
const dated = ordered.map((post, i) => {
  const week = Math.floor(i / 3);
  const dayOffset = offsets[i % 3];
  const d = new Date(start);
  d.setUTCDate(d.getUTCDate() + week * 7 + dayOffset);
  const iso = d.toISOString().slice(0, 10);
  return { ...post, date: iso, index: i + 1 };
});

writeFileSync("marketing/raw/all-posts.json", JSON.stringify(dated, null, 2));
console.log(`Assembled ${dated.length} posts, from ${dated[0].date} to ${dated[dated.length - 1].date}`);
