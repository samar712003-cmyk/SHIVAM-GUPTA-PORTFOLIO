const photos = window.PHOTOS || [];
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const esc = (s='') => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const ASSET = './';

// Visual category map: manually curated from the recovered photo library.
// The old database genres were mixed up in several ID ranges, so the website uses
// a hand-checked classification based on the actual images.
const PHOTO_CATEGORY = new Map();
const assign = (label, ids) => ids.forEach(id => PHOTO_CATEGORY.set(id, label));
assign('PRODUCT', [
  ...Array.from({length:23}, (_,i)=>i+1),
  59,60,61,62,67,68,69,75,98,99,102,107,108,109,110,113
]);
assign('FASHION', [
  27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,43,44,45,46,47,48,49,50,51,52,53,
  63,64,65,66,70,71,73,74,76,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97
]);
assign('PORTRAIT', [42,72,100,101,103,105,106]);
assign('ARCHITECTURE / INTERIORS', [54,55,56,57,58,116]);
assign('STREET / DOCUMENTARY', [111,114,115,117,119,120,122]);
assign('WEDDING', [112,118,121,123]);

const categoryFor = p => PHOTO_CATEGORY.get(Number(p?.id)) || 'FASHION';
const cats = ['ALL','FASHION','PRODUCT','PORTRAIT','ARCHITECTURE / INTERIORS','STREET / DOCUMENTARY','WEDDING'];

