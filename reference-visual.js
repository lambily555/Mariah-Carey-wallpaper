(()=>{
const stage=document.querySelector('.stage'),NS='http://www.w3.org/2000/svg';
const back=[
 'M 1645 140 C 1440 320 1080 230 965 355 C 785 548 1260 487 1495 587 C 1770 717 1615 954 1260 956 C 980 958 740 810 480 860',
 'M 390 550 C 140 570 -10 710 52 805 C 130 923 520 834 760 767 C 940 716 1050 685 1200 754',
 'M 1592 204 C 1350 325 1010 268 958 402 C 932 490 1320 493 1540 638'
];
const front=[
 'M 970 827 C 1180 879 1448 1050 1574 872 C 1651 764 1578 614 1475 581',
 'M 320 904 C 272 1018 739 1022 1112 963 C 1448 910 1680 931 1590 724'
];
function make(paths,isFront){const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 1600 1000');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');svg.classList.add('reference-ribbons');if(isFront)svg.classList.add('front');svg.innerHTML='<defs><linearGradient id="threadGold" x1="0" y1="0" x2="1" y2=".5"><stop stop-color="#b5a071"/><stop offset=".25" stop-color="#e9dcb8"/><stop offset=".5" stop-color="#fffdf2"/><stop offset=".75" stop-color="#d2c193"/><stop offset="1" stop-color="#f5ecd3"/></linearGradient><filter id="threadBlur"><feGaussianBlur stdDeviation="4"/></filter><filter id="threadGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
const glow=document.createElementNS(NS,'radialGradient');glow.id=`strandLight-${isFront?'front':'back'}`;glow.innerHTML='<stop stop-color="#fffbe5" stop-opacity=".9"/><stop offset=".18" stop-color="#fff1bc" stop-opacity=".55"/><stop offset=".55" stop-color="#efcc80" stop-opacity=".18"/><stop offset="1" stop-color="#efcc80" stop-opacity="0"/>';svg.querySelector('defs').append(glow);
paths.forEach((d,i)=>{for(const [j,spread] of [-48,-25,-9,14,38,64].entries()){const guide=document.createElementNS(NS,'path');guide.setAttribute('d',d);const length=guide.getTotalLength(),points=[];for(let n=0;n<=180;n++){const t=n/180,pos=t*length,p=guide.getPointAtLength(pos),a=guide.getPointAtLength(Math.max(0,pos-1)),b=guide.getPointAtLength(Math.min(length,pos+1)),dx=b.x-a.x,dy=b.y-a.y,norm=Math.hypot(dx,dy)||1;const fan=Math.pow(Math.sin(Math.PI*t),.65)*(spread*Math.cos(t*Math.PI*(1.15+j*.13)+j*.71+i*.4)+Math.sin(t*Math.PI*2+j*1.43)*18);points.push([p.x-dy/norm*fan,p.y+dx/norm*fan])}const p=document.createElementNS(NS,'path');p.setAttribute('d','M '+points.map(v=>v.join(' ')).join(' L '));p.classList.add('reference-thread','hairline');p.style.opacity=j%2?'.78':'.52';svg.append(p);
const curveLength=p.getTotalLength();
for(let k=0;k<12;k++){const u=(.045+k*.081+j*.019+i*.027)%1,q=p.getPointAtLength(curveLength*u);const dot=document.createElementNS(NS,'circle');dot.setAttribute('cx',q.x);dot.setAttribute('cy',q.y);dot.setAttribute('r',k%4===0?'1.35':'.65');dot.setAttribute('fill','#fff8d7');dot.setAttribute('opacity',k%3===0?'.95':'.55');svg.append(dot);
if(k%4===0){const halo=document.createElementNS(NS,'circle');halo.setAttribute('cx',q.x);halo.setAttribute('cy',q.y);halo.setAttribute('r',j%2?'8':'12');halo.setAttribute('fill',`url(#strandLight-${isFront?'front':'back'})`);svg.append(halo);}
if(k===3&&j%2===0){const star=document.createElementNS(NS,'path');star.setAttribute('d',`M ${q.x-6} ${q.y} Q ${q.x} ${q.y-1} ${q.x} ${q.y-8} Q ${q.x+1} ${q.y} ${q.x+6} ${q.y} Q ${q.x} ${q.y+1} ${q.x} ${q.y+8} Q ${q.x-1} ${q.y} ${q.x-6} ${q.y}`);star.setAttribute('fill','#fff9df');star.setAttribute('opacity','.85');svg.append(star);}}
const shine=p.cloneNode();shine.classList.remove('reference-thread','hairline');shine.setAttribute('class','strand-highlight');shine.setAttribute('pathLength','100');shine.setAttribute('stroke-dasharray',`${3+j%3} ${20+j*3} 1 ${76-j*3-j%3}`);shine.style.opacity='.9';svg.append(shine);
}for(const kind of ['reference-thread soft','reference-traveller']){const p=document.createElementNS(NS,'path');p.setAttribute('d',d);p.setAttribute('pathLength','100');p.setAttribute('class',kind);p.style.animationDelay=`-${i*7}s`;svg.append(p)}});stage.append(svg)}make(back,false);make(front,true);
// Dense granular trails, with tapered cores and loose perimeter glitter.
stage.querySelectorAll('.reference-ribbons').forEach((svg,layer)=>{
 let seed=481+layer*97;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 [...svg.querySelectorAll('.reference-thread.soft')].forEach((path,k)=>{
  path.classList.toggle('accent-soft',k%2===1);const length=path.getTotalLength(),batches=['','','',''];
  const luminous=document.createElementNS(NS,'g');luminous.classList.add('luminous-body');
  const samples=[];for(let n=0;n<=220;n++){const t=n/220,pos=t*length,p=path.getPointAtLength(pos),a=path.getPointAtLength(Math.max(0,pos-1)),b=path.getPointAtLength(Math.min(length,pos+1)),norm=Math.hypot(b.x-a.x,b.y-a.y)||1;const swell=Math.pow(Math.sin(Math.PI*t),.7)*(.3+.7*Math.pow(.5+.5*Math.sin(t*Math.PI*3+k*1.7+layer),2));samples.push({x:p.x,y:p.y,nx:-(b.y-a.y)/norm,ny:(b.x-a.x)/norm,swell})}
  for(const [width,color,alpha] of [[20,'#edc878',.025],[14,'#edc878',.04],[9,'#f5d78c',.07],[5.5,'#ffe5a3',.13],[2.8,'#fff1bd',.30],[1.1,'#fffae1',.93]]){const edges=[[],[]];for(const p of samples){const w=(.12+p.swell)*width*(layer===0&&k===2?.6:1);edges[0].push(`${p.x+p.nx*w} ${p.y+p.ny*w}`);edges[1].push(`${p.x-p.nx*w} ${p.y-p.ny*w}`)}const band=document.createElementNS(NS,'path');band.setAttribute('d','M '+edges[0].join(' L ')+' L '+edges[1].reverse().join(' L ')+' Z');band.setAttribute('fill',color);band.setAttribute('opacity',alpha);luminous.append(band)}
  svg.insertBefore(luminous,path);

  const gradient=document.createElementNS(NS,'linearGradient'),gid=`translucent-${layer}-${k}`;gradient.id=gid;gradient.setAttribute('x2','0');gradient.setAttribute('y2','1');gradient.innerHTML='<stop stop-color="#fff0c4" stop-opacity=".95"/><stop offset=".14" stop-color="var(--effect-color,#d5b36b)" stop-opacity=".65"/><stop offset=".48" stop-color="#f0d495" stop-opacity=".16"/><stop offset=".83" stop-color="var(--effect-light,#dfc082)" stop-opacity=".56"/><stop offset="1" stop-color="#fff3d0" stop-opacity=".85"/>';svg.querySelector('defs').append(gradient);if(k%2===0){gradient.querySelectorAll('stop')[1].setAttribute('stop-color','#d5b36b');gradient.querySelectorAll('stop')[3].setAttribute('stop-color','#dfc082')}
  if(!svg.querySelector('.accent-trail-gradient')){const g=document.createElementNS(NS,'linearGradient');g.id=`accentTrail-${layer}`;g.setAttribute('class','accent-trail-gradient');g.setAttribute('x2','1');g.setAttribute('y2','.3');g.innerHTML='<stop stop-color="#fff1c6"/><stop offset=".28" stop-color="var(--effect-light)"/><stop offset=".48" stop-color="#fff8df"/><stop offset=".72" stop-color="var(--effect-color)"/><stop offset="1" stop-color="#f6dfa6"/>';svg.querySelector('defs').append(g)}
  for(let band=0;band<1;band++){
   const edges=[[],[]];
   for(let n=0;n<=160;n++){const t=n/160,pos=t*length,p=path.getPointAtLength(pos),a=path.getPointAtLength(Math.max(0,pos-1)),b=path.getPointAtLength(Math.min(length,pos+1)),dx=b.x-a.x,dy=b.y-a.y,norm=Math.hypot(dx,dy)||1;const taper=Math.pow(Math.sin(Math.PI*t),.7),width=Math.sin(t*Math.PI*1.3+k*.5)*taper*5,offset=band?Math.sin(t*Math.PI*2)*9:0;for(let side=0;side<2;side++){const off=offset+(side?1:-1)*width;edges[side].push([p.x-dy/norm*off,p.y+dx/norm*off])}}
   const sheet=document.createElementNS(NS,'path');sheet.setAttribute('d','M '+edges[0].map(v=>v.join(' ')).join(' L ')+' L '+[...edges[1]].reverse().map(v=>v.join(' ')).join(' L ')+' Z');sheet.setAttribute('fill',`url(#${gid})`);sheet.setAttribute('class','translucent-sheet');svg.insertBefore(sheet,path);
   for(const edge of edges.slice(0,1)){const ridge=document.createElementNS(NS,'path');ridge.setAttribute('d','M '+edge.map(v=>v.join(' ')).join(' L '));ridge.setAttribute('class','translucent-ridge');ridge.style.stroke=k%2===1?`url(#accentTrail-${layer})`:'#ffefbd';svg.append(ridge)}
  }
  for(let i=0;i<900;i++){
   const t=random(),pos=t*length,p=path.getPointAtLength(pos),a=path.getPointAtLength(Math.max(0,pos-1)),b=path.getPointAtLength(Math.min(length,pos+1));
   const dx=b.x-a.x,dy=b.y-a.y,norm=Math.hypot(dx,dy)||1,taper=Math.pow(Math.sin(t*Math.PI),.65),halo=random()<.07;
   const gaussian=(random()+random()+random()+random()-2),spread=gaussian*(halo?12:1.8)*taper;
   const x=p.x-dy/norm*spread,y=p.y+dx/norm*spread,r=(halo?.18+random()*.4:.25+random()*.5)*(.25+.75*taper),color=Math.floor(random()*4);
   batches[color]+=`M ${(x-r).toFixed(2)} ${y.toFixed(2)}a ${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2*r).toFixed(2)} 0a ${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2*r).toFixed(2)} 0`;
  }
  for(let j=0;j<9;j++){const point=path.getPointAtLength(length*(.08+j*.103)),glint=document.createElementNS(NS,'circle');glint.setAttribute('cx',point.x);glint.setAttribute('cy',point.y);glint.setAttribute('r',j%3===0?'1.7':'1');glint.setAttribute('fill','#fffbea');glint.setAttribute('filter','url(#threadGlow)');glint.style.cssText=`animation:grainGlow ${4+j%3}s ease-in-out infinite;animation-delay:-${j*.7}s`;svg.append(glint)}
  batches.forEach((d,i)=>{const dots=document.createElementNS(NS,'path');dots.setAttribute('d',d);dots.setAttribute('fill',['#fff8dd','#e6d29a','#b89a55','#f4e6b6'][i]);dots.setAttribute('class','gold-grain'+(i===1?' accent-grain':i===2?' accent-grain-light':''));dots.style.animationDelay=`-${i+k*.7}s`;svg.append(dots)});
 });
});
const veil=document.createElement('div');veil.className='portrait-base-veil';veil.setAttribute('aria-hidden','true');veil.innerHTML='<svg viewBox="0 0 700 160" preserveAspectRatio="none"><defs><linearGradient id="hemSatin" x2="0" y2="1"><stop stop-color="#fff9e9"/><stop offset=".4" stop-color="#dfcda2"/><stop offset=".7" stop-color="#f6ebd1"/><stop offset="1" stop-color="#c7b48b"/></linearGradient></defs><path d="M 0 145 C 200 140 280 100 420 106 S 610 85 700 45 L 700 160 L 0 160 Z" fill="url(#hemSatin)"/></svg>';stage.append(veil);
const photo=document.querySelector('.photo'),rim=photo.cloneNode();rim.className='portrait rim-light';rim.alt='';rim.setAttribute('aria-hidden','true');stage.insertBefore(rim,photo);
const rear=document.createElement('img');rear.className='reference-butterfly';rear.src='gold-butterfly.png';rear.alt='';rear.setAttribute('aria-hidden','true');stage.append(rear);
const stars=document.createElement('div');stars.className='reference-stars';stars.setAttribute('aria-hidden','true');const coords=[[25,27,1],[36,29,0],[18,37,0],[46,31,0],[50,39,0],[22,55,1],[16,61,0],[8,73,0],[17,81,1],[32,81,0],[59,37,0],[61,43,1],[64,78,1],[70,89,1],[84,92,0],[91,77,1],[96,57,1],[88,63,1],[34,25,1],[28,44,1],[20,58,0],[12,68,0],[42,36,0],[54,42,1],[61,48,0],[64,41,0],[68,12,0],[72,7,1],[87,26,0],[92,46,0],[78,59,1],[85,67,0],[88,84,0],[94,90,0],[65,87,0],[26,85,0]];coords.forEach(([x,y,large],i)=>{const el=document.createElement('i');el.className='reference-star'+(large?' large':'');el.style.cssText=`left:${x}%;top:${y}%;animation-delay:-${i*1.13}s`;stars.append(el)});stage.append(stars);
const notes=document.createElement('div');notes.className='reference-notes';notes.setAttribute('aria-hidden','true');[[49,34,'♫'],[61,47,'𝄞'],[59,65,'♪'],[94,74,'♫']].forEach(([x,y,text])=>{const n=document.createElement('span');n.style.left=x+'%';n.style.top=y+'%';n.textContent=text;notes.append(n)});stage.append(notes);
// Local bevel shading: retain crisp strokes rather than blurring the lettering.
const sig=document.querySelector('.artist-name');
sig.querySelectorAll('text')[1].setAttribute('y','302');
const metallic=['#fff4d2','#995e28','#f7db9e','#fff7d9','#b27a38','#e7bd72','#8f5522','#f8dfaa','#fff8de','#bf8e48','#795026'];
sig.querySelectorAll('#champagneInk stop').forEach((s,i)=>s.setAttribute('stop-color',metallic[i]));
sig.querySelector('#satinRelief').innerHTML='<feDropShadow dx=".7" dy="1.9" stdDeviation=".55" flood-color="#71451f" flood-opacity=".75"/><feDropShadow dx="-.4" dy="-.8" stdDeviation=".2" flood-color="#fffbea" flood-opacity=".95"/><feDropShadow dx="0" dy="0" stdDeviation="2.2" flood-color="#fff0b5" flood-opacity=".75"/>';
const defs=document.querySelector('#gold').parentNode;
defs.insertAdjacentHTML('beforeend','<filter id="portraitEdgeLight" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB"><feComponentTransfer in="SourceAlpha" result="cleanAlpha"><feFuncA type="linear" slope="1.25" intercept="-.125"/></feComponentTransfer><feMorphology in="cleanAlpha" operator="dilate" radius="1.8" result="expanded"/><feComposite in="expanded" in2="cleanAlpha" operator="out" result="edge"/><feGaussianBlur in="edge" stdDeviation="1.4" result="softEdge"/><feFlood flood-color="#fff0c8" flood-opacity="1"/><feComposite in2="softEdge" operator="in" result="goldEdge"/><feGaussianBlur in="edge" stdDeviation="4" result="outerEdge"/><feFlood class="rim-accent-flood" flood-opacity=".65"/><feComposite in2="outerEdge" operator="in" result="accentEdge"/><feMerge><feMergeNode in="accentEdge"/><feMergeNode in="goldEdge"/></feMerge></filter>');
defs.insertAdjacentHTML('beforeend','<filter id="goldWingFilter" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".3 .55 .15 0 .24 .25 .48 .12 0 .18 .15 .3 .08 0 .10 0 0 0 .55 0"/><feDropShadow dx="0" dy="0" stdDeviation="1" flood-color="#ffe2a4" flood-opacity=".6"/></filter>');
const lyricPanel=document.querySelector('.lyrics-panel'),lyricWindow=lyricPanel.querySelector('.lyric-window');
function fitLines(){for(const row of lyricWindow.children){row.style.fontSize='';const width=row.clientWidth;if(!width)continue;const base=parseFloat(getComputedStyle(row).fontSize);const overflow=row.scrollWidth;if(overflow>width)row.style.fontSize=(base*(width-3)/overflow)+'px'}for(const row of document.querySelectorAll('.bg-words span')){row.style.fontSize='';const base=parseFloat(getComputedStyle(row).fontSize);if(row.scrollWidth>row.clientWidth)row.style.fontSize=(base*(row.clientWidth-2)/row.scrollWidth)+'px'}}
function placeLyrics(){fitLines();if(innerWidth<701)return;const matrix=sig.getScreenCTM();if(!matrix)return;const inkBottom=Math.max(...Array.from(sig.querySelectorAll('text')).map(t=>{const b=t.getBBox();return matrix.f+(b.y+b.height)*matrix.d}));const input=document.querySelector('.composer').getBoundingClientRect();const latest=input.top-lyricPanel.offsetHeight-25;const preferred=Math.max(innerHeight*.615,inkBottom+18);lyricPanel.style.bottom='auto';lyricPanel.style.top=Math.min(latest,preferred)+'px'}
const observer=new MutationObserver(()=>placeLyrics());observer.observe(lyricWindow,{childList:true});addEventListener('resize',()=>{if(innerWidth<701){lyricPanel.style.top='';lyricPanel.style.bottom=''}placeLyrics()});document.fonts.ready.then(placeLyrics);placeLyrics();
addEventListener('pagehide',()=>observer.disconnect());
document.querySelector('#replay').addEventListener('click',()=>{for(const el of [rim,rear,...stage.querySelectorAll('.reference-ribbons')]){el.style.animation='none';void el.getBoundingClientRect();el.style.animation=''}});
})();



