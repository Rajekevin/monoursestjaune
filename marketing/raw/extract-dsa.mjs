import { readFileSync, writeFileSync, mkdirSync } from "fs";

const html = readFileSync("C:/Users/Utilisateur/Downloads/dev-academy.html", "utf8");

const startMarker = "const P = [";
const start = html.indexOf(startMarker) + "const P = ".length;
const endMarker = "\n];";
// Find the closing "];" that ends the array — search after start for the pattern
const afterStart = html.slice(start);
const closeIdx = afterStart.indexOf(endMarker);
const arrayLiteral = afterStart.slice(0, closeIdx + 2); // include the closing ]

// Evaluate the array literal safely (trusted local file, plain data)
const P = new Function(`return ${arrayLiteral};`)();

console.log(`Parsed ${P.length} problems.`);

const DIFF = { 1: "Facile", 2: "Moyen", 3: "Difficile" };

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function yamlEscape(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const patternCounts = {};

for (const p of P) {
  const slug = slugify(p.t);
  const patternSlug = slugify(p.c);
  patternCounts[p.c] = (patternCounts[p.c] || 0) + 1;

  const tags = ["dsa", "java", "entretien-technique", patternSlug];

  const frontMatter = `---
title: "${yamlEscape(p.t)}"
description: "${yamlEscape(p.e.slice(0, 140))}${p.e.length > 140 ? "..." : ""}"
category: "Algorithmes & Structures de données"
pattern: "${yamlEscape(p.c)}"
difficulty: "${DIFF[p.d]}"
number: ${p.n}
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
summary: "${yamlEscape(p.e)}"
---
`;

  const body = `
## L'idée clé

${p.k}

## Pourquoi cette solution ?

${p.w}

## Solution Java

\`\`\`java
${p.code}
\`\`\`

## Complexité

${p.x}
`;

  writeFileSync(`content/algorithmes/${slug}.md`, frontMatter + body);
}

console.log("Patterns:", patternCounts);
console.log(`Wrote ${P.length} files to content/algorithmes/`);