const work = [
  {title:"Kellogg's Froot Loops — Cinematic Reel",type:'AI / VIDEO',group:'ai',thumb:'kelloggs.jpg',orientation:'landscape',url:'https://drive.google.com/file/d/1RrjhbxmL0vhKhIDnj0AT4u-XoCfrDBoJ/view?usp=drive_link'},
  {title:'Adidas — UGC AI',type:'AI / UGC',group:'ai',thumb:'adidas.webp',orientation:'portrait',url:'https://drive.google.com/file/d/1e6fFmrJSNP4tuRK1VKXkjrSyiuBIMQb0/view?usp=drive_link'},
  {title:'Hand Fan — AI Reel',type:'AI / VIDEO',group:'ai',thumb:'handfan.webp',orientation:'portrait',url:'https://drive.google.com/file/d/14Rw0wM22r4CwfuToBgvl_KAyTjdiHg5d/view?usp=drive_link'},
  {title:'NIVEA — Product Film + UGC',type:'AI / CAMPAIGN',group:'ai',thumb:'nivea.png',secondaryThumb:'nivea-ugc.jpg',orientation:'landscape',url:'https://drive.google.com/file/d/1tVyyb6ryYyQKy1PKZHyn2jCEGE0YmrA/view?usp=drive_link'},
  {title:'Dilkush Sweets — Concept Film',type:'AI / CONCEPT',group:'ai',thumb:'dilkush.webp',orientation:'landscape',url:'https://drive.google.com/file/d/1p5zSR3sZGv_PWbBOak6VM47j6u_SsqiZ/view?usp=drive_link'},
  {title:'Sparrow Interactive — AI Reel',type:'AI / VIDEO',group:'ai',thumb:'sparrow.webp',orientation:'landscape',url:'https://drive.google.com/file/d/1xy2Or2QooJ5Ef2AMDGEsdJNvwLaBQNtB/view?usp=drive_link'},
  {title:'Ambience Mall, Gurugram',type:'SHOT + EDIT',group:'film',thumb:'ambience.webp',orientation:'portrait',url:'https://drive.google.com/file/d/193-xljPf789ig34KLzgfwr_K_v09AhwX/view?usp=drive_link'},
  {title:'SNITCH — Social Reel',type:'SHOT + EDIT',group:'film',thumb:'snitch.webp',orientation:'portrait',url:'https://drive.google.com/file/d/1WDdeSeoaOr5dyQZs0hxv6rFFtvUz0Yq9/view?usp=drive_link'},
  {title:'BMW — Walkinn',type:'SHOT + EDIT',group:'film',thumb:'bmw.webp',orientation:'portrait',url:'https://drive.google.com/file/d/1AScGxXUNVxqFLwjjg71D_7j8t7Gy6L4z/view?usp=drive_link'},
  {title:'High-End Jewellery Shoot',type:'SHOT + EDIT',group:'film',thumb:'jewellery.webp',orientation:'portrait',url:'https://drive.google.com/file/d/1ByVNHlo42FllklM9BwkYUgX2tEwJXX8V/view?usp=drive_link'},
  {title:'Perfora — Assignment',type:'SHOT + EDIT',group:'film',thumb:'perfora.webp',orientation:'portrait',url:'https://drive.google.com/file/d/14tekMS6D0SwAUXjSjibh2BEvUobiHWNK/view?usp=drive_link'},
  {title:'Mission Buniyaad / Super 100 — Documentary',type:'DOCUMENTARY',group:'documentary',thumb:'mission-buniyaad.webp',orientation:'landscape',url:'https://drive.google.com/file/d/1FtVxHusyyztcPD9SUoNghM5wYAd3Pkn5/view?usp=drive_link'},
  {title:'Mission Buniyaad — Music Video',type:'SOCIAL IMPACT · MUSIC',group:'documentary',thumb:'mission-buniyaad-old.jpg',orientation:'landscape',url:'https://youtu.be/5D0v3GJcz70?si=H33m6wczxshG9VmL'},
  {title:'Paytm Brand Reels',type:'BRAND · FREELANCE',group:'brand',thumb:'paytm-01.webp',orientation:'landscape',links:[
    ['Reel 01','https://www.instagram.com/reel/DM4Yj7fORyq/?stkn=MTkwMTJmZGllcm1vYw=='],
    ['Reel 02','https://www.instagram.com/reel/DNFT-74ysrK/?stkn=MXN6OXNzNGkxdHFoOA==']
  ],reelThumbs:['paytm-01.webp','paytm-02.webp']},
  {title:'Podcasts',type:'DOCUMENTARY · LONG-FORM',group:'documentary',thumb:'podcasts.png',orientation:'landscape',links:[
    ['Episode 01','https://youtu.be/cXBZVjGKsnI?si=g5YOHZXmFfgZImHO'],
    ['Episode 02','https://youtu.be/nZwt_Ze5sCQ?si=Oa6A5FfKjH16NN0t'],
    ['Episode 03','https://youtu.be/xpyM1CKo9Nc?si=W_gaXscWyY4xjBbh'],
    ['Episode 04','https://youtu.be/DMuhWeV6-vc?si=9Z9peVlgRrwpgvqY']
  ]},
  {title:'Interviews',type:'DOCUMENTARY · INTERVIEWS',group:'documentary',thumb:'interviews.png',orientation:'landscape',links:[
    ['Interview 01','https://youtu.be/ojCQgijsrJw?si=mOFAOVg-gdC3BhK0'],
    ['Interview 02','https://youtu.be/5A_Kt6Cynzs?si=Or3utHHBChJsnWmL'],
    ['Interview 03','https://youtu.be/Cyz2wp1yNNE?si=OxJC6E-Kjcjcb6Mo'],
    ['Interview 04','https://youtu.be/eUww6dkz-v4?si=NhjEvyTXpiz4Anqz']
  ]},
  {title:'Shorgull',type:'SHORT FILM · NARRATIVE',group:'documentary',thumb:'shorgull.png',orientation:'landscape',links:[
    ['Watch Film','https://drive.google.com/file/d/1u8BU5pUttfbFXAaESlhaFhXBDoc7AR0x/view?usp=drive_link']
  ]}
];

