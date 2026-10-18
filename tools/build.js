// node tools/build.js  -> escreve queue.json, cards/*.html e preview.html
// Depois: bash tools/render.sh  (Chrome headless -> img/*.jpg; IG via API so aceita JPEG)
// O workflow n8n escolhe posts[diasDesde(epoch) % posts.length], com a data de hoje em America/New_York.
// Trocar a data de inicio = editar "epoch" no queue.json, sem mexer no workflow.
const fs = require('fs');
const path = require('path');
const { posts, CTA, TAGS } = require('./posts');

const SITE = 'https://dayvson30-alt.github.io/ngs-social/img/';
const ROOT = path.join(__dirname, '..');
const EPOCH = process.env.EPOCH || '2026-10-20';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function card(p) {
  const top = `<div class="tag">${esc(p.label)}</div><h1>${esc(p.headline)}</h1>`;
  let mid = '';
  if (p.type === 'card') mid = `<div class="accent">${esc(p.accent)}</div><p>${esc(p.body)}</p>`;
  if (p.type === 'list') mid = `<div class="box"><ul>${p.items.map(i => `<li><span>✓</span>${esc(i)}</li>`).join('')}</ul></div>`;
  if (p.type === 'price') mid = `<div class="box">${p.rows.map(([a, b]) => `<div class="row"><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join('')}</div><p class="note">${esc(p.note)}</p>`;
  const sub = p.lang === 'pt' ? 'Transfer privativo · Orlando · 24h' : 'Orlando airport transfers · 24/7';
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px}
body{background:#f6f1e7;font-family:Montserrat,Arial,sans-serif;color:#13294b;display:flex;flex-direction:column;padding:110px 90px 0}
main{flex:1;display:flex;flex-direction:column;justify-content:center;gap:34px}
.tag{font-weight:700;font-size:32px;letter-spacing:5px;color:#c0392b}
h1{font-weight:800;font-size:90px;line-height:1.05}
.accent{font-weight:800;font-size:96px;line-height:1.05;color:#c0392b}
p{font-size:40px;line-height:1.4;font-weight:500;color:#4a5d7a}
.box{background:#13294b;color:#fff;border-radius:36px;padding:44px 56px}
ul{list-style:none;display:flex;flex-direction:column;gap:30px}
li{font-size:44px;font-weight:700;display:flex;gap:24px;align-items:baseline}
li span{color:#f2c14e;font-weight:800}
.row{display:flex;justify-content:space-between;align-items:baseline;font-size:46px;font-weight:500;padding:18px 0;border-top:2px solid rgba(255,255,255,.15)}
.row:first-child{border-top:none}
.row b{font-weight:800;font-size:60px;color:#f2c14e}
.note{font-size:30px}
footer{display:flex;justify-content:space-between;align-items:center;border-top:3px solid #13294b;padding:34px 0 54px;margin-top:40px}
footer b{font-weight:800;font-size:40px}
footer small{font-size:28px;font-weight:700;color:#c0392b}
</style></head><body><main>${top}${mid}</main><footer><b>@ngsprivaterides</b><small>${sub}</small></footer></body></html>`;
}

function caption(p, i) {
  const [first, second] = p.lang === 'pt' ? [p.pt, p.en] : [p.en, p.pt];
  const flag = p.lang === 'pt' ? '🇺🇸' : '🇧🇷';
  const cta = p.lang === 'pt' ? `${CTA.pt[0]}\n\n${CTA.en[0]}` : `${CTA.en[0]}\n\n${CTA.pt[0]}`;
  return `${first}\n\n${flag} ${second}\n\n${cta}\n\n${TAGS[i % TAGS.length]}`;
}

const slugs = new Set();
for (const p of posts) {
  if (slugs.has(p.slug)) throw new Error('slug repetido ' + p.slug);
  slugs.add(p.slug);
  if (!p.en || !p.pt) throw new Error('falta en/pt em ' + p.slug);
}
const items = posts.map((p, i) => ({
  slot: i + 1, slug: p.slug, image: SITE + p.slug + '.jpg', caption: caption(p, i), targets: ['fb', 'ig'],
}));
for (const it of items) if (it.caption.length > 2200) throw new Error(`legenda > 2200 (limite IG): ${it.slug} ${it.caption.length}`);

fs.writeFileSync(path.join(ROOT, 'queue.json'), JSON.stringify({ epoch: EPOCH, posts: items }, null, 2) + '\n');

// cards/*.html -> tools/render.sh (Chrome headless) gera img/*.jpg
fs.mkdirSync(path.join(ROOT, 'cards'), { recursive: true });
for (const p of posts) fs.writeFileSync(path.join(ROOT, 'cards', p.slug + '.html'), card(p));

// Pagina de revisao: card + legenda + data, para aprovacao antes de ativar
const d0 = Date.parse(EPOCH);
const day = i => new Date(d0 + i * 86400000).toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, 'preview.html'), `<!doctype html><meta charset="utf-8"><title>NGS fila social</title>
<style>body{font-family:system-ui;max-width:1100px;margin:auto;padding:16px;background:#f6f1e7;color:#13294b}
.p{display:flex;gap:20px;background:#fff;border-radius:12px;padding:16px;margin:16px 0}img{width:300px;border-radius:8px}
pre{white-space:pre-wrap;font:14px/1.45 system-ui;margin:0}@media(max-width:700px){.p{flex-direction:column}img{width:100%}}</style>
<h1>NGS Private Rides · fila de ${items.length} posts (início ${EPOCH}, 12:00 ET)</h1>
${items.map((it, i) => `<div class="p"><img src="img/${it.slug}.jpg"><div><b>#${it.slot} · ${day(i)} · ${it.slug}</b><pre>${esc(it.caption)}</pre></div></div>`).join('\n')}`);

items.forEach((it, i) => console.log(day(i), it.slug.padEnd(22), `(${it.caption.length} ch)`, '|', it.caption.split('\n')[0].slice(0, 60)));
