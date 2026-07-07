renderNav('health');

window.hOpenMo=id=>{const el=document.getElementById(id);if(el)el.classList.add('open')};
window.hCloseMo=id=>{const el=document.getElementById(id);if(el)el.classList.remove('open')};
window.ptOpenMo=id=>{const el=document.getElementById(id);if(el)el.classList.add('open')};
window.ptCloseMo=id=>{const el=document.getElementById(id);if(el)el.classList.remove('open')};
document.querySelectorAll('.mo').forEach(mo=>{mo.onclick=e=>{if(e.target===mo)mo.classList.remove('open')}});


// Health modal helpers
window.hOpenMo=id=>{const el=document.getElementById(id);if(el)el.classList.add('open')};
window.hCloseMo=id=>{const el=document.getElementById(id);if(el)el.classList.remove('open')};
document.querySelectorAll('.mo').forEach(mo=>{mo.onclick=e=>{if(e.target===mo)mo.classList.remove('open')}});

// Period tracker modal helpers
window.ptOpenMo=id=>{const el=document.getElementById(id);if(el)el.classList.add('open')};
window.ptCloseMo=id=>{const el=document.getElementById(id);if(el)el.classList.remove('open')};

// ============ HEALTH ============
const HK={meds:'wgh2_meds',supps:'wgh2_supps',taken:'wgh2_taken',syms:'wgh2_syms',wins:'wgh2_wins',impr:'wgh2_impr',se:'wgh2_se',docs:'wgh2_docs',appts:'wgh2_appts',tdoc:'wgh2_tdoc',pnotes:'wgh2_pnotes',checkups:'wgh2_chk',nutr:'wgh2_nutr',food:'wgh2_food',activity:'wgh2_act'};
const HTODAY=new Date().toISOString().split('T')[0];
const hFmtD=(k)=>{if(!k)return'';const p=k.split('-');return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})};
const hFmtS=(k)=>{if(!k)return'';const p=k.split('-');return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString('en-US',{month:'short',day:'numeric'})};
const hNowS=()=>new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
const H_BASE={protein:95,water:88,fat:57,fiber:25,carbs:130};
const H_ACT_LEVELS=[{key:'rest',label:'Rest day',emoji:'🛋️',waterAdd:0,proteinAdd:0,carbsAdd:0,note:'Baseline targets'},{key:'light',label:'Light',emoji:'🚶',waterAdd:8,proteinAdd:5,carbsAdd:0,note:'+8 fl oz water'},{key:'moderate',label:'Moderate',emoji:'🏃',waterAdd:16,proteinAdd:10,carbsAdd:15,note:'+16 fl oz water, +10g protein'},{key:'vigorous',label:'Vigorous',emoji:'💪',waterAdd:24,proteinAdd:15,carbsAdd:25,note:'+24 fl oz water, +15g protein'},{key:'sweaty',label:'Intense/Hot',emoji:'🔥',waterAdd:32,proteinAdd:20,carbsAdd:30,note:'+32 fl oz water, +20g protein'}];
const H_NUTR_DEF=[{key:'protein',label:'Protein',unit:'g',color:'#c0392b',icon:'🥩',note:'Stabilizes blood sugar + PCOS hormones.'},{key:'water',label:'Water',unit:'fl oz',color:'#2980b9',icon:'💧',note:'Based on your weight (162 lb × 0.54).'},{key:'fiber',label:'Fiber',unit:'g',color:'#27ae60',icon:'🥦',note:'MiraFiber gives you 8g already.'},{key:'fat',label:'Healthy fats',unit:'g',color:'#f0a500',icon:'🥑',note:'Needed for Vitamin D + hormones.'},{key:'carbs',label:'Net carbs',unit:'g',color:'#8e44ad',icon:'🍞',note:'Moderate target for T1D.'}];
const H_CC={'Type 1 Diabetes':'#c0392b','PCOS':'#8e44ad','Hypothyroidism':'#2980b9','ADHD':'#27ae60','Cardiovascular':'#e67e22','Hormone / Contraceptive':'#e91e8c','General / Other':'#888'};
const H_SYMS=[{n:'Fatigue',i:'😴',c:'#e67e22'},{n:'Brain fog',i:'🌫️',c:'#8e44ad'},{n:'Headache',i:'🤕',c:'#c0392b'},{n:'Nausea',i:'🤢',c:'#27ae60'},{n:'Low blood sugar',i:'📉',c:'#c0392b'},{n:'High blood sugar',i:'📈',c:'#e74c3c'},{n:'Joint pain',i:'🦴',c:'#d35400'},{n:'Low mood',i:'😔',c:'#2980b9'},{n:'Anxiety',i:'😰',c:'#8e44ad'},{n:'Hot flashes',i:'🔥',c:'#e74c3c'},{n:'Bloating',i:'😣',c:'#27ae60'},{n:'Hair loss',i:'🪮',c:'#c9a84c'},{n:'Dry skin',i:'🧴',c:'#d35400'},{n:'Insomnia',i:'🌙',c:'#2980b9'},{n:'Cramps',i:'⚡',c:'#8e44ad'},{n:'Acne',i:'😤',c:'#e67e22'},{n:'Dizziness',i:'💫',c:'#16a085'},{n:'Heart palpitations',i:'💓',c:'#c0392b'}];
const H_MED_COLORS=['#c0392b','#2980b9','#8e44ad','#27ae60','#e67e22','#16a085','#d35400','#e91e8c'];
const H_SUPP_COLORS=['#f0a500','#27ae60','#2980b9','#8e44ad','#16a085','#e67e22'];
const H_SUGGESTED=[{name:'Magnesium Glycinate',dose:'400–600mg before bed',why:'PCOS + anxiety + sleep + insulin sensitivity.',cond:'PCOS + General',color:'#8e44ad'},{name:'Inositol (Myo + D-Chiro 40:1)',dose:'4g/day',why:'Best-studied PCOS supplement. Improves insulin sensitivity, ovulation, acne.',cond:'PCOS',color:'#e91e8c'},{name:'Omega-3 (EPA + DHA)',dose:'2–4g/day',why:'PCOS inflammation, cardiovascular support, mood.',cond:'PCOS + Cardiovascular',color:'#2980b9'},{name:'CoQ10 (Ubiquinol)',dose:'200–400mg/day',why:'Rosuvastatin depletes CoQ10 — essential for statin users.',cond:'Cardiovascular',color:'#e67e22'},{name:'B-Complex (methylated)',dose:'High-potency daily',why:'Metformin depletes B12. Methylated bypasses absorption problems.',cond:'T1D + General',color:'#c9a84c'},{name:'Berberine',dose:'500mg 2–3× daily with meals',why:'Studied vs Metformin for insulin sensitivity.',cond:'PCOS + T1D',color:'#27ae60'},{name:'NAC',dose:'600–1800mg/day',why:'PCOS + liver support + antioxidant. Improves ovulation.',cond:'PCOS + General',color:'#16a085'},{name:'Zinc',dose:'25–50mg with food',why:'Reduces androgens in PCOS, improves acne and hair loss.',cond:'PCOS + Thyroid',color:'#d35400'},{name:'Selenium',dose:'200mcg/day',why:'Critical for thyroid T4→T3 conversion.',cond:'Hypothyroidism',color:'#1a4a6b'},{name:'Spearmint tea/extract',dose:'2 cups/day or 400mg extract',why:'Reduces testosterone in PCOS. Helps hirsutism, acne, hair loss.',cond:'PCOS',color:'#16a085'},{name:'Iron (with Vitamin C)',dose:'Test first — get ferritin checked!',why:'PCOS frequently causes iron deficiency. Low ferritin = fatigue.',cond:'PCOS',color:'#c0392b'}];
const H_CHECKUP_DEF=[{id:1,name:'Annual physical + bloodwork',freq:'Yearly',intervalMonths:12,icon:'🩺',priority:'high',why:'Full metabolic panel — essential for T1D, thyroid, PCOS'},{id:2,name:'Endocrinologist follow-up',freq:'Every 3–6 months',intervalMonths:4,icon:'🦋',priority:'high',why:'T1D, thyroid, PCOS, Ozempic management'},{id:3,name:'A1C (HbA1c) test',freq:'Every 3 months',intervalMonths:3,icon:'🩸',priority:'high',why:'Blood sugar control — critical for T1D'},{id:4,name:'Thyroid panel (TSH, T3, T4)',freq:'Every 6 months',intervalMonths:6,icon:'🦋',priority:'high',why:'Levothyroxine dose check'},{id:5,name:'Pap smear / cervical screening',freq:'Every 3 years',intervalMonths:36,icon:'🌺',priority:'high',why:'PCOS slightly elevates cervical risk'},{id:6,name:'OB-GYN annual well visit',freq:'Yearly',intervalMonths:12,icon:'👩‍⚕️',priority:'high',why:'PCOS, Norethindrone check'},{id:7,name:'Lipid panel (cholesterol)',freq:'Yearly',intervalMonths:12,icon:'❤️',priority:'high',why:'Rosuvastatin effectiveness + cardiovascular monitoring'},{id:8,name:'Kidney function',freq:'Yearly',intervalMonths:12,icon:'🫘',priority:'high',why:'T1D kidney protection + Metformin safety'},{id:9,name:'Eye exam (diabetic retinopathy)',freq:'Yearly',intervalMonths:12,icon:'👁️',priority:'high',why:'T1D retinal vessel protection'},{id:10,name:'Dental exam + cleaning',freq:'Every 6 months',intervalMonths:6,icon:'🦷',priority:'medium',why:'T1D increases infection and gum disease risk'},{id:11,name:'ADHD evaluation',freq:'ASAP',intervalMonths:24,icon:'🧠',priority:'high',why:'Book this now — it changes everything',nextDueOverride:'BOOK ASAP'},{id:12,name:'Vitamin D levels check',freq:'Every 6 months',intervalMonths:6,icon:'☀️',priority:'medium',why:'Confirm 10,000 IU is maintaining levels'},{id:13,name:'B12 levels',freq:'Yearly',intervalMonths:12,icon:'💊',priority:'medium',why:'Metformin depletes B12 over time'},{id:14,name:'Ferritin / iron panel',freq:'Yearly',intervalMonths:12,icon:'🩸',priority:'high',why:'PCOS major fatigue cause — check iron!'},{id:15,name:'Testosterone / androgen panel',freq:'Yearly',intervalMonths:12,icon:'🌙',priority:'medium',why:'PCOS androgen monitoring'}];

let hTodayActivity=ls(HK.activity,{date:HTODAY,intensity:'rest',steps:0,workouts:[]});
if(hTodayActivity.date!==HTODAY){hTodayActivity={date:HTODAY,intensity:'rest',steps:0,workouts:[]};ss(HK.activity,hTodayActivity)}
let hNutrToday=ls(HK.nutr,{date:HTODAY,vals:{protein:0,water:0,fiber:0,fat:0,carbs:0}});
if(hNutrToday.date!==HTODAY){hNutrToday={date:HTODAY,vals:{protein:0,water:0,fiber:0,fat:0,carbs:0}};ss(HK.nutr,hNutrToday)}
let hFoodLog=ls(HK.food,[]);
let hMeds=ls(HK.meds,[{id:1,name:'Levothyroxine',dose:'75mcg',form:'Tablet',fnum:1,funit:'day',type:'recurring',cond:'Hypothyroidism',time:'Morning, 30–60 min before food',notes:'Do NOT take within 4 hrs of calcium, iron, antacids, or MiraFiber.',color:'#2980b9'},{id:2,name:'Ozempic',dose:'2mg',form:'Injection',fnum:1,funit:'week',type:'recurring',cond:'PCOS',time:'Same day each week',notes:'GLP-1 agonist. Rotate injection sites.',color:'#8e44ad'},{id:3,name:'Gabapentin',dose:'900mg (3×300mg)',form:'Capsule',fnum:1,funit:'day',type:'recurring',cond:'General / Other',time:'Take with food',notes:'Taking all at once is fine. Food reduces dizziness.',color:'#d35400'},{id:4,name:'Rosuvastatin',dose:'20mg',form:'Tablet',fnum:1,funit:'day',type:'recurring',cond:'Cardiovascular',time:'Evening preferred',notes:'Avoid grapefruit. Watch for muscle soreness.',color:'#e67e22'},{id:5,name:'Metformin ER',dose:'500mg',form:'Tablet',fnum:1,funit:'day',type:'recurring',cond:'Type 1 Diabetes',time:'With evening meal',notes:'Extended release — take whole. Depletes B12!',color:'#c0392b'},{id:6,name:'Norethindrone',dose:'0.35mg',form:'Tablet',fnum:1,funit:'day',type:'recurring',cond:'Hormone / Contraceptive',time:'SAME TIME every day — 3-hour window!',notes:'Progestin-only mini pill. Must stay within same 3-hour window.',color:'#e91e8c'},{id:7,name:'Terconazole',dose:'0.4%',form:'Other',fnum:1,funit:'day',type:'limited',cond:'General / Other',time:'At bedtime',notes:'7-day antifungal. Use ALL 7 days.',endDate:'2026-03-23',color:'#16a085'}]);
let hSupps=ls(HK.supps,[{id:1,name:'Vitamin D3',dose:'10,000 IU',form:'Gummy',fnum:1,funit:'day',reason:'Documented deficiency',notes:'Take with a fat-containing meal.',color:'#f0a500'},{id:2,name:'MiraFiber',dose:'8g fiber',form:'Gummy',fnum:1,funit:'day',reason:'Digestive health, blood sugar stability',notes:'Take away from Levothyroxine.',color:'#27ae60'}]);
let hTakenLog=ls(HK.taken,{});
let hSymLog=ls(HK.syms,[]);
let hWinsLog=ls(HK.wins,[]);
let hImprLog=ls(HK.impr,[]);
let hSeLog=ls(HK.se,[]);
let hDocs=ls(HK.docs,[{id:1,name:'Dr. [Your Endocrinologist]',spec:'Endocrinology',practice:'',phone:'',conds:'T1D, Hypothyroidism, PCOS',notes:'Every 3–6 months.'},{id:2,name:'Dr. [Your GP / PCP]',spec:'Primary Care',practice:'',phone:'',conds:'General, Rosuvastatin',notes:'Annual physical.'},{id:3,name:'Dr. [Your OB-GYN]',spec:'OB-GYN',practice:'',phone:'',conds:'PCOS, Norethindrone',notes:'Annual well visit.'}]);
let hAppts=ls(HK.appts,[]);
let hTdoc=ls(HK.tdoc,[{text:'Ask about thyroid optimization — TSH target for PCOS + hypothyroid',done:false},{text:'Gabapentin: taking all at once OK long-term?',done:false},{text:'ADHD evaluation referral',done:false},{text:'Request B12 levels (Metformin depletes B12)',done:false},{text:'Request ferritin/iron panel',done:false}]);
let hCheckupState=ls(HK.checkups,{});
let hSymSelFull={};
let hQuickSel=new Set();
let hPendingChkId=null;
let hAdhChart=null,hWellChart=null,hTrRange='month';
let hActiveChkFilter='all';

function hGetTargets(){const act=H_ACT_LEVELS.find(a=>a.key===hTodayActivity.intensity)||H_ACT_LEVELS[0];return{protein:H_BASE.protein+act.proteinAdd,water:H_BASE.water+act.waterAdd,fat:H_BASE.fat,fiber:H_BASE.fiber,carbs:H_BASE.carbs+act.carbsAdd}}
const hTkKey=(id,isS)=>HTODAY+'_'+(isS?'s':'m')+id;
const hIsTaken=(id,isS)=>!!hTakenLog[hTkKey(id,isS)];
window.hToggleTaken=(id,isS)=>{hTakenLog[hTkKey(id,isS)]=!hTakenLog[hTkKey(id,isS)];ss(HK.taken,hTakenLog);hRenderTodayTab()};
window.hOpenMo=id=>document.getElementById(id).classList.add('open');
window.hCloseMo=id=>document.getElementById(id).classList.remove('open');
document.querySelectorAll('.mo').forEach(mo=>mo.onclick=e=>{if(e.target===mo)mo.classList.remove('open')});

window.showHTab=t=>{
  document.querySelectorAll('.htab-content').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('htab-'+t).classList.add('active');
  document.querySelector(`.tab-btn[onclick="showHTab('${t}')"]`).classList.add('active');
  if(t==='trends'){hRenderTrendCharts();hRenderTrendStats()}
  if(t==='symptoms'){hRenderSymHistory();hRenderSymFreq()}
  if(t==='docs'){hRenderDocs();hRenderTdoc()}
  if(t==='appts')hRenderAppts();
  if(t==='checkups')hRenderCheckups();
  if(t==='nutrition'){hRenderNutrTrackers();hRenderFoodLog()}
  if(t==='activity')hRenderActivityLog();
  if(t==='supps')hRenderSuppList();
  if(t==='meds')hRenderMedLists();
};

