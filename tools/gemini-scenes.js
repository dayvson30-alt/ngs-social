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
  'curb-welcome': 'Orlando airport arrivals curb OUTSIDE the terminal, bright day: a friendly driver dressed smart casual (navy polo shirt tucked into dark blue jeans, brown belt, clean sneakers, no suit, no tie, no jacket) standing next to the open trunk of a clean black SUV parked at the curb, smiling and lifting a suitcase into the trunk while a happy Latin family (parents and two kids) with a luggage cart walks up to him from the sidewalk. Terminal glass facade and palm trees blurred behind, cars at the curb. No signs held by anyone.',
  'park-dropoff': 'A family with two kids wearing sun hats and small backpacks stepping out of a clean black SUV at a theme park guest drop-off area in Florida, excited, the driver holding the door. Colorful entrance gates blurred in the background, no recognizable characters, castles or logos. Sunny morning.',
  'flight-tracking': 'Orlando airport arrivals area, bright day: a professional chauffeur in a dark navy suit standing near the arrivals exit, checking a flight tracking app on his smartphone (screen facing him, not visible to camera), calm and attentive. Travelers with rolling luggage walking in the soft-focus background, large windows with palm trees outside.',
  'arrivals-welcome': 'Airport arrivals exit in Orlando: a smiling professional driver in a dark suit holding a blank white welcome sign with no writing, greeting a happy Latin family (parents and two kids) pushing a luggage cart toward him. Warm, welcoming mood, natural daylight, palm trees through the glass.',
  'holiday-home':'Evening in front of a Florida vacation home decorated with warm Christmas lights, palm trees wrapped in string lights, a clean black SUV parked in the driveway, a family arriving with suitcases, festive and warm mood.',
  'ad-resident': 'Morning in the driveway of a tidy single-story Central Florida retirement-community home with palm trees and manicured lawn: a professional chauffeur in a navy polo shirt holding open the rear passenger door of a clean black luxury SUV for a cheerful senior couple in their sixties, a rolling suitcase beside them, relaxed and confident mood. Soft warm sunrise light, three-quarter view.',
  'ad-carseat': 'Interior of a clean premium black luxury SUV photographed from the open rear door: a child car safety seat properly installed on the tan leather back seat, seatbelts neat, bottle of water in the cup holder, soft daylight through lightly tinted windows, tidy and upscale, no people.',
  'ad-resident-a': 'Morning in the driveway of a tidy single-story Central Florida retirement-community home with palm trees: a professional chauffeur in a navy polo shirt holding open the rear passenger door of a clean black full-size luxury SUV for a cheerful senior couple in their sixties, a rolling suitcase beside them. The SUV is a correct, realistic, standard production full-size SUV with accurate proportions and intact bodywork: four normal doors, a single solid rear tailgate at the back, no extra doors on the rear, no distorted or duplicated panels. Three-quarter FRONT view with the front of the SUV nearest the camera. Soft warm sunrise light, relaxed confident mood.',
  'fleet-palms-a': 'Wide landscape 16:9 composition. Four clean, glossy black passenger vehicles parked side by side in a neat row on clean light-grey pavement, slight three-quarter front view: a full-size luxury sedan, a full-size luxury SUV, a modern minivan, and a high-roof passenger van. Behind them a line of tall royal palm trees against a clear deep-blue Florida sky, lush green hedge at their base. Bright late-morning sun, crisp reflections on the paint. Every vehicle is a correct, realistic, standard production model with accurate proportions, symmetric headlights, four round wheels, intact bodywork, no duplicated or melted panels. Tack-sharp focus across all four vehicles, high detail, professional automotive fleet photo, no people.',
  'fleet-palms-b': 'Wide landscape 16:9 composition, eye-level automotive photograph. A fleet of four clean black vehicles lined up diagonally in a row on a clean paved lot: luxury sedan in front, then a full-size SUV, a minivan and a high-roof passenger van at the back. Tall royal palm trees and a blue sky with a few soft white clouds behind, warm golden-hour side light, long soft shadows. Vehicles are realistic standard production models with accurate proportions, correct wheels and intact bodywork, no distortion. Sharp focus, high resolution detail, premium chauffeur-service advertising photo, no people.',
  'ad-resident-b':'Morning in front of a tidy single-story Central Florida retirement-community home with palm trees: a professional chauffeur in a navy polo shirt warmly greeting a cheerful senior couple in their sixties next to a clean black luxury SUV, a rolling suitcase beside them. Tight composition showing only the front half of the SUV (hood, front door, side mirror) so the rear of the vehicle is out of frame. Realistic standard SUV bodywork, no distortion. Soft warm sunrise light, friendly mood.',
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
