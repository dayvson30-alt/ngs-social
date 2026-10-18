// Fila social da NGS Private Rides. Gera queue.json + cards (1080x1350).
// type: card (headline + accent + body) | list (itens) | price (linhas rota/veiculo)
// lang: 'en' (card em ingles, legenda EN + PT) | 'pt' (card em portugues, legenda PT + EN)
// So fatos confirmados: rotas/precos publicos aprovados 16/10, 24/7, reserva online, WhatsApp, portugues.
const BOOK = 'ngsprivaterides.com/book-now';
const WA = '(321) 317-7254';
const CTA = {
  en: [`Instant quote and booking: ${BOOK}\nText or WhatsApp ${WA}`],
  pt: [`Cotação e reserva na hora: ${BOOK}\nWhatsApp ${WA} (falamos português)`],
};
const TAGS = [
  '#OrlandoAirport #MCO #OrlandoTransfer #DavenportFL #ChampionsGate',
  '#DisneyWorld #OrlandoVacation #KissimmeeFL #PrivateTransfer #MCOAirport',
  '#PortCanaveral #CruiseTransfer #OrlandoTravel #VacationHome #Celebration',
  '#BrasileirosEmOrlando #OrlandoBrasil #TransferOrlando #Disney #Davenport',
];

const posts = [
  { slug: 'intro-landed', lang: 'en', type: 'card', photo: 'airport.jpg',
    label: 'MCO AIRPORT TRANSFER', headline: 'Landed at MCO?', accent: 'Your ride is set.',
    body: 'Private ride to your vacation home, Disney hotel or cruise port. Price fixed when you book.',
    en: `Long flight, tired kids, six suitcases. The last thing you want is to figure out a ride in the arrivals hall.\n\nBook your private ride before you fly. Price is fixed when you book, and it takes you straight to your vacation home, Disney hotel or cruise port.`,
    pt: `Voo longo, criança cansada, seis malas. A última coisa que você quer é resolver transporte no desembarque.\n\nReserve seu transfer privativo antes de embarcar. O preço fica fixo na reserva e o carro te leva direto para a casa de temporada, hotel da Disney ou porto.` },

  { slug: 'price-championsgate', lang: 'en', type: 'price',
    label: 'SAMPLE QUOTES · OCT 2026', headline: 'MCO → ChampionsGate',
    rows: [['Sedan', '$94'], ['SUV', '$124'], ['Minivan', '$138']],
    note: 'Final price depends on address, date and vehicle',
    en: `How much is a ride from Orlando airport to ChampionsGate?\n\nSedan $94. SUV $124. Minivan $138. Sample quotes from October 2026, the exact price shows up on the booking page before you pay.`,
    pt: `Quanto custa do aeroporto de Orlando até ChampionsGate?\n\nSedan $94. SUV $124. Minivan $138. Cotações de exemplo de outubro de 2026, o preço exato aparece na página de reserva antes de pagar.` },

  { slug: 'tip-bags', lang: 'en', type: 'card', photo: 'night-pickup.jpg',
    label: 'ORLANDO TRAVEL TIP', headline: 'Big family, lots of bags?', accent: 'Count the bags.',
    body: 'Tell us passengers and suitcases when you book. We match the vehicle so nothing rides on a lap.',
    en: `Most airport ride problems start with one number nobody counted: the suitcases.\n\nWhen you book, tell us how many people and how many bags, strollers included. We send a vehicle that fits all of it, so nobody spends the drive with a carry-on on their lap.`,
    pt: `A maioria dos problemas de transfer começa com um número que ninguém contou: as malas.\n\nNa reserva, informe quantas pessoas e quantas malas, carrinho de bebê incluído. A gente manda o carro certo, e ninguém vai a viagem inteira com mala no colo.` },

  { slug: 'pt-portugues', lang: 'pt', type: 'card',
    label: 'BRASILEIRO EM ORLANDO?', headline: 'Do aeroporto até a casa,', accent: 'em português.',
    body: 'Transfer privativo saindo do MCO. Reserva online e atendimento no WhatsApp.',
    pt: `Chegou em Orlando e quer resolver o transfer sem se enrolar no inglês?\n\nA NGS é de brasileiros. Você reserva online, paga com preço fixo e fala com a gente em português pelo WhatsApp. Do aeroporto até a casa de temporada, hotel da Disney ou porto.`,
    en: `Brazilian family landing in Orlando? We speak Portuguese.\n\nBook online, fixed price, and talk to us on WhatsApp in your language. MCO to your vacation home, Disney hotel or cruise port.` },

  { slug: 'list-why', lang: 'en', type: 'list', photo: 'suv-interior.jpg',
    label: 'WHY A PRIVATE RIDE', headline: 'Know it before you land.',
    items: ['Price fixed at booking', 'Just your group in the car', 'Straight to your door', 'Booked online in minutes'],
    en: `Why book a private ride instead of figuring it out at the curb?\n\nThe price is fixed when you book. It's just your group in the car. It goes straight to your door, no stops for other passengers. And you book it online in a few minutes, before you even pack.`,
    pt: `Por que reservar um transfer privativo em vez de resolver na hora?\n\nO preço fica fixo na reserva. Só o seu grupo no carro. Direto para a porta, sem parar para outros passageiros. E você reserva online em poucos minutos, antes mesmo de fazer a mala.` },

  { slug: 'tip-terminal', lang: 'en', type: 'card', photo: 'terminal.jpg',
    label: 'MCO TIP', headline: 'Which terminal?', accent: 'A, B or C.',
    body: 'Terminal C is a separate building from A and B. Check your airline before you land.',
    en: `Orlando airport has three terminals, and Terminal C is a separate building from A and B.\n\nCheck which one your airline uses before you land. It saves a long walk with the luggage cart.`,
    pt: `O aeroporto de Orlando tem três terminais, e o Terminal C fica num prédio separado do A e do B.\n\nConfira qual terminal sua companhia usa antes de pousar. Evita uma caminhada longa empurrando o carrinho de malas.` },

  { slug: 'price-disney-springs', lang: 'en', type: 'price',
    label: 'SAMPLE QUOTE · OCT 2026', headline: 'MCO → Disney Springs',
    rows: [['Sedan', '$76']],
    note: 'Final price depends on address, date and vehicle',
    en: `Orlando airport to Disney Springs in a private sedan: $76.\n\nSample quote from October 2026. Put in your exact address and date on the booking page and the real price shows up before you pay.`,
    pt: `Do aeroporto de Orlando até Disney Springs de sedan privativo: $76.\n\nCotação de exemplo de outubro de 2026. Coloque endereço e data na página de reserva e o preço real aparece antes de pagar.` },

  { slug: 'tip-gate', lang: 'en', type: 'card', photo: 'vacation-home.jpg',
    label: 'VACATION HOME TIP', headline: 'Gated community?', accent: 'Send the code.',
    body: 'Add the house number and gate code to your booking notes. The driver goes right to your door.',
    en: `Most vacation home communities around Davenport and ChampionsGate have a gate.\n\nPut the full address, house number and gate code in your booking notes. The driver goes right to your door instead of waiting at the entrance.`,
    pt: `A maioria dos condomínios de casas de temporada em Davenport e ChampionsGate tem portão.\n\nColoque o endereço completo, número da casa e código do portão nas observações da reserva. O motorista vai direto até a porta em vez de esperar na entrada.` },

  { slug: 'card-247', lang: 'en', type: 'card', photo: 'night-pickup.jpg',
    label: '24/7', headline: 'Landing at 1am?', accent: "We're up.",
    body: 'Rides run around the clock. Book ahead and the price is set before you fly.',
    en: `Red-eye landing at 1am? We're up.\n\nRides run 24/7. Book ahead and the price is set before you take off, so you're not negotiating anything half asleep.`,
    pt: `Pousando à 1 da manhã? A gente está acordado.\n\nTransfer 24 horas. Reserve antes e o preço já fica definido antes de você embarcar, nada de negociar meio dormindo.` },

  { slug: 'list-howto', lang: 'en', type: 'list',
    label: 'HOW TO BOOK', headline: 'Four steps, no calls.',
    items: ['Open ngsprivaterides.com', 'Enter pickup and drop-off', 'Pick your vehicle', 'Pay online. Done.'],
    en: `Booking takes about as long as reading this.\n\n1. Go to ngsprivaterides.com/book-now\n2. Enter pickup and drop-off\n3. Pick your vehicle\n4. Pay online\n\nYou get the confirmation by email. Questions? Text or WhatsApp us.`,
    pt: `Reservar leva o tempo de ler este post.\n\n1. Entre em ngsprivaterides.com/book-now\n2. Coloque origem e destino\n3. Escolha o veículo\n4. Pague online\n\nA confirmação chega por e-mail. Dúvida? Chama no WhatsApp.` },

  { slug: 'pt-quanto-custa', lang: 'pt', type: 'price',
    label: 'COTAÇÕES DE EXEMPLO · OUT 2026', headline: 'Quanto custa do MCO?',
    rows: [['Disney Springs · Sedan', '$76'], ['ChampionsGate · Sedan', '$94'], ['ChampionsGate · SUV', '$124']],
    note: 'Preço final depende do endereço, data e veículo',
    pt: `Quanto custa um transfer do aeroporto de Orlando?\n\nDisney Springs de sedan: $76. ChampionsGate de sedan: $94, de SUV: $124. Cotações de exemplo de outubro de 2026. O preço exato aparece na reserva antes de pagar.`,
    en: `How much from Orlando airport? Disney Springs by sedan $76. ChampionsGate by sedan $94, SUV $124. Sample quotes, October 2026.` },

  { slug: 'tip-cruise', lang: 'en', type: 'card',
    label: 'CRUISE DAY', headline: 'Port Canaveral?', accent: 'Leave early.',
    body: 'Count on about an hour or more from Orlando. Plan your pickup around your boarding time.',
    en: `Cruising out of Port Canaveral? Count on about an hour or more from the Orlando area, more on a weekend morning.\n\nCheck your boarding time on the cruise line app and book your pickup with room to spare. The ship won't wait for traffic on 528.`,
    pt: `Vai fazer cruzeiro saindo de Port Canaveral? Conte com cerca de uma hora ou mais saindo da região de Orlando, mais num sábado de manhã.\n\nConfira o horário de embarque no app do cruzeiro e reserve o transfer com folga. O navio não espera o trânsito da 528.` },

  { slug: 'list-vehicles', lang: 'en', type: 'list', photo: 'fleet.jpg',
    label: 'PICK YOUR VEHICLE', headline: 'One size does not fit all.',
    items: ['Sedan · couples, light bags', 'SUV · families, more bags', 'Minivan · the whole family', 'Van · groups'],
    en: `Two people with carry-ons and a family of six with checked bags don't need the same car.\n\nSedan for couples and light luggage. SUV for families with more bags. Minivan when the whole family comes. Van for groups. Not sure? Tell us people and bags and we'll point you to the right one.`,
    pt: `Um casal com mala de mão e uma família de seis com malas despachadas não precisam do mesmo carro.\n\nSedan para casal e pouca bagagem. SUV para família com mais malas. Minivan quando vem a família toda. Van para grupos. Na dúvida, diga pessoas e malas que a gente indica.` },

  { slug: 'tip-return', lang: 'en', type: 'card',
    label: 'TRAVEL TIP', headline: 'Booking the arrival?', accent: 'Book the return too.',
    body: 'One less thing to think about on your last day of vacation.',
    en: `Booking your ride from the airport? Book the ride back at the same time.\n\nThe last day of a vacation is already packing, checkout and one more park. Having the airport ride set is one less thing to think about.`,
    pt: `Reservando o transfer de chegada? Reserve a volta junto.\n\nO último dia de viagem já tem mala, checkout e mais um parque. Ter a ida ao aeroporto resolvida é uma preocupação a menos.` },

  { slug: 'pt-primeira-vez', lang: 'pt', type: 'card', photo: 'airport.jpg',
    label: 'PRIMEIRA VEZ EM ORLANDO?', headline: 'Reserve o transfer', accent: 'antes de voar.',
    body: 'Preço fixo, carro só da sua família e atendimento em português.',
    pt: `Primeira viagem para Orlando? Deixe o transfer resolvido antes de embarcar.\n\nVocê chega cansado, com malas e criança, e não precisa negociar nada nem baixar app no desembarque. Preço fixo, carro só da sua família e atendimento em português pelo WhatsApp.`,
    en: `First time in Orlando? Book your airport ride before you fly. Fixed price, private car, and we speak Portuguese too.` },

  { slug: 'tip-tsa', lang: 'en', type: 'card', photo: 'terminal.jpg',
    label: 'FLYING HOME', headline: 'Leaving from MCO?', accent: '2 hours. Minimum.',
    body: 'Two hours before domestic flights, three before international. Set the pickup from there.',
    en: `Flying home from Orlando? Security lines at MCO get long, especially on weekends and holidays.\n\nPlan to be at the airport two hours before a domestic flight and three before an international one. Work backwards from that to set your pickup time.`,
    pt: `Voltando para casa por Orlando? A fila de segurança do MCO fica longa, principalmente em fim de semana e feriado.\n\nChegue ao aeroporto duas horas antes de voo doméstico e três antes de internacional (Brasil é internacional). Calcule o horário de busca a partir disso.` },

  { slug: 'list-areas', lang: 'en', type: 'list',
    label: 'WHERE WE GO', headline: 'From MCO to:',
    items: ['Disney hotels', 'Orlando & Kissimmee hotels', 'Davenport & ChampionsGate homes', 'Port Canaveral'],
    en: `Where do we go from Orlando airport?\n\nDisney hotels. Hotels across Orlando, Kissimmee and Celebration. Vacation homes in Davenport and ChampionsGate. And the cruise terminals at Port Canaveral. Not on the list? Put the address in the booking page and see the price.`,
    pt: `Para onde a gente vai saindo do aeroporto de Orlando?\n\nHotéis da Disney. Hotéis em Orlando, Kissimmee e Celebration. Casas de temporada em Davenport e ChampionsGate. E os terminais de cruzeiro de Port Canaveral. Não está na lista? Coloque o endereço na reserva e veja o preço.` },

  { slug: 'tip-luggage-hold', lang: 'en', type: 'card',
    label: 'DISNEY HOTEL TIP', headline: 'Landing early?', accent: 'Drop the bags first.',
    body: 'Hotels usually hold luggage before check-in. Drop bags, then go enjoy the day.',
    en: `Morning flight, but check-in isn't until afternoon?\n\nMost hotels, Disney resorts included, hold your luggage before your room is ready. Go straight from the airport, drop the bags at the front desk, and start the vacation.`,
    pt: `Voo de manhã e o check-in só à tarde?\n\nA maioria dos hotéis, inclusive os da Disney, guarda as malas antes do quarto ficar pronto. Vá direto do aeroporto, deixe as malas na recepção e comece a viagem.` },

  { slug: 'price-van', lang: 'en', type: 'price', photo: 'fleet.jpg',
    label: 'SAMPLE QUOTE · OCT 2026', headline: 'Big group? MCO → ChampionsGate',
    rows: [['Van', '$189']],
    note: 'Whole group, one vehicle · final price depends on address and date',
    en: `Traveling with a big group? Keep everyone in one vehicle.\n\nVan from Orlando airport to ChampionsGate: $189 (sample quote, October 2026). No splitting into two cars, no one waiting at the curb for the second ride.`,
    pt: `Viajando com um grupo grande? Todo mundo no mesmo carro.\n\nVan do aeroporto de Orlando até ChampionsGate: $189 (cotação de exemplo, outubro de 2026). Sem dividir em dois carros e ninguém esperando o segundo na calçada.` },

  { slug: 'tip-stroller', lang: 'en', type: 'card',
    label: 'TRAVELING WITH KIDS', headline: 'Stroller? Wheelchair?', accent: 'Tell us.',
    body: 'They take trunk space. Add them to your booking notes so we send the right vehicle.',
    en: `Strollers, wheelchairs, golf bags: they all take trunk space.\n\nAdd them in the booking notes. We'll make sure the vehicle fits your group and everything you're bringing.`,
    pt: `Carrinho de bebê, cadeira de rodas, bolsa de golfe: tudo ocupa porta-malas.\n\nColoque nas observações da reserva. A gente garante que o carro comporta o grupo e tudo que vocês estão levando.` },

  { slug: 'pt-cruzeiro', lang: 'pt', type: 'card',
    label: 'VAI FAZER CRUZEIRO?', headline: 'Do aeroporto ou da casa', accent: 'até o porto.',
    body: 'Transfer privativo para Port Canaveral, com tempo de sobra para o embarque.',
    pt: `Cruzeiro saindo de Port Canaveral? A gente leva.\n\nDo aeroporto, do hotel ou da casa de temporada direto ao terminal, só a sua família no carro. São cerca de uma hora ou mais de Orlando, então reserve com folga para o horário de embarque.`,
    en: `Cruise out of Port Canaveral? Private ride from the airport, your hotel or vacation home straight to the terminal.` },

  { slug: 'list-cruise', lang: 'en', type: 'list',
    label: 'CRUISE DAY CHECKLIST', headline: 'Before you leave the house:',
    items: ['Passports in the carry-on', 'Boarding time confirmed', 'Luggage tags on the bags', 'Ride to the port booked'],
    en: `Cruise day checklist before you walk out the door:\n\nPassports and documents in the carry-on, not the big suitcase. Boarding time confirmed in the cruise line app. Luggage tags on every checked bag. And your ride to the port booked ahead.`,
    pt: `Checklist do dia do cruzeiro antes de sair de casa:\n\nPassaportes e documentos na mala de mão, não na mala grande. Horário de embarque confirmado no app do cruzeiro. Etiqueta em toda mala despachada. E o transfer até o porto já reservado.` },

  { slug: 'card-fixed', lang: 'en', type: 'card', photo: 'suv-interior.jpg',
    label: 'FIXED PRICE', headline: 'Want the price before you land?', accent: 'Book it fixed.',
    body: 'See the exact price online, pay when you book, nothing changes when you arrive.',
    en: `Want to know what the ride costs before you board the plane?\n\nPut your addresses in the booking page, see the exact price, pay online. The price you saw is the price of the ride.`,
    pt: `Quer saber quanto custa o transfer antes de entrar no avião?\n\nColoque os endereços na página de reserva, veja o preço exato e pague online. O preço que você viu é o preço da corrida.` },

  { slug: 'tip-port-to-mco', lang: 'en', type: 'card',
    label: 'CRUISE ENDS', headline: 'Ship docks, flight later?', accent: 'Port to MCO.',
    body: 'Book the ride from Port Canaveral back to the airport and leave the morning easy.',
    en: `Cruise over, flight home in the afternoon?\n\nBook your ride from Port Canaveral back to Orlando airport ahead of time. Walk off the ship, find your ride, and go.`,
    pt: `Acabou o cruzeiro e o voo é à tarde?\n\nReserve o transfer de Port Canaveral até o aeroporto de Orlando com antecedência. Desce do navio, encontra o carro e segue.` },

  { slug: 'list-what', lang: 'en', type: 'list',
    label: 'WHAT YOU GET', headline: 'Every ride:',
    items: ['Just your group in the car', 'Price fixed at booking', 'Online booking and payment', 'Text or WhatsApp support'],
    en: `What every ride includes:\n\nJust your group in the car. Price fixed at booking. Book and pay online. And a real person on text or WhatsApp if anything changes with your flight or plans.`,
    pt: `O que toda corrida inclui:\n\nSó o seu grupo no carro. Preço fixo na reserva. Reserva e pagamento online. E uma pessoa de verdade no WhatsApp se algo mudar no voo ou nos planos.` },

  { slug: 'pt-casa-temporada', lang: 'pt', type: 'card', photo: 'vacation-home.jpg',
    label: 'CASA DE TEMPORADA', headline: 'Davenport, ChampionsGate,', accent: 'direto na porta.',
    body: 'Mande o endereço e o código do portão. O motorista vai até a casa.',
    pt: `Alugou casa em Davenport ou ChampionsGate?\n\nNa reserva, coloque o endereço completo, número da casa e o código do portão do condomínio. O motorista vai direto até a porta, sem ficar esperando na portaria.`,
    en: `Vacation home in Davenport or ChampionsGate? Add the house number and gate code to your booking and we drive right to your door.` },

  { slug: 'tip-park', lang: 'en', type: 'card',
    label: 'PARK DAY', headline: 'Skip the parking lot.', accent: 'Get dropped off.',
    body: 'Park parking adds up fast. A private drop-off takes you to the guest drop-off area.',
    en: `Theme park parking adds up fast over a week, and so does the walk from the far end of the lot.\n\nA private ride drops your group at the guest drop-off area and picks you up when you're done.`,
    pt: `Estacionamento de parque sai caro numa semana inteira, e a caminhada do fundo do estacionamento também cansa.\n\nO transfer privativo deixa seu grupo na área de desembarque e busca na volta.` },

  { slug: 'card-winter', lang: 'en', type: 'card',
    label: 'HOLIDAY SEASON', headline: 'Coming for the holidays?', accent: 'Book early.',
    body: 'December is one of the busiest months at MCO. Lock your ride in now.',
    en: `Coming to Orlando for the holidays? December is one of the busiest stretches of the year at MCO.\n\nBook your airport ride now, while your dates are set, and stop thinking about it.`,
    pt: `Vem para Orlando nas festas? Dezembro é um dos períodos mais movimentados do ano no MCO.\n\nReserve o transfer agora, com as datas já definidas, e esqueça esse assunto.` },

  { slug: 'card-local', lang: 'en', type: 'card',
    label: 'NGS PRIVATE RIDES', headline: 'Based in Davenport.', accent: 'Next door to your rental.',
    body: 'We know the vacation home communities, the gates and the shortcuts.',
    en: `We're based in Davenport, right in the middle of the vacation home communities between Orlando and the parks.\n\nThat means we know the gates, the clubhouses and how long the drive really takes. Book your ride from MCO in a few minutes.`,
    pt: `A NGS fica em Davenport, no meio dos condomínios de casas de temporada entre Orlando e os parques.\n\nA gente conhece os portões, as entradas e quanto tempo a viagem leva de verdade. Reserve seu transfer do MCO em poucos minutos.` },
];

module.exports = { posts, CTA, TAGS, BOOK, WA };
