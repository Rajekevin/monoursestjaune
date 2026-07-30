import { readFileSync, writeFileSync } from "fs";

const posts = JSON.parse(readFileSync("marketing/raw/all-posts.json"));

const CATS = [
  "Lancement",
  "Architecture logicielle",
  "Design Patterns",
  "Bases de données",
  "Tests",
  "Cloud & DevOps",
  "Engagement",
  "Entretien",
  "Actualité",
];

const MONTHS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const DAYS_FR = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];

function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00Z");
  return {
    day: String(d.getUTCDate()).padStart(2, "0"),
    month: MONTHS_FR[d.getUTCMonth()],
    weekday: DAYS_FR[d.getUTCDay()],
    full: `${d.getUTCDate()} ${MONTHS_FR[d.getUTCMonth()]} ${d.getUTCFullYear()}`,
  };
}

// group into weeks of 3 (as scheduled) for section dividers
const weekGroups = [];
for (let i = 0; i < posts.length; i += 3) {
  weekGroups.push(posts.slice(i, i + 3));
}

const dataJson = JSON.stringify(posts).replace(/</g, "\\u003c");

const catCounts = CATS.map((c) => [c, posts.filter((p) => p.category_label === c).length]).filter(
  ([, n]) => n > 0
);

const first = fmtDate(posts[0].date);
const last = fmtDate(posts[posts.length - 1].date);

