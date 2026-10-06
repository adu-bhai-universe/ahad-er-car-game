/* ====== BONDHUDER NAAM EKHANE ====== */
const NAMES=[
["Arthi","👩‍🎤"],["Sejuti","🧚‍♀️"],["Tanha","😎"],["Mumu","🐮"],["Sabriha","🦸‍♀️"],
["Nahid","🤓"],["Ashraful","🍔"],["Mahim","🤪"],["Talha","🥷"],
["Ahad","😏"],["Mahin","🎮"],["Afnan","🐧"],["Orpita","🦋"],["Shakkor","🧃"]
];
/* Dhakka khaile ja bolbe ({n} = bondhur naam) */
const CRASH=[
n=>n+" er gari-te dhakka! License ache toh? 🪪",
n=>n+" bole: 'ei, dekhe chalao!' 😤",
n=>n+" er gari ekhon hashte hashte gorai 🤣",
n=>n+" ke bondhu bole dhakka dite nei! 😭",
n=>n+" er gari-te ekta dent, ekhon treat dite hobe 🍕",
n=>n+" bole: 'amar insurance nai re!' 😱"
];
const $=id=>document.getElementById(id);
const cv=$("cv"),ctx=cv.getContext("2d");
const W=360,H=560,L=4,LW=W/L,PY=H-120,CW=52,CH=84;
const N=NAMES.length,col=i=>"hsl("+Math.round(i*360/N)+",80%,55%)";
const nm=i=>'<span class="nm">'+NAMES[i][1]+" "+NAMES[i][0]+'</span>';
const lx=l=>l*LW+LW/2;
let run=false,lives,score,speed,obs,px,tl,inv,off,spawnT,crashes,best=0,last=0;
try{best=+localStorage.getItem("bb_best")||0}catch(e){}
$("best").textContent=best;

function chips(){$("chips").innerHTML=NAMES.map((f,i)=>
 '<span class="chip" style="background:'+col(i)+'">'+f[0]+': '+((crashes&&crashes[i])||0)+'</span>').join("");}

function start(){lives=3;score=0;speed=4;obs=[];px=lx(1);tl=1;inv=0;off=0;spawnT=30;crashes={};
 $("menu").style.display="none";$("lives").textContent=3;$("score").textContent=0;
 $("res").textContent="Cholo cholo! 🏁";chips();run=true;last=performance.now();requestAnimationFrame(loop);}

function spawn(){const n=Math.random()<.3?2:1,lanes=[0,1,2,3].sort(()=>Math.random()-.5).slice(0,n);
 lanes.forEach(l=>obs.push({l,y:-100,i:Math.floor(Math.random()*N),food:Math.random()<.1&&n===1}));}

function move(d){if(run)tl=Math.max(0,Math.min(L-1,tl+d));}
document.addEventListener("keydown",e=>{
 if(e.key==="ArrowLeft"||e.key==="a")move(-1);
 if(e.key==="ArrowRight"||e.key==="d")move(1);
 if((e.key==="Enter"||e.key===" ")&&!run)start();});
$("bl").onpointerdown=()=>move(-1);$("br").onpointerdown=()=>move(1);
cv.onpointerdown=e=>{const r=cv.getBoundingClientRect();move(e.clientX-r.left<r.width/2?-1:1);};
$("go").onclick=start;

function car(x,y,color,face,label){
 ctx.fillStyle="#000a";ctx.fillRect(x-CW/2-3,y-CH/2+5,CW+6,CH);
 ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x-CW/2,y-CH/2,CW,CH,12);ctx.fill();
 ctx.fillStyle="#1b2542cc";ctx.fillRect(x-CW/2+7,y-CH/2+14,CW-14,16);ctx.fillRect(x-CW/2+7,y+CH/2-28,CW-14,12);
 ctx.fillStyle="#ffe9a0";ctx.fillRect(x-CW/2+4,y-CH/2+2,9,5);ctx.fillRect(x+CW/2-13,y-CH/2+2,9,5);
 ctx.font="26px serif";ctx.textAlign="center";ctx.fillText(face,x,y+8);
 if(label){ctx.font="bold 13px Trebuchet MS,sans-serif";ctx.lineWidth=4;ctx.strokeStyle="#000";
  ctx.strokeText(label,x,y-CH/2-6);ctx.fillStyle="#fff";ctx.fillText(label,x,y-CH/2-6);}}

function draw(){
 ctx.fillStyle="#2b2f3a";ctx.fillRect(0,0,W,H);
 ctx.fillStyle="#fff8";for(let l=1;l<L;l++)for(let y=-40+off;y<H;y+=40)ctx.fillRect(l*LW-2,y,4,22);
 ctx.fillStyle="#ffd23f";ctx.fillRect(0,0,6,H);ctx.fillRect(W-6,0,6,H);
 obs.forEach(o=>{if(o.food){ctx.font="40px serif";ctx.textAlign="center";ctx.fillText("🍔",lx(o.l),o.y+14);}
  else car(lx(o.l),o.y,col(o.i),NAMES[o.i][1],NAMES[o.i][0]);});
 if(!(inv>0&&Math.floor(inv/5)%2))car(px,PY,"#ff4f6d","🏎️","Tumi");}

function loop(t){if(!run)return;
 const k=Math.min(2,(t-last)/16.7);last=t;
 speed=Math.min(11,speed+.0015*k);off=(off+speed*k)%40;
 score+=speed*k*.05;$("score").textContent=Math.floor(score);
 px+=(lx(tl)-px)*.25*k;if(inv>0)inv-=k;
 spawnT-=k;if(spawnT<=0){spawn();spawnT=Math.max(28,75-speed*4);}
 for(let j=obs.length-1;j>=0;j--){const o=obs[j];o.y+=speed*k*.9;
  if(o.y>H+80){obs.splice(j,1);continue;}
  if(Math.abs(lx(o.l)-px)<CW-8&&Math.abs(o.y-PY)<CH-10){
   if(o.food){score+=50;if(lives<3)lives++;$("lives").textContent=lives;
    $("res").innerHTML="<span>🍔 "+nm(6)+" er burger pelo! +50</span>";obs.splice(j,1);}
   else if(inv<=0){lives--;inv=60;crashes[o.i]=(crashes[o.i]||0)+1;chips();
    $("lives").textContent=lives;$("res").innerHTML="<span>💥 "+CRASH[Math.floor(Math.random()*CRASH.length)](nm(o.i))+"</span>";
    obs.splice(j,1);if(lives<=0)return over();}}}
 draw();requestAnimationFrame(loop);}

function over(){run=false;draw();const s=Math.floor(score);
 if(s>best){best=s;$("best").textContent=s;try{localStorage.setItem("bb_best",s)}catch(e){}}
 const top=Object.entries(crashes).sort((a,b)=>b[1]-a[1])[0];
 const rank=s>=600?"👑 Race Champion!":s>=300?"🏎️ Pro Driver":s>=120?"🚗 Thik-thak":"🛺 Rickshaw driver";
 $("menu").innerHTML="<h2>Gari Gorai! 💥</h2><p class='big'>Score: <b>"+s+" m</b><br>"+rank+"<br><br>"+
  (top?"Shobcheye beshi dhakka khaise: "+nm(+top[0])+" ("+top[1]+" bar)":"Kono bondhur gari-te dhakka dao nai! 😇")+
  "</p><button id='go2'>🔁 Abar Khelo</button>";
 $("menu").style.display="flex";$("go2").onclick=start;
 $("res").textContent="Game over! Bondhuder kachhe maaf chao 🙏";}
draw();