const brands = [
  {name:'Galleria VSB',kind:'Art gallery · Visual identity · Film · Photography',thumb:'galleria-vsb-01.webp',links:[
    ['Reel 01','https://www.instagram.com/reel/DO0v0yaEmrB/?stkn=ZnR6YWtuZG80NGZi'],
    ['Reel 02','https://www.instagram.com/reel/DO_CgK7Ekh3/?stkn=MTNhaThzcDFmN3A4Yw=='],
    ['Reel 03','https://www.instagram.com/reel/DWWmzuAkqiM/?stkn=MXd3bTFqbW14cGZ0Ng=='],
    ['Reel 04','https://www.instagram.com/reel/DV6Ij9pie4g/?stkn=MTVvMWl4OXcwNnJtMg=='],
    ['Reel 05','https://www.instagram.com/reel/DTiLxcpkuEF/?stkn=MXRnMjlwMnQyeTd6ZQ=='],
    ['Reel 06','https://www.instagram.com/reel/DTXt8qzEhBP/?stkn=bmt5bzdxM2RtcTU='],
    ['Reel 07','https://www.instagram.com/reel/DS7erZmErru/?stkn=MTI3bHl3anB2MTQyMQ=='],
    ['Reel 08','https://www.instagram.com/reel/DObA8i8kp_R/?stkn=MWV5OHY3NHgwbjZqOQ=='],
    ['Reel 09','https://www.instagram.com/reel/DOtC2rIkpEl/?stkn=MW9hc3lsbW51bGJzbw=='],
    ['Reel 10','https://www.instagram.com/reel/DPWQEsxDuWn/?stkn=MmY5eWRsczluMzZy'],
    ['Reel 11','https://www.instagram.com/reel/DNaou2pyhSO/?stkn=MWZhY2lxa3VkOGhjcA=='],
    ['Reel 12','https://www.instagram.com/reel/DGneU5izkL1/?stkn=Y2locmY1Zmhhem8x'],
    ['Reel 13','https://www.instagram.com/reel/DGGCvtCTcBh/?stkn=b2toMHJxMzR0czF6']
  ],reelThumbs:Array.from({length:13},(_,i)=>`galleria-vsb-${String(i+1).padStart(2,'0')}.webp`)},
  {name:'White & Yellow',kind:'Luxury jewellery · Film · Photography',thumb:'white-and-yellow-01.webp',links:[
    ['Reel 01','https://www.instagram.com/reel/DU8IVBdiQGK/?stkn=MTVueTNoOHI3cXhxdA=='],
    ['Reel 02','https://www.instagram.com/reel/DUYF5A0iTJC/?stkn=N2s4bnN1Mm80YWFz'],
    ['Reel 03','https://www.instagram.com/reel/DXCBiUAEufv/?stkn=MW96aWo3aWpvbWRuMg=='],
    ['Reel 04','https://www.instagram.com/reel/DVTZgb4iWyA/?stkn=Y210Ynp5cnJ2ODc1'],
    ['Reel 05','https://www.instagram.com/reel/DUx1Pr4ifBG/?stkn=a2Y1aXEzcXo3MnZr'],
    ['Reel 06','https://www.instagram.com/reel/DTNd1Q6iaeA/?stkn=Y2Joa3oyZng0YjZj']
  ],reelThumbs:Array.from({length:6},(_,i)=>`white-and-yellow-${String(i+1).padStart(2,'0')}.webp`)},
];