// Shared light-trail treatment for the left sweep, rear orbit and foreground arc.
(()=>{
const stage=document.querySelector('.stage'),NS='http://www.w3.org/2000/svg';
stage.classList.add('flow-study');
function mount(curves,key,front=false){
const svg=document.createElementNS(NS,'svg');svg.setAttribute('class','golden-flow-study');svg.setAttribute('viewBox','0 0 1600 1000');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
svg.innerHTML=`<defs>
<linearGradient id="flowGold" x1="0" y1="0" x2="1" y2=".3"><stop stop-color="#bd9250" stop-opacity="0"/><stop offset=".15" stop-color="#efcf89" stop-opacity=".8"/><stop offset=".32" stop-color="#f6dfa6"/><stop offset=".44" stop-color="#fff8dc"/><stop offset=".56" stop-color="#c9a263" stop-opacity=".3"/><stop offset=".72" stop-color="#edd39a"/><stop offset=".88" stop-color="#fff4ce"/><stop offset="1" stop-color="#d1ab68" stop-opacity="0"/></linearGradient>
<linearGradient id="flowEdge" x1="0" y1="0" x2="1" y2=".3"><stop stop-color="#b68d50" stop-opacity="0"/><stop offset=".2" stop-color="#c8a361" stop-opacity=".65"/><stop offset=".42" stop-color="#e9cc8e"/><stop offset=".57" stop-color="#bd9556" stop-opacity=".35"/><stop offset=".8" stop-color="#ddbd7a"/><stop offset="1" stop-color="#cfac6a" stop-opacity="0"/></linearGradient>
<linearGradient id="flowCore" x1="0" y1="0" x2="1" y2=".2"><stop stop-color="#fff8df" stop-opacity="0"/><stop offset=".18" stop-color="#fff5d8" stop-opacity=".8"/><stop offset=".3" stop-color="#fff9e5"/><stop offset=".43" stop-color="#fffdf0"/><stop offset=".56" stop-color="#f5deb0" stop-opacity=".15"/><stop offset=".76" stop-color="#fff6db"/><stop offset=".9" stop-color="#fffbed"/><stop offset="1" stop-color="#fff4ce" stop-opacity="0"/></linearGradient>
<filter id="flowMiddle" x="-8%" y="-30%" width="116%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="2.3"/></filter>
<filter id="flowOuter" x="-8%" y="-30%" width="116%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="7"/></filter>
<radialGradient id="flowPoint"><stop stop-color="#fffdf1"/><stop offset=".12" stop-color="#fff6cd" stop-opacity=".95"/><stop offset=".4" stop-color="#efcf88" stop-opacity=".4"/><stop offset="1" stop-color="#efcf88" stop-opacity="0"/></radialGradient>
</defs>`;

const groups={};for(const [name,filter,width,opacity] of [['outer','url(#flowOuter)',26,.28],['middle','url(#flowMiddle)',8,.75],['body','none',2.8,.7],['core','none',1.45,1]]){const g=document.createElementNS(NS,'g');g.setAttribute('class','flow-'+name);g.setAttribute('fill','none');g.setAttribute('stroke',name==='core'?'url(#flowCore)':name==='body'?'url(#flowEdge)':'url(#flowGold)');g.setAttribute('stroke-linecap','round');g.setAttribute('filter',filter);g.setAttribute('opacity',opacity);curves.forEach((d,i)=>{const path=document.createElementNS(NS,'path');path.setAttribute('d',d);path.setAttribute('stroke-width',width*(name==='core'?[2.1,.7,.32,1.15]:[1.7,.65,.3,1.05])[i]);if(name==='core')path.id='flow-track-'+i;g.append(path)});svg.append(g);groups[name]=g}
const glints=document.createElementNS(NS,'g');glints.classList.add('flow-moving');
for(const [i,duration,delay] of [[0,12,0],[2,14,-7]]){const head=document.createElementNS(NS,'g');for(let j=5;j>=0;j--){const dot=document.createElementNS(NS,'circle');dot.setAttribute('r',j===0?'9':String(5-j*.45));dot.setAttribute('fill','url(#flowPoint)');dot.setAttribute('opacity',String(j===0?1:.5-j*.06));const motion=document.createElementNS(NS,'animateMotion');motion.setAttribute('dur',duration+'s');motion.setAttribute('begin',(delay+j*.07)+'s');motion.setAttribute('repeatCount','indefinite');motion.setAttribute('path',curves[i]);dot.append(motion);const fade=document.createElementNS(NS,'animate');fade.setAttribute('attributeName','opacity');fade.setAttribute('values',`0;${j===0?1:.5-j*.06};${j===0?1:.5-j*.06};0`);fade.setAttribute('keyTimes','0;.08;.9;1');fade.setAttribute('dur',duration+'s');fade.setAttribute('begin',(delay+j*.07)+'s');fade.setAttribute('repeatCount','indefinite');dot.append(fade);head.append(dot)}glints.append(head)}svg.append(glints);
for(const [i,t] of [[0,.2],[1,.47],[2,.75]]){const path=groups.core.children[i],point=path.getPointAtLength(path.getTotalLength()*t),star=document.createElementNS(NS,'g');star.setAttribute('class','flow-star');star.style.animationDelay=(-i*3)+'s';star.innerHTML=`<circle cx="${point.x}" cy="${point.y}" r="13" fill="url(#flowPoint)"/><path d="M ${point.x-6} ${point.y} Q ${point.x} ${point.y-1} ${point.x} ${point.y-8} Q ${point.x+1} ${point.y} ${point.x+6} ${point.y} Q ${point.x} ${point.y+1} ${point.x} ${point.y+8} Q ${point.x-1} ${point.y} ${point.x-6} ${point.y}" fill="#fff9de"/>`;svg.append(star)}
const moving=document.createElementNS(NS,'svg');moving.setAttribute('class','golden-flow-study golden-flow-points');moving.setAttribute('viewBox','0 0 1600 1000');moving.setAttribute('preserveAspectRatio','none');moving.setAttribute('aria-hidden','true');moving.append(glints,...svg.querySelectorAll('.flow-star'));
for(const root of [svg,moving]){root.dataset.flowGroup=key;if(front)root.classList.add('golden-flow-front');for(const el of root.querySelectorAll('*'))for(const attr of [...el.attributes]){if(attr.name==='id')el.setAttribute('id',attr.value+'-'+key);else if(attr.value.includes('url(#flow'))el.setAttribute(attr.name,attr.value.replace(/url\(#(flow[^)]+)\)/g,`url(#$1-${key})`))}}stage.append(svg,moving);
}
const curves=[
'M 350 600 C 333 604 318 608 305 612 C 292 616 -32 679 53 793 C 149 922 544 787 908 735 C 1190 695 1495 938 1600 875 C 1635 854 1670 835 1735 819',
'M 350 600 C 333 604 318 608 305 612 C 292 616 -10.5 691.5 76.5 785.5 C 206 917.5 579 781 924 784 C 1200 788 1495 938 1600 875 C 1635 854 1670 835 1735 819',
'M 350 600 C 333 604 318 608 305 612 C 292 616 -62.5 703 48.5 810 C 180 935.5 585 714 963 764 C 1217 797 1495 938 1600 875 C 1635 854 1670 835 1735 819',
'M 350 600 C 333 604 318 608 305 612 C 292 616 9.5 715.5 105.5 804.5 C 241.5 922.5 657 719 997 822 C 1278 908 1495 938 1600 875 C 1635 854 1670 835 1735 819'
];
mount(curves,'left');
mount([
'M 1645 208 C 1588 241 1548 255 1508 266 C 1468 277 1030 285 956 411 C 898 512 1278 543 1505 587 C 1600 606 1658 635 1700 654',
'M 1645 208 C 1588 241 1548 255 1508 266 C 1468 277 1044 307 981 417 C 938 493 1292 548 1505 587 C 1600 606 1658 635 1700 654',
'M 1645 208 C 1588 241 1548 255 1508 266 C 1468 277 1013 262 944 431 C 914 548 1294 514 1505 587 C 1600 606 1658 635 1700 654',
'M 1645 208 C 1588 241 1548 255 1508 266 C 1468 277 1070 325 1008 425 C 961 511 1327 580 1505 587 C 1600 606 1658 635 1700 654'
],'rear');
mount([
'M 905 866 C 950 875 982 886 1012 897 C 1042 908 1390 1035 1550 904 C 1635 834 1575 714 1542 673 C 1520 647 1507 633 1485 620',
'M 905 866 C 950 875 982 886 1012 897 C 1042 908 1380 1002 1538 890 C 1610 823 1569 713 1542 673 C 1520 647 1507 633 1485 620',
'M 905 866 C 950 875 982 886 1012 897 C 1042 908 1410 1063 1567 918 C 1668 824 1593 718 1542 673 C 1520 647 1507 633 1485 620',
'M 905 866 C 950 875 982 886 1012 897 C 1042 908 1402 1014 1527 876 C 1594 796 1557 710 1542 673 C 1520 647 1507 633 1485 620'
],'front',true);
})();