function hRenderTodayTab(){
  hRenderTargetsGrid();
  const ml=document.getElementById('h-t-med-list');if(!ml)return;ml.innerHTML='';
  const mt=hMeds.filter(m=>hIsTaken(m.id,false)).length;
  const mp=document.getElementById('h-t-med-prog');if(mp)mp.textContent=mt+'/'+hMeds.length+' taken';
  hMeds.forEach(m=>{const done=hIsTaken(m.id,false);const cc=H_CC[m.cond]||'#888';const e=document.createElement('div');e.className='mcard'+(done?' taken':'');e.innerHTML=`<div class="mhdr"><div class="micon" style="background:${m.color}18">💊</div><div style="flex:1"><div class="mname">${m.name}</div><div class="mdose">${m.dose} · ${m.form}</div><div class="mfreq"><span class="tag" style="background:${cc}15;color:${cc};border:1px solid ${cc}33">${m.cond}</span><span class="tag" style="background:var(--chp);color:var(--chd)">${m.fnum}×/${m.funit}</span>${m.time?`<span class="tag" style="background:#f5f5f5;color:var(--tmut)">${m.time}</span>`:''}</div></div><button class="bsm ${done?'g':'p'}" onclick="hToggleTaken(${m.id},false)">${done?'✓ Taken':'Take'}</button></div>${m.notes?`<div class="mnotes">📝 ${m.notes}</div>`:''}${m.endDate?`<div style="font-size:9px;color:var(--yellow);margin-top:3px">⏰ Ends: ${hFmtD(m.endDate)}</div>`:''}`;ml.appendChild(e)});
  const sl=document.getElementById('h-t-supp-list');if(!sl)return;sl.innerHTML='';
  const st=hSupps.filter(s=>hIsTaken(s.id,true)).length;
  const sp=document.getElementById('h-t-supp-prog');if(sp)sp.textContent=st+'/'+hSupps.length+' taken';
  hSupps.forEach(s=>{const done=hIsTaken(s.id,true);const e=document.createElement('div');e.className='mcard'+(done?' taken':'');e.innerHTML=`<div class="mhdr"><div class="micon" style="background:${s.color}18">🌿</div><div style="flex:1"><div class="mname">${s.name}</div><div class="mdose">${s.dose} · ${s.form} · ${s.fnum}×/${s.funit}</div><div style="font-size:10px;color:var(--tmut);margin-top:2px">${s.reason}</div></div><button class="bsm ${done?'g':'p'}" onclick="hToggleTaken(${s.id},true)">${done?'✓ Taken':'Take'}</button></div>${s.notes?`<div class="mnotes">📝 ${s.notes}</div>`:''}`;sl.appendChild(e)});
  const all=[...hMeds.map(m=>({...m,isS:false})),...hSupps.map(s=>({...s,isS:true}))];
  const tk=all.filter(i=>hIsTaken(i.id,i.isS)).length;const pct=all.length?Math.round(tk/all.length*100):0;
  const pa=document.getElementById('h-t-pct');if(pa)pa.textContent=pct+'%';
  const sa=document.getElementById('h-t-sub');if(sa)sa.textContent=tk+' of '+all.length;
  const mc=document.getElementById('h-t-meds');if(mc)mc.textContent=hMeds.length;
  const sc=document.getElementById('h-t-supps');if(sc)sc.textContent=hSupps.length+' supplements';
  hRenderAdhCal();hRenderQuickChips();
}
function hRenderTargetsGrid(){const g=document.getElementById('h-targets-grid');if(!g)return;g.innerHTML='';const targets=hGetTargets();const act=H_ACT_LEVELS.find(a=>a.key===hTodayActivity.intensity)||H_ACT_LEVELS[0];const lbl=document.getElementById('h-activity-modifier-label');if(lbl)lbl.textContent=act.key!=='rest'?'— adjusted for '+act.label.toLowerCase()+' activity today':'';H_NUTR_DEF.forEach(n=>{const val=hNutrToday.vals[n.key]||0,tgt=targets[n.key],pct=Math.min(100,Math.round(val/tgt*100));const e=document.createElement('div');e.className='stat-mini';const sc=pct>=100?'var(--green)':pct>=60?n.color:'var(--ch)';e.innerHTML=`<div class="sm-label">${n.icon} ${n.label}</div><div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:${sc}">${val}<span style="font-size:10px;font-weight:400;color:var(--tmut)"> / ${tgt}${n.unit}</span></div><div style="height:5px;background:rgba(0,0,0,.07);border-radius:3px;overflow:hidden;margin-top:4px"><div style="height:100%;width:${pct}%;background:${sc};border-radius:3px;transition:width .4s"></div></div>`;g.appendChild(e)})}
function hRenderAdhCal(){const lab=document.getElementById('h-adh-labels'),cal=document.getElementById('h-adh-cal');if(!lab||!cal)return;lab.innerHTML='';['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d=>{const e=document.createElement('div');e.style.cssText='text-align:center;font-size:9px;color:var(--tmut);padding-bottom:2px';e.textContent=d;lab.appendChild(e)});const _an=new Date(),_ay=_an.getFullYear(),_am=_an.getMonth(),_adim=new Date(_ay,_am+1,0).getDate();const _mnames=['January','February','March','April','May','June','July','August','September','October','November','December'];const adhTitle=document.getElementById('adh-cal-title');if(adhTitle)adhTitle.textContent=_mnames[_am]+' '+_ay+' — adherence';cal.innerHTML='';const fd=new Date(_ay,_am,1).getDay();for(let i=0;i<fd;i++){const e=document.createElement('div');e.style.cssText='aspect-ratio:1;border-radius:4px';cal.appendChild(e)}const allItems=[...hMeds.map(m=>({...m,isS:false})),...hSupps.map(s=>({...s,isS:true}))];const totalItems=allItems.length;for(let d=1;d<=_adim;d++){const e=document.createElement('div');e.className='adh-day';e.textContent=d;const k=_ay+'-'+String(_am+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');const isFuture=(_ay===_an.getFullYear()&&_am===_an.getMonth()&&d>_an.getDate())||(_ay>_an.getFullYear())||(_ay===_an.getFullYear()&&_am>_an.getMonth());const isToday=d===_an.getDate()&&_am===_an.getMonth()&&_ay===_an.getFullYear();if(isFuture){e.style.cssText='background:rgba(192,57,43,.04);border-radius:4px;aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:8px;color:transparent'}else{const tk=totalItems?allItems.filter(i=>hTakenLog[k+'_'+(i.isS?'s':'m')+i.id]).length:0;const pct=totalItems?tk/totalItems:0;if(pct>=1&&totalItems)e.classList.add('adh-taken');else if(pct>0){e.style.background='#fef9e7';e.style.border='1px solid var(--yellow)'}else if(totalItems){e.style.background='var(--chp)';e.style.color='var(--ch)'}else{e.style.background='rgba(0,0,0,.02)'}if(isToday){e.style.outline='2px solid var(--ch)';e.style.outlineOffset='1px'}}cal.appendChild(e)}}
function hRenderNutrTrackers(){const c=document.getElementById('h-nutr-trackers');if(!c)return;c.innerHTML='';const targets=hGetTargets();const nl=document.getElementById('h-nutr-activity-note');const act=H_ACT_LEVELS.find(a=>a.key===hTodayActivity.intensity);if(nl)nl.textContent=act&&act.key!=='rest'?`— ${act.note}`:'';H_NUTR_DEF.forEach(n=>{const val=hNutrToday.vals[n.key]||0,tgt=targets[n.key],pct=Math.min(100,Math.round(val/tgt*100));const sc=pct>=100?'var(--green)':pct>=60?n.color:'var(--ch)';const card=document.createElement('div');card.className='nutr-card';card.style.marginBottom='8px';if(n.key==='water'){const glasses=Math.round(tgt/8);const filled=Math.min(glasses,Math.round(val/8));card.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem"><span style="font-size:13px;font-weight:600">${n.icon} ${n.label}</span><span style="font-size:11px;font-weight:600;color:${sc}">${val} fl oz / ${tgt} fl oz</span></div><div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:.4rem" id="h-water-glasses"></div><div style="font-size:9px;color:var(--tmut);font-style:italic;margin-bottom:.4rem">${n.note}</div><div style="display:flex;gap:5px;align-items:center"><button class="btn btn-blue2" onclick="hAddWater(8)" style="font-size:10px;padding:3px 9px">+8 fl oz</button><button class="btn btn-blue2" onclick="hAddWater(16)" style="font-size:10px;padding:3px 9px">+16 fl oz</button><button class="bsm" onclick="hAddWater(-8)" style="font-size:9px">-8 oz</button></div>`;c.appendChild(card);const wg=document.getElementById('h-water-glasses');if(wg){for(let i=0;i<glasses;i++){const b=document.createElement('button');b.className='water-btn'+(i<filled?' filled':'');b.innerHTML=`<span>${i<filled?'💧':'🏺'}</span>`;b.onclick=()=>{const nv=(i+1)*8;hNutrToday.vals.water=nv===hNutrToday.vals.water?i*8:nv;ss(HK.nutr,hNutrToday);hRenderNutrTrackers();hRenderTargetsGrid()};wg.appendChild(b)}}}else{card.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px"><span style="font-size:13px;font-weight:600">${n.icon} ${n.label}</span><span style="font-size:11px;font-weight:600;color:${sc}">${val}${n.unit} / ${tgt}${n.unit}</span></div><div class="nutr-track" style="position:relative"><div class="nutr-fill" style="width:${pct}%;background:${sc};position:relative"></div></div><div style="display:flex;justify-content:space-between;font-size:9px;color:var(--tmut);margin-bottom:.4rem"><span>${pct}% of target</span><span style="font-style:italic">${n.note}</span></div>`;c.appendChild(card)}});const inpRow=document.getElementById('h-nutr-inputs');if(!inpRow)return;inpRow.innerHTML='';H_NUTR_DEF.forEach(n=>{const d=document.createElement('div');d.innerHTML=`<label class="fl">${n.icon} ${n.label} (${n.unit})</label><input class="inp inp-full" type="number" min="0" step="0.1" id="h-ni-${n.key}" placeholder="0">`;inpRow.appendChild(d)})}
window.hAddWater=oz=>{hNutrToday.vals.water=Math.max(0,(hNutrToday.vals.water||0)+oz);ss(HK.nutr,hNutrToday);hRenderNutrTrackers();hRenderTargetsGrid()};
window.hLogFood=()=>{const name=document.getElementById('h-food-name').value.trim();if(!name)return;const entry={name,meal:document.getElementById('h-food-meal').value,nutr:{},ts:Date.now()};H_NUTR_DEF.forEach(n=>{const inp=document.getElementById('h-ni-'+n.key);const v=parseFloat(inp?.value)||0;entry.nutr[n.key]=v;hNutrToday.vals[n.key]=(hNutrToday.vals[n.key]||0)+v});hFoodLog.unshift(entry);ss(HK.food,hFoodLog);ss(HK.nutr,hNutrToday);document.getElementById('h-food-name').value='';H_NUTR_DEF.forEach(n=>{const inp=document.getElementById('h-ni-'+n.key);if(inp)inp.value=''});hRenderNutrTrackers();hRenderFoodLog();hRenderTargetsGrid();const s=document.getElementById('h-food-saved');s.style.color='var(--green)';s.textContent='Logged! 🥗';setTimeout(()=>s.textContent='',2500)};
function hRenderFoodLog(){const c=document.getElementById('h-food-log-list');if(!c)return;c.innerHTML='';const today=hFoodLog.filter(f=>f.ts>new Date(new Date().setHours(0,0,0,0)));if(!today.length){c.innerHTML='<div class="empty-s">No foods logged today</div>';return}today.forEach((f,i)=>{const nutrStr=Object.entries(f.nutr||{}).filter(([k,v])=>v>0).map(([k,v])=>{const def=H_NUTR_DEF.find(n=>n.key===k);return`${def?.icon||''} ${v}${def?.unit||''}`}).join(' · ');const e=document.createElement('div');e.style.cssText='display:flex;gap:8px;align-items:flex-start;padding:7px 9px;background:white;border:1px solid var(--cbr);border-radius:8px;margin-bottom:4px';e.innerHTML=`<span class="tag" style="background:var(--chp);color:var(--chd);flex-shrink:0;margin-top:1px">${f.meal}</span><div style="flex:1"><div style="font-size:11px;font-weight:500">${f.name}</div>${nutrStr?`<div style="font-size:9px;color:var(--tmut);margin-top:2px">${nutrStr}</div>`:''}</div><button class="bdel" onclick="hDelFood(${i})">×</button>`;c.appendChild(e)})}
window.hDelFood=i=>{const f=hFoodLog[i];if(f){H_NUTR_DEF.forEach(n=>{hNutrToday.vals[n.key]=Math.max(0,(hNutrToday.vals[n.key]||0)-(f.nutr?.[n.key]||0))});ss(HK.nutr,hNutrToday)}hFoodLog.splice(i,1);ss(HK.food,hFoodLog);hRenderNutrTrackers();hRenderFoodLog();hRenderTargetsGrid()};
function hRenderNutrTips(){const tips=[{t:'Pair every carb with protein + fat',w:'Slows glucose — critical for T1D and PCOS.'},{t:'Eat within 30 min of waking',w:'Stabilizes cortisol and morning blood sugar.'},{t:'Fiber before carbs at meals',w:'Dramatically flattens your glucose curve.'},{t:'Hydrate before each meal',w:'Reduces glucose spikes and supports PCOS.'},{t:"Don't fear fat (the right kinds)",w:'Avocado, olive oil, nuts — needed for hormone production.'}];const c=document.getElementById('h-nutr-tips');if(!c)return;tips.forEach(t=>{const e=document.createElement('div');e.style.cssText='display:flex;gap:8px;padding:7px 9px;background:white;border:1px solid var(--cbr);border-radius:8px;margin-bottom:4px;font-size:11px;align-items:flex-start';e.innerHTML=`<span style="flex-shrink:0;font-size:14px">✨</span><div><div style="font-weight:600">${t.t}</div><div style="font-size:9px;color:var(--tmut);margin-top:2px">${t.w}</div></div>`;c.appendChild(e)})}
function hRenderIntensityGrid(){const g=document.getElementById('h-intensity-grid');if(!g)return;g.innerHTML='';H_ACT_LEVELS.forEach(a=>{const e=document.createElement('div');e.className='act-pill'+(hTodayActivity.intensity===a.key?' selected':'');e.innerHTML=`<span class="act-emoji">${a.emoji}</span><div class="act-label">${a.label}</div>`;e.onclick=()=>{hTodayActivity.intensity=a.key;ss(HK.activity,hTodayActivity);hRenderIntensityGrid();hRenderActivityImpact();hRenderTargetsGrid();hRenderNutrTrackers()};g.appendChild(e)})}
function hRenderActivityImpact(){const banner=document.getElementById('h-activity-impact-banner'),text=document.getElementById('h-activity-impact-text');if(!banner||!text)return;const act=H_ACT_LEVELS.find(a=>a.key===hTodayActivity.intensity);if(!act||act.key==='rest'){banner.style.display='none';return}banner.style.display='block';const parts=[];if(act.waterAdd)parts.push(`💧 Water: +${act.waterAdd} fl oz`);if(act.proteinAdd)parts.push(`🥩 Protein: +${act.proteinAdd}g`);if(act.carbsAdd)parts.push(`🍞 Carbs: +${act.carbsAdd}g`);text.innerHTML=parts.join('<br>')}
window.hLogSteps=()=>{const v=parseInt(document.getElementById('h-steps-inp').value)||0;hTodayActivity.steps=v;ss(HK.activity,hTodayActivity);const disp=document.getElementById('h-steps-display');if(!disp)return;const pct=Math.min(100,Math.round(v/8000*100));const label=v<2000?'Mostly sedentary':v<5000?'Low activity':v<8000?'Moderate':v<12000?'Active':'Very active!';disp.innerHTML=`<div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:3px"><span style="font-weight:600">${v.toLocaleString()} steps</span><span style="color:var(--teal)">${label}</span></div><div style="height:7px;background:rgba(0,0,0,.07);border-radius:4px;overflow:hidden"><div style="height:100%;width:${pct}%;background:var(--teal);border-radius:4px;transition:width .4s"></div></div>`};
window.hLogWorkout=()=>{const name=document.getElementById('h-workout-name').value.trim();if(!name)return;const mins=parseInt(document.getElementById('h-workout-mins').value)||0;const type=document.getElementById('h-workout-type').value;hTodayActivity.workouts.push({name,mins,type,time:hNowS()});ss(HK.activity,hTodayActivity);if(type==='vigorous'&&hTodayActivity.intensity!=='vigorous'&&hTodayActivity.intensity!=='sweaty'){hTodayActivity.intensity='vigorous';ss(HK.activity,hTodayActivity)}else if(type==='moderate'&&hTodayActivity.intensity==='rest'){hTodayActivity.intensity='moderate';ss(HK.activity,hTodayActivity)}document.getElementById('h-workout-name').value='';document.getElementById('h-workout-mins').value='';hRenderIntensityGrid();hRenderActivityImpact();hRenderTargetsGrid();hRenderNutrTrackers();hRenderActivityLog()};
function hRenderActivityLog(){const c=document.getElementById('h-activity-log');if(!c)return;const act=ls(HK.activity,{});if(!act.workouts?.length&&!act.steps){c.innerHTML='<div class="empty-s">No activity logged today</div>';return}c.innerHTML='';if(act.steps){const e=document.createElement('div');e.style.cssText='display:flex;gap:8px;padding:7px 9px;background:white;border:1px solid var(--cbr);border-radius:8px;margin-bottom:4px;align-items:center;font-size:11px';e.innerHTML=`<span style="font-size:16px">👟</span><div style="flex:1"><div style="font-weight:600">${act.steps.toLocaleString()} steps</div></div>`;c.appendChild(e)}act.workouts?.forEach(w=>{const e=document.createElement('div');e.style.cssText='display:flex;gap:8px;padding:7px 9px;background:white;border:1px solid var(--cbr);border-radius:8px;margin-bottom:4px;align-items:flex-start;font-size:11px';e.innerHTML=`<span style="font-size:16px">🏋️</span><div style="flex:1"><div style="font-weight:600">${w.name}${w.mins?` — ${w.mins} min`:''}</div><div style="font-size:9px;color:var(--tmut)">${w.time}</div></div>`;c.appendChild(e)})}
function hRenderMedLists(){['recurring','limited'].forEach(type=>{const c=document.getElementById('h-meds-'+type);if(!c)return;c.innerHTML='';const arr=hMeds.filter(m=>m.type===type);if(!arr.length){c.innerHTML='<div class="empty-s">None yet</div>';return}arr.forEach(m=>{const cc=H_CC[m.cond]||'#888';const e=document.createElement('div');e.className='mcard';e.innerHTML=`<div class="mhdr"><div class="micon" style="background:${m.color}18">💊</div><div style="flex:1"><div class="mname">${m.name}</div><div class="mdose">${m.dose} · ${m.form}</div><div class="mfreq"><span class="tag" style="background:${cc}15;color:${cc};border:1px solid ${cc}33">${m.cond}</span><span class="tag" style="background:var(--chp);color:var(--chd)">${m.fnum}×/${m.funit}</span>${m.time?`<span class="tag" style="background:#f5f5f5;color:var(--tmut)">${m.time}</span>`:''}</div></div><button class="bdel" onclick="hDelMed(${m.id})">✕</button></div>${m.notes?`<div class="mnotes">📝 ${m.notes}</div>`:''}${m.endDate?`<div style="font-size:9px;color:var(--yellow);margin-top:3px">⏰ Ends: ${hFmtD(m.endDate)}</div>`:''}`;c.appendChild(e)})})}
window.hDelMed=id=>{if(confirm('Remove?')){hMeds=hMeds.filter(m=>m.id!==id);ss(HK.meds,hMeds);hRenderMedLists();hRenderTodayTab();hPopulateSESelect()}};
function hRenderSuppList(){const c=document.getElementById('h-supps-active');if(!c)return;c.innerHTML='';if(!hSupps.length){c.innerHTML='<div class="empty-s">No supplements yet</div>';return}hSupps.forEach(s=>{const e=document.createElement('div');e.className='mcard';e.innerHTML=`<div class="mhdr"><div class="micon" style="background:${s.color}18">🌿</div><div style="flex:1"><div class="mname">${s.name}</div><div class="mdose">${s.dose} · ${s.form} · ${s.fnum}×/${s.funit}</div><div style="font-size:10px;color:var(--tmut);margin-top:2px">${s.reason}</div></div><button class="bdel" onclick="hDelSupp(${s.id})">✕</button></div>${s.notes?`<div class="mnotes">📝 ${s.notes}</div>`:''}`;c.appendChild(e)})}
window.hDelSupp=id=>{if(confirm('Remove?')){hSupps=hSupps.filter(s=>s.id!==id);ss(HK.supps,hSupps);hRenderSuppList();hRenderTodayTab()}};
function hRenderSuggestedSupps(){const c=document.getElementById('h-suggested-supps');if(!c)return;c.innerHTML='';H_SUGGESTED.forEach(s=>{const e=document.createElement('div');e.style.cssText='background:white;border:1px solid var(--cbr);border-radius:10px;padding:9px 12px;margin-bottom:6px';e.innerHTML=`<div style="display:flex;align-items:flex-start;gap:9px"><span style="font-size:17px;flex-shrink:0">🌿</span><div style="flex:1"><div style="font-size:12px;font-weight:600">${s.name}</div><div style="font-size:10px;font-weight:600;color:${s.color};margin-top:1px">Suggested: ${s.dose}</div><div style="font-size:9px;color:var(--tmut);margin-top:3px;line-height:1.5">${s.why}</div></div><span class="tag" style="background:${s.color}15;color:${s.color};border:1px solid ${s.color}33;flex-shrink:0;align-self:flex-start">${s.cond}</span></div>`;c.appendChild(e)})}
function hRenderQuickChips(){const c=document.getElementById('h-quick-chips');if(!c)return;c.innerHTML='';H_SYMS.slice(0,10).forEach(s=>{const sel=hQuickSel.has(s.n);const e=document.createElement('span');e.className='schip';e.style.cssText=`background:${sel?s.c+'22':'white'};color:${s.c};border-color:${s.c}44`;e.textContent=s.i+' '+s.n;e.onclick=()=>{if(hQuickSel.has(s.n))hQuickSel.delete(s.n);else hQuickSel.add(s.n);hRenderQuickChips()};c.appendChild(e)})}
window.hLogQuickSym=()=>{const syms=[...hQuickSel].map(n=>({n,sev:'mild'}));const custom=document.getElementById('h-qsym-inp').value.trim();if(custom)syms.push({n:custom,sev:'mild'});if(!syms.length)return;hSymLog.unshift({date:HTODAY,ts:Date.now(),syms,notes:'Quick',feel:5});ss(HK.syms,hSymLog);hQuickSel.clear();document.getElementById('h-qsym-inp').value='';hRenderQuickChips();const s=document.getElementById('h-qsym-saved');s.style.color='var(--green)';s.textContent='Logged! ✨';setTimeout(()=>s.textContent='',2000)};
window.hLogQuickWin=()=>{const t=document.getElementById('h-qwin-inp').value.trim();if(!t)return;hWinsLog.unshift({text:t,date:hNowS(),ts:Date.now()});hImprLog.unshift({text:t,cat:'General',date:hNowS(),ts:Date.now()});ss(HK.wins,hWinsLog);ss(HK.impr,hImprLog);document.getElementById('h-qwin-inp').value='';const s=document.getElementById('h-qwin-saved');s.style.color='var(--green)';s.textContent='Logged! ✨';setTimeout(()=>s.textContent='',2000)};
function hRenderSymFullGrid(){const c=document.getElementById('h-sym-full-grid');if(!c)return;c.innerHTML='';H_SYMS.forEach(s=>{const sel=hSymSelFull[s.n];const e=document.createElement('div');e.style.cssText=`background:white;border:1.5px solid ${s.c}44;border-radius:8px;padding:5px 9px;cursor:pointer;display:flex;gap:5px;align-items:center;font-size:11px;transition:all .15s${sel?`;border-color:${s.c};background:${s.c}18`:''}`;e.innerHTML=`<span>${s.i}</span><span>${s.n}</span>${sel?`<select class="sel" style="font-size:9px;padding:1px 3px;border-radius:4px;border:1px solid ${s.c}44" onclick="event.stopPropagation()" onchange="hSymSelFull['${s.n}']=this.value"><option ${sel==='mild'?'selected':''}>mild</option><option ${sel==='moderate'?'selected':''}>moderate</option><option ${sel==='severe'?'selected':''}>severe</option></select>`:''}`;e.onclick=()=>{if(hSymSelFull[s.n])delete hSymSelFull[s.n];else hSymSelFull[s.n]='mild';hRenderSymFullGrid()};c.appendChild(e)})}
window.hAddCustomSym=()=>{const n=document.getElementById('h-sym-custom').value.trim();if(!n)return;hSymSelFull[n]=document.getElementById('h-sym-sev').value;hRenderSymFullGrid();document.getElementById('h-sym-custom').value=''};
document.getElementById('h-sym-feeling').oninput=function(){document.getElementById('h-sym-feeling-val').textContent=this.value+'/10'};
window.hLogSymptoms=()=>{const syms=Object.entries(hSymSelFull).map(([n,sev])=>({n,sev}));if(!syms.length){const s=document.getElementById('h-sym-saved');s.style.color='var(--ch)';s.textContent='Select a symptom!';setTimeout(()=>s.textContent='',2000);return}hSymLog.unshift({date:HTODAY,ts:Date.now(),syms,notes:document.getElementById('h-sym-notes').value.trim(),feel:parseInt(document.getElementById('h-sym-feeling').value)});ss(HK.syms,hSymLog);hSymSelFull={};document.getElementById('h-sym-notes').value='';document.getElementById('h-sym-feeling').value=5;document.getElementById('h-sym-feeling-val').textContent='5/10';hRenderSymFullGrid();hRenderSymHistory();hRenderSymFreq();const s=document.getElementById('h-sym-saved');s.style.color='var(--green)';s.textContent='Logged! ✨';setTimeout(()=>s.textContent='',3000)};
function hRenderSymHistory(){const c=document.getElementById('h-sym-history');if(!c)return;c.innerHTML='';if(!hSymLog.length){c.innerHTML='<div class="empty-s">No symptoms logged</div>';return}hSymLog.slice(0,25).forEach((entry,i)=>{const e=document.createElement('div');e.className='log-entry';e.innerHTML=`<div class="log-date">${hFmtS(entry.date)}<br><span style="color:var(--ch);font-weight:600">${entry.feel}/10</span></div><div style="flex:1"><div style="display:flex;flex-wrap:wrap;gap:2px">${entry.syms.map(s=>`<span class="log-chip">${s.n} (${s.sev})</span>`).join('')}</div>${entry.notes&&entry.notes!=='Quick'?`<div style="font-size:9px;color:var(--tmut);margin-top:2px">${entry.notes}</div>`:''}</div><button class="bdel" onclick="hDelSym(${i})">×</button>`;c.appendChild(e)})}
window.hDelSym=i=>{hSymLog.splice(i,1);ss(HK.syms,hSymLog);hRenderSymHistory();hRenderSymFreq()};
function hRenderSymFreq(){const c=document.getElementById('h-sym-freq');if(!c)return;c.innerHTML='';const freq={};hSymLog.forEach(e=>e.syms.forEach(s=>{freq[s.n]=(freq[s.n]||0)+1}));const sorted=Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,8);if(!sorted.length){c.innerHTML='<div class="empty-s">Log symptoms to see patterns</div>';return}const max=sorted[0][1];sorted.forEach(([n,cnt])=>{const sym=H_SYMS.find(s=>s.n===n);const e=document.createElement('div');e.style.marginBottom='7px';e.innerHTML=`<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px"><span>${sym?.i||''} <strong>${n}</strong></span><span style="color:var(--tmut)">${cnt}×</span></div><div style="height:6px;background:rgba(192,57,43,.08);border-radius:3px;overflow:hidden"><div style="height:100%;width:${cnt/max*100}%;background:${sym?.c||'var(--ch)'};border-radius:3px"></div></div>`;c.appendChild(e)})}
function hRenderDocs(){const c=document.getElementById('h-docs-list');if(!c)return;c.innerHTML='';if(!hDocs.length){c.innerHTML='<div class="empty-s">No doctors added</div>';return}hDocs.forEach((d,i)=>{const e=document.createElement('div');e.className='doc-card';e.innerHTML=`<div style="display:flex;align-items:flex-start;gap:8px"><div style="flex:1"><div style="font-size:13px;font-weight:600">${d.name}</div><div style="font-size:10px;color:var(--tmut)">${d.spec}</div>${d.practice?`<div style="font-size:9px;color:var(--tmut)">${d.practice}</div>`:''}<div style="display:flex;gap:5px;margin-top:4px;flex-wrap:wrap">${d.phone?`<span class="tag" style="background:var(--chp);color:var(--chd)">📞 ${d.phone}</span>`:''}${d.conds?`<span class="tag" style="background:#e8f4fd;color:var(--blue)">${d.conds}</span>`:''}</div>${d.notes?`<div style="font-size:9px;color:var(--tmut);margin-top:4px;font-style:italic">${d.notes}</div>`:''}</div><button class="bdel" onclick="hDelDoc(${d.id})">✕</button></div>`;c.appendChild(e)})}
window.hDelDoc=id=>{if(confirm('Remove?')){hDocs=hDocs.filter(d=>d.id!==id);ss(HK.docs,hDocs);hRenderDocs()}};
function hRenderTdoc(){const c=document.getElementById('h-tdoc-list');if(!c)return;c.innerHTML='';if(!hTdoc.length){c.innerHTML='<div class="empty-s">Nothing yet</div>';return}hTdoc.forEach((item,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:7px;padding:5px 8px;background:white;border:1px solid var(--cbr);border-radius:7px;margin-bottom:3px;font-size:11px'+(item.done?';opacity:.5;text-decoration:line-through':'');e.innerHTML=`<div style="width:15px;height:15px;border:2px solid ${item.done?'var(--green)':'var(--cbr)'};border-radius:4px;cursor:pointer;flex-shrink:0;background:${item.done?'var(--green)':'white'};display:flex;align-items:center;justify-content:center;color:white;font-size:9px" onclick="hToggleTdoc(${i})">${item.done?'✓':''}</div><span style="flex:1">${item.text}</span><button class="bdel" onclick="hDelTdoc(${i})">×</button>`;c.appendChild(e)})}
window.hToggleTdoc=i=>{hTdoc[i].done=!hTdoc[i].done;ss(HK.tdoc,hTdoc);hRenderTdoc()};
window.hDelTdoc=i=>{hTdoc.splice(i,1);ss(HK.tdoc,hTdoc);hRenderTdoc()};
window.hAddTdoc=()=>{const t=document.getElementById('h-tdoc-inp').value.trim();if(!t)return;hTdoc.push({text:t,done:false});ss(HK.tdoc,hTdoc);document.getElementById('h-tdoc-inp').value='';hRenderTdoc()};
document.getElementById('h-tdoc-inp').onkeydown=e=>{if(e.key==='Enter')hAddTdoc()};
function hRenderAppts(){const up=document.getElementById('h-appts-upcoming'),past=document.getElementById('h-appts-past');if(!up||!past)return;up.innerHTML='';past.innerHTML='';if(!hAppts.length){up.innerHTML='<div class="empty-s">No appointments yet</div>';past.innerHTML='<div class="empty-s">No past notes</div>';return}const sorted=[...hAppts].sort((a,b)=>a.date.localeCompare(b.date));const upcoming=sorted.filter(a=>a.date>=HTODAY),pastArr=sorted.filter(a=>a.date<HTODAY).reverse();if(!upcoming.length)up.innerHTML='<div class="empty-s">No upcoming appointments</div>';upcoming.forEach(a=>{const d=new Date(a.date+'T12:00');const e=document.createElement('div');e.className='appt-item';e.innerHTML=`<div class="appt-date-block"><div class="appt-month">${d.toLocaleString('en-US',{month:'short'})}</div><div class="appt-day">${d.getDate()}</div></div><div style="flex:1"><div style="font-size:12px;font-weight:600">${a.doc}</div><div style="font-size:10px;color:var(--tmut);margin-top:2px">${a.time||''} ${a.loc?'· '+a.loc:''}</div>${a.notes?`<div style="font-size:10px;color:var(--tmut);margin-top:3px;font-style:italic">${a.notes}</div>`:''}</div>`;up.appendChild(e)});if(!pastArr.length)past.innerHTML='<div class="empty-s">No past notes</div>';pastArr.forEach(a=>{const e=document.createElement('div');e.style.cssText='padding:7px 9px;background:white;border:1px solid var(--cbr);border-radius:8px;margin-bottom:4px;font-size:11px;opacity:.8';e.innerHTML=`<div style="font-weight:600;color:var(--chd)">${hFmtD(a.date)} — ${a.doc}</div>${a.notes?`<div style="font-size:9px;color:var(--tmut);margin-top:2px">${a.notes}</div>`:''}`;past.appendChild(e)})}
function hAddMonths(dateStr,months){if(!dateStr)return null;const p=dateStr.split('-');const d=new Date(+p[0],+p[1]-1,+p[2]);d.setMonth(d.getMonth()+months);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function hCheckupStatus(ck){if(ck.nextDueOverride&&!ck.lastDone)return'asap';if(!ck.lastDone)return'unknown';const nd=ck.nextDue||hAddMonths(ck.lastDone,ck.intervalMonths);if(!nd)return'unknown';const today=new Date(),due=new Date(nd.split('-').map((v,i)=>i===1?+v-1:+v));const diffDays=Math.floor((due-today)/86400000);if(diffDays<0)return'overdue';if(diffDays<=60)return'soon';return'ok'}
function hCheckupStatusLabel(ck){const s=hCheckupStatus(ck);if(s==='asap')return{text:'BOOK ASAP',color:'var(--ch)',bg:'var(--chp)'};if(s==='overdue'){const nd=ck.nextDue||hAddMonths(ck.lastDone,ck.intervalMonths);const p=nd.split('-');const due=new Date(+p[0],+p[1]-1,+p[2]);const days=Math.floor((new Date()-due)/86400000);return{text:`Overdue by ${days} day${days!==1?'s':''}`,color:'var(--ch)',bg:'var(--chp)'}}if(s==='soon'){const nd=ck.nextDue||hAddMonths(ck.lastDone,ck.intervalMonths);const p=nd.split('-');const due=new Date(+p[0],+p[1]-1,+p[2]);const days=Math.floor((due-new Date())/86400000);return{text:`Due in ${days} day${days!==1?'s':''}`,color:'#b37a00',bg:'#fef9e7'}}if(s==='ok'){const nd=ck.nextDue||hAddMonths(ck.lastDone,ck.intervalMonths);return{text:`Next: ${hFmtS(nd)}`,color:'var(--green)',bg:'#eafaf1'}}return{text:'No date set — tap to log',color:'var(--tmut)',bg:'#f5f5f5'}}
function hGetCheckups(){return H_CHECKUP_DEF.map(c=>({...c,...(hCheckupState[c.id]||{})}))}
window.hFilterCheckups=(f,btn)=>{hActiveChkFilter=f;document.querySelectorAll('[data-chkf]').forEach(b=>b.classList.remove('p'));btn.classList.add('p');hRenderCheckups()};
function hRenderCheckups(){const c=document.getElementById('h-checkups-list');if(!c)return;c.innerHTML='';let list=hGetCheckups();const order={'asap':0,'overdue':1,'soon':2,'unknown':3,'ok':4};list.sort((a,b)=>(order[hCheckupStatus(a)]??5)-(order[hCheckupStatus(b)]??5));if(hActiveChkFilter==='overdue')list=list.filter(c=>['asap','overdue'].includes(hCheckupStatus(c)));else if(hActiveChkFilter==='soon')list=list.filter(c=>hCheckupStatus(c)==='soon');else if(hActiveChkFilter==='done')list=list.filter(c=>hCheckupStatus(c)==='ok');if(!list.length){c.innerHTML='<div class="empty-s">Nothing in this category</div>';return}list.forEach(ck=>{const s=hCheckupStatus(ck);const sl=hCheckupStatusLabel(ck);const e=document.createElement('div');e.className='chk-item'+(s==='overdue'||s==='asap'?' overdue':s==='soon'?' due-soon':'');e.innerHTML=`<div class="chk-header"><div class="chk-icon-box" style="background:${sl.bg}">${ck.icon}</div><div style="flex:1"><div style="font-size:12px;font-weight:600">${ck.name}</div><div style="font-size:10px;color:var(--tmut);margin-top:1px">${ck.freq}</div><div style="font-size:9px;color:var(--tmut);margin-top:3px;font-style:italic">${ck.why}</div>${ck.lastDone?`<div style="font-size:9px;color:var(--tmut);margin-top:3px">Last done: ${hFmtD(ck.lastDone)}</div>`:''}<div class="next-due-pill" style="background:${sl.bg};color:${sl.color};border:1px solid ${sl.color}44">📅 ${sl.text}</div></div></div><div style="margin-top:.5rem;display:flex;gap:5px"><button class="bsm p" onclick="hOpenChkModal(${ck.id})">✓ Mark as done</button>${ck.lastDone?`<button class="bsm" onclick="hUndoChk(${ck.id})" style="font-size:9px">↩ Undo</button>`:''}</div>`;c.appendChild(e)})}
window.hOpenChkModal=id=>{const ck=hGetCheckups().find(c=>c.id===id);if(!ck)return;hPendingChkId=id;document.getElementById('h-chk-modal-title').textContent='✓ Mark done: '+ck.name;document.getElementById('h-chk-modal-desc').textContent=ck.why;const dateInp=document.getElementById('h-chk-done-date');dateInp.value=HTODAY;const nextPreview=document.getElementById('h-chk-next-preview');const updatePreview=()=>{const nd=hAddMonths(dateInp.value||HTODAY,ck.intervalMonths);nextPreview.textContent=nd?hFmtD(nd)+` (in ${ck.intervalMonths} months)`:'...'};updatePreview();dateInp.oninput=updatePreview;document.getElementById('h-chk-confirm-btn').onclick=()=>{const doneDate=dateInp.value||HTODAY;hCheckupState[id]={lastDone:doneDate,nextDue:hAddMonths(doneDate,ck.intervalMonths),done:true};ss(HK.checkups,hCheckupState);hCloseMo('h-chk-modal');hRenderCheckups()};hOpenMo('h-chk-modal')};
window.hUndoChk=id=>{delete hCheckupState[id];ss(HK.checkups,hCheckupState);hRenderCheckups()};
window.hSetTr=(r,btn)=>{hTrRange=r;document.querySelectorAll('#htab-trends [data-tr]').forEach(b=>b.classList.remove('p'));btn.classList.add('p');hRenderTrendCharts();hRenderTrendStats()};
function hRenderTrendStats(){const c=document.getElementById('h-trend-stats');if(!c)return;const days=hTrRange==='month'?30:hTrRange==='6m'?180:365;const cutoff=Date.now()-days*86400000;const allItems=[...hMeds.map(m=>({...m,isS:false})),...hSupps.map(s=>({...s,isS:true}))];const totalItems=allItems.length;let totalChecks=0,totalPossible=0;const _an=new Date();for(let i=0;i<days&&i<=_an.getDate()+(_an.getMonth()*30);i++){const d=new Date();d.setDate(d.getDate()-i);const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if(totalItems){totalPossible+=totalItems;totalChecks+=allItems.filter(item=>hTakenLog[k+'_'+(item.isS?'s':'m')+item.id]).length}}const adhPct=totalPossible?Math.round(totalChecks/totalPossible*100):0;c.innerHTML=`<div class="stat-mini"><div class="sm-label">Avg adherence</div><div class="sm-val" style="color:${adhPct>=70?'var(--green)':adhPct>=40?'var(--yellow)':'var(--ch)'}">${adhPct}%</div><div class="sm-sub">${hTrRange} avg</div></div><div class="stat-mini"><div class="sm-label">Symptom logs</div><div class="sm-val">${hSymLog.length}</div><div class="sm-sub">entries</div></div><div class="stat-mini"><div class="sm-label">Wins logged</div><div class="sm-val" style="color:var(--green)">${hImprLog.length}</div><div class="sm-sub">improvements</div></div>`}
function hRenderTrendCharts(){const days=hTrRange==='month'?30:hTrRange==='6m'?180:365;const step=hTrRange==='month'?1:hTrRange==='6m'?7:30;const labels=[],adhD=[],wellD=[];const allItems=[...hMeds.map(m=>({...m,isS:false})),...hSupps.map(s=>({...s,isS:true}))];const totalItems=allItems.length;for(let i=days;i>=0;i-=step){const d=new Date();d.setDate(d.getDate()-i);const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');labels.push(d.toLocaleDateString('en-US',{month:'short',day:hTrRange==='month'?'numeric':undefined}));if(totalItems){const tk=allItems.filter(item=>hTakenLog[k+'_'+(item.isS?'s':'m')+item.id]).length;adhD.push(Math.round(tk/totalItems*100))}else{adhD.push(0)}const sym=hSymLog.find(s=>s.date===k);wellD.push(sym?sym.feel:null)}const mk=(id,ex,data,color)=>{const ctx=document.getElementById(id);if(!ctx)return;if(ex)ex.destroy();const filtered=data.map((v,i)=>v!==null?v:undefined);return new Chart(ctx.getContext('2d'),{type:'line',data:{labels,datasets:[{data:filtered,borderColor:color,backgroundColor:color+'18',tension:.4,pointRadius:2,borderWidth:2,spanGaps:true}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(192,57,43,.05)'},ticks:{font:{size:9},color:'#6b3a3a',maxTicksLimit:10}},y:{grid:{color:'rgba(192,57,43,.05)'},ticks:{font:{size:9},color:'#6b3a3a'}}}}})};hAdhChart=mk('h-adh-chart',hAdhChart,adhD,'rgb(39,174,96)');hWellChart=mk('h-well-chart',hWellChart,wellD,'rgb(41,128,185)')}
function hRenderSEList(){const c=document.getElementById('h-se-list');if(!c)return;c.innerHTML='';if(!hSeLog.length){c.innerHTML='<div class="empty-s">No side effects logged</div>';return}hSeLog.slice(0,12).forEach((s,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;gap:7px;padding:6px 8px;background:#fef9e7;border:1px solid rgba(240,165,0,.2);border-radius:7px;margin-bottom:3px;font-size:11px';e.innerHTML=`<span>⚠️</span><div style="flex:1"><div style="font-weight:500">${s.text}</div><div style="font-size:9px;color:var(--tmut)">${s.med} · ${s.date}</div></div><button class="bdel" onclick="hDelSE(${i})">×</button>`;c.appendChild(e)})}
window.hDelSE=i=>{hSeLog.splice(i,1);ss(HK.se,hSeLog);hRenderSEList()};
window.hLogSE=()=>{const t=document.getElementById('h-se-inp').value.trim();if(!t)return;hSeLog.unshift({text:t,med:document.getElementById('h-se-med').value,date:hNowS(),ts:Date.now()});ss(HK.se,hSeLog);document.getElementById('h-se-inp').value='';hRenderSEList()};
function hPopulateSESelect(){const sel=document.getElementById('h-se-med');if(!sel)return;sel.innerHTML='';[...hMeds,...hSupps].forEach(m=>{const o=document.createElement('option');o.value=m.name;o.textContent=m.name;sel.appendChild(o)});const og=document.createElement('option');og.value='General';og.textContent='General';sel.appendChild(og)}
window.hSaveMed=()=>{const n=document.getElementById('h-mm-name').value.trim();if(!n)return;hMeds.push({id:Date.now(),name:n,dose:document.getElementById('h-mm-dose').value.trim(),form:document.getElementById('h-mm-form').value,fnum:parseInt(document.getElementById('h-mm-fnum').value)||1,funit:document.getElementById('h-mm-funit').value,type:document.getElementById('h-mm-type').value,cond:document.getElementById('h-mm-cond').value,time:document.getElementById('h-mm-time').value.trim(),notes:document.getElementById('h-mm-notes').value.trim(),endDate:document.getElementById('h-mm-end').value,color:H_MED_COLORS[hMeds.length%H_MED_COLORS.length]});ss(HK.meds,hMeds);hRenderMedLists();hRenderTodayTab();hPopulateSESelect();hCloseMo('h-med-modal');['h-mm-name','h-mm-dose','h-mm-time','h-mm-notes','h-mm-end'].forEach(id=>document.getElementById(id).value='')};
window.hSaveSupp=()=>{const n=document.getElementById('h-sm-name').value.trim();if(!n)return;hSupps.push({id:Date.now(),name:n,dose:document.getElementById('h-sm-dose').value.trim(),form:document.getElementById('h-sm-form').value,fnum:parseInt(document.getElementById('h-sm-fnum').value)||1,funit:document.getElementById('h-sm-funit').value,reason:document.getElementById('h-sm-reason').value.trim(),notes:document.getElementById('h-sm-notes').value.trim(),color:H_SUPP_COLORS[hSupps.length%H_SUPP_COLORS.length]});ss(HK.supps,hSupps);hRenderSuppList();hRenderTodayTab();hCloseMo('h-supp-modal');['h-sm-name','h-sm-dose','h-sm-reason','h-sm-notes'].forEach(id=>document.getElementById(id).value='')};
window.hSaveDoc=()=>{const n=document.getElementById('h-dm-name').value.trim();if(!n)return;hDocs.push({id:Date.now(),name:n,spec:document.getElementById('h-dm-spec').value.trim(),practice:document.getElementById('h-dm-practice').value.trim(),phone:document.getElementById('h-dm-phone').value.trim(),conds:document.getElementById('h-dm-conds').value.trim(),notes:document.getElementById('h-dm-notes').value.trim()});ss(HK.docs,hDocs);hRenderDocs();hCloseMo('h-doc-modal');['h-dm-name','h-dm-spec','h-dm-practice','h-dm-phone','h-dm-conds','h-dm-notes'].forEach(id=>document.getElementById(id).value='')};
window.hSaveAppt=()=>{const doc=document.getElementById('h-am-doc').value.trim(),date=document.getElementById('h-am-date').value;if(!doc||!date)return;const time=document.getElementById('h-am-time').value;const loc=document.getElementById('h-am-loc').value.trim();const notes=document.getElementById('h-am-notes').value.trim();hAppts.push({doc,date,time,loc,notes,ts:Date.now()});ss(HK.appts,hAppts);hRenderAppts();hCloseMo('h-appt-modal');
// Also add to calendar
const calEvents=ls('wg_fc_events',[]);calEvents.push({id:Date.now(),name:'Dr. '+doc,date:date,time:time||'',cat:'health',color:'#2980b9',notes:(loc?loc+' — ':'')+notes,recur:'none'});ss('wg_fc_events',calEvents);
['h-am-doc','h-am-date','h-am-time','h-am-loc','h-am-notes'].forEach(id=>document.getElementById(id).value='')};
window.hSavePNotes=()=>{ss(HK.pnotes,document.getElementById('h-presc-notes').value);const btn=event.target;btn.textContent='Saved! ✓';setTimeout(()=>btn.textContent='Save notes',2000)};
document.getElementById('h-presc-notes').value=ls(HK.pnotes,'');
// Add blue button style
const hBtnStyle=document.createElement('style');hBtnStyle.textContent='.btn-blue2{background:var(--blue);color:white;border:none;border-radius:8px;padding:6px 13px;font-size:11px;font-family:"DM Sans",sans-serif;cursor:pointer;font-weight:500;transition:all .15s}.btn-blue2:hover{background:#1a4a6b}';document.head.appendChild(hBtnStyle);
// Init health page
try{hRenderTodayTab();hRenderIntensityGrid();hRenderActivityImpact();hRenderNutrTrackers();hRenderNutrTips();hRenderFoodLog();hRenderSuggestedSupps();hRenderSymFullGrid();hRenderQuickChips();hPopulateSESelect();hRenderSEList()}catch(e){console.log('Health init:',e)}
// Health init
hRenderTodayTab();hRenderIntensityGrid();hRenderActivityImpact();hRenderNutrTrackers();hRenderNutrTips();hRenderFoodLog();hRenderSuggestedSupps();hRenderSymFullGrid();hRenderQuickChips();hPopulateSESelect();hRenderSEList();

// ====== PERIOD TRACKER JS ======
let _ptInited=false;
function ptInit(){
  if(_ptInited)return; _ptInited=true;
  loadSettingsForm();
  const ad=document.getElementById('add-date');if(ad)ad.value=TODAY;
  const pd=document.getElementById('ps-date');if(pd)pd.value=TODAY;
  const od=document.getElementById('onset-date');if(od)od.value=TODAY;
  renderAll();renderLogForm();renderRecentLogs();renderPeriodList();
}
// ====== STORAGE ======
const ptK={p:'wgc_periods',s:'wgc_settings',o:'wgc_onsets',j:'wgc_journal',l:'wgc_logs'};
const TODAY=new Date().toISOString().split('T')[0];
const fmtD=k=>{if(!k)return'';const p=k.split('-');return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})};
const fmtS=k=>{if(!k)return'';const p=k.split('-');return new Date(+p[0],+p[1]-1,+p[2]).toLocaleDateString('en-US',{month:'short',day:'numeric'})};
const ptNowS=()=>new Date().toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
function addDays(d,n){const p=d.split('-');const dt=new Date(+p[0],+p[1]-1,+p[2]);dt.setDate(dt.getDate()+n);return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0')}
function daysBetween(a,b){const parse=s=>{const p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2])};return Math.round((parse(b)-parse(a))/86400000)}