function nav(active){
  const links=[['/','Home'],['/photography','Photography'],['/film','Film'],['/ai','AI'],['/about','About'],['/contact','Contact']];
  return `<header class="nav">
    <a class="wordmark" href="#/">SHIVAM<span>GUPTA</span></a>
    <nav id="navLinks" aria-label="Primary navigation">${links.map(([p,l])=>`<a class="${active===p?'active':''}" href="#${p}">${l}</a>`).join('')}</nav>
  </header>`;
}
function footer(){return `<footer><span>SHIVAM GUPTA / IMAGE MAKER</span><span>© 2026</span></footer>`;}
function photoImg(p, extra=''){const file=String(p?.file||'').replace(/^\/+/, '');return `<img class="${extra}" loading="lazy" decoding="async" src="${ASSET}${esc(file)}" alt="${esc(p.title)}">`;}
function primaryUrl(w){
  if(w.url) return w.url;
  if(Array.isArray(w.links) && w.links.length) return w.links[0][1];
  return null;
}
function projectUrls(w){
  if(w.url) return [w.url];
  return Array.isArray(w.links) ? w.links.map(x=>x[1]).filter(Boolean) : [];
}
function openLinksAttr(w){
  const urls=projectUrls(w);
  return urls.length>1 ? `data-open-links="${esc(JSON.stringify(urls))}"` : '';
}
function thumbImg(w){
  if(!w.thumb) return `<div class="thumbPending"><span>THUMBNAIL<br>PENDING</span></div>`;
  const url=primaryUrl(w);
  const main=`<img loading="lazy" decoding="async" src="${ASSET}thumbnails/${w.thumb}" alt="${esc(w.title||w.name)}">`;
  const content=w.secondaryThumb ? `<div class="dualThumb"><span>${main}</span><span><img loading="lazy" decoding="async" src="${ASSET}thumbnails/${w.secondaryThumb}" alt="${esc(w.title||w.name)} — UGC"></span></div>` : main;
  if(!url) return content;
  const multi=projectUrls(w).length>1;
  return `<a class="thumbLink${multi?' multiLink':''}" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(w.title||w.name)}" ${openLinksAttr(w)}>${content}</a>`;
}
function openAllNow(urls){
  const safe=Array.isArray(urls)?urls.filter(Boolean):[];
  safe.forEach(u=>window.open(u,'_blank','noopener,noreferrer'));
}
function compactLinkLabel(label){
  const raw=String(label||'').trim();
  let m=raw.match(/^Episode\s*0?(\d+)$/i); if(m) return `EP${m[1]}`;
  m=raw.match(/^Interview\s*0?(\d+)$/i); if(m) return `Interview ${m[1]}`;
  m=raw.match(/^Reel\s*0?(\d+)$/i); if(m) return `Reel ${m[1]}`;
  return raw;
}
function workLinks(w){
  return (w.links||[]).map(([label,url],i)=>{
    const thumb=Array.isArray(w.reelThumbs) ? w.reelThumbs[i] : null;
    const bg=thumb ? ` style="--reel-bg:url('${ASSET}thumbnails/${thumb}')"` : '';
    return `<a class="watchLink${thumb?' reelThumbLink':''}" href="${url}" target="_blank" rel="noopener noreferrer"${bg}>${esc(compactLinkLabel(label))} ↗</a>`;
  }).join('');
}
function workCard(w, opts={}){
  const cls=`workCard ${w.orientation||'landscape'} ${opts.featureClass||''}`;
  return `<article class="${cls}">
    <div class="workThumb">${thumbImg(w)}${w.thumb?'<span class="thumbArrow">↗</span>':''}</div>
    <div class="workMeta"><span>${w.type}</span><h3>${esc(w.title)}</h3>${workLinks(w)?`<div class="workLinks">${workLinks(w)}</div>`:''}</div>
  </article>`;
}

function flagshipCard(w, opts={}){
  const href=primaryUrl(w);
  const img=w.thumb ? `<img loading="lazy" decoding="async" src="${ASSET}thumbnails/${w.thumb}" alt="${esc(w.title)}">` : `<div class="thumbPending"><span>THUMBNAIL<br>PENDING</span></div>`;
  const visual=href ? `<a class="flagshipMedia${projectUrls(w).length>1?' multiLink':''}" href="${href}" target="_blank" rel="noopener noreferrer" ${openLinksAttr(w)}>${img}<span class="mediaArrow">↗</span></a>` : `<div class="flagshipMedia">${img}</div>`;
  return `<article class="flagshipCard ${opts.className||''}">${visual}<div class="flagshipMeta"><span>${w.type}</span><h3>${esc(w.title)}</h3>${workLinks(w)?`<div class="workLinks">${workLinks(w)}</div>`:''}</div></article>`;
}
function brandFlagshipCard(b, index){
  const href=b.links?.[0]?.[1];
  const img=`<img loading="lazy" decoding="async" src="${ASSET}thumbnails/${b.thumb}" alt="${esc(b.name)}">`;
  return `<article class="flagshipCard brandFlag"><a class="flagshipMedia multiLink" href="${href}" target="_blank" rel="noopener noreferrer" ${openLinksAttr(b)}>${img}<span class="mediaArrow">↗</span></a><div class="flagshipMeta"><span>${esc(b.kind)}</span><h3>${esc(b.name)}</h3><div class="workLinks">${b.links.map(([label,url])=>`<a class="watchLink" href="${url}" target="_blank" rel="noopener noreferrer">${esc(compactLinkLabel(label))} ↗</a>`).join('')}</div></div></article>`;
}

