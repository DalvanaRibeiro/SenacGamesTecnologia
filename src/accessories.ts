export type Slot = 'head' | 'eyes' | 'mouth' | 'hair' | 'neck';
export interface Accessory { id:string; name:string; slot:Slot; art:string; ratio:number }
const svg=(body:string)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 120">${body}</svg>`;
export const items:Accessory[]=[
{id:'hat',name:'Cartola',slot:'head',ratio:1.65,art:svg('<rect x="57" y="5" width="126" height="91" rx="12" fill="#18202e"/><path d="M57 75H183V94H57Z" fill="#ef9b24"/><ellipse cx="120" cy="100" rx="116" ry="17" fill="#18202e"/>')},
{id:'crown',name:'Coroa',slot:'head',ratio:1.5,art:svg('<path d="M20 105L5 15 70 62 120 3 170 62 235 15 220 105Z" fill="#ffc83d" stroke="#bc7614" stroke-width="5"/><circle cx="120" cy="75" r="12" fill="#e43e65"/>')},
{id:'cap',name:'Boné Tech',slot:'head',ratio:1.5,art:svg('<path d="M20 90Q12 0 110 5Q202 5 200 90Z" fill="#0757a5"/><path d="M100 83Q240 65 237 100Q170 125 100 98Z" fill="#ff941e"/><text x="105" y="60" fill="white" text-anchor="middle" font-size="22" font-family="sans-serif">TECH</text>')},
{id:'glasses',name:'Óculos escuros',slot:'eyes',ratio:2.1,art:svg('<g fill="#14202e" stroke="#070b11" stroke-width="8"><rect x="5" y="25" width="105" height="65" rx="22"/><rect x="130" y="25" width="105" height="65" rx="22"/><path d="M110 48H130"/></g><path d="M20 40L70 35M145 40L195 35" stroke="#8096aa" stroke-width="5"/>')},
{id:'heart',name:'Óculos coração',slot:'eyes',ratio:2.1,art:svg('<g fill="#f04c80" fill-opacity=".8" stroke="#a61b49" stroke-width="5"><path d="M60 105Q-20 45 15 20Q40 0 60 30Q85 0 108 20Q140 45 60 105Z"/><path d="M180 105Q100 45 135 20Q160 0 180 30Q205 0 228 20Q260 45 180 105Z"/><path d="M110 48H130"/></g>')},
{id:'mustache',name:'Bigode clássico',slot:'mouth',ratio:1.05,art:svg('<path d="M120 50Q85 5 48 55Q20 85 3 45Q-5 120 70 105Q103 100 120 75Q137 100 170 105Q245 120 237 45Q220 85 192 55Q155 5 120 50Z" fill="#35241c"/>')},
{id:'pink',name:'Cabelo rosa',slot:'hair',ratio:1.85,art:svg('<path d="M5 120Q-5 5 70 5Q110 -5 120 18Q150 -5 190 10Q245 30 235 120L205 120Q210 45 175 45Q125 95 75 45Q35 60 35 120Z" fill="#ed459c"/>')},
{id:'blue',name:'Cabelo azul',slot:'hair',ratio:1.85,art:svg('<path d="M5 115L15 35 45 55 55 5 95 38 120 0 145 38 185 5 195 55 225 35 235 115 205 115 195 75 45 75 35 115Z" fill="#25a9ed"/>')},
{id:'bow',name:'Gravata borboleta',slot:'neck',ratio:1.1,art:svg('<path d="M110 50L10 10V110L110 70M130 50L230 10V110L130 70" fill="#e94c42"/><rect x="100" y="40" width="40" height="40" rx="8" fill="#a91d25"/>')}
];
// Catálogo adicional: artes vetoriais independentes, sem dependências externas.
const add=(id:string,name:string,slot:Slot,ratio:number,body:string)=>items.push({id,name,slot,ratio,art:svg(body)});
const hat=(color:string,band:string)=>`<path d="M45 94L60 12Q120 -3 180 12L195 94Z" fill="${color}"/><path d="M50 72H190V94H50Z" fill="${band}"/><ellipse cx="120" cy="100" rx="118" ry="16" fill="${color}"/>`;
add('wizard','Mago','head',1.7,'<path d="M48 95L135 0 190 95Z" fill="#6639b8"/><ellipse cx="120" cy="100" rx="116" ry="15" fill="#492782"/><text x="125" y="70" font-size="35" fill="#ffe77a">★</text>');
add('cowboy','Cowboy','head',1.8,'<path d="M60 90L70 20Q100 0 120 25Q145 0 170 20L185 90Z" fill="#a66b36"/><path d="M0 65Q55 105 120 80Q185 105 240 65Q225 120 120 115Q15 120 0 65" fill="#b98145"/>');
add('pirate','Pirata','head',1.7,'<path d="M5 100Q10 20 65 40L120 5 175 40Q230 20 235 100Z" fill="#252532"/><circle cx="120" cy="55" r="22" fill="white"/><path d="M100 83L140 35M100 35L140 83" stroke="white" stroke-width="7"/><circle cx="112" cy="53" r="5"/><circle cx="128" cy="53" r="5"/>');
add('chef','Chef','head',1.5,'<g fill="#fff" stroke="#b8c9d8" stroke-width="3"><circle cx="65" cy="42" r="40"/><circle cx="120" cy="35" r="35"/><circle cx="175" cy="42" r="40"/><rect x="55" y="55" width="130" height="60" rx="8"/></g>');
add('fedora','Fedora','head',1.6,hat('#98734d','#332c28'));
add('party','Festa','head',1.2,'<path d="M55 112L120 8 185 112Z" fill="#ef479c"/><path d="M78 75L151 57M65 97L170 80" stroke="#ffdf63" stroke-width="12"/><circle cx="120" cy="10" r="10" fill="#ffe066"/>');
add('helmet','Capacete','head',1.6,'<path d="M20 98Q20 5 120 5Q220 5 220 98Z" fill="#ffc21b"/><path d="M110 5H130V98H110Z" fill="#f39412"/><rect x="5" y="92" width="230" height="18" rx="9" fill="#e9a20a"/>');
add('santa','Noel','head',1.6,'<path d="M35 100Q40 5 120 8Q190 8 225 70L190 75 170 45 185 100Z" fill="#e43b45"/><rect x="25" y="88" width="170" height="25" rx="12" fill="white"/><circle cx="225" cy="72" r="14" fill="white"/>');
add('viking','Viking','head',1.8,'<path d="M60 90Q0 75 5 5Q35 50 75 45M180 90Q240 75 235 5Q205 50 165 45" fill="#f4e0b0"/><path d="M40 110Q40 15 120 15Q200 15 200 110Z" fill="#8494a4"/><path d="M110 15H130V110H110Z" fill="#d5dce5"/>');
add('halo','Aur éola'.replace(' ',''),'head',1.5,'<ellipse cx="120" cy="60" rx="105" ry="30" fill="none" stroke="#ffda43" stroke-width="14"/>');
const specs=(shape:string,color:string,lens:string)=>`<g fill="${lens}" stroke="${color}" stroke-width="8">${shape}<path d="M105 55Q120 43 135 55" fill="none"/></g>`;
const round='<circle cx="57" cy="60" r="47"/><circle cx="183" cy="60" r="47"/>';
const square='<rect x="8" y="23" width="100" height="74" rx="8"/><rect x="132" y="23" width="100" height="74" rx="8"/>';
add('round','Redondo','eyes',1.25,specs(round,'#d6a93e','#bceaff55'));
add('nerd','Nerd','eyes',1.3,specs(square,'#161d32','#c8f4ff44'));
add('neon','Neon','eyes',1.3,specs(square,'#28f4c4','#123b70aa'));
add('pinkgl','Rosa','eyes',1.3,specs(round,'#f44d9b','#f9a8d488'));
add('aviator','Aviador','eyes',1.3,specs('<path d="M8 30Q55 10 105 30L95 83Q55 120 20 82Z"/><path d="M135 30Q185 10 232 30L220 82Q185 120 145 83Z"/>','#e3b44b','#35576cbb'));
add('star','Estrelas','eyes',1.4,specs('<path d="M57 5L72 39 110 43 82 68 91 108 57 87 23 108 32 68 4 43 42 39Z"/><path d="M183 5L198 39 236 43 208 68 217 108 183 87 149 108 158 68 130 43 168 39Z"/>','#efb922','#ffe37caa'));
add('vr','Visor VR','eyes',1.4,'<rect x="3" y="18" width="234" height="84" rx="25" fill="#202d42"/><rect x="18" y="30" width="204" height="60" rx="20" fill="#497ce1"/><path d="M40 45H200" stroke="#83eaff" stroke-width="5"/>');
add('pixel','Pixel','eyes',1.4,'<path d="M0 25H240V50H220V75H145V50H95V75H20V50H0Z" fill="#171717"/><path d="M25 35H45V45H25M155 35H175V45H155" stroke="white" stroke-width="5"/>');
const moust=(c:string)=>`<path d="M120 45Q85 5 45 55Q15 85 2 45Q0 115 70 105Q100 100 120 70Q140 100 170 105Q240 115 238 45Q225 85 195 55Q155 5 120 45Z" fill="${c}"/>`;
add('ginger','Bigode ruivo','mouth',.85,moust('#c75c25'));
add('white','Bigode branco','mouth',.85,moust('#f3f4f6'));
add('thin','Bigode fino','mouth',.75,'<path d="M10 70Q65 15 120 55Q175 15 230 70Q175 50 120 75Q65 50 10 70" fill="#302018"/>');
add('curl','Bigode curvo','mouth',.9,'<path d="M120 60Q80 20 50 65Q15 100 15 50Q0 30 5 70Q15 130 80 90L120 75 160 90Q225 130 235 70Q240 30 225 50Q225 100 190 65Q160 20 120 60" fill="#211b20"/>');
add('lips','Batom','mouth',.65,'<path d="M5 60Q75 5 120 35Q165 5 235 60Q120 135 5 60Z" fill="#d92360"/><path d="M5 60Q120 80 235 60" stroke="#8f1641" stroke-width="5"/>');
const hair=(c:string)=>`<path d="M5 120Q-5 0 75 5Q120 -5 165 5Q245 0 235 120L205 120Q210 45 175 45Q125 95 75 45Q35 60 35 120Z" fill="${c}"/>`;
add('goldhair','Loiro','hair',1.45,hair('#e6b74c'));
add('redhair','Ruivo','hair',1.45,hair('#b74723'));
add('purplehair','Roxo','hair',1.45,hair('#8d45d7'));
add('curly','Cacheado','hair',1.55,'<g fill="#4b2c20">'+Array.from({length:9},(_,i)=>`<circle cx="${25+i*24}" cy="${i===0||i===8?65:35}" r="30"/>`).join('')+'</g>');
add('mohawk','Moicano','hair',1.2,'<path d="M40 110L65 40 85 65 110 0 135 45 165 5 180 65 200 40 210 110Z" fill="#39d36b"/>');
add('tie','Gravata','neck',.85,'<path d="M95 5H145L135 28 155 95 120 120 85 95 105 28Z" fill="#1678cc"/>');
add('medal','Medalha','neck',1.1,'<path d="M45 0L120 75 195 0" fill="none" stroke="#e94d4d" stroke-width="24"/><circle cx="120" cy="82" r="35" fill="#ffcf42" stroke="#ba861b" stroke-width="5"/><text x="120" y="96" text-anchor="middle" font-size="38" fill="#fff">★</text>');
export const artUrl=(a:Accessory)=>`data:image/svg+xml;charset=utf-8,${encodeURIComponent(a.art)}`;
