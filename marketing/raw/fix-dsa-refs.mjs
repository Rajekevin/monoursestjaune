import { readFileSync, writeFileSync, readdirSync } from "fs";

const html = readFileSync("C:/Users/Utilisateur/Downloads/dev-academy.html", "utf8");
const start = html.indexOf("const P = [") + "const P = ".length;
const afterStart = html.slice(start);
const closeIdx = afterStart.indexOf("\n];");
const P = new Function(`return ${afterStart.slice(0, closeIdx + 2)};`)();

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const byNumber = {};
for (const p of P) {
  byNumber[p.n] = { title: p.t, slug: slugify(p.t) };
}

const dir = "content/algorithmes";
const files = readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "_index.md");

let totalFixed = 0;

for (const file of files) {
  const path = `${dir}/${file}`;
  const raw = readFileSync(path, "utf8");
  const fmEnd = raw.indexOf("---", 3);
  let frontMatter = raw.slice(0, fmEnd + 3);
  let body = raw.slice(fmEnd + 3);

  let changed = false;

  // Front matter: plain text, no links — replace #N with just the title
  frontMatter = frontMatter.replace(/#(\d+)/g, (match, numStr) => {
    const num = parseInt(numStr, 10);
    const ref = byNumber[num];
    if (!ref) return match;
    changed = true;
    return ref.title;
  });

  // Body: real cross-links to the other problem's page
  body = body.replace(/#(\d+)/g, (match, numStr) => {
    const num = parseInt(numStr, 10);
    const ref = byNumber[num];
    if (!ref) return match;
    changed = true;
    return `[${ref.title}](/algorithmes/${ref.slug}/)`;
  });

  if (changed) {
    writeFileSync(path, frontMatter + body);
    totalFixed++;
  }
}

console.log(`Fixed cross-references in ${totalFixed} files.`);