// Carefully selected from the visual contact sheets rather than arbitrary IDs.
const selectedIds = [40,44,34,50,75,80,89,106];
function home(){
  const hero = photos.find(p=>p.id===40) || photos[0];
  const featured = selectedIds.map(id=>photos.find(p=>p.id===id)).filter(Boolean);
  const filmFeatured = [work.find(w=>w.title==='Shorgull'), work.find(w=>w.title==='Paytm Brand Reels'), {...brands[1], title:brands[1].name, type:'BRAND · JEWELLERY', group:'brand'}].filter(Boolean);
  return `<main class="homePage">
    <section class="hero reveal revealHero">
      <div class="heroCopy reveal revealGroup"><p class="eyebrow">CINEMATOGRAPHER · PHOTOGRAPHER · CREATIVE DIRECTOR</p><h1>Making images<br><em>with intent.</em></h1><p class="intro">Commercial films, photography, visual direction and AI-led image making — built around the idea first.</p><a class="textLink" href="#/photography">Enter the work <b>↗</b></a></div>
      <div class="heroImage reveal revealImage">${photoImg(hero)}<div class="heroLabel"><span>SELECTED FRAME</span><strong>${String(hero.id).padStart(3,'0')}</strong></div></div>
    </section>
    <section class="introBand reveal"><div class="sectionNo">01 /</div><div><p class="eyebrow">THE PRACTICE</p><h2>Camera first.<br><em>Technology second.</em></h2><p class="bodyCopy">I work across photography, cinematography, editing and generative production. The medium changes; the obsession with the image doesn't.</p></div><div class="miniSignature">SHIVAM<br>GUPTA</div></section>
    <section class="photoPreview reveal"><div class="sectionHead"><div><p class="eyebrow">02 — PHOTOGRAPHY</p><h2>Selected frames</h2></div><a class="textLink" href="#/photography">View all 118 <b>↗</b></a></div><div class="editorialGrid">${featured.map((p,i)=>`<a href="#/photography" class="photoCard pc${i}">${photoImg(p)}<div><span>${categoryFor(p)}</span><strong>${String(p.id).padStart(3,'0')}</strong></div></a>`).join('')}</div></section>
    <section class="filmPreview reveal"><div class="sectionHead"><div><p class="eyebrow">03 — FILM</p><h2>Moving image.</h2></div><a class="textLink" href="#/film">Explore film <b>↗</b></a></div><div class="filmGrid homeFilmCompact">${filmFeatured.map(workCard).join('')}</div></section>
    <section class="aiVideoPreview reveal"><div class="sectionHead"><div><p class="eyebrow">04 — AI VIDEOS</p><h2>Generative moving image.</h2></div><a class="textLink" href="#/ai">See all AI work <b>↗</b></a></div><div class="aiVideoGrid">${work.filter(w=>w.group==='ai').slice(0,3).map(workCard).join('')}</div></section>
    <section class="aiTease reveal"><div><p class="eyebrow">04 — AI</p><h2>Generative work,<br><em>kept separate.</em></h2></div><div><p class="bodyCopy">AI image making, generative films and experimental workflows — presented as its own practice, not mixed into the film reel.</p><a class="textLink" href="#/ai">Explore AI <b>↗</b></a></div></section>
    <section class="brandWorlds reveal"><div><p class="eyebrow">04 — BRAND WORLDS</p><h2>Client work,
<br><em>selected.</em></h2></div><div class="brandStack">${brands.map((b,i)=>`<a class="brandRow" href="#/film"><span>0${i+1}</span><div><strong>${b.name}</strong><small>${b.kind}</small></div><b>↗</b></a>`).join('')}</div></section>
    <section class="aboutTease reveal"><div class="aboutTeasePhoto"><img src="./about-shivam.jpg" alt="Shivam Gupta behind the camera" loading="lazy"></div><div><p class="eyebrow">05 — BEHIND THE CAMERA</p><h2>Not just the<br><em>final frame.</em></h2><p class="bodyCopy">A cinematographer and photographer who likes to stay close to the making — from the first reference to the final grade.</p><a class="textLink" href="#/about">About Shivam <b>↗</b></a></div></section>
    <section class="contactBand reveal"><p class="eyebrow">06 — AVAILABLE FOR SELECT PROJECTS</p><h2>Let's make something<br><em>worth looking at.</em></h2><a class="pill" href="#/contact">Start a conversation ↗</a></section>
  </main>`;
}

function photography(){return `<main class="page photographyPage"><section class="pageIntro photoIntro"><div><p class="eyebrow">PHOTOGRAPHY / 118 FRAMES</p><h1>A visual archive,<br><em>without the noise.</em></h1></div><div><p>A selection of fashion, product, portrait, architecture, street and wedding photography.</p></div></section><div class="filters" id="filters">${cats.map(c=>`<button data-cat="${c}" class="${c==='ALL'?'selected':''}">${c}</button>`).join('')}</div><section class="archiveGrid" id="archive"></section><div class="lightbox" id="lightbox" hidden></div></main>`;}

