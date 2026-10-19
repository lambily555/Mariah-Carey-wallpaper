(()=>{
const meta={"frames": 749, "files": ["sheet00.webp", "sheet01.webp", "sheet02.webp", "sheet03.webp", "sheet04.webp", "sheet05.webp", "sheet06.webp", "sheet07.webp", "sheet08.webp", "sheet09.webp", "sheet10.webp", "sheet11.webp", "sheet12.webp"], "w": 280, "h": 270};
const layer=document.createElement('canvas');layer.setAttribute('aria-hidden','true');layer.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2';document.querySelector('.stage').append(layer);
const ctx=layer.getContext('2d'),portrait=document.querySelector('.photo');let W,H,dpr;function resize(){W=innerWidth;H=innerHeight;dpr=Math.min(devicePixelRatio,2);layer.width=W*dpr;layer.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}resize();addEventListener('resize',resize);
const images=meta.files.slice(0,2).map(src=>{const im=new Image();im.src='butterfly-frames/'+src;return im});
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
Promise.all([...images.map(im=>im.decode()),portrait.decode()]).then(()=>{let start;
function frame(t){if(start===undefined)start=t;const elapsed=(t-start)/1000;layer.style.opacity=getComputedStyle(portrait).opacity;ctx.clearRect(0,0,W,H);const r=portrait.getBoundingClientRect(),ratio=portrait.naturalWidth/portrait.naturalHeight,ih=Math.min(r.height,r.width/ratio),iw=ih*ratio,left=r.left+(r.width-iw)/2,top=r.bottom-ih;
const locations=[{x:.19,y:.325,scale:.50,offset:0,angle:-.12},{x:.94,y:.65,scale:.43,offset:0,angle:.12,mirror:true},{screen:true,x:.21,y:.60,scale:.34,offset:0,angle:-.2,gold:true}];
locations.forEach(f=>{let local=reduced?25:Math.floor(elapsed*30)%120;if(local>60)local=120-local;let step=f.offset+local;const k=step%60,im=images[Math.floor(step/60)];const scale=f.scale*Math.min(1,ih/846);ctx.save();ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";const pad=Math.hypot(meta.w,meta.h)*scale/2+6;const px=f.screen?W*f.x:left+iw*f.x,py=f.screen?H*f.y+(reduced?0:Math.sin(elapsed*1.25)*4):top+ih*f.y;if(f.gold)ctx.filter="url(#goldWingFilter)";ctx.translate(Math.max(pad,Math.min(W-pad,px)),Math.max(pad,Math.min(H-pad,py)));ctx.rotate(f.angle);if(f.mirror)ctx.scale(-1,1);ctx.drawImage(im,(k%10)*meta.w,Math.floor(k/10)*meta.h,meta.w,meta.h,-meta.w*scale/2,-meta.h*scale/2,meta.w*scale,meta.h*scale);ctx.restore()});if(!reduced||elapsed<2)requestAnimationFrame(frame)}requestAnimationFrame(frame)}).catch(e=>console.error('Butterfly frames:',e));
})();










