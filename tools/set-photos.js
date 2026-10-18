// node tools/set-photos.js  -> grava o campo photo: nos posts (mapa abaixo) em tools/posts.js
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'posts.js');
const map = {
  'intro-landed': 'airport.jpg', 'pt-primeira-vez': 'airport.jpg',
  'tip-terminal': 'terminal.jpg', 'tip-tsa': 'terminal.jpg',
  'tip-gate': 'vacation-home.jpg', 'pt-casa-temporada': 'vacation-home.jpg',
  'tip-bags': 'night-pickup.jpg', 'card-247': 'night-pickup.jpg',
  'list-vehicles': 'fleet.jpg', 'price-van': 'fleet.jpg',
  'card-fixed': 'suv-interior.jpg', 'list-why': 'suv-interior.jpg',
};
let s = fs.readFileSync(file, 'utf8');
for (const [slug, photo] of Object.entries(map)) {
  const re = new RegExp(`(\\{ slug: '${slug}', lang: '\\w+', type: '\\w+',)( photo: '[^']+',)?`);
  if (!re.test(s)) throw new Error('nao achou ' + slug);
  s = s.replace(re, `$1 photo: '${photo}',`);
}
fs.writeFileSync(file, s);
console.log('posts com foto:', (s.match(/ photo: '/g) || []).length);