function renderArchive(cat='ALL'){
  const list=photos.filter(p=>cat==='ALL'||categoryFor(p)===cat);
  const archive=$('#archive');
  if(!archive) return;
  archive.innerHTML=list.map((p,i)=>`<button class="archiveCard" data-id="${p.id}" style="--delay:${Math.min(i,20)*12}ms"><span class="archiveImage">${photoImg(p)}</span><span class="archiveMeta"><b>${String(p.id).padStart(3,'0')}</b><span>${categoryFor(p)}</span></span></button>`).join('');
  $$('.archiveCard',archive).forEach(b=>b.addEventListener('click',()=>openLight(Number(b.dataset.id),list)));
}
function openLight(id,list){
  let i=list.findIndex(p=>p.id===id); const lb=$('#lightbox'); if(!lb)return; lb.hidden=false; document.body.classList.add('modalOpen');
  const draw=()=>{const p=list[i];lb.innerHTML=`<button class="lbClose" aria-label="Close">×</button><button class="lbPrev" aria-label="Previous">‹</button><div class="lbInner">${photoImg(p,'lbImage')}<div><span>${String(p.id).padStart(3,'0')} · ${categoryFor(p)}</span><strong>${esc(p.title)}</strong></div></div><button class="lbNext" aria-label="Next">›</button>`;lb.onclick=e=>{if(e.target===lb)close()};$('.lbClose',lb).onclick=close;$('.lbPrev',lb).onclick=()=>{i=(i-1+list.length)%list.length;draw()};$('.lbNext',lb).onclick=()=>{i=(i+1)%list.length;draw()};};
  const close=()=>{lb.hidden=true;document.body.classList.remove('modalOpen')}; draw();
}

