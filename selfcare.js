renderNav('selfcare');
const morningR=['Skincare routine','Medications / insulin check','Drink water before anything else','Stretch or move for 5 min','Set one intention for the day'];
const eveningR=['Remove makeup + cleanse','Moisturize & eye cream','Lay out tomorrow\'s outfit','Wind-down screen break','Gratitude or journal moment'];
let ritData=ls(K.rituals,{morning:{},evening:{}});
function renderRit(type,items,cid){const c=document.getElementById(cid);if(!c)return;c.innerHTML='';const today=todayKey(),d=ritData[type]||{};items.forEach((r,i)=>{const done=d[today]&&d[today][i];const e=document.createElement('div');e.className='ritual-item'+(done?' done-today':'');e.innerHTML=`<div class="ritual-check${done?' checked':''}" onclick="toggleRit('${type}',${i})">${done?'✓':''}</div><span style="font-size:11px;flex:1;${done?'text-decoration:line-through;opacity:.6':''}">${r}</span>`;c.appendChild(e)})}
window.toggleRit=(type,i)=>{const today=todayKey();if(!ritData[type])ritData[type]={};if(!ritData[type][today])ritData[type][today]={};ritData[type][today][i]=!ritData[type][today][i];ss(K.rituals,ritData);renderRit('morning',morningR,'rituals-morning');renderRit('evening',eveningR,'rituals-evening')};
renderRit('morning',morningR,'rituals-morning');renderRit('evening',eveningR,'rituals-evening');

let treatments=ls(K.treatments,[]);
function renderTx(){const l=document.getElementById('treatment-log');l.innerHTML='';if(!treatments.length){l.innerHTML='<div class="empty-s">No treatments logged yet</div>';return}treatments.slice(0,20).forEach((t,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:6px;padding:5px 8px;background:white;border:1px solid var(--cbr);border-radius:7px;font-size:11px';e.innerHTML=`<span>💅</span><span style="flex:1">${t.name}</span><span style="font-size:9px;color:var(--tmut)">${t.date}</span><button class="btn-del" onclick="delTx(${i})">×</button>`;l.appendChild(e)})}
window.delTx=i=>{treatments.splice(i,1);ss(K.treatments,treatments);renderTx()};
document.getElementById('treatment-add-btn').onclick=()=>{const inp=document.getElementById('treatment-inp'),v=inp.value.trim();if(!v)return;treatments.unshift({name:v,date:new Date().toLocaleDateString()});ss(K.treatments,treatments);inp.value='';renderTx();addDone('Beauty: '+v+' 💅')};
document.getElementById('treatment-inp').onkeydown=e=>{if(e.key==='Enter')document.getElementById('treatment-add-btn').click()};
renderTx();

let outfits=ls(K.outfits,[]);
function renderOf(){const l=document.getElementById('outfit-log');l.innerHTML='';if(!outfits.length){l.innerHTML='<div class="empty-s">No outfits logged yet</div>';return}outfits.slice(0,20).forEach((o,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:6px;padding:5px 8px;background:white;border:1px solid var(--cbr);border-radius:7px;font-size:11px';e.innerHTML=`<span>👗</span><span style="flex:1">${o.name}</span><span style="font-size:9px;color:var(--tmut)">${o.date}</span><button class="btn-del" onclick="delOf(${i})">×</button>`;l.appendChild(e)})}
window.delOf=i=>{outfits.splice(i,1);ss(K.outfits,outfits);renderOf()};
document.getElementById('outfit-add-btn').onclick=()=>{const inp=document.getElementById('outfit-inp'),v=inp.value.trim();if(!v)return;outfits.unshift({name:v,date:new Date().toLocaleDateString()});ss(K.outfits,outfits);inp.value='';renderOf()};
document.getElementById('outfit-inp').onkeydown=e=>{if(e.key==='Enter')document.getElementById('outfit-add-btn').click()};
renderOf();

[{step:'1',name:'Cleanser',note:'Double cleanse if wearing makeup',time:'AM/PM'},{step:'2',name:'Toner / essence',note:'Hydrating toner for T1D skin barrier',time:'AM/PM'},{step:'3',name:'Serum',note:'Vitamin C in AM · Retinol in PM (start slow)',time:'AM or PM'},{step:'4',name:'Moisturizer',note:'Gel-cream hybrid for PCOS skin',time:'AM/PM'},{step:'5',name:'SPF 30+',note:'Non-negotiable in AM',time:'AM only'},{step:'6',name:'Eye cream',note:'Pat gently, never rub',time:'PM'}].forEach(s=>{const e=document.createElement('div');e.style.cssText='background:white;border:1px solid var(--cbr);border-radius:9px;padding:7px 10px;margin-bottom:5px;display:flex;gap:8px;align-items:center';e.innerHTML=`<span style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--ch);min-width:18px">${s.step}</span><div style="flex:1"><div style="font-size:12px;font-weight:500">${s.name}</div><div style="font-size:9px;color:var(--tmut);margin-top:1px">${s.note}</div></div><span class="tag" style="background:var(--chp);color:var(--chd);border:1px solid var(--cbr)">${s.time}</span>`;document.getElementById('skincare-grid').appendChild(e)});

let bGoals=ls('wg_beautygoals',[{text:'Consistent morning skincare for 30 days',done:false},{text:'Start electrolysis consultations',done:false},{text:'Find a signature scent',done:false},{text:'Build a capsule wardrobe of 20 key pieces',done:false}]);
function renderBG(){const l=document.getElementById('bg-list');l.innerHTML='';bGoals.forEach((g,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid var(--cbr);font-size:11px';e.innerHTML=`<div class="check-box${g.done?' done':''}" onclick="toggleBG(${i})">${g.done?'✓':''}</div><span style="flex:1;${g.done?'text-decoration:line-through;opacity:.5':''}">${g.text}</span><button class="btn-del" onclick="delBG(${i})">×</button>`;l.appendChild(e)})}
window.toggleBG=i=>{bGoals[i].done=!bGoals[i].done;ss('wg_beautygoals',bGoals);renderBG()};
window.delBG=i=>{bGoals.splice(i,1);ss('wg_beautygoals',bGoals);renderBG()};
document.getElementById('bg-add').onclick=()=>{const v=document.getElementById('bg-inp').value.trim();if(!v)return;bGoals.push({text:v,done:false});ss('wg_beautygoals',bGoals);document.getElementById('bg-inp').value='';renderBG()};
renderBG();