// ====== STATE ======
let periods=ls(ptK.p,[{date:'2026-03-01',flow:'medium',periodLen:5,notes:''}]);
let settings=ls(ptK.s,{cycleLen:32,periodLen:5,pmddDays:10,lastPeriod:'2026-03-01'});
let onsets=ls(ptK.o,[]);
let journal=ls(ptK.j,[]);
let ptLogs=ls(ptK.l,[]);

function sortPeriods(){periods.sort((a,b)=>b.date.localeCompare(a.date))}
sortPeriods();

// ====== CYCLE MATH ======
function calcAvgCL(){
  const lens=[];for(let i=0;i<periods.length-1;i++){const l=daysBetween(periods[i+1].date,periods[i].date);if(l>=15&&l<=120)lens.push(l)}
  return lens.length?lens.reduce((a,b)=>a+b,0)/lens.length:null;
}
function calcCLs(){
  const r=[];for(let i=0;i<periods.length-1;i++){const l=daysBetween(periods[i+1].date,periods[i].date);if(l>=15&&l<=120)r.push({date:periods[i].date,len:l})}return r;
}
function avgPL(){const v=periods.filter(p=>p.periodLen&&p.periodLen>0);return v.length?Math.round(v.reduce((a,b)=>a+b.periodLen,0)/v.length):settings.periodLen||5}
function getCycleLen(){return calcAvgCL()?Math.round(calcAvgCL()):settings.cycleLen}
function getCycleDay(dateStr){const last=settings.lastPeriod;if(!last)return null;const d=daysBetween(last,dateStr);return Math.max(1,d+1)}
function getPhase(cd){
  const cl=getCycleLen(),pl=avgPL(),pmdd=settings.pmddDays,ov=Math.round(cl/2);
  if(cd<=pl)return'men';if(cd<=ov-2)return'fol';if(cd<=ov+2)return'ov';if(cd<=cl-pmdd)return'lut';return'pmdd';
}
function getPhaseForDate(d){const cd=getCycleDay(d);if(!cd||cd<1)return'fol';return getPhase(cd)}
const PNAME={men:'Menstrual',fol:'Follicular',ov:'Ovulation',lut:'Luteal',pmdd:'Late Luteal / PMDD'};
const PEMOJI={men:'🩸',fol:'🌱',ov:'🌸',lut:'🌕',pmdd:'💙'};
const PCOL={men:'var(--men)',fol:'var(--fol)',ov:'var(--ov)',lut:'var(--lut)',pmdd:'var(--pmdd)'};
const PBG={men:'var(--menl)',fol:'var(--foll)',ov:'var(--ovl)',lut:'var(--lutl)',pmdd:'var(--pmddl)'};