function brandCard(b,i){return `<article class="brandCard"><div class="brandVisual"><img src="${ASSET}thumbnails/${b.thumb}" alt="${esc(b.name)}"><span class="brandNo">0${i+1}</span></div><div class="brandCardBody"><span>${esc(b.kind)}</span><h3>${esc(b.name)}</h3><div class="brandLinks">${b.links.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`).join('')}<small>Selected reels</small></div></div></article>`;}
function reelSection(name, kind, links, thumbs, number){
  return `<section class="filmProjectSection">
    <div class="filmProjectHead"><div><p class="eyebrow">${esc(number)} — FILM / ${esc(kind)}</p><h2>${esc(name)}</h2></div></div>
    <div class="filmReelGrid">${links.map(([label,url],i)=>{
      const thumb=thumbs?.[i];
      const bg=thumb ? ` style="--reel-bg:url('${ASSET}thumbnails/${esc(thumb)}')"` : '';
      return `<a class="filmReelCard" href="${url}" target="_blank" rel="noopener noreferrer"${bg}>
        <span class="filmReelLabel">${esc(compactLinkLabel(label))} <b>↗</b></span>
      </a>`;
    }).join('')}</div>
  </section>`;
}

function film(){
  const shorgull=work.find(w=>w.title==='Shorgull');
  const paytm=work.find(w=>w.title==='Paytm Brand Reels');
  const missionMusic=work.find(w=>w.title==='Mission Buniyaad — Music Video');
  const missionDoc=work.find(w=>w.title==='Mission Buniyaad / Super 100 — Documentary');
  const podcasts=work.find(w=>w.title==='Podcasts');
  const interviews=work.find(w=>w.title==='Interviews');
  const galleria=brands.find(b=>b.name==='Galleria VSB');
  const whiteYellow=brands.find(b=>b.name==='White & Yellow');
  return `<main class="page filmPage">
    <section class="pageIntro filmIntro">
      <div><p class="eyebrow">FILM / MOVING IMAGE</p><h1>Film, edit &<br><em>direction.</em></h1></div>
      <div><p>Commercial films, narrative work, branded content and documentary. AI experiments live on a separate page.</p></div>
    </section>

    ${galleria ? reelSection(galleria.name, 'ART / BRAND', galleria.links, galleria.reelThumbs, '01') : ''}
    ${whiteYellow ? reelSection(whiteYellow.name, 'LUXURY JEWELLERY', whiteYellow.links, whiteYellow.reelThumbs, '02') : ''}

    ${shorgull ? `<section class="filmProjectSection filmSingleProject">
      <div class="filmProjectHead"><div><p class="eyebrow">03 — SHORT FILM · NARRATIVE</p><h2>${esc(shorgull.title)}</h2></div></div>
      <div class="filmSingleGrid">${flagshipCard(shorgull,{className:'filmSingleCard'})}</div>
    </section>` : ''}

    ${paytm ? reelSection(paytm.title, 'BRAND · FREELANCE', paytm.links, paytm.reelThumbs, '04') : ''}

    <section class="storySection">
      <div class="sectionHead"><div><p class="eyebrow">05 — DOCUMENTARY & LONG-FORM</p><h2>Stories that<br><em>stay with you.</em></h2></div><p class="sectionNote">Documentary, social-impact and longer-form work from the edit room and the field.</p></div>
      <div class="storyGrid">
        ${flagshipCard(missionMusic,{className:'storyMain'})}
        ${flagshipCard(missionDoc,{className:'storyMain'})}
        ${flagshipCard(podcasts,{className:'storySmall'})}
        ${flagshipCard(interviews,{className:'storySmall'})}
      </div>
    </section>

    <section class="filmArchiveSection">
      <div class="sectionHead"><div><p class="eyebrow">06 — ADDITIONAL FILM WORK</p><h2>More work.</h2></div><p class="sectionNote">Additional commercial and commissioned moving-image work.</p></div>
      <div class="workGrid">${work.filter(w=>['film','brand','documentary'].includes(w.group) && ![shorgull?.title,paytm?.title,missionMusic?.title,missionDoc?.title,podcasts?.title,interviews?.title].includes(w.title)).map(workCard).join('')}</div>
    </section>
  </main>`;
}

function ai(){
  const aiWork=work.filter(w=>w.group==='ai');
  return `<main class="page aiPage">
    <section class="pageIntro aiIntro">
      <div><p class="eyebrow">AI / GENERATIVE PRACTICE</p><h1>Images, films &<br><em>new workflows.</em></h1></div>
      <div><p>Generative image making, AI-led films and experimental commercial concepts. This work is intentionally separate from the cinematography reel.</p></div>
    </section>
    <section class="aiArchive">
      <div class="sectionHead"><div><p class="eyebrow">01 — SELECTED AI WORK</p><h2>Built beyond<br><em>the camera.</em></h2></div><p class="sectionNote">Concepts and finished pieces made with generative tools, creative direction and post-production.</p></div>
      <div class="aiGrid">${aiWork.map(workCard).join('')}</div>
    </section>
  </main>`;
}

function about(){return `<main class="page"><section class="aboutHero"><div class="aboutPortrait"><img src="./about-shivam.jpg" alt="Shivam Gupta with camera"></div><div class="aboutTitle"><p class="eyebrow">ABOUT / BEHIND THE CAMERA</p><h1>Shivam<br><em>Gupta.</em></h1><p class="portraitCaption">Cinematographer · Photographer · Creative Director</p></div><div class="aboutText"><p class="lead">I build visual stories across commercial, editorial, documentary and AI-led production.</p><p>I like images that feel considered without feeling overworked. My process moves from concept to camera to edit, with generative tools added when they genuinely make the idea stronger.</p><p>Based in India. Available for select productions, campaigns, visual identities and creative collaborations.</p></div></section><section class="aboutDetails"><div><span>01</span><h3>CAMERA</h3><p>Commercial cinematography · Fashion · Product · Documentary</p></div><div><span>02</span><h3>PHOTOGRAPHY</h3><p>Editorial · Portrait · Product · Fashion · Visual stories</p></div><div><span>03</span><h3>GENERATIVE</h3><p>AI film · Concept development · Image generation · Creative workflows</p></div></section></main>`;}
function contact(){return `<main class="page contactPage"><p class="eyebrow">CONTACT</p><h1>Have a project<br><em>in mind?</em></h1><p class="contactIntro">Films, campaigns, photography, AI-led production or creative direction.</p><div class="contactDetails"><a class="email" href="mailto:samar712003@gmail.com">samar712003@gmail.com ↗</a><a class="phone" href="tel:+919528527971">+91 95285 27971</a></div><div class="socials"><a href="https://www.linkedin.com/in/shivam-gupta-743b45266/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="#/film">Work reels ↗</a></div></main>`;}

