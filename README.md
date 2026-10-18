# ngs-social

Fila de posts automáticos da NGS Private Rides (Facebook + Instagram), publicada pelo workflow n8n "MAXIMUS - NGS Post Diario" (12:00 ET).

- `tools/posts.js`: conteúdo (EN + PT).
- `node tools/build.js`: gera `queue.json`, `cards/*.html` e `preview.html`.
- `bash tools/render.sh`: Chrome headless → `img/*.jpg` (IG via API só aceita JPEG).
- `tools/n8n-workflow.js`: gera o JSON do workflow.
- O workflow publica `posts[diasDesde(epoch) % posts.length]`; mudar o início = editar `epoch` em `queue.json`.
- Revisão: https://dayvson30-alt.github.io/ngs-social/preview.html
