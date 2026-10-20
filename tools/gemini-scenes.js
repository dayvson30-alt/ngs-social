// Cenas p/ gerar no Gemini (app web, via dev-browser no Chrome de automacao logado).
// node tools/gemini-scenes.js <nome1,nome2,...>  -> imprime o script dev-browser p/ esse lote
// Saida do dev-browser: linhas "IMG:<nome>:data:image/jpeg;base64,..." -> tools/save-gemini.js grava em photos/
const BASE = 'Create a photorealistic image, landscape 4:3. Advertising photo. No logos, no text, no signage, no readable license plates, no brand badges. 35mm photo, shallow depth of field, natural colors, realistic skin and fabric.';
const scenes = {
  'port-pickup': 'Afternoon at a Florida cruise port: a large white cruise ship docked behind. A professional chauffeur in a dark navy suit loading a family\'s suitcases into the trunk of a clean black luxury SUV while the family, tanned and relaxed after the cruise, waits smiling. Palm trees.',
  'brazilian-family': 'Orlando airport arrivals curb, bright day: a friendly professional driver in a dark suit warmly shaking hands with a smiling Brazilian family (parents, grandmother and two kids) with suitcases, next to a clean black SUV. Warm, welcoming mood. Palm trees and modern terminal blurred behind.',
  'resort-road': 'A clean black luxury SUV driving on a palm-lined boulevard in the Orlando resort area at golden hour, warm sunset light, lush landscaping, resort hotels softly blurred in the distance. Three-quarter front view, motion feel.',
  'phone-booking': 'A woman sitting on a sofa at home next to a packed suitcase and passports, smiling while booking something on her smartphone (screen not visible to camera). Bright, cozy living room, vacation anticipation mood.',
  'departures': 'Early morning at an airport departures curb in Florida: a professional chauffeur in a dark suit taking suitcases out of the trunk of a clean black SUV for a family about to fly home. Soft sunrise light, terminal glass behind.',
  'community-aerial': 'Aerial drone photo of a Central Florida vacation home community: rows of colorful stucco houses with tile roofs and private screened pools, palm trees, curving streets, a single clean black SUV driving on the street. Bright sunny day.',
  'hotel-entrance': 'Entrance of an upscale Orlando resort hotel with a porte-cochere: a bellman with a brass luggage cart full of suitcases next to a clean black SUV, a family checking in. Tropical landscaping, bright day.',
  'stroller': 'A friendly driver in a navy polo folding a baby stroller and placing it into the trunk of a clean black minivan while a young mother holds her toddler nearby, smiling, in front of a Florida vacation home with palm trees. Natural afternoon light.',
  'water-service': 'Inside a clean premium black SUV: a professional chauffeur in a dark suit, turned from the front seat, handing a cold bottle of water to a smiling woman passenger in the tan leather back seat. Soft daylight through tinted windows.',
  'park-dropoff': 'A family with two kids wearing sun hats and small backpacks stepping out of a clean black SUV at a theme park guest drop-off area in Florida, excited, the driver holding the door. Colorful entrance gates blurred in the background, no recognizable characters, castles or logos. Sunny morning.',
  'holiday-home': 'Evening in front of a Florida vacation home decorated with warm Christmas lights, palm trees wrapped in string lights, a clean black SUV parked in the driveway, a family arriving with suitcases, festive and warm mood.',
};
module.exports = { scenes };
if (require.main === module) {
  const names = (process.argv[2] || '').split(',').filter(Boolean);
  for (const n of names) if (!scenes[n]) throw new Error('cena desconhecida ' + n);
  const jobs = names.map(n => ({ n, p: `${BASE} ${scenes[n]}` }));
  process.stdout.write(`const jobs = ${JSON.stringify(jobs)};
const page = await browser.getPage("gemini");
for (const j of jobs) {
  await page.goto("https://gemini.google.com/app", { waitUntil: "commit", timeout: 30000 });
  await page.waitForTimeout(6000);
  const box = page.locator('rich-textarea .ql-editor, div[contenteditable="true"]').first();
  await box.click(); await box.fill(j.p); await page.waitForTimeout(400); await page.keyboard.press('Enter');
  let data = null;
  for (let i = 0; i < 40 && !data; i++) {
    await page.waitForTimeout(5000);
    data = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('model-response img')].filter(i => i.src.startsWith('blob:') && i.complete && i.naturalWidth > 300);
      if (!imgs.length) return null;
      const i = imgs[imgs.length - 1];
      const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight;
      c.getContext('2d').drawImage(i, 0, 0);
      return c.toDataURL('image/jpeg', 0.95);
    });
  }
  if (!data) {
    const msg = await page.evaluate(() => { const r = [...document.querySelectorAll('model-response')].pop(); return r ? r.innerText.slice(0, 200).replace(/\\n+/g, ' ') : 'sem resposta'; });
    console.log('FAIL:' + j.n + ':' + msg);
  } else console.log('IMG:' + j.n + ':' + data);
}
`);
}