function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cardHtml(p) {
  const d = fmtDate(p.date);
  const tags = p.hashtags.map((h) => `<span class="tag">#${esc(h)}</span>`).join("");
  const bodyHtml = esc(p.body).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>");
  const linkHtml = p.link
    ? `<a class="post-link" href="${esc(p.link)}" target="_blank" rel="noopener">${esc(
        p.link.replace("https://", "")
      )}</a>`
    : `<span class="post-link post-link--none">Pas de lien — post d'engagement</span>`;

  return `
  <article class="card" data-cat="${esc(p.category_label)}" id="post-${p.index}">
    <div class="card-date">
      <span class="card-date-day">${d.day}</span>
      <span class="card-date-month">${d.month}</span>
      <span class="card-date-weekday">${d.weekday}</span>
      <span class="card-index">#${p.index}</span>
    </div>
    <div class="card-body">
      <div class="card-head">
        <span class="pill pill--${slugify(p.category_label)}">${esc(p.category_label)}</span>
        <button class="copy-btn" type="button" data-index="${p.index}">
          <span class="copy-label">Copier</span>
          <span class="copy-check" aria-hidden="true">✓</span>
        </button>
      </div>
      <p class="hook">${esc(p.hook)}</p>
      <div class="prose"><p>${bodyHtml}</p></div>
      <div class="card-foot">
        <div class="tags">${tags}</div>
        ${linkHtml}
      </div>
    </div>
  </article>`;
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const weekSections = weekGroups
  .map((group, i) => {
    const wStart = fmtDate(group[0].date);
    const cards = group.map(cardHtml).join("\n");
    return `
    <section class="week">
      <h2 class="week-title">Semaine du ${wStart.full}</h2>
      <div class="week-cards">${cards}</div>
    </section>`;
  })
  .join("\n");

const filterChips = ["Tous", ...CATS.filter((c) => catCounts.find(([cc]) => cc === c))]
  .map((c) => {
    if (c === "Tous") {
      return `<button class="chip chip--active" data-filter="Tous">Tous <span class="chip-count">${posts.length}</span></button>`;
    }
    const count = catCounts.find(([cc]) => cc === c)[1];
    return `<button class="chip" data-filter="${esc(c)}">${esc(c)} <span class="chip-count">${count}</span></button>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>MyBearIsYellow — Calendrier LinkedIn</title>
<style>
:root {
  --bg: #0B1220;
  --surface: #111827;
  --surface-2: #1B2536;
  --border: #24304a;
  --text: #F8FAFC;
  --text-muted: #94A3B8;
  --text-faint: #64748B;
  --primary: #FACC15;
  --primary-ink: #3f2d02;
  --secondary: #3B82F6;
  --radius: 14px;
  --font-ui: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
:root[data-theme="light"] {
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --surface-2: #F1F5F9;
  --border: #E2E8F0;
  --text: #0B1220;
  --text-muted: #475569;
  --text-faint: #94A3B8;
  --primary: #EAB308;
  --primary-ink: #3f2d02;
  --secondary: #2563EB;
}
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    --bg: #F8FAFC;
    --surface: #FFFFFF;
    --surface-2: #F1F5F9;
    --border: #E2E8F0;
    --text: #0B1220;
    --text-muted: #475569;
    --text-faint: #94A3B8;
    --primary: #EAB308;
    --primary-ink: #3f2d02;
    --secondary: #2563EB;
  }
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-ui);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--secondary); }
.wrap { max-width: 880px; margin: 0 auto; padding: 0 20px 96px; }

header.top {
  position: sticky;
  top: 0;
  z-index: 20;
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  padding: 20px 0 16px;
}
.top-inner { max-width: 880px; margin: 0 auto; padding: 0 20px; }
.eyebrow {
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
}
h1 {
  font-size: clamp(22px, 4vw, 30px);
  font-weight: 800;
  margin: 6px 0 4px;
  text-wrap: balance;
}
.subtitle {
  color: var(--text-muted);
  font-size: 14.5px;
  margin: 0 0 16px;
}
.subtitle strong { color: var(--text); font-variant-numeric: tabular-nums; }

.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.chip:hover { border-color: var(--primary); color: var(--text); }
.chip:focus-visible { outline: 2px solid var(--secondary); outline-offset: 2px; }
.chip-count { font-family: var(--font-mono); color: var(--text-faint); font-variant-numeric: tabular-nums; }
.chip--active { background: var(--primary); color: var(--primary-ink); border-color: var(--primary); }
.chip--active .chip-count { color: color-mix(in srgb, var(--primary-ink) 70%, transparent); }

.howto {
  margin-top: 14px;
  font-size: 13.5px;
  color: var(--text-muted);
  border-left: 2px solid var(--border);
  padding-left: 10px;
}
.howto strong { color: var(--text); }

.week { margin-top: 40px; }
.week-title {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--border);
}
.week-cards { display: flex; flex-direction: column; gap: 14px; }

.card {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  scroll-margin-top: 90px;
}
.card-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 2px;
  font-family: var(--font-mono);
}
.card-date-day { font-size: 22px; font-weight: 700; line-height: 1.1; font-variant-numeric: tabular-nums; }
.card-date-month { font-size: 11px; color: var(--text-muted); text-transform: uppercase; }
.card-date-weekday { font-size: 10px; color: var(--text-faint); margin-top: 2px; }
.card-index { font-size: 10px; color: var(--text-faint); margin-top: 8px; font-variant-numeric: tabular-nums; }

.card-body { min-width: 0; }
.card-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }

.pill {
  font-size: 11.5px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--text-muted);
  border: 1px solid var(--border);
  white-space: nowrap;
}
.pill--lancement { background: var(--primary); color: var(--primary-ink); border-color: var(--primary); }
.pill--engagement { color: var(--secondary); border-color: color-mix(in srgb, var(--secondary) 40%, var(--border)); }
.pill--actualite { color: var(--primary); border-color: color-mix(in srgb, var(--primary) 40%, var(--border)); }

.copy-btn {
  flex-shrink: 0;
  font-family: var(--font-ui);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: border-color 0.15s, background 0.15s;
}
.copy-btn:hover { border-color: var(--primary); }
.copy-btn:focus-visible { outline: 2px solid var(--secondary); outline-offset: 2px; }
.copy-btn .copy-check { display: none; color: #16A34A; }
.copy-btn.copied .copy-label { display: none; }
.copy-btn.copied .copy-check { display: inline; }
.copy-btn.copied { border-color: #16A34A; }

.hook { font-size: 15.5px; font-weight: 700; margin: 0 0 8px; text-wrap: balance; }
.prose { font-size: 14.5px; color: var(--text-muted); }
.prose p { margin: 0 0 10px; white-space: normal; }
.prose p:last-child { margin-bottom: 0; }

.card-foot {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--secondary);
}
.post-link { font-family: var(--font-mono); font-size: 12px; text-decoration: none; }
.post-link:hover { text-decoration: underline; }
.post-link--none { color: var(--text-faint); pointer-events: none; }

.card.is-hidden { display: none; }
.week.is-empty { display: none; }

footer.end {
  max-width: 880px;
  margin: 48px auto 0;
  padding: 20px;
  color: var(--text-faint);
  font-size: 12.5px;
  text-align: center;
}

@media (max-width: 560px) {
  .card { grid-template-columns: 48px 1fr; gap: 12px; padding: 14px; }
  .card-date-day { font-size: 18px; }
}

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}

.manual-copy-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 100;
  background: color-mix(in srgb, black 55%, transparent);
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.manual-copy-overlay.is-open { display: flex; }
.manual-copy-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 20px 60px color-mix(in srgb, black 40%, transparent);
}
.manual-copy-title { margin: 0 0 12px; font-size: 14px; color: var(--text-muted); }
#manual-copy-textarea {
  width: 100%;
  min-height: 180px;
  resize: vertical;
  background: var(--surface-2);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 12px;
}
</style>
</head>
<body>
<header class="top">
  <div class="top-inner">
    <div class="eyebrow">🐻 MyBearIsYellow</div>
    <h1>Calendrier de posts LinkedIn</h1>
    <p class="subtitle"><strong>${posts.length}</strong> posts prêts à copier-coller · du <strong>${first.full}</strong> au <strong>${last.full}</strong> · rythme 3×/semaine (mar·jeu·sam)</p>
    <div class="chips" id="chips">
      ${filterChips}
    </div>
    <p class="howto"><strong>Comment publier :</strong> clique "Copier" sur un post, colle-le dans une nouvelle publication LinkedIn, puis utilise l'icône 🕒 "Programmer pour plus tard" dans la fenêtre de rédaction pour choisir la date indiquée sur la carte.</p>
  </div>
</header>

<main class="wrap">
${weekSections}
</main>

<footer class="end">MyBearIsYellow — généré à partir des 40 articles réels du site, sans contenu inventé.</footer>

<div class="manual-copy-overlay" id="manual-copy-overlay">
  <div class="manual-copy-panel">
    <p class="manual-copy-title">Copie automatique bloquée par le navigateur — sélectionne le texte ci-dessous et fais Ctrl+C (Cmd+C sur Mac).</p>
    <textarea id="manual-copy-textarea" readonly></textarea>
    <button type="button" id="manual-copy-close" class="copy-btn">Fermer</button>
  </div>
</div>

<script id="posts-data" type="application/json">${dataJson}</script>
<script>
(function () {
  var posts = JSON.parse(document.getElementById('posts-data').textContent);
  var postsByIndex = {};
  posts.forEach(function (p) { postsByIndex[p.index] = p; });

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.width = '2px';
    ta.style.height = '2px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { ta.setSelectionRange(0, text.length); } catch (e) {}
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  var manualOverlay = document.getElementById('manual-copy-overlay');
  var manualTextarea = document.getElementById('manual-copy-textarea');
  document.getElementById('manual-copy-close').addEventListener('click', function () {
    manualOverlay.classList.remove('is-open');
  });

  function showManualCopy(text) {
    manualTextarea.value = text;
    manualOverlay.classList.add('is-open');
    manualTextarea.focus();
    manualTextarea.select();
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return legacyCopy(text); }
      );
    }
    return Promise.resolve(legacyCopy(text));
  }

  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var p = postsByIndex[btn.dataset.index];
      var tags = p.hashtags.map(function (h) { return '#' + h; }).join(' ');
      var parts = [p.hook, p.body];
      if (p.link) parts.push(p.link);
      parts.push(tags);
      var text = parts.join('\\n\\n');
      copyText(text).then(function (ok) {
        if (ok) {
          btn.classList.add('copied');
          setTimeout(function () { btn.classList.remove('copied'); }, 1800);
        } else {
          showManualCopy(text);
        }
      });
    });
  });

  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('chip--active'); });
      chip.classList.add('chip--active');
      var filter = chip.dataset.filter;
      document.querySelectorAll('.card').forEach(function (card) {
        var show = filter === 'Tous' || card.dataset.cat === filter;
        card.classList.toggle('is-hidden', !show);
      });
      document.querySelectorAll('.week').forEach(function (week) {
        var anyVisible = week.querySelectorAll('.card:not(.is-hidden)').length > 0;
        week.classList.toggle('is-empty', !anyVisible);
      });
    });
  });
})();
</script>
</body>
</html>
`;

writeFileSync("marketing/linkedin-calendar.html", html);
console.log("Wrote marketing/linkedin-calendar.html —", html.length, "bytes");
