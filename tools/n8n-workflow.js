// Gera o JSON do workflow "MAXIMUS - NGS Post Diario" (inativo ao criar).
// Uso: CID=<id da credencial "Meta Page Token NGS"> node tools/n8n-workflow.js > wf.json
//      curl -X POST -H "X-N8N-API-KEY: ..." -H "Content-Type: application/json" --data @wf.json $N8N/api/v1/workflows
// Credencial: tipo httpQueryAuth, name "access_token", value = Page token da NGS (pages_manage_posts,
// pages_read_engagement, instagram_basic, instagram_content_publish).
const cred = { httpQueryAuth: { id: process.env.CID, name: 'Meta Page Token NGS' } };
const QUEUE_URL = process.env.QUEUE_URL || 'https://dayvson30-alt.github.io/ngs-social/queue.json';
const http = (id, name, x, method, url, q) => ({ id, name, type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [x, 0],
  parameters: { method, url, authentication: 'genericCredentialType', genericAuthType: 'httpQueryAuth', sendQuery: true,
    queryParameters: { parameters: q.map(([name, value]) => ({ name, value })) }, options: { response: { response: { neverError: true } } } },
  credentials: cred });
const code = (id, name, x, jsCode) => ({ id, name, type: 'n8n-nodes-base.code', typeVersion: 2, position: [x, 0], parameters: { jsCode } });
const P = "$('Escolher post do dia').first().json";
const nodes = [
  { id: 'n1', name: 'Todo dia 12h ET', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2, position: [0, 0],
    parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 12 * * *' }] } } },
  { id: 'n2', name: 'Buscar fila', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [220, 0],
    parameters: { url: QUEUE_URL, options: {} } },
  code('n3', 'Escolher post do dia', 440, `// NGS Private Rides. queue.json = { epoch: 'AAAA-MM-DD', posts: [...] }
// Indice = dias desde epoch (data de hoje em America/New_York) % posts.length. Sem estado salvo.
const PAGE_ID = '694371467090835';        // NGS Private Rides
const IG_USER_ID = '17841474979998101';   // @ngsprivaterides
const API = 'https://graph.facebook.com/v23.0';
const all = $input.all().map(i => i.json);
const q = all.length === 1 && all[0].posts ? all[0] : { epoch: null, posts: all };
const posts = (q.posts || []).filter(p => p && p.image && p.caption);
if (!posts.length) throw new Error('fila vazia ou queue.json inacessivel');
if (!q.epoch) throw new Error('queue.json sem epoch');
const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
const days = Math.round((Date.parse(ymd) - Date.parse(q.epoch)) / 86400000);
if (days < 0) return []; // antes do inicio: nao publica
const p = posts[days % posts.length];
if (!/^https:\\/\\/.+\\.jpe?g$/i.test(p.image)) throw new Error('imagem precisa ser JPEG https: ' + p.image);
const t = Array.isArray(p.targets) && p.targets.length ? p.targets : ['fb', 'ig'];
return [{ json: { ...p, _day: days, _date: ymd, postFb: t.includes('fb'), postIg: t.includes('ig'),
  fbPhotoUrl: API + '/' + PAGE_ID + '/photos', igMediaUrl: API + '/' + IG_USER_ID + '/media',
  igPublishUrl: API + '/' + IG_USER_ID + '/media_publish' } }];`),
  http('n4', 'FB - Publicar foto', 660, 'POST', `={{ ${P}.fbPhotoUrl }}`,
    [['url', `={{ ${P}.image }}`], ['caption', `={{ ${P}.caption }}`], ['published', 'true']]),
  http('n5', 'IG - Criar container', 880, 'POST', `={{ ${P}.igMediaUrl }}`,
    [['image_url', `={{ ${P}.image }}`], ['caption', `={{ ${P}.caption }}`]]),
  { id: 'n6', name: 'Aguardar upload', type: 'n8n-nodes-base.wait', typeVersion: 1.1, position: [1100, 0], parameters: { amount: 15 } },
  http('n7', 'IG - Publicar', 1320, 'POST', `={{ ${P}.igPublishUrl }}`, [['creation_id', "={{ $('IG - Criar container').first().json.id }}"]]),
  code('n8', 'Conferir publicacao', 1540, `// GUARD: a Meta devolve erro no corpo com HTTP 200. Falha aqui = execucao vermelha.
const s = ${P};
const fb = $('FB - Publicar foto').first().json, igc = $('IG - Criar container').first().json, ig = $input.first().json;
const errs = [];
for (const [k, r] of [['fb', fb], ['ig_container', igc], ['ig', ig]]) if (r && r.error) errs.push(k + ': ' + (r.error.code || '') + ' ' + (r.error.message || ''));
if (!fb.post_id && !fb.id) errs.push('fb sem id');
if (!ig.id) errs.push('ig sem id');
if (errs.length) throw new Error('NGS slot ' + s.slot + ' (' + s.slug + ') falhou: ' + errs.join(' | '));
return [{ json: { ok: true, date: s._date, slot: s.slot, slug: s.slug, fb: fb.post_id || fb.id, ig: ig.id } }];`),
];
// FB e IG em sequencia para o guard ver os dois resultados
const chain = nodes.map(n => n.name);
const connections = {};
for (let i = 0; i < chain.length - 1; i++) connections[chain[i]] = { main: [[{ node: chain[i + 1], type: 'main', index: 0 }]] };
console.log(JSON.stringify({ name: 'MAXIMUS - NGS Post Diario', nodes, connections,
  settings: { executionOrder: 'v1', timezone: 'America/New_York', saveDataSuccessExecution: 'all', saveDataErrorExecution: 'all' } }));
