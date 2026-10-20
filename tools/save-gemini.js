// node tools/save-gemini.js <saida-do-dev-browser.txt>  -> grava photos/<nome>.jpg e lista falhas
const fs = require('fs');
const path = require('path');
const t = fs.readFileSync(process.argv[2], 'utf8');
for (const line of t.split(/\r?\n/)) {
  let m = line.match(/^IMG:([\w-]+):data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/);
  if (m) {
    const f = path.join(__dirname, '..', 'photos', m[1] + '.jpg');
    fs.writeFileSync(f, Buffer.from(m[2], 'base64'));
    console.log('salvo', m[1], Math.round(fs.statSync(f).size / 1024) + 'KB');
    continue;
  }
  m = line.match(/^FAIL:([\w-]+):(.*)$/);
  if (m) console.log('FALHOU', m[1], '-', m[2]);
}
