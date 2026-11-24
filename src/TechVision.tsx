import React,{useEffect,useRef,useState} from 'react';
import {items,artUrl,Accessory,Slot} from './accessories';
import {createVision} from './vision';
import './style.css';
type Point={x:number;y:number};
const W=1280,H=720,rail=260;
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
const slots:Slot[]=['head','eyes','mouth','hair','neck'];
const labels:Record<Slot,string>={head:'Chapéus',eyes:'Óculos',mouth:'Bigodes e boca',hair:'Cabelos',neck:'Pescoço'};
const images=new Map(items.map(a=>{const im=new Image();im.src=artUrl(a);return [a.id,im]}));
export default function TechVision(){
 const video=useRef<HTMLVideoElement>(null),canvas=useRef<HTMLCanvasElement>(null),stop=useRef<()=>void>(()=>{}),generation=useRef(0);
 const worn=useRef<Partial<Record<Slot,Accessory>>>({}),drag=useRef<Accessory|null>(null);
 const category=useRef(0),page=useRef(0),selected=useRef<Slot>('head'),sizes=useRef<Partial<Record<Slot,number>>>({});
 const [,refresh]=useState(0);
 const update=()=>refresh(n=>n+1);
 function changeCategory(delta:number){category.current=(category.current+delta+slots.length)%slots.length;page.current=0;update();}
 function changePage(delta:number){const count=Math.ceil(items.filter(a=>a.slot===slots[category.current]).length/6);page.current=(page.current+delta+count)%count;update();}
 function resize(delta:number){sizes.current[selected.current]=Math.max(.5,Math.min(2,Math.round(((sizes.current[selected.current]??1)+delta)*100)/100));update();}
 function choose(a:Accessory){worn.current[a.slot]=a;selected.current=a.slot;update();}
 const [status,setStatus]=useState('Pronto para começar'),[active,setActive]=useState(false),[loading,setLoading]=useState(false);
 useEffect(()=>()=>{generation.current++;stop.current()},[]);
 async function start(){
  const token=++generation.current;setLoading(true);setStatus('Carregando modelos de IA…');
  let stream:MediaStream|undefined;let vision:Awaited<ReturnType<typeof createVision>>|undefined;let frame=0;
  const cleanup=()=>{cancelAnimationFrame(frame);stream?.getTracks().forEach(t=>t.stop());vision?.face.close();vision?.hand.close();};stop.current=cleanup;
  try{
   if(!navigator.mediaDevices?.getUserMedia)throw Error('Use HTTPS ou localhost para acessar a câmera.');
   stream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720},facingMode:'user'},audio:false});
   if(token!==generation.current){cleanup();return;}
   const v=video.current!,c=canvas.current!,ctx=c.getContext('2d')!;v.srcObject=stream;await v.play();
   vision=await createVision();if(token!==generation.current){cleanup();return;}
   const models=vision;setActive(true);setLoading(false);setStatus('Faça uma pinça para pegar um acessório');
   let pinched=false,lastTime=-1,face:ReturnType<typeof models.face.detectForVideo>['faceLandmarks'][number]|undefined,hand:ReturnType<typeof models.hand.detectForVideo>['landmarks'][number]|undefined;
   let lastInference=0, lastFace=0;
   let hands:ReturnType<typeof models.hand.detectForVideo>['landmarks']=[];
   let scaling:{slot:Slot;distance:number;size:number}|null=null;
   let waitRelease=false;
   const draw=(a:Accessory,p:Point,width:number,angle=0)=>{const im=images.get(a.id)!;if(!im.complete||!im.naturalWidth)return;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(angle);ctx.drawImage(im,-width/2,-width/4,width,width/2);ctx.restore();};
   function loop(now:number){
    if(token!==generation.current)return;
    try{
     const scale=Math.max(W/v.videoWidth,H/v.videoHeight),vw=v.videoWidth*scale,vh=v.videoHeight*scale,ox=(W-vw)/2,oy=(H-vh)/2;
     const map=(p:Point):Point=>({x:W-(ox+p.x*vw),y:oy+p.y*vh});
     ctx.fillStyle='#08182e';ctx.fillRect(0,0,W,H);ctx.save();ctx.translate(W,0);ctx.scale(-1,1);ctx.drawImage(v,ox,oy,vw,vh);ctx.restore();
     if(v.currentTime!==lastTime&&now-lastInference>20){lastTime=v.currentTime;lastInference=now;hands=models.hand.detectForVideo(v,now).landmarks;hand=hands[0];if(now-lastFace>65){face=models.face.detectForVideo(v,now).faceLandmarks[0];lastFace=now;}}
     let anchors:Partial<Record<Slot,Point>>={},fw=150,angle=0;
     if(face){const p=(i:number)=>map(face![i]);const left=p(454),right=p(234);fw=distance(left,right);angle=Math.atan2(right.y-left.y,right.x-left.x);const top=p(10),chin=p(152),nose=p(2),lip=p(13),eye1=p(33),eye2=p(263);const mid=(a:Point,b:Point)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});anchors={head:{x:top.x,y:top.y-fw*.25},hair:{x:top.x,y:top.y+fw*.06},eyes:mid(eye1,eye2),mouth:mid(nose,lip),neck:{x:chin.x,y:chin.y+fw*.27}};for(const slot of ['hair','head','eyes','mouth','neck'] as Slot[]){const a=worn.current[slot];if(a)draw(a,anchors[a.slot]!,fw*a.ratio*(sizes.current[slot]??1),angle);}}
     const catalog=items.filter(a=>a.slot===slots[category.current]);const visible=catalog.slice(page.current*6,page.current*6+6);
     const control=(x:number,y:number,w:number,h:number,label:string)=>{ctx.fillStyle='#19558a';ctx.beginPath();ctx.roundRect(x,y,w,h,9);ctx.fill();ctx.fillStyle='white';ctx.font='bold 16px sans-serif';ctx.textAlign='center';ctx.fillText(label,x+w/2,y+h/2+6,w-8);ctx.textAlign='left';};
     ctx.fillStyle='#07182ef5';ctx.fillRect(0,0,rail,H);ctx.fillStyle='#fff';ctx.font='bold 19px sans-serif';ctx.fillText('ACESSÓRIOS',18,27);
     control(10,40,42,42,'‹');control(57,40,146,42,labels[slots[category.current]]);control(208,40,42,42,'›');
     visible.forEach((a,i)=>{const x=10+(i%2)*125,y=94+Math.floor(i/2)*125;ctx.fillStyle=worn.current[a.slot]?.id===a.id?'#167d83':'#173653';ctx.beginPath();ctx.roundRect(x,y,115,115,12);ctx.fill();draw(a,{x:x+57,y:y+45},100);ctx.fillStyle='#fff';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText(a.name,x+57,y+98,108);ctx.textAlign='left';});
     control(10,478,55,42,'‹');control(70,478,120,42,`${page.current+1} / ${Math.ceil(catalog.length/6)}`);control(195,478,55,42,'›');
     control(10,534,240,42,labels[selected.current]+' · tamanho');control(10,588,65,50,'−');control(80,588,100,50,`${Math.round((sizes.current[selected.current]??1)*100)}%`);control(185,588,65,50,'+');control(10,650,240,48,'Limpar visual');
     const gestures=hands.map(h=>{const i=map(h[8]),t=map(h[4]);return {p:{x:(i.x+t.x)/2,y:(i.y+t.y)/2},ratio:distance(i,t)/Math.max(1,distance(map(h[0]),map(h[9])))};});
     const both=gestures.length===2&&gestures.every(g=>g.ratio<(scaling?.48:.32));
     if(both&&!drag.current&&worn.current[selected.current]){
       const a=gestures[0].p,b=gestures[1].p,d=distance(a,b);
       if(!scaling&&d>35)scaling={slot:selected.current,distance:d,size:sizes.current[selected.current]??1};
       if(scaling){const next=Math.max(.5,Math.min(2,Math.round(scaling.size*d/scaling.distance*100)/100));if(Math.abs(next-(sizes.current[scaling.slot]??1))>=.02){sizes.current[scaling.slot]=next;update();}waitRelease=true;pinched=false;
       ctx.strokeStyle='#62efbf';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();for(const g of gestures){ctx.beginPath();ctx.arc(g.p.x,g.p.y,14,0,Math.PI*2);ctx.stroke();}ctx.fillStyle='#07182e';ctx.fillRect(W/2-120,80,240,42);ctx.fillStyle='white';ctx.font='bold 20px sans-serif';ctx.fillText('TAMANHO '+Math.round(next*100)+'%',W/2-100,107);}
     }else if(scaling||waitRelease){scaling=null;if(gestures.every(g=>g.ratio>.48)){waitRelease=false;pinched=false;}}
     else if(hand){const index=map(hand[8]),thumb=map(hand[4]),p={x:(index.x+thumb.x)/2,y:(index.y+thumb.y)/2};const ratio=distance(index,thumb)/Math.max(1,distance(map(hand[0]),map(hand[9])));const closed=ratio<(pinched?.45:.30);
      if(closed&&!pinched&&p.x>=0&&p.x<rail){
       if(p.y>=40&&p.y<=82){if(p.x<55)changeCategory(-1);else if(p.x>205)changeCategory(1);}
       else if(p.y>=94&&p.y<469){const col=Math.floor((p.x-10)/125),row=Math.floor((p.y-94)/125);if(col>=0&&col<2&&row>=0&&row<3)drag.current=visible[row*2+col]??null;}
       else if(p.y>=478&&p.y<=520){if(p.x<65)changePage(-1);else if(p.x>195)changePage(1);}
       else if(p.y>=534&&p.y<=576){selected.current=slots[(slots.indexOf(selected.current)+1)%slots.length];update();}
       else if(p.y>=588&&p.y<=638){if(p.x<75)resize(-.1);else if(p.x>185)resize(.1);}
       else if(p.y>=650&&p.y<=698){worn.current={};sizes.current={};update();}
      }
      if(!closed&&pinched&&drag.current){const a=drag.current,target=anchors[a.slot];if(target&&p.x>rail&&distance(p,target)<Math.max(90,fw*.85)){choose(a);}drag.current=null;}
      pinched=closed;if(drag.current)draw(drag.current,p,Math.max(100,fw*drag.current.ratio*(sizes.current[drag.current.slot]??1)));ctx.beginPath();ctx.arc(p.x,p.y,closed?13:19,0,Math.PI*2);ctx.strokeStyle=closed?'#ff9c25':'#62efbf';ctx.lineWidth=4;ctx.stroke();
     }else{pinched=false;drag.current=null;}
     ctx.fillStyle='#07182ecc';ctx.fillRect(rail,H-44,W-rail,44);ctx.fillStyle='#fff';ctx.font='18px sans-serif';ctx.fillText(face?'Pinça: arraste | Duas pinças: ajuste o tamanho':'Posicione seu rosto diante da câmera',rail+20,H-16);
     ctx.fillStyle="#004587e8";ctx.fillRect(W-365,12,350,62);ctx.fillStyle="white";ctx.font="bold 24px sans-serif";ctx.fillText("SENAC — SÃO LEOPOLDO",W-352,38);ctx.font="bold 16px sans-serif";ctx.fillStyle="#ffb44d";ctx.fillText("TECNOLOGIA",W-352,60);
     frame=requestAnimationFrame(loop);
    }catch(e){cleanup();setActive(false);setStatus('Falha no rastreamento. Reinicie a câmera.');}
   }
   frame=requestAnimationFrame(loop);
  }catch(e){cleanup();if(token===generation.current){setLoading(false);setActive(false);setStatus(e instanceof Error?e.message:'Não foi possível iniciar a câmera.');}}
 }
 function end(){generation.current++;stop.current();setActive(false);setLoading(false);drag.current=null;worn.current={};sizes.current={};update();setStatus('Câmera desligada');}
 function photo(){const c=canvas.current;if(!c)return;const out=document.createElement('canvas');out.width=W-rail;out.height=H-44;const g=out.getContext('2d')!;g.drawImage(c,rail,0,out.width,out.height,0,0,out.width,out.height);g.fillStyle='#004587';g.fillRect(0,0,out.width,50);g.fillStyle='white';g.font='bold 23px sans-serif';g.fillText('Senac São Leopoldo | Tecnologia | Tech Vision',20,33);const a=document.createElement('a');a.download='senac-tech-vision.png';a.href=out.toDataURL('image/png');a.click();}
 return <main><header><div className="brand"><img src="/senac.svg" alt="Senac"/><div className="brandtext"><strong>SENAC — SÃO LEOPOLDO</strong><span>TECNOLOGIA</span></div></div><div className="title">TECH VISION <small>Experiência de realidade aumentada</small></div></header><section className="stage"><video ref={video} muted playsInline/><canvas ref={canvas} width={W} height={H}/>{!active&&<div className="welcome"><span className="tag">VISÃO COMPUTACIONAL</span><h1>Transforme seu visual!</h1><p>Use suas mãos para experimentar acessórios virtuais.</p><button disabled={loading} onClick={start}>{loading?'Carregando…':'Iniciar experiência'}</button>{loading&&<button onClick={end}>Cancelar</button>}</div>}</section><section className="size-panel"><label>Categoria <select value={category.current} onChange={e=>{category.current=Number(e.target.value);page.current=0;update();}}>{slots.map((slot,i)=><option key={slot} value={i}>{labels[slot]}</option>)}</select></label><label>Acessório <select disabled={!active} value={worn.current[slots[category.current]]?.id??''} onChange={e=>{const a=items.find(a=>a.id===e.target.value);if(a)choose(a);}}><option value="" disabled>Escolha um item</option>{items.filter(a=>a.slot===slots[category.current]).map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></label><label>Ajustar <select value={selected.current} onChange={e=>{selected.current=e.target.value as Slot;update();}}>{slots.map(slot=><option key={slot} value={slot}>{labels[slot]}</option>)}</select></label><button onClick={()=>resize(-.1)}>−</button><input aria-label="Tamanho do acessório" type="range" min="50" max="200" step="5" value={Math.round((sizes.current[selected.current]??1)*100)} onChange={e=>{sizes.current[selected.current]=Number(e.target.value)/100;update();}}/><button onClick={()=>resize(.1)}>+</button><strong>{Math.round((sizes.current[selected.current]??1)*100)}%</strong></section><div className="toolbar"><span role="status">{status}</span><button disabled={!active} onClick={()=>{worn.current={};sizes.current={};drag.current=null;update()}}>Limpar acessórios</button><button disabled={!active} onClick={photo}>Tirar foto</button><button disabled={!active&&!loading} onClick={end}>Desligar câmera</button><button onClick={()=>{if(document.fullscreenElement)void document.exitFullscreen();else void document.documentElement.requestFullscreen?.().catch(()=>{});}}>Tela cheia</button></div><section className="instructions"><b>1. Faça uma pinça</b><b>2. Arraste até o rosto</b><b>3. Abra os dedos</b><b>4. Duas pinças: afaste ou aproxime as mãos para ajustar</b></section><footer>Senac São Leopoldo — Tecnologia • Inteligência artificial e interação humano-computador • Imagens processadas localmente</footer></main>;
}