// ====== TABS ======
window.ptGoTab=t=>{
  document.querySelectorAll('.pt-tc').forEach(e=>e.classList.remove('active'));
  document.querySelectorAll('.pt-tb').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+t).classList.add('active');
  document.querySelector(`.pt-tb[onclick="ptGoTab('${t}')"]`).classList.add('active');
  if(t==='overview')renderAll();
  if(t==='log')renderLogForm();
  if(t==='history'){renderPeriodList();loadSettingsForm()}
  if(t==='phases')renderPhaseCards();
  if(t==='nutrition')renderNutrPhases();
  if(t==='supplements')renderSuppPhases();
  if(t==='pmdd'){renderPMDD();renderOnsetLog();renderPMDDPatterns();renderJournal()}
  if(t==='trends')ptRenderTrends();
};

// ====== MODALS ======
window.ptOpenMo=id=>document.getElementById(id).classList.add('open');
window.ptCloseMo=id=>document.getElementById(id).classList.remove('open');
document.querySelectorAll('#htab-cycle .mo').forEach(mo=>mo.onclick=e=>{if(e.target===mo)mo.classList.remove('open')});

// ====== PERIOD HISTORY ======
window.addPeriod=()=>{
  const date=document.getElementById('add-date').value;if(!date)return;
  if(periods.find(p=>p.date===date)){flash('add-saved','Already have this date!','var(--ch)');return}
  periods.push({date,flow:document.getElementById('add-flow').value||'',periodLen:parseInt(document.getElementById('add-plen').value)||null,notes:document.getElementById('add-notes').value.trim()});
  sortPeriods();if(!settings.lastPeriod||date>settings.lastPeriod){settings.lastPeriod=date;ss(ptK.s,settings)}
  ss(ptK.p,periods);['add-date','add-notes'].forEach(id=>document.getElementById(id).value='');document.getElementById('add-flow').value='';document.getElementById('add-plen').value='';
  renderPeriodList();flash('add-saved','Added! 🌸','var(--green)');
};