function bind(){
  const menu=$('#menu'), mobileMenu=$('#mobileMenu'), menuClose=$('#menuClose');
  const setMenu=(open)=>{
    if(!menu || !mobileMenu) return;
    menu.classList.toggle('open',open);
    menu.setAttribute('aria-expanded',String(open));
    mobileMenu.classList.toggle('open',open);
    mobileMenu.setAttribute('aria-hidden',String(!open));
    document.body.classList.toggle('menuOpen',open);
  };
  if(menu) menu.onclick=()=>setMenu(!mobileMenu.classList.contains('open'));
  if(menuClose) menuClose.onclick=()=>setMenu(false);
  if(mobileMenu) $$('.mobileMenuLinks a',mobileMenu).forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape') setMenu(false)},{once:true});

  // Cinematic entrance + scroll reveals. Respect reduced-motion preferences.
  const revealEls=$$('.reveal');
  if('IntersectionObserver' in window && revealEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}
    }),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    revealEls.forEach(el=>io.observe(el));
  }else revealEls.forEach(el=>el.classList.add('is-visible'));

  const exitPopup=$('#exitPopup');
  if(exitPopup){
    const closeExit=()=>{exitPopup.classList.remove('open');document.body.classList.remove('exitOpen');localStorage.setItem('sg_exit_seen','1');};
    const maybeExit=()=>{
      if(window.innerWidth<=700 || localStorage.getItem('sg_exit_seen')==='1') return;
      if(!exitPopup.classList.contains('open')){exitPopup.classList.add('open');document.body.classList.add('exitOpen');}
    };
    $('.exitClose',exitPopup)?.addEventListener('click',closeExit);
    $('.exitBackdrop',exitPopup)?.addEventListener('click',closeExit);
    const form=$('#exitForm');
    if(form) form.addEventListener('submit',e=>{
      e.preventDefault();
      const email=$('#exitEmail',form)?.value.trim();
      if(!email) return;
      const subject=encodeURIComponent('Project enquiry from website');
      const body=encodeURIComponent(`Hi Shivam,\n\nI'd like to connect about a project.\n\nMy email: ${email}`);
      window.location.href=`mailto:samar712003@gmail.com?subject=${subject}&body=${body}`;
      closeExit();
    });
    document.addEventListener('mouseleave',e=>{if(e.clientY<=0) maybeExit();});
  }

  $$('.multiLink').forEach(a=>a.addEventListener('click',e=>{
    const raw=a.dataset.openLinks;
    if(!raw) return;
    e.preventDefault();
    try{ openAllNow(JSON.parse(raw)); }catch(err){ window.open(a.href,'_blank','noopener,noreferrer'); }
  }));
  const filters=$('#filters'); if(filters){$$('button',filters).forEach(b=>b.onclick=()=>{$$('button',filters).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');renderArchive(b.dataset.cat)});renderArchive();}
  const wg=$('#workGrid'); if(wg){$$('#filmFilters button').forEach(b=>b.onclick=()=>{$$('#filmFilters button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');wg.innerHTML=work.filter(w=>b.dataset.tab==='all'||w.group===b.dataset.tab).map(workCard).join('')});}
}
function render(){
  const path=location.hash.slice(1)||'/';
  const body=path==='/photography'?photography():path==='/film'?film():path==='/ai'?ai():path==='/about'?about():path==='/contact'?contact():home();
  const popup=path==='/'?`<div class="exitPopup" id="exitPopup" aria-hidden="true"><div class="exitBackdrop"></div><div class="exitCard" role="dialog" aria-modal="true" aria-labelledby="exitTitle"><button class="exitClose" aria-label="Close">×</button><p class="eyebrow">BEFORE YOU GO</p><h2 id="exitTitle">Have a project<br><em>in mind?</em></h2><p>Leave your email and I'll get back to you for the next conversation.</p><form id="exitForm"><input id="exitEmail" name="email" type="email" autocomplete="email" placeholder="your@email.com" required><button type="submit">Connect ↗</button></form><small>Your email opens a direct enquiry to Shivam.</small></div></div>`:'';
  $('#app').innerHTML=nav(path)+body+footer()+popup;
  bind();
  window.scrollTo({top:0,behavior:'instant'});
}
addEventListener('hashchange',render); render();
