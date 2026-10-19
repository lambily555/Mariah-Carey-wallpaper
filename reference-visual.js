(()=>{
const stage=document.querySelector('.stage'),NS='http://www.w3.org/2000/svg';
const back=[
 'M 1635 160 C 1480 280 1120 255 990 350 C 815 480 1235 510 1460 555 C 1740 615 1630 870 1260 925 C 1010 963 705 855 480 860',
 'M 440 557 C 210 574 32 658 46 743 C 67 866 580 800 902 795',
 'M 1592 204 C 1350 325 1010 268 958 402 C 932 490 1320 493 1540 638'
];
const front=[
 'M 1000 830 C 1190 920 1430 1025 1570 887 C 1640 823 1615 715 1580 655',
 'M 1030 940 C 1240 1008 1510 973 1608 824'
];
function make(paths,isFront){const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 1600 1000');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');svg.classList.add('reference-ribbons');if(isFront)svg.classList.add('front');svg.innerHTML='<defs><linearGradient id="threadGold" x1="0" y1="0" x2="1" y2=".5"><stop stop-color="#b5a071"/><stop offset=".25" stop-color="#e9dcb8"/><stop offset=".5" stop-color="#fffdf2"/><stop offset=".75" stop-color="#d2c193"/><stop offset="1" stop-color="#f5ecd3"/></linearGradient><filter id="threadBlur"><feGaussianBlur stdDeviation="4"/></filter><filter id="threadGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
paths.forEach((d,i)=>{for(const [j,dy] of [-8,-3,0,4,10].entries()){const p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('transform',`translate(${j%2?4:-3} ${dy})`);p.classList.add('reference-thread');if(j!==2)p.classList.add('hairline');svg.append(p)}for(const kind of ['reference-thread soft','reference-traveller']){const p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('pathLength','100');p.setAttribute('class',kind);p.style.animationDelay=`-${i*7}s`;svg.append(p)}});stage.append(svg)}make(back,false);make(front,true);
// Dense granular trails, with tapered cores and loose perimeter glitter.
stage.querySelectorAll('.reference-ribbons').forEach((svg,layer)=>{
 let seed=481+layer*97;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 [...svg.querySelectorAll('.reference-thread.soft')].forEach((path,k)=>{
  path.classList.toggle('accent-soft',k%2===1);const length=path.getTotalLength(),batches=['','','',''];
  const gradient=document.createElementNS(NS,'linearGradient'),gid=`translucent-${layer}-${k}`;gradient.id=gid;gradient.setAttribute('x2','0');gradient.setAttribute('y2','1');gradient.innerHTML='<stop stop-color="#fff0c4" stop-opacity=".95"/><stop offset=".14" stop-color="var(--effect-color,#d5b36b)" stop-opacity=".65"/><stop offset=".48" stop-color="#f0d495" stop-opacity=".16"/><stop offset=".83" stop-color="var(--effect-light,#dfc082)" stop-opacity=".56"/><stop offset="1" stop-color="#fff3d0" stop-opacity=".85"/>';svg.querySelector('defs').append(gradient);if(k%2===0){gradient.querySelectorAll('stop')[1].setAttribute('stop-color','#d5b36b');gradient.querySelectorAll('stop')[3].setAttribute('stop-color','#dfc082')}
  if(!svg.querySelector('.accent-trail-gradient')){const g=document.createElementNS(NS,'linearGradient');g.id=`accentTrail-${layer}`;g.setAttribute('class','accent-trail-gradient');g.setAttribute('x2','1');g.setAttribute('y2','.3');g.innerHTML='<stop stop-color="#fff1c6"/><stop offset=".28" stop-color="var(--effect-light)"/><stop offset=".48" stop-color="#fff8df"/><stop offset=".72" stop-color="var(--effect-color)"/><stop offset="1" stop-color="#f6dfa6"/>';svg.querySelector('defs').append(g)}
  for(let band=0;band<1;band++){
   const edges=[[],[]];
   for(let n=0;n<=160;n++){const t=n/160,pos=t*length,p=path.getPointAtLength(pos),a=path.getPointAtLength(Math.max(0,pos-1)),b=path.getPointAtLength(Math.min(length,pos+1)),dx=b.x-a.x,dy=b.y-a.y,norm=Math.hypot(dx,dy)||1;const taper=Math.pow(Math.sin(Math.PI*t),.7),width=Math.sin(t*Math.PI*1.3+k*.5)*taper*11,offset=band?Math.sin(t*Math.PI*2)*9:0;for(let side=0;side<2;side++){const off=offset+(side?1:-1)*width;edges[side].push([p.x-dy/norm*off,p.y+dx/norm*off])}}
   const sheet=document.createElementNS(NS,'path');sheet.setAttribute('d','M '+edges[0].map(v=>v.join(' ')).join(' L ')+' L '+[...edges[1]].reverse().map(v=>v.join(' ')).join(' L ')+' Z');sheet.setAttribute('fill',`url(#${gid})`);sheet.setAttribute('class','translucent-sheet');svg.insertBefore(sheet,path);
   for(const edge of edges.slice(0,1)){const ridge=document.createElementNS(NS,'path');ridge.setAttribute('d','M '+edge.map(v=>v.join(' ')).join(' L '));ridge.setAttribute('class','translucent-ridge');ridge.style.stroke=k%2===1?`url(#accentTrail-${layer})`:'#ffefbd';svg.append(ridge)}
  }
  for(let i=0;i<1600;i++){
   const t=random(),pos=t*length,p=path.getPointAtLength(pos),a=path.getPointAtLength(Math.max(0,pos-1)),b=path.getPointAtLength(Math.min(length,pos+1));
   const dx=b.x-a.x,dy=b.y-a.y,norm=Math.hypot(dx,dy)||1,taper=Math.pow(Math.sin(t*Math.PI),.65),halo=random()<.07;
   const gaussian=(random()+random()+random()+random()-2),spread=gaussian*(halo?12:1.8)*taper;
   const x=p.x-dy/norm*spread,y=p.y+dx/norm*spread,r=(halo?.18+random()*.4:.25+random()*.5)*(.25+.75*taper),color=Math.floor(random()*4);
   batches[color]+=`M ${(x-r).toFixed(2)} ${y.toFixed(2)}a ${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2*r).toFixed(2)} 0a ${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2*r).toFixed(2)} 0`;
  }
  batches.forEach((d,i)=>{const dots=document.createElementNS(NS,'path');dots.setAttribute('d',d);dots.setAttribute('fill',['#fff8dd','#e6d29a','#b89a55','#f4e6b6'][i]);dots.setAttribute('class','gold-grain'+(i===1?' accent-grain':i===2?' accent-grain-light':''));dots.style.animationDelay=`-${i+k*.7}s`;svg.append(dots)});
 });
});
const veil=document.createElement('div');veil.className='portrait-base-veil';veil.setAttribute('aria-hidden','true');veil.innerHTML='<svg viewBox="0 0 700 160" preserveAspectRatio="none"><defs><linearGradient id="hemSatin" x2="0" y2="1"><stop stop-color="#fff9e9"/><stop offset=".4" stop-color="#dfcda2"/><stop offset=".7" stop-color="#f6ebd1"/><stop offset="1" stop-color="#c7b48b"/></linearGradient></defs><path d="M 0 145 C 200 140 280 100 420 106 S 610 85 700 45 L 700 160 L 0 160 Z" fill="url(#hemSatin)"/></svg>';stage.append(veil);
const photo=document.querySelector('.photo'),rim=photo.cloneNode();rim.className='portrait rim-light';rim.alt='';rim.setAttribute('aria-hidden','true');stage.insertBefore(rim,photo);
const rear=document.createElement('img');rear.className='reference-butterfly';rear.src='gold-butterfly.png';rear.alt='';rear.setAttribute('aria-hidden','true');stage.append(rear);
const stars=document.createElement('div');stars.className='reference-stars';stars.setAttribute('aria-hidden','true');const coords=[[34,25,1],[28,44,1],[20,58,0],[12,68,0],[42,36,0],[54,42,1],[61,48,0],[64,41,0],[68,12,0],[72,7,1],[87,26,0],[92,46,0],[78,59,1],[85,67,0],[88,84,0],[94,90,0],[65,87,0],[26,85,0]];coords.forEach(([x,y,large],i)=>{const el=document.createElement('i');el.className='reference-star'+(large?' large':'');el.style.cssText=`left:${x}%;top:${y}%;animation-delay:-${i*1.13}s`;stars.append(el)});stage.append(stars);
const notes=document.createElement('div');notes.className='reference-notes';notes.setAttribute('aria-hidden','true');[[49,34,'♫'],[61,47,'𝄞'],[59,65,'♪'],[94,74,'♫']].forEach(([x,y,text])=>{const n=document.createElement('span');n.style.left=x+'%';n.style.top=y+'%';n.textContent=text;notes.append(n)});stage.append(notes);
// Local bevel shading: retain crisp strokes rather than blurring the lettering.
const sig=document.querySelector('.artist-name');
sig.querySelectorAll('text')[1].setAttribute('y','302');
const metallic=['#fff4d2','#995e28','#f7db9e','#fff7d9','#b27a38','#e7bd72','#8f5522','#f8dfaa','#fff8de','#bf8e48','#795026'];
sig.querySelectorAll('#champagneInk stop').forEach((s,i)=>s.setAttribute('stop-color',metallic[i]));
sig.querySelector('#satinRelief').innerHTML='<feDropShadow dx=".7" dy="1.9" stdDeviation=".55" flood-color="#71451f" flood-opacity=".75"/><feDropShadow dx="-.4" dy="-.8" stdDeviation=".2" flood-color="#fffbea" flood-opacity=".95"/><feDropShadow dx="0" dy="0" stdDeviation="1.2" flood-color="#ffe3a0" flood-opacity=".4"/>';
const defs=document.querySelector('#gold').parentNode;
defs.insertAdjacentHTML('beforeend','<filter id="portraitEdgeLight" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB"><feComponentTransfer in="SourceAlpha" result="cleanAlpha"><feFuncA type="linear" slope="1.25" intercept="-.125"/></feComponentTransfer><feMorphology in="cleanAlpha" operator="dilate" radius="1" result="expanded"/><feComposite in="expanded" in2="cleanAlpha" operator="out" result="edge"/><feGaussianBlur in="edge" stdDeviation="1" result="softEdge"/><feFlood flood-color="#fff0c8" flood-opacity=".8"/><feComposite in2="softEdge" operator="in" result="goldEdge"/><feGaussianBlur in="edge" stdDeviation="3" result="outerEdge"/><feFlood class="rim-accent-flood" flood-opacity=".35"/><feComposite in2="outerEdge" operator="in" result="accentEdge"/><feMerge><feMergeNode in="accentEdge"/><feMergeNode in="goldEdge"/></feMerge></filter>');
defs.insertAdjacentHTML('beforeend','<filter id="goldWingFilter" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".25 .5 .15 0 .32 .18 .38 .10 0 .19 .08 .18 .05 0 .06 0 0 0 .76 0"/><feDropShadow dx="0" dy="0" stdDeviation="1" flood-color="#ffe2a4" flood-opacity=".6"/></filter>');
const lyricPanel=document.querySelector('.lyrics-panel'),lyricWindow=lyricPanel.querySelector('.lyric-window');
function fitLines(){for(const row of lyricWindow.children){row.style.fontSize='';const width=row.clientWidth;if(!width)continue;const base=parseFloat(getComputedStyle(row).fontSize);const overflow=row.scrollWidth;if(overflow>width)row.style.fontSize=(base*(width-3)/overflow)+'px'}for(const row of document.querySelectorAll('.bg-words span')){row.style.fontSize='';const base=parseFloat(getComputedStyle(row).fontSize);if(row.scrollWidth>row.clientWidth)row.style.fontSize=(base*(row.clientWidth-2)/row.scrollWidth)+'px'}}
function placeLyrics(){fitLines();if(innerWidth<701)return;const matrix=sig.getScreenCTM();if(!matrix)return;const inkBottom=Math.max(...Array.from(sig.querySelectorAll('text')).map(t=>{const b=t.getBBox();return matrix.f+(b.y+b.height)*matrix.d}));const input=document.querySelector('.composer').getBoundingClientRect();const latest=input.top-lyricPanel.offsetHeight-25;const preferred=Math.max(innerHeight*.615,inkBottom+18);lyricPanel.style.bottom='auto';lyricPanel.style.top=Math.min(latest,preferred)+'px'}
const observer=new MutationObserver(()=>placeLyrics());observer.observe(lyricWindow,{childList:true});addEventListener('resize',()=>{if(innerWidth<701){lyricPanel.style.top='';lyricPanel.style.bottom=''}placeLyrics()});document.fonts.ready.then(placeLyrics);placeLyrics();
addEventListener('pagehide',()=>observer.disconnect());
document.querySelector('#replay').addEventListener('click',()=>{for(const el of [rim,rear,...stage.querySelectorAll('.reference-ribbons')]){el.style.animation='none';void el.getBoundingClientRect();el.style.animation=''}});
})();