window.logPeriodStart=()=>{
  const date=document.getElementById('ps-date').value;if(!date)return;
  const entry={date,flow:document.getElementById('ps-flow').value,periodLen:parseInt(document.getElementById('ps-plen').value)||null,notes:document.getElementById('ps-notes').value.trim()};
  const existing=periods.findIndex(p=>p.date===date);
  if(existing>=0)periods[existing]=entry;else periods.push(entry);
  sortPeriods();settings.lastPeriod=date;ss(ptK.s,settings);ss(ptK.p,periods);
  ptCloseMo('period-start-modal');renderAll();renderPeriodList();
};

function parseDate(str){
  str=str.trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(str))return str;
  const mdy=str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if(mdy)return mdy[3]+'-'+mdy[1].padStart(2,'0')+'-'+mdy[2].padStart(2,'0');
  const mns={january:'01',february:'02',march:'03',april:'04',may:'05',june:'06',july:'07',august:'08',september:'09',october:'10',november:'11',december:'12',jan:'01',feb:'02',mar:'03',apr:'04',jun:'06',jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12'};
  const mn=str.match(/^([a-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i);if(mn){const m=mns[mn[1].toLowerCase()];if(m)return mn[3]+'-'+m+'-'+mn[2].padStart(2,'0')}
  const dm=str.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i);if(dm){const m=mns[dm[2].toLowerCase()];if(m)return dm[3]+'-'+m+'-'+dm[1].padStart(2,'0')}
  return null;
}
window.bulkImport=()=>{
  const lines=document.getElementById('bulk-inp').value.trim().split('\n').map(l=>l.trim()).filter(l=>l);
  let added=0,skip=0;
  lines.forEach(line=>{const d=parseDate(line);if(!d)return;if(periods.find(p=>p.date===d)){skip++;return}periods.push({date:d,flow:'',periodLen:null,notes:'Bulk import'});added++});
  sortPeriods();if(periods.length){settings.lastPeriod=periods[0].date;ss(ptK.s,settings)}
  ss(ptK.p,periods);document.getElementById('bulk-inp').value='';renderPeriodList();
  flash('bulk-saved',`Added ${added}${skip?' ('+skip+' skipped)':''}! 🌸`,'var(--green)');
};

let editIdx=null;
function renderPeriodList(){
  const c=document.getElementById('period-list');if(!c)return;
  const cnt=document.getElementById('period-count');if(cnt)cnt.textContent=periods.length;
  c.innerHTML='';
  if(!periods.length){c.innerHTML='<div class="empty-s">No periods yet — add them above or use bulk import</div>';return}
  const FC={spotting:'#ffb3c1',light:'#ff6b9d',medium:'#e91e8c',heavy:'#c0392b',very_heavy:'#7b241c'};
  periods.forEach((p,i)=>{
    const nxt=periods[i+1];const cl=nxt?daysBetween(nxt.date,p.date):null;
    const e=document.createElement('div');e.className='period-row';
    e.innerHTML=`<div style="width:10px;height:10px;border-radius:50%;background:${FC[p.flow]||'#e0e0e0'};flex-shrink:0"></div>
      <div style="flex:1"><div style="font-weight:600">${fmtD(p.date)}</div>
      <div style="font-size:9px;color:var(--tmut);margin-top:1px">${p.flow?p.flow.replace('_',' ')+' flow':'flow not logged'}${p.periodLen?' · '+p.periodLen+'d':''}${cl?' · cycle: '+cl+'d':''}</div>
      ${p.notes?`<div style="font-size:9px;color:var(--tmut);font-style:italic">${p.notes}</div>`:''}</div>
      <button class="bsm" onclick="openEdit(${i})" style="font-size:9px">Edit</button>
      <button class="bdel" onclick="delPeriod(${i})">×</button>`;
    c.appendChild(e);
  });
}
window.delPeriod=i=>{if(confirm('Remove?')){periods.splice(i,1);sortPeriods();ss(ptK.p,periods);renderPeriodList()}};
window.openEdit=i=>{editIdx=i;const p=periods[i];document.getElementById('em-date').value=p.date;document.getElementById('em-flow').value=p.flow||'';document.getElementById('em-plen').value=p.periodLen||'';document.getElementById('em-notes').value=p.notes||'';ptOpenMo('edit-modal')};
window.saveEdit=()=>{if(editIdx===null)return;periods[editIdx]={...periods[editIdx],date:document.getElementById('em-date').value,flow:document.getElementById('em-flow').value,periodLen:parseInt(document.getElementById('em-plen').value)||null,notes:document.getElementById('em-notes').value.trim()};sortPeriods();ss(ptK.p,periods);renderPeriodList();ptCloseMo('edit-modal')};

// ====== SETTINGS ======
function loadSettingsForm(){
  ['s-cl','s-pl','s-pmdd'].forEach((id,i)=>{const el=document.getElementById(id);if(el)el.value=[settings.cycleLen,settings.periodLen,settings.pmddDays][i]||''});
  ['sm-cl','sm-pl','sm-pmdd','sm-last'].forEach((id,i)=>{const el=document.getElementById(id);if(el)el.value=[settings.cycleLen,settings.periodLen,settings.pmddDays,settings.lastPeriod][i]||''});
}
window.saveSettings=()=>{settings={...settings,cycleLen:parseInt(document.getElementById('s-cl').value)||settings.cycleLen,periodLen:parseInt(document.getElementById('s-pl').value)||settings.periodLen,pmddDays:parseInt(document.getElementById('s-pmdd').value)||settings.pmddDays};ss(ptK.s,settings);flash('settings-saved','Saved! ✓','var(--green)')};
window.saveSettingsModal=()=>{settings={cycleLen:parseInt(document.getElementById('sm-cl').value)||settings.cycleLen,periodLen:parseInt(document.getElementById('sm-pl').value)||settings.periodLen,pmddDays:parseInt(document.getElementById('sm-pmdd').value)||settings.pmddDays,lastPeriod:document.getElementById('sm-last').value||settings.lastPeriod};ss(ptK.s,settings);loadSettingsForm();ptCloseMo('settings-modal');renderAll()};
window.autoCalc=()=>{const avg=calcAvgCL();if(!avg){flash('settings-saved','Need 2+ periods','var(--ch)');return}settings.cycleLen=Math.round(avg);ss(ptK.s,settings);loadSettingsForm();flash('settings-saved',`Set to ${settings.cycleLen}d from ${periods.length} cycles ✓`,'var(--green)')};

// ====== OVERVIEW RENDER ======
function renderAll(){
  const cd=getCycleDay(TODAY);const phase=cd?getPhase(cd):'fol';const cl=getCycleLen();
  const nextPeriod=settings.lastPeriod?addDays(settings.lastPeriod,cl):null;
  const daysToNext=nextPeriod?daysBetween(TODAY,nextPeriod):null;
  const pmddStart=nextPeriod?addDays(nextPeriod,-settings.pmddDays):null;
  const daysToPMDD=pmddStart?daysBetween(TODAY,pmddStart):null;

  // Phase banner
  const pb=document.getElementById('phase-banner');if(pb&&settings.lastPeriod){pb.innerHTML=`<div style="background:${PBG[phase]};border:2px solid ${PCOL[phase]}33;border-radius:14px;padding:1rem 1.2rem;margin-bottom:.9rem;display:flex;gap:14px;align-items:center"><div style="font-size:42px;flex-shrink:0">${PEMOJI[phase]}</div><div style="flex:1"><div style="font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:${PCOL[phase]}">${PNAME[phase]}</div><div style="font-size:11px;color:var(--tmut);margin-top:3px">Cycle day ${cd||'?'} of ${cl} · ${PHASE_DATA[phase]?.energy||''}</div><div style="font-size:10px;color:var(--tmut);margin-top:3px;font-style:italic;line-height:1.5">${PHASE_DATA[phase]?.desc||''}</div></div><div style="text-align:right;flex-shrink:0"><div style="font-size:10px;color:${PCOL[phase]};font-weight:600">Day ${cd||'?'}</div><div style="font-size:9px;color:var(--tmut)">of ${cl}</div></div></div>`}else if(pb){pb.innerHTML=`<div style="background:var(--pinkl);border:1px solid rgba(233,30,140,.2);border-radius:12px;padding:.8rem 1rem;margin-bottom:.9rem;text-align:center;font-size:11px;color:var(--pinkd)">🌸 <strong>Add your last period date to activate predictions</strong> — tap "🩸 Log period" or go to Period History</div>`}

  // PMDD alert
  const pa=document.getElementById('pmdd-alert-banner');
  if(pa){if(phase==='pmdd'&&settings.lastPeriod){pa.style.display='block';pa.innerHTML=`<div style="font-size:13px;margin-bottom:4px">💙 <strong>You're in your PMDD window right now</strong></div><div style="font-size:11px;color:var(--tmut);line-height:1.6">Your period is estimated in ~${daysToNext} day${daysToNext!==1?'s':''}. These feelings are symptoms, not facts about who you are. <button class="bsm b" onclick="ptGoTab('pmdd')" style="margin-left:6px">Log how you're feeling →</button></div>`}else pa.style.display='none'}

  // Stats
  const ss2=document.getElementById('overview-stats');if(ss2){ss2.innerHTML=`<div class="sm"><div class="sm-l">Cycle day</div><div class="sm-v" style="color:${PCOL[phase]}">${cd||'—'}</div><div class="sm-s">${settings.lastPeriod?PNAME[phase]:'set last period'}</div></div><div class="sm"><div class="sm-l">Avg cycle</div><div class="sm-v">${calcAvgCL()?Math.round(calcAvgCL())+'d':settings.cycleLen+'d'}</div><div class="sm-s">${calcAvgCL()?`from ${periods.length} cycles`:'default setting'}</div></div><div class="sm"><div class="sm-l">Next period</div><div class="sm-v" style="font-size:13px;color:var(--men)">${nextPeriod?fmtS(nextPeriod):'—'}</div><div class="sm-s">${daysToNext!==null?daysToNext>0?'in '+daysToNext+'d':daysToNext===0?'today!':'overdue?':''}</div></div>`}

  // Countdown card
  const cde=document.getElementById('cd-emoji');const cdp=document.getElementById('cd-phase');const cdd=document.getElementById('cd-day');const cdn=document.getElementById('cd-number');const cdl=document.getElementById('cd-label');
  if(cde)cde.textContent=PEMOJI[phase];if(cdp)cdp.textContent=PNAME[phase];if(cdd)cdd.textContent=`Cycle day ${cd||'?'} of ${cl}`;
  if(cdn&&cdl&&daysToNext!==null){if(phase==='pmdd'){cdn.textContent=daysToNext;cdn.style.color='var(--pmdd)';cdl.textContent=`day${daysToNext!==1?'s':''} until period`}else{cdn.textContent=daysToNext;cdn.style.color=PCOL[phase];cdl.textContent=`day${daysToNext!==1?'s':''} until next period`}}else if(cdn){cdn.textContent='—';cdl&&(cdl.textContent='add period history')}

  // PMDD mini countdown
  const pmc=document.getElementById('pmdd-countdown-mini');if(pmc&&pmddStart){
    // personal onset from history
    const withCD=onsets.filter(o=>o.cycleDay);const avgOnset=withCD.length?Math.round(withCD.reduce((a,b)=>a+b.cycleDay,0)/withCD.length):null;
    const personalDate=avgOnset&&settings.lastPeriod?addDays(settings.lastPeriod,avgOnset-1):null;
    const daysToPersonal=personalDate?daysBetween(TODAY,personalDate):null;
    pmc.innerHTML=`<div style="margin-bottom:.5rem"><div style="font-size:9px;font-weight:600;color:var(--pmdd);margin-bottom:2px">📅 Predicted window</div><div style="font-size:13px;font-weight:700;font-family:'Playfair Display',serif;color:var(--pmdd)">${fmtS(pmddStart)}</div><div style="font-size:9px;color:var(--tmut)">${daysToPMDD>0?'in '+daysToPMDD+'d':daysToPMDD===0?'starting today':'you\'re in it now'}</div></div>${personalDate?`<div><div style="font-size:9px;font-weight:600;color:var(--purple);margin-bottom:2px">🧠 YOUR personal onset (from ptLogs)</div><div style="font-size:13px;font-weight:700;font-family:'Playfair Display',serif;color:var(--purple)">${fmtS(personalDate)}</div><div style="font-size:9px;color:var(--tmut)">${daysToPersonal>0?'in '+daysToPersonal+'d':daysToPersonal===0?'today':'you\'re in it'} · day ${avgOnset} avg</div></div>`:`<div style="font-size:9px;color:var(--tmut);font-style:italic">Log PMDD onsets to build your personal prediction</div>`}`;
  }else if(pmc)pmc.innerHTML='<div style="font-size:10px;color:var(--tmut);font-style:italic">Add period history to activate</div>';

  renderCalendar();renderTodayAdjustments(phase);renderUpcoming(cd||1,cl);renderNextPredictions(nextPeriod,pmddStart,daysToNext,daysToPMDD);
  // Update PMDD day label
  const pdl=document.getElementById('pmdd-day-label');if(pdl)pdl.textContent=`day ${cl-settings.pmddDays}`;
}

// ====== CALENDAR ======
let ptCalYear=new Date().getFullYear(),ptCalMonth=new Date().getMonth();
window.ptCalPrev=()=>{ptCalMonth--;if(ptCalMonth<0){ptCalMonth=11;ptCalYear--}renderCalendar()};
window.ptCalNext=()=>{ptCalMonth++;if(ptCalMonth>11){ptCalMonth=0;ptCalYear++}renderCalendar()};

function renderCalendar(){
  const lb=document.getElementById('cal-labels'),g=document.getElementById('pt-cal-grid');if(!lb||!g)return;
  const _n=new Date(),_cy=ptCalYear||_n.getFullYear(),_cm=ptCalMonth!==undefined?ptCalMonth:_n.getMonth();
  const _daysInMonth=new Date(_cy,_cm+1,0).getDate();
  const _monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const titleEl=document.getElementById('pt-cal-title');if(titleEl)titleEl.textContent='Cycle calendar — '+_monthNames[_cm]+' '+_cy;
  lb.innerHTML='';['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d=>{const e=document.createElement('div');e.className='pcal-hdr';e.textContent=d;lb.appendChild(e)});
  g.innerHTML='';const fd=new Date(_cy,_cm,1).getDay();
  for(let i=0;i<fd;i++){const e=document.createElement('div');e.className='pd empty';g.appendChild(e)}
  for(let d=1;d<=_daysInMonth;d++){
    const ds=_cy+'-'+String(_cm+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');const e=document.createElement('div');e.className='pd';e.textContent=d;
    const cd=getCycleDay(ds);if(cd&&cd>0){const ph=getPhase(cd);e.classList.add(ph)}
    // override with actual period
    const isPeriod=periods.find(p=>{const diff=daysBetween(p.date,ds);return diff>=0&&diff<(p.periodLen||avgPL())});
    if(isPeriod){e.className='pd men';if(d>16)e.classList.add('predicted')}
    else if(d>16)e.classList.add('predicted');
    if(_cy===_n.getFullYear()&&_cm===_n.getMonth()&&d===_n.getDate())e.classList.add('today');
    if(ptLogs.find(l=>l.date===ds))e.classList.add('logged-sym');
    g.appendChild(e);
  }
}

function renderTodayAdjustments(phase){
  const c=document.getElementById('today-adjustments');if(!c)return;
  const n=NUTR_DATA[phase];if(!n){c.innerHTML='<div class="empty-s" style="padding:.5rem">Add your last period date to see adjustments</div>';return}
  c.innerHTML=`<div style="margin-bottom:.4rem;font-size:10px;font-weight:600;color:${n.color}">For your ${PNAME[phase]} phase:</div>${n.adjustments.map(a=>`<div style="display:flex;gap:7px;padding:4px 0;border-bottom:1px solid var(--cbr);font-size:11px;align-items:flex-start"><div style="width:5px;height:5px;border-radius:50%;background:${n.color};flex-shrink:0;margin-top:5px"></div><span>${a}</span></div>`).join('')}<div style="background:var(--menl);border-radius:8px;padding:.4rem .7rem;margin-top:.5rem;font-size:10px;color:var(--men)"><strong>🩸 T1D:</strong> ${n.t1d}</div>`;
}

function renderUpcoming(cd,cl){
  const c=document.getElementById('upcoming-phases');if(!c)return;c.innerHTML='';
  const windows=[];let d=cd;for(let i=0;i<cl*2;i++){const p=getPhase(d%cl||cl);if(!windows.length||windows[windows.length-1].phase!==p){windows.push({phase:p,startDay:d})}d++;if(windows.length>=6)break}
  windows.slice(1,5).forEach(w=>{const away=w.startDay-cd;const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:8px;padding:6px 8px;background:white;border:1px solid var(--cbr);border-radius:8px;margin-bottom:4px;font-size:11px';e.innerHTML=`<div style="width:28px;height:28px;border-radius:7px;background:${PBG[w.phase]};display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">${PEMOJI[w.phase]}</div><div style="flex:1"><div style="font-weight:600">${PNAME[w.phase]}</div><div style="font-size:9px;color:var(--tmut)">day ${w.startDay}</div></div><span style="font-size:10px;font-weight:600;color:${PCOL[w.phase]}">in ${away}d</span>`;c.appendChild(e)});
}

function renderNextPredictions(np,ps,dtn,dtp){
  const c=document.getElementById('next-predictions');if(!c)return;
  if(!np){c.innerHTML='<div class="empty-s">Add period history to see predictions</div>';return}
  const avg=calcAvgCL();
  c.innerHTML=`<div style="display:flex;flex-direction:column;gap:.5rem">
    <div style="background:var(--menl);border-radius:9px;padding:.6rem .8rem"><div style="font-size:9px;font-weight:600;color:var(--men);margin-bottom:2px">🩸 Next period</div><div style="font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--men)">${fmtS(np)}</div><div style="font-size:9px;color:var(--tmut)">${dtn>0?'in '+dtn+'d':dtn===0?'today':'may be starting'} · ${avg?Math.round(avg)+'d avg cycle':'from settings'}</div></div>
    ${ps?`<div style="background:var(--pmddl);border-radius:9px;padding:.6rem .8rem"><div style="font-size:9px;font-weight:600;color:var(--pmdd);margin-bottom:2px">💙 PMDD window starts</div><div style="font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--pmdd)">${fmtS(ps)}</div><div style="font-size:9px;color:var(--tmut)">${dtp>0?'in '+dtp+'d':dtp===0?'today':'in progress'}</div></div>`:''}
    ${avg?`<div style="font-size:9px;color:var(--tmut);font-style:italic;padding:.3rem">Based on your ${Math.round(avg)}d average from ${periods.length} tracked cycles</div>`:''}
    </div>`;
}

// ====== DAILY LOG ======
const MOODS=[{e:'🌑',l:'Dark/Depressed'},{e:'😔',l:'Low/Sad'},{e:'😶',l:'Numb'},{e:'😐',l:'Okay'},{e:'🙂',l:'Alright'},{e:'😊',l:'Good'},{e:'✨',l:'Great'},{e:'😤',l:'Irritable'},{e:'😡',l:'Rage'},{e:'😰',l:'Anxious'}];
const ENERGY_LABELS=['Crash 💀','Very low 🔋','Low-ish 😩','Okay ⚡','Good 🔥'];
const CYCLE_SYMS=['Cramps','Heavy flow','Spotting','Bloating','Breast tenderness','Headache','Lower back pain','Nausea','Fatigue','Brain fog','Mood swings','Anxiety','Depression','Rage','Hopelessness','Insomnia','Food cravings','Acne','High energy','Pelvic pain','Ovulation pain'];
const SD_OPTS=['None','Low','Medium','High','Very high 🔥'];
const CM_OPTS=['None/Dry','Sticky','Creamy','Watery','Egg-white'];
let selFlow=null,selMood=null,selEnergy=3,selSyms=new Set(),selSD=null,selCM=null;

function renderLogForm(){
  const phase=getPhase(getCycleDay(TODAY)||1);
  const lb=document.getElementById('log-phase-badge');if(lb){lb.textContent=PEMOJI[phase]+' '+PNAME[phase];lb.style.background=PBG[phase];lb.style.color=PCOL[phase]}
  // flow
  const fb=document.getElementById('flow-btns');if(fb){fb.innerHTML='';[{v:null,l:'None',c:'#e0e0e0'},{v:'spotting',l:'Spotting',c:'#ffb3c1'},{v:'light',l:'Light',c:'#ff6b9d'},{v:'medium',l:'Medium',c:'#e91e8c'},{v:'heavy',l:'Heavy',c:'#c0392b'},{v:'very_heavy',l:'Very heavy',c:'#7b241c'}].forEach(f=>{const e=document.createElement('div');e.style.cssText=`display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:5px 8px;border-radius:8px;border:2px solid;transition:all .15s;border-color:${selFlow===f.v?f.c:'var(--cbr)'};background:${selFlow===f.v?f.c+'22':'white'}`;e.innerHTML=`<div style="width:20px;height:20px;border-radius:50%;background:${f.c}"></div><span style="font-size:9px;color:var(--tmut)">${f.l}</span>`;e.onclick=()=>{selFlow=f.v;renderLogForm()};fb.appendChild(e)})}
  // mood
  const mb=document.getElementById('mood-btns');if(mb){mb.innerHTML='';MOODS.forEach(m=>{const e=document.createElement('div');e.className='mood-opt'+(selMood===m.l?' sel':'');e.innerHTML=`<div style="font-size:16px">${m.e}</div><div style="font-size:9px;color:var(--tmut)">${m.l}</div>`;e.onclick=()=>{selMood=m.l;renderLogForm()};mb.appendChild(e)})}
  // energy
  const es=document.getElementById('energy-sl'),el=document.getElementById('energy-lbl');if(es){es.value=selEnergy;es.oninput=function(){selEnergy=parseInt(this.value);if(el)el.textContent=ENERGY_LABELS[selEnergy-1]}}if(el)el.textContent=ENERGY_LABELS[selEnergy-1];
  // syms
  const sc=document.getElementById('sym-chips');if(sc){sc.innerHTML='';CYCLE_SYMS.forEach(s=>{const sel=selSyms.has(s);const e=document.createElement('span');e.className='schip';e.style.cssText=`background:${sel?PCOL[phase]+'22':'white'};color:${PCOL[phase]};border-color:${PCOL[phase]}44`;e.textContent=s;e.onclick=()=>{if(selSyms.has(s))selSyms.delete(s);else selSyms.add(s);renderLogForm()};sc.appendChild(e)})}
  // sex drive
  const sd=document.getElementById('sd-btns');if(sd){sd.innerHTML='';SD_OPTS.forEach(s=>{const e=document.createElement('span');e.className='schip';e.style.cssText=`background:${selSD===s?'var(--pink)22':'white'};color:var(--pink);border-color:rgba(233,30,140,.3)`;e.textContent=s;e.onclick=()=>{selSD=s;renderLogForm()};sd.appendChild(e)})}
  // cm
  const cm=document.getElementById('cm-btns');if(cm){cm.innerHTML='';CM_OPTS.forEach(c=>{const e=document.createElement('span');e.className='schip';e.style.cssText=`background:${selCM===c?'var(--blue)22':'white'};color:var(--blue);border-color:rgba(41,128,185,.3)`;e.textContent=c;e.onclick=()=>{selCM=c;renderLogForm()};cm.appendChild(e)})}
}

window.saveLog=()=>{
  const entry={date:TODAY,flow:selFlow,mood:selMood,energy:selEnergy,symptoms:[...selSyms],sexDrive:selSD,cm:selCM,notes:document.getElementById('log-notes').value.trim(),phase:getPhase(getCycleDay(TODAY)||1),ts:Date.now()};
  const idx=ptLogs.findIndex(l=>l.date===TODAY);if(idx>=0)ptLogs[idx]=entry;else ptLogs.unshift(entry);
  ss(ptK.l,ptLogs);selFlow=null;selMood=null;selEnergy=3;selSyms.clear();selSD=null;selCM=null;
  document.getElementById('log-notes').value='';renderLogForm();renderRecentLogs();
  flash('log-saved','Logged! 🌸','var(--green)');
};

function renderRecentLogs(){
  const c=document.getElementById('recent-ptLogs');if(!c)return;c.innerHTML='';
  if(!ptLogs.length){c.innerHTML='<div class="empty-s">No ptLogs yet</div>';return}
  ptLogs.slice(0,14).forEach(l=>{
    const pc=PCOL[l.phase||'fol'],pb=PBG[l.phase||'fol'],pe=PEMOJI[l.phase||'fol'];
    const e=document.createElement('div');e.className='log-entry';
    e.innerHTML=`<div style="min-width:64px;flex-shrink:0"><div style="font-size:9px;color:var(--tmut)">${fmtS(l.date)}</div><div style="margin-top:3px;font-size:9px;background:${pb};color:${pc};border-radius:5px;padding:2px 5px;text-align:center">${pe} ${PNAME[l.phase||'fol']}</div></div><div style="flex:1"><div style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:2px">${l.flow?`<span class="tag" style="background:var(--menl);color:var(--men)">🩸 ${l.flow}</span>`:''}${l.mood?`<span class="tag" style="background:var(--pinkl);color:var(--pink)">${l.mood}</span>`:''}${l.energy?`<span class="tag" style="background:#f5f5f5;color:var(--tmut)">${ENERGY_LABELS[l.energy-1]}</span>`:''}</div><div style="display:flex;flex-wrap:wrap;gap:2px">${(l.symptoms||[]).slice(0,3).map(s=>`<span class="tag" style="background:var(--pinkl);color:var(--pink)">${s}</span>`).join('')}${(l.symptoms||[]).length>3?`<span class="tag">+${l.symptoms.length-3}</span>`:''}</div>${l.notes?`<div style="font-size:9px;color:var(--tmut);margin-top:2px;font-style:italic">${l.notes.slice(0,80)}</div>`:''}</div>`;
    c.appendChild(e);
  });
}

// ====== PHASE CONTENT DATA ======
const PHASE_DATA={
  men:{energy:'Low — honor it. This is your body\'s winter.',desc:'Your uterine lining is shedding. Estrogen and progesterone are at their lowest. Rest is productive right now.',moods:'Introverted, reflective, possibly weepy or tender. That\'s okay.',strengths:['Deep reflection','Intuitive thinking','Saying no to things','Rest without guilt'],symptoms:['Cramps','Heavy flow','Bloating','Fatigue','Lower back pain','Headache','Nausea'],care:['Heating pad on abdomen and lower back','Hot baths with Epsom salt (magnesium absorbs through skin)','Dark chocolate (reduces prostaglandins)','Light walking only','Sleep in if you can','Castor oil pack on abdomen for cramps']},
  fol:{energy:'Rising and building — one of your best windows.',desc:'Estrogen is rising as follicles develop. Energy naturally climbs. This is your body\'s spring.',moods:'Optimistic, motivated, creative, social. Make use of this!',strengths:['Starting new projects','Hard conversations','Workouts','Creative work','Planning'],symptoms:['Increased energy','Higher motivation','Clearer thinking','More sociable'],care:['Great time to push yourself physically','Batch cook or prep for later in your cycle','Schedule hard tasks here','Social time feels good now']},
  ov:{energy:'Peak energy and confidence — this is your summer.',desc:'LH surges, triggering egg release. Estrogen peaks. Testosterone briefly spikes.',moods:'Magnetic, confident, outgoing, sometimes intense.',strengths:['High-stakes conversations','Presentations','Physical challenges','Connection'],symptoms:['Increased sex drive','Mild one-sided pain','Clearer skin','More talkative'],care:['Use your natural confidence for hard things','High-intensity workouts feel amazing now','Social plans go well here']},
  lut:{energy:'Moderate, declining. Detail work feels natural. Social energy drops.',desc:'Progesterone rises. Estrogen drops. Your body preparing. This is your autumn.',moods:'More introverted, task-focused, slightly less patient. Normal.',strengths:['Detail work','Editing and finishing things','Administrative tasks','Boundaries'],symptoms:['Mild bloating','Breast tenderness','Sleep changes','Food cravings','Irritability'],care:['Wind down workout intensity','Prep easier meals in advance','Start PMDD supplement protocol now','Reduce sugar and alcohol — they make PMDD worse']},
  pmdd:{energy:'Very low — sometimes crash-level. More sleep than usual.',desc:'Progesterone and estrogen drop sharply. Your brain\'s serotonin and GABA systems react intensely. You\'re not being dramatic — this is neurological.',moods:'Severe: depression, anxiety, rage, hopelessness, brain fog, dissociation. These are symptoms, not personality.',strengths:['Solitude','Rest','Gentle creativity','Very close relationships only'],symptoms:['Depression','Severe anxiety','Rage','Hopelessness','Brain fog','Social withdrawal','Fatigue','Insomnia','Tender to touch'],care:['Tell your partner what phase you\'re in','Cancel non-essential plans','Heating pad, comfort food, cozy spaces','Light movement only','No hard decisions or conversations if you can help it','This phase ends. You will feel like yourself again.']}
};

function renderPhaseCards(){
  const c=document.getElementById('phase-cards');if(!c)return;c.innerHTML='';
  const curPhase=getPhase(getCycleDay(TODAY)||1);
  const daysRef={men:'Days 1–5',fol:'Days 6–13',ov:'Days 14–16',lut:'Days 17–20',pmdd:'Days 21–end'};
  Object.entries(PHASE_DATA).forEach(([key,p])=>{
    const isNow=key===curPhase;const card=document.createElement('div');card.className='card';
    const acc={men:' men-a',fol:' fol-a',ov:' ov-a',lut:' lut-a',pmdd:' pmdd-a'}[key]||'';card.className='card'+acc;
    if(isNow)card.style.cssText='border:2px solid '+PCOL[key]+';box-shadow:0 4px 16px '+PCOL[key]+'22;';
    card.innerHTML=`${isNow?`<div style="background:${PCOL[key]};color:white;font-size:10px;padding:3px 12px;border-radius:20px;font-weight:700;display:inline-block;margin-bottom:.6rem">← YOU ARE HERE</div>`:''}<div style="display:flex;gap:10px;align-items:center;margin-bottom:.8rem"><div style="font-size:32px">${PEMOJI[key]}</div><div><div style="font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:${PCOL[key]}">${PNAME[key]}</div><div style="font-size:10px;color:var(--tmut)">${daysRef[key]||''}</div></div></div>
    <div class="g2"><div>
      <div class="phase-section" style="background:${PBG[key]}"><div style="font-size:10px;font-weight:700;color:${PCOL[key]};margin-bottom:.3rem">⚡ Energy & mood</div><div style="color:var(--tmut);margin-bottom:.3rem">${p.energy}</div><div style="color:var(--tmut)">${p.moods}</div></div>
      <div class="phase-section" style="background:#f8f8f8"><div style="font-size:10px;font-weight:700;margin-bottom:.3rem">💪 Natural strengths</div>${p.strengths.map(s=>`<div class="phase-bullet"><div class="phase-bullet-dot" style="background:${PCOL[key]}"></div>${s}</div>`).join('')}</div>
    </div><div>
      <div class="phase-section" style="background:${PBG[key]}"><div style="font-size:10px;font-weight:700;color:${PCOL[key]};margin-bottom:.3rem">🩺 Common symptoms</div>${p.symptoms.map(s=>`<span class="tag" style="display:inline-block;margin:2px;background:${PBG[key]};color:${PCOL[key]};border:1px solid ${PCOL[key]}33">${s}</span>`).join('')}</div>
      <div class="phase-section" style="background:#f8f8f8"><div style="font-size:10px;font-weight:700;margin-bottom:.3rem">💆 Self-care</div>${p.care.map(s=>`<div class="phase-bullet"><div class="phase-bullet-dot" style="background:${PCOL[key]}"></div>${s}</div>`).join('')}</div>
    </div></div>`;
    c.appendChild(card);
  });
}

// ====== NUTRITION DATA ======
const NUTR_DATA={
  men:{color:'var(--men)',bg:'var(--menl)',adjustments:['+8–16 fl oz water (anti-bloating)','Maintain protein (95g+) for mood stability','Reduce salt — worsens water retention','Iron-rich foods: red meat, lentils, spinach (you\'re losing iron!)'],t1d:'Insulin resistance is higher during menstruation. Monitor more closely and adjust as needed.',eatMore:['🫀 Iron: red meat, lentils, spinach, dark chocolate','🫒 Omega-3s: salmon, walnuts (reduce prostaglandins/cramps)','🫐 Anti-inflammatory: berries, turmeric, ginger','🍵 Raspberry leaf tea (may ease cramping)'],eatLess:['🧂 Salt (worsens bloating)','☕ Caffeine (worsens cramps)','🍷 Alcohol (worsens cramps, disrupts sleep)','🍬 Sugar spikes']},
  fol:{color:'var(--fol)',bg:'var(--foll)',adjustments:['Back to baseline water (88 fl oz)','Higher protein if increasing activity (100–110g)','Add fermented foods for estrogen metabolism'],t1d:'Insulin sensitivity improves. You may need slightly less insulin — track carefully.',eatMore:['🥚 Eggs (choline supports estrogen metabolism)','🌱 Fermented foods: kimchi, kefir, yogurt','🥬 Phytoestrogens: flaxseeds, edamame','🍗 Lean protein to support follicle development'],eatLess:['Nothing specific — this is your most metabolically flexible phase']},
  ov:{color:'var(--ov)',bg:'var(--ovl)',adjustments:['+8 fl oz water (peak metabolism)','Higher protein if doing intense workouts (100–110g)','Anti-inflammatory focus'],t1d:'Testosterone spike around ovulation can briefly affect insulin sensitivity. Stay consistent.',eatMore:['🌿 Anti-inflammatory: turmeric, ginger, omega-3s','🫐 Berries, dark leafy greens','🌰 Zinc-rich: pumpkin seeds, beef (supports ovulation)'],eatLess:['Trans fats and heavily processed foods','Alcohol (disrupts LH surge)']},
  lut:{color:'var(--lut)',bg:'var(--lutl)',adjustments:['+8 fl oz water (progesterone raises body temp slightly)','Maintain protein at 95–100g to reduce cravings','Prioritize magnesium-rich foods now','Cut sugar NOW before PMDD hits'],t1d:'Progesterone increases insulin resistance. Blood sugars may run higher — monitor and adjust.',eatMore:['🍫 Dark chocolate (magnesium — reduces cravings)','🥜 Magnesium: pumpkin seeds, almonds, greens','🍠 Complex carbs: sweet potato, quinoa (support serotonin)','🐟 Fatty fish (anti-inflammatory, mood support)'],eatLess:['🍬 Sugar (dramatically worsens PMDD)','🍷 Alcohol (serotonin disruptor)','☕ Caffeine (worsens anxiety)']},
  pmdd:{color:'var(--pmdd)',bg:'var(--pmddl)',adjustments:['+16 fl oz water (set reminders — you may forget)','Protein 95–110g: non-negotiable for mood stability','Complex carbs over simple — feed serotonin','Caffeine reduction is huge here'],t1d:'Hardest blood sugar week. Cortisol from emotional dysregulation raises glucose. Be extremely gentle with yourself around any numbers.',eatMore:['🍫 Dark chocolate — genuinely therapeutic','🍠 Complex carbs: sweet potato, oats (serotonin pathway)','🐟 Salmon, sardines — EPA/DHA supports brain chemistry','🫐 Antioxidants: blueberries, raspberries','🍵 Chamomile tea (mild GABA support)'],eatLess:['🚨 Alcohol — absolutely avoid','🍬 Sugar — crashes hit 10× harder with T1D','☕ Caffeine — worsens everything','🧂 Salt — water retention makes everything worse']}
};

function renderNutrPhases(){
  const c=document.getElementById('nutr-phases');if(!c)return;c.innerHTML='';
  const cur=getPhase(getCycleDay(TODAY)||1);
  Object.entries(NUTR_DATA).forEach(([key,n])=>{
    const isNow=key===cur;const card=document.createElement('div');
    const acc={men:' men-a',fol:' fol-a',ov:' ov-a',lut:' lut-a',pmdd:' pmdd-a'}[key]||'';
    card.className='card'+acc;if(isNow)card.style.cssText='border:2px solid '+n.color+';box-shadow:0 4px 16px '+n.color+'22';
    card.innerHTML=`${isNow?`<div style="background:${n.color};color:white;font-size:10px;padding:3px 12px;border-radius:20px;font-weight:700;display:inline-block;margin-bottom:.6rem">← Your current phase</div>`:''}
    <div style="font-family:'Playfair Display',serif;font-size:.95rem;font-weight:700;color:${n.color};margin-bottom:.7rem">${PEMOJI[key]} ${PNAME[key]} — nutrition</div>
    <div class="g2">
      <div>
        <div style="background:${n.bg};border-radius:9px;padding:.6rem .8rem;margin-bottom:.5rem"><div style="font-size:10px;font-weight:700;color:${n.color};margin-bottom:.3rem">💧 Water & protein</div><div style="font-size:11px;color:var(--tmut)">${n.adjustments.slice(0,2).join('<br>')}</div></div>
        <div style="background:${n.bg};border-radius:9px;padding:.6rem .8rem;margin-bottom:.5rem"><div style="font-size:10px;font-weight:700;color:${n.color};margin-bottom:.3rem">✅ Eat more</div>${n.eatMore.map(f=>`<div style="font-size:11px;padding:2px 0;border-bottom:1px solid rgba(0,0,0,.05)">${f}</div>`).join('')}</div>
        <div style="background:rgba(192,57,43,.06);border-radius:9px;padding:.6rem .8rem"><div style="font-size:10px;font-weight:700;color:var(--ch);margin-bottom:.3rem">⚠️ Reduce/avoid</div>${n.eatLess.map(f=>`<div style="font-size:11px;padding:2px 0;border-bottom:1px solid rgba(0,0,0,.05)">${f}</div>`).join('')}</div>
      </div>
      <div>
        <div style="background:#f5f5f5;border-radius:9px;padding:.6rem .8rem;margin-bottom:.5rem"><div style="font-size:10px;font-weight:700;margin-bottom:.3rem">📋 All adjustments</div>${n.adjustments.map(a=>`<div style="font-size:11px;padding:3px 0;border-bottom:1px solid rgba(0,0,0,.05)">${a}</div>`).join('')}</div>
        <div style="background:rgba(192,57,43,.06);border-radius:9px;padding:.6rem .8rem"><div style="font-size:10px;font-weight:700;color:var(--ch);margin-bottom:.3rem">🩸 T1D note</div><div style="font-size:11px;color:var(--tmut)">${n.t1d}</div></div>
      </div>
    </div>`;
    c.appendChild(card);
  });
}

// ====== SUPPLEMENTS DATA ======
const SUPP_DATA={
  all:{title:'🔄 Every day',color:'var(--pink)',bg:'var(--pinkl)',supps:[{n:'Vitamin D3 10,000 IU',w:'Morning with fat-containing meal',y:'Your deficiency is resolved at this dose — keep it up every day.'},{n:'MiraFiber 8g',w:'Away from Levothyroxine by 4+ hrs',y:'Daily fiber slows glucose spikes all cycle long.'},{n:'Magnesium Glycinate 400–600mg',w:'Before bed',y:'Most important PMDD supplement. Also PCOS insulin sensitivity, sleep, anxiety. Daily throughout cycle.'},{n:'Omega-3 EPA+DHA 2–4g',w:'With meals',y:'Anti-inflammatory. Brain chemistry support for PMDD. Cardiovascular support.'},{n:'B-Complex (methylated)',w:'Morning with food',y:'Metformin depletes B12 continuously. B6 supports hormone metabolism.'}]},
  men:{title:'🩸 Menstrual phase adds',color:'var(--men)',bg:'var(--menl)',supps:[{n:'Iron + Vitamin C (if ferritin low)',w:'Away from Levothyroxine',y:'You\'re losing iron. Get ferritin tested — low iron is a top missed fatigue cause.'},{n:'Turmeric/Curcumin 500–1000mg',w:'With food',y:'Natural anti-inflammatory — reduces prostaglandins that cause cramping.'},{n:'Ginger extract 500mg',w:'With meals',y:'Proven to reduce menstrual pain and nausea.'},{n:'Bump Magnesium to 600mg',w:'Before bed',y:'Muscle relaxant — reduces cramp severity significantly.'}]},
  fol:{title:'🌱 Follicular phase adds',color:'var(--fol)',bg:'var(--foll)',supps:[{n:'Myo-Inositol + D-Chiro (4g, 40:1)',w:'2g morning, 2g evening',y:'Best PCOS supplement. Supports follicle development and insulin sensitivity.'},{n:'Selenium 200mcg',w:'Morning',y:'Thyroid T4→T3 conversion + follicle support. Most impactful in this phase.'},{n:'CoQ10 Ubiquinol 200–400mg',w:'With food',y:'Egg quality + essential for statin users (Rosuvastatin depletes CoQ10).'},{n:'Zinc 25–50mg',w:'With food',y:'PCOS androgen reduction. Reduces acne. Thyroid co-factor.'}]},
  ov:{title:'🌸 Ovulation phase adds',color:'var(--ov)',bg:'var(--ovl)',supps:[{n:'NAC (N-Acetyl Cysteine) 600mg',w:'With food',y:'Antioxidant that supports follicle health. Powerful PCOS support.'},{n:'Continue Selenium + CoQ10',w:'As above',y:'Keep going through ovulation for continued support.'}]},
  lut:{title:'🌕 Luteal phase — ramp up',color:'var(--lut)',bg:'var(--lutl)',supps:[{n:'Magnesium — increase to 600mg NOW',w:'Before bed',y:'Start ramping up BEFORE PMDD hits. Supports GABA, anxiety, sleep, cramps.'},{n:'Vitamin B6 100mg (extra)',w:'With food',y:'B6 is specifically studied for PMS/PMDD. Add on top of your B-Complex.'},{n:'Evening Primrose Oil 1000–3000mg',w:'With food',y:'Reduces breast tenderness, bloating, and PMS severity.'},{n:'Calcium 1000mg',w:'Split with meals (away from Levothyroxine)',y:'Most evidence-backed PMDD supplement — reduces mood symptoms 48% in studies. Takes 2–3 cycles.'}]},
  pmdd:{title:'💙 PMDD phase — maximum support',color:'var(--pmdd)',bg:'var(--pmddl)',note:'⚠️ Check all of these with your doctor alongside your current meds.',supps:[{n:'Magnesium Glycinate 600mg+ (twice daily)',w:'Morning + bedtime',y:'#1 PMDD supplement. GABA support — reduces anxiety, irritability, sleep disruption.'},{n:'Vitamin B6 100mg',w:'Morning',y:'Serotonin/dopamine precursor. Critical during PMDD window.'},{n:'Calcium 1000mg',w:'Split with meals',y:'48% reduction in PMDD mood symptoms in studies. Takes 2–3 cycles to work fully.'},{n:'5-HTP 50–100mg',w:'Before bed ONLY — NOT with SSRIs',y:'Serotonin precursor. Helps PMDD depression and sleep.'},{n:'L-Theanine 200mg',w:'As needed — safe with everything',y:'GABA support without sedation. Takes edge off anxiety. Use throughout the day as needed.'},{n:'Ashwagandha KSM-66 300–600mg',w:'Evening',y:'Cortisol modulation — your cortisol spikes worsen T1D blood sugar. Blunts the stress response.'},{n:'Rhodiola Rosea 200–400mg',w:'Morning, not after 2pm',y:'Reduces brain fog and fatigue during PMDD. Adaptogen.'}]}
};

function renderSuppPhases(){
  const c=document.getElementById('supp-phases');if(!c)return;c.innerHTML='';
  const cur=getPhase(getCycleDay(TODAY)||1);
  Object.entries(SUPP_DATA).forEach(([key,sp])=>{
    const isNow=key===cur||key==='all';const card=document.createElement('div');
    const acc={all:' teal-a',men:' men-a',fol:' fol-a',ov:' ov-a',lut:' lut-a',pmdd:' pmdd-a'}[key]||'';
    card.className='card'+acc;if(isNow&&key!=='all')card.style.cssText='border:2px solid '+sp.color+';box-shadow:0 4px 16px '+sp.color+'22';
    card.innerHTML=`${isNow&&key!=='all'?`<div style="background:${sp.color};color:white;font-size:10px;padding:3px 12px;border-radius:20px;font-weight:700;display:inline-block;margin-bottom:.6rem">← Your current phase</div>`:''}
    <div style="font-family:'Playfair Display',serif;font-size:.95rem;font-weight:700;color:${sp.color};margin-bottom:.6rem">${sp.title}</div>
    ${sp.note?`<div style="background:${sp.bg};border-radius:8px;padding:.4rem .7rem;font-size:10px;color:${sp.color};margin-bottom:.6rem">${sp.note}</div>`:''}
    <div style="display:flex;flex-direction:column;gap:5px">${sp.supps.map(s=>`<div style="background:white;border:1px solid var(--cbr);border-radius:9px;padding:7px 10px;display:flex;gap:8px"><span style="font-size:16px;flex-shrink:0">🌿</span><div style="flex:1"><div style="font-size:12px;font-weight:600">${s.n}</div><div style="font-size:10px;font-weight:600;color:${sp.color};margin-top:1px">⏰ ${s.w}</div><div style="font-size:10px;color:var(--tmut);margin-top:2px;line-height:1.5">${s.y}</div></div></div>`).join('')}</div>`;
    c.appendChild(card);
  });
}

// ====== PMDD ======
const ONSET_SYMS=['Sadness/depression','Anxiety/dread','Rage/irritability','Hopelessness','Brain fog','Fatigue crash','Insomnia','Crying spells','Social withdrawal','Numbness/dissociation','Intrusive thoughts','Oversensitivity','Physical tension','Appetite changes','Cravings','Low motivation'];
let selOnsetSyms=new Set();

function renderPMDD(){
  // Full countdown
  const pfc=document.getElementById('pmdd-full-cd');if(pfc){
    const last=periods[0];if(!last){pfc.innerHTML='<div class="empty-s">Add period history to activate</div>'}
    else{
      const cl=getCycleLen();const nextP=addDays(last.date,cl);const pmddStart=addDays(nextP,-settings.pmddDays);
      const dtp=daysBetween(TODAY,pmddStart);const dtn=daysBetween(TODAY,nextP);
      const withCD=onsets.filter(o=>o.cycleDay);const avgOnset=withCD.length?Math.round(withCD.reduce((a,b)=>a+b.cycleDay,0)/withCD.length):null;
      const personalDate=avgOnset?addDays(last.date,avgOnset-1):null;const dtPers=personalDate?daysBetween(TODAY,personalDate):null;
      pfc.innerHTML=`<div class="g2" style="margin-bottom:.6rem">
        <div style="background:var(--pmddl);border-radius:9px;padding:.6rem .8rem;text-align:center"><div style="font-size:9px;font-weight:600;color:var(--pmdd);margin-bottom:2px">📅 Predicted window</div><div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:var(--pmdd)">${fmtS(pmddStart)}</div><div style="font-size:9px;color:var(--tmut)">${dtp>0?'in '+dtp+'d':dtp===0?'starting today':'in progress'}</div></div>
        <div style="background:${avgOnset?'var(--purplel)':'#f5f5f5'};border-radius:9px;padding:.6rem .8rem;text-align:center;border:1px solid ${avgOnset?'rgba(142,68,173,.2)':'var(--cbr)'}"><div style="font-size:9px;font-weight:600;color:${avgOnset?'var(--purple)':'var(--tmut)'};margin-bottom:2px">🧠 YOUR personal onset</div><div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:${avgOnset?'var(--purple)':'var(--tmut)'}">${personalDate?fmtS(personalDate):'Log onsets to unlock'}</div><div style="font-size:9px;color:var(--tmut)">${dtPers!==null?(dtPers>0?'in '+dtPers+'d':dtPers===0?'today':'you\'re in it'):`from ${withCD.length} logged onsets`}</div></div>
      </div>
      <div style="font-size:10px;color:var(--tmut);line-height:1.6;font-style:italic">${avgOnset?`📊 Based on your ${withCD.length} logged onsets, you tend to feel PMDD starting around day ${avgOnset} — that's ${Math.abs(avgOnset-(cl-settings.pmddDays))} day${Math.abs(avgOnset-(cl-settings.pmddDays))!==1?'s':''} ${avgOnset<cl-settings.pmddDays?'earlier than':'later than'} the standard prediction. This is YOUR number.`:'💙 Log PMDD onset dates to build your personal fingerprint. After a few cycles you\'ll know exactly when to expect it — and you can prepare properly.'}</div>`;
    }
  }
  // quick onset grid
  const qg=document.getElementById('quick-onset-grid');if(qg){qg.innerHTML='';ONSET_SYMS.slice(0,9).forEach(s=>{const sel=selOnsetSyms.has(s);const e=document.createElement('div');e.style.cssText=`background:${sel?'rgba(41,128,185,.15)':'white'};border:1.5px solid ${sel?'var(--pmdd)':'var(--cbr)'};border-radius:8px;padding:5px 7px;cursor:pointer;font-size:10px;text-align:center;transition:all .15s`;e.textContent=s;e.onclick=()=>{if(selOnsetSyms.has(s))selOnsetSyms.delete(s);else selOnsetSyms.add(s);renderPMDD()};qg.appendChild(e)})}
  // onset chips
  const oc=document.getElementById('onset-chips');if(oc){oc.innerHTML='';ONSET_SYMS.forEach(s=>{const sel=selOnsetSyms.has(s);const e=document.createElement('span');e.className='schip';e.style.cssText=`background:${sel?'var(--pmdd)22':'white'};color:var(--pmdd);border-color:rgba(41,128,185,.35)`;e.textContent=s;e.onclick=()=>{if(selOnsetSyms.has(s))selOnsetSyms.delete(s);else selOnsetSyms.add(s);renderPMDD()};oc.appendChild(e)})}
  // emergency
  const ec=document.getElementById('pmdd-emergency');if(ec)ec.innerHTML=['💧 Drink water and eat something — blood sugar + PMDD is brutal','🛁 Epsom salt bath — magnesium absorbs through skin in 20 min','🎧 Headphones on — silence or white noise changes brain state','🌡️ Heating pad — your body thinks it\'s in pain because it sort of is','✍️ Write it down — one page, no filter, destroy if needed','📞 Text someone safe — "having a hard PMDD day" is enough','🍫 Dark chocolate — genuinely medicinal right now','🛌 Lie down without guilt — rest is literally treatment','🎬 Put on something familiar — no new media, no stress'].map(t=>`<div style="font-size:11px;padding:5px 0;border-bottom:1px solid rgba(41,128,185,.1);line-height:1.5">${t}</div>`).join('');
  const pc=document.getElementById('pmdd-prevent');if(pc)pc.innerHTML=['🌿 Start magnesium 600mg at ovulation — 10+ days before period','💊 Vitamin B6 100mg daily from day 14 onward','🍷 Cut alcohol completely in late luteal — it makes PMDD acute','🍬 Reduce sugar in week before period — crashes hit harder','😴 Protect sleep ruthlessly — deprivation doubles PMDD severity','🧘 Light movement only — hard workouts raise cortisol','📅 Tell your partner what phase you\'re in — prevents conflict','🗓️ Schedule less during your PMDD window — protect it now'].map(t=>`<div style="font-size:11px;padding:5px 0;border-bottom:1px solid rgba(41,128,185,.1);line-height:1.5">${t}</div>`).join('');
  const mc=document.getElementById('pmdd-medical');if(mc)mc.innerHTML=[{t:'SSRIs/SNRIs luteal-phase dosing',d:'You don\'t need to take them every day — luteal-phase-only SSRIs (days 14–28) work as well as continuous for PMDD with fewer side effects. Ask about this specifically.'},{t:'Your Norethindrone (progestin-only pill)',d:'Important: progestin-only pills can worsen PMDD in some people because progesterone sensitivity is part of the mechanism. Ask your OB-GYN about switching to a continuous combined pill to skip periods entirely and eliminate PMDD.'},{t:'GnRH agonists (for severe PMDD)',d:'Temporary medical menopause to confirm PMDD and provide relief. Used in severe, treatment-resistant cases.'},{t:'Discuss Ozempic + PMDD',d:'GLP-1 agonists are being studied for mood regulation. Your endocrinologist may have insight on this interaction.'}].map(m=>`<div style="background:white;border:1px solid var(--cbr);border-radius:9px;padding:8px 11px;margin-bottom:5px;display:flex;gap:8px"><div style="width:4px;flex-shrink:0;background:var(--pmdd);border-radius:2px"></div><div><div style="font-size:12px;font-weight:600">${m.t}</div><div style="font-size:10px;color:var(--tmut);margin-top:3px;line-height:1.5">${m.d}</div></div></div>`).join('');
  // affirmations
  const ac=document.getElementById('pmdd-affirm');if(ac)ac.innerHTML=['These feelings are symptoms. They are not facts about who you are.','You have gotten through every PMDD window so far. Every single one.','Low progesterone is a medical event. You are not weak for struggling.','The depression you feel right now is chemical, not truth. It will lift.','You are not a burden. You have a condition. There\'s a difference.','Your brain is doing something unusual right now. That makes you resilient, not broken.','Rest is not giving up. Rest is a medical intervention right now.','This is temporary. Spring is always on the other side of this.'].map(a=>`<div style="background:white;border-left:3px solid var(--blue);border-radius:0 8px 8px 0;padding:7px 12px;margin-bottom:5px;font-size:11px;font-style:italic;line-height:1.6">"${a}"</div>`).join('');
  document.getElementById('onset-date').value=TODAY;
}

window.logOnset=()=>{
  const date=document.getElementById('onset-date').value||TODAY;
  const cd=getCycleDay(date);
  const entry={date,cycleDay:cd,severity:parseInt(document.getElementById('onset-sev').value)||3,symptoms:[...selOnsetSyms],trigger:document.getElementById('onset-trigger').value.trim(),helped:document.getElementById('onset-helped').value.trim(),notes:document.getElementById('onset-notes').value.trim(),ts:Date.now()};
  onsets.unshift(entry);ss(ptK.o,onsets);selOnsetSyms.clear();
  ['onset-trigger','onset-helped','onset-notes'].forEach(id=>document.getElementById(id).value='');
  renderPMDD();renderOnsetLog();renderPMDDPatterns();
  flash('onset-saved','Logged 💙','var(--green)');
};

window.quickLogOnset=()=>{
  const cd=getCycleDay(TODAY);
  const entry={date:TODAY,cycleDay:cd,severity:parseInt(document.getElementById('quick-sev').value)||3,symptoms:[...selOnsetSyms],trigger:'',helped:'',notes:document.getElementById('quick-note').value.trim(),ts:Date.now(),quick:true};
  onsets.unshift(entry);ss(ptK.o,onsets);selOnsetSyms.clear();document.getElementById('quick-note').value='';
  renderPMDD();renderOnsetLog();renderPMDDPatterns();
  flash('quick-saved','Logged 💙 — tracking this matters so much','var(--green)');
};

function renderOnsetLog(){
  const c=document.getElementById('onset-log');if(!c)return;c.innerHTML='';
  if(!onsets.length){c.innerHTML='<div class="empty-s">No onset ptLogs yet — log when you first feel it to build your pattern</div>';return}
  const SC={1:'#aaa',2:'var(--yellow)',3:'var(--orange)',4:'var(--ch)',5:'var(--chd)'};
  const SL={1:'Whisper',2:'Mild',3:'Moderate',4:'Severe',5:'Crisis'};
  const avgCL=getCycleLen();const pred=avgCL-settings.pmddDays;
  onsets.forEach((o,i)=>{
    const diff=o.cycleDay?o.cycleDay-pred:null;
    const e=document.createElement('div');e.className='onset-item';
    e.innerHTML=`<div style="display:flex;gap:9px;align-items:flex-start"><div style="flex-shrink:0;min-width:60px"><div style="font-size:9px;color:var(--tmut)">${fmtS(o.date)}</div><div style="background:${SC[o.severity]||'#aaa'}22;color:${SC[o.severity]||'#aaa'};border:1px solid ${SC[o.severity]||'#aaa'}44;border-radius:6px;padding:2px 6px;font-size:9px;font-weight:700;margin-top:3px;text-align:center">${SL[o.severity]||'—'}</div>${o.quick?`<div class="tag" style="background:var(--bluel);color:var(--blue);margin-top:3px">⚡ quick</div>`:''}</div><div style="flex:1"><div style="font-size:10px;font-weight:600;color:var(--pmdd);margin-bottom:3px">Day ${o.cycleDay||'?'}${diff!==null?` · ${diff>0?'+'+diff+'d late':diff<0?Math.abs(diff)+'d early':'on predicted day'}`:''}</div><div style="display:flex;flex-wrap:wrap;gap:2px;margin-bottom:3px">${(o.symptoms||[]).slice(0,4).map(s=>`<span class="tag" style="background:var(--pmddl);color:var(--pmdd)">${s}</span>`).join('')}</div>${o.trigger?`<div style="font-size:9px;color:var(--tmut)">⚡ ${o.trigger}</div>`:''}${o.helped?`<div style="font-size:9px;color:var(--green)">✨ ${o.helped}</div>`:''}</div><button class="bdel" onclick="delOnset(${i})">×</button></div>`;
    c.appendChild(e);
  });
}
window.delOnset=i=>{if(confirm('Remove?')){onsets.splice(i,1);ss(ptK.o,onsets);renderOnsetLog();renderPMDDPatterns()}};

function renderPMDDPatterns(){
  const c=document.getElementById('pmdd-patterns');if(!c)return;
  if(onsets.length<2){c.innerHTML='<div class="empty-s">Log PMDD onset across 2+ cycles to see your patterns</div>';return}
  const withCD=onsets.filter(o=>o.cycleDay);const avgCD=withCD.length?Math.round(withCD.reduce((a,b)=>a+b.cycleDay,0)/withCD.length):null;
  const pred=getCycleLen()-settings.pmddDays;const avgDiff=avgCD?avgCD-pred:null;
  const allS={};onsets.forEach(o=>(o.symptoms||[]).forEach(s=>{allS[s]=(allS[s]||0)+1}));const topS=Object.entries(allS).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const helped={};onsets.filter(o=>o.helped).forEach(o=>o.helped.split(',').forEach(h=>{const t=h.trim();if(t)helped[t]=(helped[t]||0)+1}));const topH=Object.entries(helped).sort((a,b)=>b[1]-a[1]).slice(0,4);
  const sevAvg=onsets.length?(onsets.reduce((a,b)=>a+b.severity,0)/onsets.length).toFixed(1):null;
  c.innerHTML=`${avgCD?`<div style="background:var(--pmddl);border-radius:9px;padding:.7rem .8rem;margin-bottom:.6rem"><div style="font-size:9px;font-weight:600;color:var(--pmdd);margin-bottom:3px">📅 When PMDD actually hits you</div><div style="font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:var(--pmdd)">Day ${avgCD} avg</div><div style="font-size:9px;color:var(--tmut);margin-top:2px">Predicted starts day ${pred}${avgDiff!==null?` · You tend to feel it ${Math.abs(avgDiff)}d ${avgDiff>0?'later':'earlier'} than predicted`:''}</div></div>`:''}
  ${topS.length?`<div style="margin-bottom:.6rem"><div style="font-size:10px;font-weight:700;color:var(--ch);margin-bottom:.4rem">⚡ Your first symptoms</div>${topS.map(([s,c])=>`<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px"><span>${s}</span><span class="tag" style="background:var(--pmddl);color:var(--pmdd)">${c}×</span></div>`).join('')}</div>`:''}
  ${topH.length?`<div style="background:var(--greenl);border-radius:9px;padding:.6rem .8rem"><div style="font-size:10px;font-weight:700;color:var(--green);margin-bottom:.3rem">✨ What helps you</div>${topH.map(([h,c])=>`<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:2px"><span>${h}</span><span class="tag" style="background:var(--greenl);color:var(--green)">${c}×</span></div>`).join('')}</div>`:''}
  ${sevAvg?`<div style="margin-top:.5rem;font-size:10px;color:var(--tmut)">Avg severity: <strong>${sevAvg}/5</strong> across ${onsets.length} logged onsets</div>`:''}`;
}

// ====== JOURNAL ======
window.saveJournal=()=>{const t=document.getElementById('j-text').value.trim();if(!t)return;const cd=getCycleDay(TODAY);journal.unshift({text:t,type:document.getElementById('j-type').value,date:ptNowS(),cycleDay:cd,phase:getPhase(cd||1),ts:Date.now()});ss(ptK.j,journal);document.getElementById('j-text').value='';renderJournal()};
function renderJournal(){
  const c=document.getElementById('j-list');if(!c)return;c.innerHTML='';
  if(!journal.length){c.innerHTML='<div class="empty-s">No entries yet</div>';return}
  const tc={during:'var(--pmdd)',coming:'var(--orange)',after:'var(--green)',pattern:'var(--purple)'};
  const tl={during:'During PMDD',coming:'Coming on',after:'After it lifted',pattern:'Pattern noticed'};
  journal.slice(0,12).forEach(j=>{const e=document.createElement('div');e.style.cssText='padding:7px 10px;background:white;border:1px solid var(--cbr);border-radius:9px;margin-bottom:5px;font-size:11px';e.innerHTML=`<div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:9px;color:var(--tmut)">${j.date}${j.cycleDay?` · Day ${j.cycleDay}`:''}</span><span class="tag" style="background:${(tc[j.type]||'var(--pink)')}18;color:${tc[j.type]||'var(--pink)'};border:1px solid ${(tc[j.type]||'var(--pink)')}33">${tl[j.type]||j.type}</span></div><div style="line-height:1.6">${j.text}</div>`;c.appendChild(e)});
}

// ====== TRENDS ======
function ptRenderTrends(){
  const cycLens=calcCLs();const avg=calcAvgCL();
  const ts=document.getElementById('trend-stats-row');if(ts){const apl=avgPL();ts.innerHTML=`<div class="sm"><div class="sm-l">Avg cycle</div><div class="sm-v" style="color:var(--pink)">${avg?Math.round(avg)+'d':settings.cycleLen+'d'}</div><div class="sm-s">${cycLens.length} cycles tracked</div></div><div class="sm"><div class="sm-l">Range</div><div class="sm-v" style="font-size:14px">${cycLens.length?Math.min(...cycLens.map(c=>c.len))+'–'+Math.max(...cycLens.map(c=>c.len))+'d':'—'}</div><div class="sm-s">shortest to longest</div></div><div class="sm"><div class="sm-l">Avg period</div><div class="sm-v" style="color:var(--men)">${apl}d</div><div class="sm-s">average duration</div></div>`}

  const clc=document.getElementById('cl-chart');if(clc){
    if(!cycLens.length){clc.innerHTML='<div class="empty-s">Add 2+ periods to see cycle length trends</div>'}
    else{const max=Math.max(...cycLens.map(c=>c.len),1);clc.innerHTML='<div style="font-size:9px;color:var(--tmut);margin-bottom:.4rem">Each bar = one cycle. Longer cycles are common with PCOS.</div>'+cycLens.slice(-14).map(c=>`<div class="trend-bar"><span class="trend-bar-label">${fmtS(c.date)}</span><div class="trend-bar-track"><div class="trend-bar-fill" style="width:${c.len/max*100}%;background:${c.len>40?'var(--orange)':c.len<21?'var(--ch)':'var(--pink)'}"></div></div><span class="trend-bar-val">${c.len}d</span></div>`).join('')+`${avg?`<div style="font-size:10px;color:var(--pink);margin-top:.4rem;font-style:italic">Average: ${Math.round(avg)} days from ${cycLens.length} cycles</div>`:''}`}
  }

  const fc=document.getElementById('flow-chart');if(fc){const fl={};periods.forEach(p=>{if(p.flow)fl[p.flow]=(fl[p.flow]||0)+1});const tot=Object.values(fl).reduce((a,b)=>a+b,0)||1;const FC2={spotting:'#ffb3c1',light:'#ff6b9d',medium:'#e91e8c',heavy:'#c0392b',very_heavy:'#7b241c'};if(!Object.keys(fl).length){fc.innerHTML='<div class="empty-s">Log flow when adding periods</div>'}else fc.innerHTML=Object.entries(fl).map(([f,cnt])=>`<div class="trend-bar"><span class="trend-bar-label">${f.replace('_',' ')}</span><div class="trend-bar-track"><div class="trend-bar-fill" style="width:${cnt/tot*100}%;background:${FC2[f]||'#888'}"></div></div><span class="trend-bar-val">${cnt}×</span></div>`).join('')}

  const plc=document.getElementById('pl-chart');if(plc){const valid=periods.filter(p=>p.periodLen);if(!valid.length){plc.innerHTML='<div class="empty-s">Log period length when adding periods</div>'}else{const max=Math.max(...valid.map(p=>p.periodLen),1);plc.innerHTML=valid.slice(-8).map(p=>`<div class="trend-bar"><span class="trend-bar-label">${fmtS(p.date)}</span><div class="trend-bar-track"><div class="trend-bar-fill" style="width:${p.periodLen/max*100}%;background:var(--purple)"></div></div><span class="trend-bar-val">${p.periodLen}d</span></div>`).join('')}}

  const otc=document.getElementById('onset-trend-chart');if(otc){
    if(!onsets.length){otc.innerHTML='<div class="empty-s">Log PMDD onsets to see patterns here</div>'}
    else{const pred=getCycleLen()-settings.pmddDays;otc.innerHTML=onsets.slice(-8).map(o=>{const diff=o.cycleDay?o.cycleDay-pred:null;return`<div style="display:flex;gap:8px;padding:6px 9px;background:white;border:1px solid var(--cbr);border-radius:8px;margin-bottom:4px;font-size:11px;align-items:center"><span style="font-size:9px;color:var(--tmut);min-width:60px">${fmtS(o.date)}</span><span class="tag" style="background:var(--pmddl);color:var(--pmdd)">Day ${o.cycleDay||'?'}</span><span style="font-size:9px;color:${diff>0?'var(--green)':diff<0?'var(--ch)':'var(--tmut)'}">${diff!==null?(diff>0?'+'+diff+'d late':diff<0?Math.abs(diff)+'d early':'on time'):'?'}</span><span style="font-size:9px;color:var(--tmut);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${(o.symptoms||[]).slice(0,2).join(', ')}</span></div>`}).join('')}
  }

  const fh=document.getElementById('full-history');if(fh){fh.innerHTML='';if(!periods.length){fh.innerHTML='<div class="empty-s">No period history yet</div>'}periods.forEach((p,i)=>{const nxt=periods[i+1];const cl=nxt?daysBetween(nxt.date,p.date):null;const e=document.createElement('div');e.style.cssText='display:flex;gap:9px;padding:7px 10px;background:white;border:1px solid var(--cbr);border-radius:9px;margin-bottom:5px;align-items:center;font-size:11px';e.innerHTML=`<div style="width:28px;height:28px;border-radius:7px;background:var(--menl);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">🩸</div><div style="flex:1"><div style="font-weight:600">${fmtD(p.date)}</div><div style="font-size:9px;color:var(--tmut);margin-top:1px">${p.flow?p.flow.replace('_',' ')+' flow':'flow not logged'}${p.periodLen?' · '+p.periodLen+'d':''}${cl?' · cycle: '+cl+'d':''}</div>${p.notes?`<div style="font-size:9px;color:var(--tmut);font-style:italic">${p.notes}</div>`:''}</div>`;fh.appendChild(e)})}
}

// ====== HELPERS ======
function flash(id,msg,color){const el=document.getElementById(id);if(!el)return;el.style.color=color;el.textContent=msg;setTimeout(()=>el.textContent='',3000)}
window.ptOpenMo=id=>document.getElementById(id).classList.add('open');
window.ptCloseMo=id=>document.getElementById(id).classList.remove('open');
document.querySelectorAll('#htab-cycle .mo').forEach(mo=>mo.onclick=e=>{if(e.target===mo)mo.classList.remove('open')});

// ====== INIT ======
// ====== INIT ======
try {
  ptInit();
} catch(e) { console.log('Period tracker init:', e); }

// ============ INIT ============
try {
  hRenderTodayTab();
  hRenderAdhCal();
  hRenderMedLists();
  hRenderSuppList();
  if(typeof hPopulateSESelect==='function') hPopulateSESelect();
  if(typeof renderAll==='function') renderAll();
  if(typeof hRenderAppts==='function') hRenderAppts();
  if(typeof hRenderDocs==='function') hRenderDocs();
  if(typeof hRenderCheckups==='function') hRenderCheckups();
  if(typeof hRenderTdoc==='function') hRenderTdoc();
  if(typeof hRenderTrendStats==='function') hRenderTrendStats();
  if(typeof hRenderTrendCharts==='function') hRenderTrendCharts();
  if(typeof hRenderSEList==='function') hRenderSEList();
  if(typeof hRenderSymHistory==='function') hRenderSymHistory();
  if(typeof hRenderSymFreq==='function') hRenderSymFreq();
  if(typeof hRenderFoodLog==='function') hRenderFoodLog();
  if(typeof hRenderActivityLog==='function') hRenderActivityLog();
} catch(e) { console.log('Health init:', e); }
