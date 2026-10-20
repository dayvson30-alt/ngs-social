// Gera o JSON de um workflow n8n TEMPORARIO para gerar imagens com a API do Gemini
// usando a credencial existente "Gemini API Key (query)" (a chave nao sai do n8n).
// Uso: P=<path-do-webhook> node tools/gemini-tmp-workflow.js > wf.json ; criar, ativar, chamar, APAGAR.
// POST /webhook/<P> {"action":"models"}                         -> lista modelos com "image" no nome
// POST /webhook/<P> {"model":"...","prompt":"...","aspect":"4:3"} -> {mime, data(base64)} ou {error}
const cred = { httpQueryAuth: { id: '0Bl4jQJCVzOsJGwX', name: 'Gemini API Key (query)' } };
const API = 'https://generativelanguage.googleapis.com/v1beta';
const opts = { response: { response: { neverError: true } }, timeout: 120000 };
const nodes = [
  { id: 'w', name: 'Webhook', type: 'n8n-nodes-base.webhook', typeVersion: 2, position: [0, 0],
    parameters: { httpMethod: 'POST', path: process.env.P, responseMode: 'responseNode', options: {} } },
  { id: 'i', name: 'Listar?', type: 'n8n-nodes-base.if', typeVersion: 2, position: [200, 0],
    parameters: { conditions: { options: { caseSensitive: true, leftValue: '', version: 2 }, combinator: 'and',
      conditions: [{ id: 'c1', leftValue: '={{ $json.body.action }}', rightValue: 'models',
        operator: { type: 'string', operation: 'equals' } }] }, options: {} } },
  { id: 'm', name: 'Modelos', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [420, -120],
    parameters: { url: `${API}/models?pageSize=200`, authentication: 'genericCredentialType', genericAuthType: 'httpQueryAuth', options: opts },
    credentials: cred },
  { id: 'mf', name: 'Filtrar', type: 'n8n-nodes-base.code', typeVersion: 2, position: [640, -120],
    parameters: { jsCode: `const r = $input.first().json;
if (r.error) return [{ json: { error: r.error } }];
return [{ json: { models: (r.models || []).map(m => m.name).filter(n => /image|imagen/i.test(n)) } }];` } },
  { id: 'g', name: 'Gerar', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [420, 120],
    parameters: { method: 'POST', url: `={{ '${API}/models/' + $json.body.model + ':generateContent' }}`,
      authentication: 'genericCredentialType', genericAuthType: 'httpQueryAuth', sendBody: true, specifyBody: 'json',
      jsonBody: `={{ JSON.stringify({ contents: [{ parts: [{ text: $json.body.prompt }] }], generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: $json.body.aspect || '4:3' } } }) }}`,
      options: opts },
    credentials: cred },
  { id: 'gx', name: 'Extrair', type: 'n8n-nodes-base.code', typeVersion: 2, position: [640, 120],
    parameters: { jsCode: `const r = $input.first().json;
if (r.error) return [{ json: { error: r.error } }];
const parts = (r.candidates && r.candidates[0] && r.candidates[0].content && r.candidates[0].content.parts) || [];
const img = parts.find(p => p.inlineData || p.inline_data);
if (!img) return [{ json: { error: 'sem imagem', finish: r.candidates && r.candidates[0] && r.candidates[0].finishReason, text: parts.map(p => p.text).filter(Boolean).join(' ').slice(0, 300) } }];
const d = img.inlineData || img.inline_data;
return [{ json: { mime: d.mimeType || d.mime_type, data: d.data, usage: r.usageMetadata } }];` } },
  { id: 'r', name: 'Responder', type: 'n8n-nodes-base.respondToWebhook', typeVersion: 1.1, position: [860, 0],
    parameters: { respondWith: 'json', responseBody: '={{ JSON.stringify($json) }}', options: {} } },
];
const connections = {
  Webhook: { main: [[{ node: 'Listar?', type: 'main', index: 0 }]] },
  'Listar?': { main: [[{ node: 'Modelos', type: 'main', index: 0 }], [{ node: 'Gerar', type: 'main', index: 0 }]] },
  Modelos: { main: [[{ node: 'Filtrar', type: 'main', index: 0 }]] },
  Filtrar: { main: [[{ node: 'Responder', type: 'main', index: 0 }]] },
  Gerar: { main: [[{ node: 'Extrair', type: 'main', index: 0 }]] },
  Extrair: { main: [[{ node: 'Responder', type: 'main', index: 0 }]] },
};
console.log(JSON.stringify({ name: 'TEMP MAXIMUS gemini imagens (apagar)', nodes, connections, settings: { executionOrder: 'v1' } }));
