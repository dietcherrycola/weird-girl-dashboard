renderNav('barbie');

// Make the barbie page visible (it's display:none by default from .page class)


// Modal helpers (used by HTML onclick handlers)
window.openMo=id=>{const el=document.getElementById(id);if(el)el.classList.add('open')};
window.closeMo=id=>{const el=document.getElementById(id);if(el)el.classList.remove('open')};
document.querySelectorAll('.mo').forEach(mo=>{mo.onclick=e=>{if(e.target===mo)mo.classList.remove('open')}});

// Barbie init guard
let _barbieInited=false;

function initBarbie(){
  if(_barbieInited)return;
  _barbieInited=true;
  updateHeaderTotal();
  renderSchoolChecklist();renderFairyNotesList();renderStudents();renderFocusAreas();
  renderMotorSkills();renderMotorWeek();renderGames();renderElfIdeas();renderSchoolFun();renderFairyVault();
  renderYTKanban();renderYTIdeas();renderYTTrends();renderJournals();renderYTDeals();renderPatreonTiers();renderBIncomeLog();
  renderModProjects();renderModIdeas();renderModWorkflow();renderModResources();renderModTools();
  renderEtsyListings();renderEtsyOrders();renderEtsyGoals();renderEtsyPlannerChecklist();renderEtsyPhotos();renderEtsyCal();updateEtsyStats();
  renderDollProjects("all");renderDollSupplies();renderDollWorkflow();renderDollTechniques();renderDollRefs();
  renderBaddieIdeas();renderBaddieInspo();renderBaddieTreatments();renderUGCDeals();renderPitches();renderBaddieBrands();renderBaddieMilestones();renderBaddieSchedule();renderBaddieWeekly();renderBaddieKanban();
  renderStreamGames();renderStreamSeries();renderStreamGoals();renderStreamLog();renderStreamSchedule();renderStreamSetupChecklist();renderStreamPromo();
  renderMonetizationGrids();renderEmpireRoadmap();renderEmpireGoals();
}
// ===== STORAGE =====
const B={
  school:'bb_school',students:'bb_students',games:'bb_games',fairy:'bb_fairy',elf:'bb_elf',schoolFun:'bb_sfun',motorWeek:'bb_motorwk',
  ytVideos:'bb_ytvideos',ytIdeas:'bb_ytideas',ytTrends:'bb_yttrends',ytJournals:'bb_ytjournals',ytDeals:'bb_ytdeals',ytPatreon:'bb_ytpatreon',
  modProjects:'bb_modprojects',modIdeas:'bb_modideas',modResources:'bb_modres',
  etsyListings:'bb_listings',etsyOrders:'bb_orders',etsyGoals:'bb_etsygoals',
  dollProjects:'bb_dolls',dollSupplies:'bb_dollsupplies',dollTechniques:'bb_techniques',dollRefs:'bb_dollrefs',
  baddieContent:'bb_baddie',baddieIdeas:'bb_baddideas',baddieInspo:'bb_inspo',baddieTreatments:'bb_treatments',ugcDeals:'bb_ugcdeals',pitches:'bb_pitches',baddieBrands:'bb_brands',baddieMilestones:'bb_milestones',
  streamGames:'bb_streamgames',streamSeries:'bb_streamseries',streamGoals:'bb_streamgoals',streamLog:'bb_streamlog',
  income:'bb_income',
  // sync key for life dashboard
  lifeIncome:'wg_ic8'
};
const nowS=()=>new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
const fmtMoney=n=>n?'$'+parseFloat(n).toFixed(0):'$0';

// ===== NAVIGATION =====
window.goJob=id=>{
  document.querySelectorAll('.job-page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.job-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('job-'+id).classList.add('active');
  document.querySelector(`.job-btn[onclick="goJob('${id}')"]`).classList.add('active');
  if(id==='money')renderEmpireMoney();
  updateHeaderTotal();
};
window.bOpenMo=id=>document.getElementById(id).classList.add('open');
window.bCloseMo=id=>document.getElementById(id).classList.remove('open');
document.querySelectorAll('#page-barbie .mo').forEach(mo=>mo.onclick=e=>{if(e.target===mo)mo.classList.remove('open')});

function showTabGeneric(prefix,t,btn){
  document.querySelectorAll('[id^="'+prefix+'tab-"]').forEach(el=>el.classList.remove('active'));
  const el=document.getElementById(prefix+'tab-'+t);if(el)el.classList.add('active');
  if(btn){btn.parentElement.querySelectorAll('.itab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}
}
window.showSchoolTab=(t,btn)=>showTabGeneric('s',t,btn);
window.showYTTab=(t,btn)=>showTabGeneric('yt',t,btn);
window.showModTab=(t,btn)=>showTabGeneric('mod',t,btn);
window.showEtsyTab=(t,btn)=>showTabGeneric('etsy',t,btn);
window.showDollTab=(t,btn)=>showTabGeneric('doll',t,btn);
window.showBaddieTab=(t,btn)=>showTabGeneric('baddie',t,btn);
window.showStreamTab=(t,btn)=>showTabGeneric('stream',t,btn);

// ===== INCOME ENGINE =====
let bIncomeLog=ls(B.income,[]);
function getIncomeBySection(section){return bIncomeLog.filter(i=>i.section===section).reduce((a,b)=>a+b.amount,0)}
function getAllIncome(){return bIncomeLog.reduce((a,b)=>a+b.amount,0)}
window.logIncome=section=>{
  const amtEl=document.getElementById('inc-'+section+'-amt');
  const sourceEl=document.getElementById('inc-'+section+'-source');
  const notesEl=document.getElementById('inc-'+section+'-notes');
  const amt=parseFloat(amtEl?.value)||0;if(!amt){amtEl?.focus();return}
  const entry={section,source:sourceEl?.value||'Other',amount:amt,notes:notesEl?.value||'',date:nowS(),ts:Date.now()};
  bIncomeLog.unshift(entry);ss(B.income,bIncomeLog);
  // sync to life dashboard
  syncToLifeDashboard(entry);
  amtEl.value='';if(notesEl)notesEl.value='';
  bCloseMo('income-modal-'+section);
  renderBIncomeLog();updateHeaderTotal();
};
function syncToLifeDashboard(entry){
  try{
    let lifeLog=ls(B.lifeIncome,[]);
    lifeLog.unshift({source:`${entry.section.toUpperCase()} — ${entry.source}`,amt:entry.amount,cat:entry.section,color:'#930500'});
    ss(B.lifeIncome,lifeLog);
  }catch(e){}
}
function bGetSchoolPay(){const now=new Date();const aug12=new Date(2026,7,12);return now>=aug12?1500:1005}
function updateHeaderTotal(){const t=getAllIncome()+bGetSchoolPay();document.getElementById('header-total').textContent=fmtMoney(t);const el=document.getElementById('empire-school');if(el)el.textContent=fmtMoney(bGetSchoolPay());const sub=document.getElementById('empire-school-sub');if(sub)sub.textContent=bGetSchoolPay()===1500?'monthly paycheck':'→ $1,500 from Aug 12'}
function renderBIncomeLog(){
  const sections=['yt','mod','etsy','doll','baddie','stream'];
  sections.forEach(s=>{
    const el=document.getElementById(s+'-income-log');if(!el)return;
    const items=bIncomeLog.filter(i=>i.section===s);
    if(!items.length){el.innerHTML='<div class="empty-s">No income logged yet</div>';return}
    el.innerHTML='';items.slice(0,5).forEach(item=>{
      const e=document.createElement('div');e.className='money-card';
      e.innerHTML=`<div class="money-dot" style="background:var(--pink)"></div><div class="money-source">${item.source}${item.notes?' — <span style="font-weight:400;color:var(--muted)">${item.notes}</span>':''}</div><div style="font-size:9px;color:var(--muted)">${item.date}</div><div class="money-amount">${fmtMoney(item.amount)}</div>`;
      el.appendChild(e);
    });
  });
}

// ===== MONETIZATION GRIDS =====
const MONETIZATION={
  yt:[{icon:'💰',name:'YouTube AdSense',desc:'Once monetized (1k subs + 4k hours)'},{icon:'🤝',name:'Brand deals',desc:'Sponsored integrations in videos'},{icon:'💜',name:'Patreon',desc:'Exclusive content, early access, BTS'},{icon:'👕',name:'Merch',desc:'Printful/Printify integration'},{icon:'🔗',name:'Affiliate links',desc:'Amazon, Book Depository, etc in description'},{icon:'💬',name:'Super Chats / Thanks',desc:'Viewer tips during premieres'}],
  mod:[{icon:'💜',name:'Patreon',desc:'Early mod access, WIP updates, exclusive content'},{icon:'☕',name:'Ko-fi / donations',desc:'One-time tips from fans'},{icon:'📦',name:'Paid mod packs',desc:'Curated bundles on Gumroad or itch.io'},{icon:'🎮',name:'Commission mods',desc:'Custom mods made for specific clients'},{icon:'🎬',name:'YouTube content',desc:'Tutorials, showcases, mod reviews'},{icon:'🤝',name:'Studio partnerships',desc:'Paid work for indie game studios'}],
  etsy:[{icon:'🎀',name:'Restored doll lots',desc:'Cleaned, repaired, photographed to sell'},{icon:'🎨',name:'OOAK customs',desc:'One-of-a-kind painted/rerooted pieces'},{icon:'🖼️',name:'Art prints',desc:'Digital designs printed on demand'},{icon:'💻',name:'Digital downloads',desc:'Printables, patterns, guides'},{icon:'✉️',name:'Made-to-order',desc:'Commissions for custom work'},{icon:'🎁',name:'Gift sets / bundles',desc:'Curated lots for higher AOV'}],
  doll:[{icon:'🛍️',name:'Etsy sales',desc:'Restored and custom dolls'},{icon:'🤝',name:'Commissions',desc:'Custom restorations for clients'},{icon:'🎬',name:'YouTube/TikTok',desc:'Restoration content drives traffic'},{icon:'👩‍🏫',name:'Tutorials',desc:'Paid PDF or video guides on restoration'},{icon:'📦',name:'Supply bundles',desc:'Curated doll supply kits'},{icon:'🏪',name:'Local markets',desc:'Craft fairs, vintage markets'}],
  baddie:[{icon:'🤝',name:'UGC creation',desc:'Create content for brands without needing big following'},{icon:'💸',name:'Brand deals',desc:'Sponsored posts once you have traction'},{icon:'🎵',name:'TikTok Creator Fund',desc:'Pay per view after 10k followers'},{icon:'🔗',name:'Affiliate links',desc:'LTK, Amazon storefront, brand affiliates'},{icon:'💄',name:'Brand ambassador',desc:'Ongoing relationship with a brand'},{icon:'👗',name:'Personal shopping',desc:'Curated style guides, Depop/Poshmark'}],
  stream:[{icon:'⭐',name:'Twitch subscriptions',desc:'$2.50–$4.99 split per sub'},{icon:'💎',name:'Bits & donations',desc:'Direct tips from viewers'},{icon:'🤝',name:'Sponsorships',desc:'Paid integrations in streams'},{icon:'🔗',name:'Affiliate links',desc:'Gaming gear, peripherals, games'},{icon:'☕',name:'Ko-fi / StreamElements',desc:'Tip jar for non-Twitch supporters'},{icon:'📺',name:'VOD content',desc:'Clips to YouTube for ad revenue'}]
};
function renderMonetizationGrids(){
  Object.entries(MONETIZATION).forEach(([key,items])=>{
    const el=document.getElementById(key+'-monetization-grid');if(!el)return;el.innerHTML='';
    items.forEach(item=>{
      const e=document.createElement('div');
      e.style.cssText='background:var(--pink-light);border:1px solid var(--border);border-radius:10px;padding:9px 11px;font-size:11px';
      e.innerHTML=`<div style="font-size:16px;margin-bottom:4px">${item.icon}</div><div style="font-weight:700;color:var(--pink-dark)">${item.name}</div><div style="font-size:9px;color:var(--muted);margin-top:2px">${item.desc}</div>`;
      el.appendChild(e);
    });
  });
}

// ===== SCHOOL =====
let students=ls(B.students,[]);
let schoolGames=ls(B.games,[]);
let fairyNotes=ls(B.fairy,[]);
let elfIdeas=ls(B.elf,['The elf moved the pencil cups around!','Elf left tiny footprints in glitter','Elf is reading a tiny book in the library corner','Elf got into the art supplies — tiny paintings left behind','Elf wrote a note saying she misses the kids']);
let schoolFun=ls(B.schoolFun,[]);

const MOTOR_SKILLS=[
  {cat:'balance',emoji:'🧘',name:'Single-leg stance',desc:'Stand on one foot for 5-10 seconds. Great for proprioception.'},
  {cat:'balance',emoji:'🚶',name:'Beam walking',desc:'Walk along a taped line or balance beam. Eyes forward!'},
  {cat:'coordination',emoji:'🤲',name:'Clapping patterns',desc:'Repeat rhythmic clapping sequences. Builds bilateral coordination.'},
  {cat:'coordination',emoji:'⚽',name:'Kicking a stationary ball',desc:'Kick toward a target with alternating feet.'},
  {cat:'coordination',emoji:'🏀',name:'Bouncing & catching',desc:'Bounce a large ball and catch it. Progress to smaller balls.'},
  {cat:'strength',emoji:'🐛',name:'Animal walks',desc:'Bear crawl, crab walk, inchworm. Full body strength & fun!'},
  {cat:'strength',emoji:'🧗',name:'Climbing & hanging',desc:'Monkey bars, climbing walls. Upper body and core strength.'},
  {cat:'spatial',emoji:'🎯',name:'Obstacle course',desc:'Over, under, through — spatial awareness and body mapping.'},
  {cat:'spatial',emoji:'🔄',name:'Rolling and tumbling',desc:'Forward rolls on a mat. Body awareness and vestibular input.'},
  {cat:'rhythm',emoji:'🥁',name:'Drum & stomp patterns',desc:'Follow a beat with hands and feet. Great for music movement sessions!'},
  {cat:'rhythm',emoji:'💃',name:'Freeze dance',desc:'Move when music plays, freeze when it stops. Impulse control + rhythm.'},
  {cat:'coordination',emoji:'🎪',name:'Scarf juggling',desc:'Toss and catch silk scarves — slow enough for little hands to track.'},
];

let motorFilterActive='all';
let motorWeek=ls(B.motorWeek,[]);
let schoolChecklist=ls(B.school,{checklist:[],focus:'',music:'',quickNotes:''});

window.saveSchoolFocus=()=>{schoolChecklist.focus=document.getElementById('school-today-focus').value;ss(B.school,schoolChecklist)};
window.saveSchoolMusic=()=>{schoolChecklist.music=document.getElementById('school-music-plan').value;ss(B.school,schoolChecklist)};
window.saveQuickNotes=()=>{schoolChecklist.quickNotes=document.getElementById('school-quick-notes').value;ss(B.school,schoolChecklist)};
window.addSchoolCheck=()=>{const v=document.getElementById('school-check-inp').value.trim();if(!v)return;schoolChecklist.checklist.push({text:v,done:false});ss(B.school,schoolChecklist);document.getElementById('school-check-inp').value='';renderSchoolChecklist()};
function renderSchoolChecklist(){const c=document.getElementById('school-checklist');if(!c)return;c.innerHTML='';if(!schoolChecklist.checklist.length){c.innerHTML='<div class="empty-s">Add today\'s tasks</div>';return}schoolChecklist.checklist.forEach((item,i)=>{const e=document.createElement('div');e.className='checklist-item';e.innerHTML=`<div class="check-box ${item.done?'done':''}" onclick="toggleSchoolCheck(${i})">${item.done?'✓':''}</div><span class="checklist-text ${item.done?'done-text':''}">${item.text}</span><button class="bdel" onclick="removeSchoolCheck(${i})">×</button>`;c.appendChild(e)})}
window.toggleSchoolCheck=i=>{schoolChecklist.checklist[i].done=!schoolChecklist.checklist[i].done;ss(B.school,schoolChecklist);renderSchoolChecklist()};
window.removeSchoolCheck=i=>{schoolChecklist.checklist.splice(i,1);ss(B.school,schoolChecklist);renderSchoolChecklist()};

window.addFairyNote=()=>{const v=document.getElementById('fairy-note-inp').value.trim();if(!v)return;fairyNotes.unshift({text:v,date:nowS()});ss(B.fairy,fairyNotes);document.getElementById('fairy-note-inp').value='';renderFairyNotesList()};
function renderFairyNotesList(){const c=document.getElementById('fairy-notes-list');if(!c)return;c.innerHTML='';fairyNotes.slice(0,3).forEach((n,i)=>{const e=document.createElement('div');e.style.cssText='font-size:10px;padding:5px 8px;background:var(--pink-light);border-radius:8px;margin-bottom:3px;color:var(--pink-dark)';e.textContent='🧚 '+n.text;c.appendChild(e)})}

window.saveStudent=()=>{const n=document.getElementById('sm-name').value.trim();if(!n)return;students.push({id:Date.now(),name:n,grade:document.getElementById('sm-grade').value,needs:document.getElementById('sm-needs').value,strengths:document.getElementById('sm-strengths').value});ss(B.students,students);renderStudents();bCloseMo('student-modal');['sm-name','sm-needs','sm-strengths'].forEach(id=>document.getElementById(id).value='')};
function renderStudents(){const c=document.getElementById('student-list');if(!c)return;c.innerHTML='';if(!students.length){c.innerHTML='<div class="empty-s">No students added yet</div>';return}students.forEach((s,i)=>{const e=document.createElement('div');e.className='student-card';e.innerHTML=`<div style="display:flex;align-items:flex-start;gap:7px"><div style="flex:1"><div class="student-name">${s.name} <span class="tag" style="background:var(--pink-light);color:var(--pink-dark)">${s.grade}</span></div>${s.needs?`<div style="font-size:9px;font-weight:600;color:var(--muted);margin-top:3px">Working on: <span style="font-weight:400">${s.needs}</span></div>`:''} ${s.strengths?`<div style="font-size:9px;color:var(--green);margin-top:2px">✨ ${s.strengths}</div>`:''}</div><button class="bdel" onclick="removeStudent(${i})">×</button></div>`;c.appendChild(e)})}
window.removeStudent=i=>{students.splice(i,1);ss(B.students,students);renderStudents()};

let focusAreas=ls('bb_focusareas',[]);
window.addFocusArea=()=>{const v=document.getElementById('focus-area-inp').value.trim();if(!v)return;focusAreas.push(v);ss('bb_focusareas',focusAreas);document.getElementById('focus-area-inp').value='';renderFocusAreas()};
function renderFocusAreas(){const c=document.getElementById('focus-areas-list');if(!c)return;c.innerHTML='';if(!focusAreas.length){c.innerHTML='<div class="empty-s">No focus areas added</div>';return}focusAreas.forEach((f,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:6px;padding:5px 8px;background:var(--pink-light);border-radius:7px;margin-bottom:3px;font-size:11px';e.innerHTML=`<div style="width:5px;height:5px;border-radius:50%;background:var(--pink);flex-shrink:0"></div><span style="flex:1">${f}</span><button class="bdel" onclick="removeFocusArea(${i})">×</button>`;c.appendChild(e)})}
window.removeFocusArea=i=>{focusAreas.splice(i,1);ss('bb_focusareas',focusAreas);renderFocusAreas()};

window.filterMotor=(cat,btn)=>{motorFilterActive=cat;document.querySelectorAll('#motor-filter-btns .bsm').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderMotorSkills()};
function renderMotorSkills(){const c=document.getElementById('motor-skills-list');if(!c)return;c.innerHTML='';const list=motorFilterActive==='all'?MOTOR_SKILLS:MOTOR_SKILLS.filter(s=>s.cat===motorFilterActive);list.forEach(s=>{const e=document.createElement('div');e.className='motor-card';e.innerHTML=`<div class="motor-emoji">${s.emoji}</div><div><div class="motor-name">${s.name} <span class="tag" style="background:var(--pink-light);color:var(--pink-dark)">${s.cat}</span></div><div class="motor-desc">${s.desc}</div></div>`;c.appendChild(e)})}

window.addMotorWeek=()=>{const v=document.getElementById('motor-week-inp').value.trim();if(!v)return;motorWeek.push(v);ss(B.motorWeek,motorWeek);document.getElementById('motor-week-inp').value='';renderMotorWeek()};
function renderMotorWeek(){const c=document.getElementById('motor-this-week');if(!c)return;c.innerHTML='';motorWeek.forEach((item,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:6px;padding:5px 8px;background:var(--teal-light);border-radius:7px;margin-bottom:3px;font-size:11px;border:1px solid rgba(22,160,133,.2)';e.innerHTML=`<span>🎯</span><span style="flex:1">${item}</span><button class="bdel" onclick="removeMotorWeek(${i})">×</button>`;c.appendChild(e)})}
window.removeMotorWeek=i=>{motorWeek.splice(i,1);ss(B.motorWeek,motorWeek);renderMotorWeek()};

window.saveGame=()=>{const n=document.getElementById('gm-name').value.trim();if(!n)return;schoolGames.push({name:n,type:document.getElementById('gm-type').value,skills:document.getElementById('gm-skills').value,how:document.getElementById('gm-how').value,id:Date.now()});ss(B.games,schoolGames);renderGames();bCloseMo('game-modal');['gm-name','gm-skills','gm-how'].forEach(id=>document.getElementById(id).value='')};
function renderGames(){
  const inv=document.getElementById('invented-games'),cls=document.getElementById('classic-games');if(!inv||!cls)return;
  inv.innerHTML='';cls.innerHTML='';
  const myGames=schoolGames.filter(g=>g.type==='Invented');const clsGames=schoolGames.filter(g=>g.type==='Classic go-to');
  [myGames,clsGames].forEach((arr,idx)=>{
    const c=idx===0?inv:cls;
    if(!arr.length){c.innerHTML='<div class="empty-s">'+(idx===0?'Add games you\'ve invented!':'Add go-to classics')+'</div>';return}
    arr.forEach((g,i)=>{const e=document.createElement('div');e.className='game-card';e.innerHTML=`<div style="font-size:12px;font-weight:700;color:var(--text)">${g.name}</div><div style="font-size:9px;color:var(--green);margin-top:2px">${g.skills}</div>${g.how?`<div style="font-size:9px;color:var(--muted);margin-top:3px">${g.how}</div>`:''}<button class="bdel" style="position:absolute;top:6px;right:8px" onclick="removeGame(${g.id})">×</button>`;e.style.position='relative';c.appendChild(e)})
  });
}
window.removeGame=id=>{schoolGames=schoolGames.filter(g=>g.id!==id);ss(B.games,schoolGames);renderGames()};

window.addElfIdea=()=>{const v=document.getElementById('elf-inp').value.trim();if(!v)return;elfIdeas.push(v);ss(B.elf,elfIdeas);document.getElementById('elf-inp').value='';renderElfIdeas()};
function renderElfIdeas(){const c=document.getElementById('elf-ideas');if(!c)return;c.innerHTML='';elfIdeas.forEach((idea,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:flex-start;gap:6px;padding:5px 8px;background:var(--gold-light);border-radius:7px;margin-bottom:3px;font-size:11px;border:1px solid rgba(201,168,76,.2)';e.innerHTML=`<span>🎅</span><span style="flex:1">${idea}</span><button class="bdel" onclick="removeElf(${i})">×</button>`;c.appendChild(e)})}
window.removeElf=i=>{elfIdeas.splice(i,1);ss(B.elf,elfIdeas);renderElfIdeas()};

window.addSchoolFun=()=>{const v=document.getElementById('school-fun-inp').value.trim();if(!v)return;schoolFun.push({text:v,cat:document.getElementById('school-fun-cat').value});ss(B.schoolFun,schoolFun);document.getElementById('school-fun-inp').value='';renderSchoolFun()};
function renderSchoolFun(){const c=document.getElementById('school-fun-list');if(!c)return;c.innerHTML='';if(!schoolFun.length){c.innerHTML='<div class="empty-s">Add fun things to do for the school!</div>';return}const catColor={Seasonal:'#5C0300',Weekly:'#4A6FA5',Special:'#930500',Ongoing:'#4A6FA5'};schoolFun.forEach((item,i)=>{const col=catColor[item.cat]||'#888';const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:7px;padding:6px 8px;background:white;border:1px solid var(--border);border-radius:8px;margin-bottom:4px;font-size:11px';e.innerHTML=`<span class="tag" style="background:${col}18;color:${col};border:1px solid ${col}33">${item.cat}</span><span style="flex:1">${item.text}</span><button class="bdel" onclick="removeSchoolFun(${i})">×</button>`;c.appendChild(e)})}
window.removeSchoolFun=i=>{schoolFun.splice(i,1);ss(B.schoolFun,schoolFun);renderSchoolFun()};

window.saveFairyNote=()=>{const from=document.getElementById('fm-from').value.trim(),msg=document.getElementById('fm-message').value.trim();if(!msg)return;const vaultEl=document.getElementById('fairy-vault');const entry={from:from||'The Fairy',message:msg,occasion:document.getElementById('fm-occasion').value,date:nowS()};fairyNotes.push(entry);ss(B.fairy,fairyNotes);document.getElementById('fm-from').value='';document.getElementById('fm-message').value='';bCloseMo('fairy-modal');renderFairyVault()};
function renderFairyVault(){const c=document.getElementById('fairy-vault');if(!c)return;c.innerHTML='';if(!fairyNotes.length){c.innerHTML='<div class="empty-s">No fairy notes yet ✨</div>';return}fairyNotes.forEach((n,i)=>{const e=document.createElement('div');e.style.cssText='background:var(--pink-light);border:1px solid var(--border);border-radius:10px;padding:9px 11px;margin-bottom:5px;font-size:11px;position:relative';e.innerHTML=`<div style="font-size:9px;font-weight:700;color:var(--pink-dark);margin-bottom:3px">From: ${n.from||'🧚'} · ${n.occasion||''}</div><div style="line-height:1.5;font-style:italic">"${n.message}"</div>`;c.appendChild(e)})}

// ===== YOUTUBE =====
let ytVideos=ls(B.ytVideos,[{id:1,title:'Why Heathers is a feminist masterpiece',type:'Film analysis',status:'idea',notes:'Gender, class, violence as metaphor. Start with the ending.',date:''},{id:2,title:'Get ready with me — spring reset era',type:'GRWM',status:'idea',notes:'Film while doing actual spring reset routine',date:''},{id:3,title:'First doll restoration — blind Barbie rescue',type:'Doll restoration',status:'filming',notes:'Already have the dolls. Just need good lighting.',date:''},{id:4,title:'Clueless as class anxiety text',type:'Film analysis',status:'scripting',notes:'Finished journal entry, need to finish bullet points',date:''}]);
let ytIdeasFilm=ls('bb_ytidfilm',['The Craft (1996) — female rage and outsider identity','Jennifer\'s Body — male gaze commentary done right','But I\'m a Cheerleader — queer representation vs heteronormativity','Ginger Snaps — puberty as body horror masterpiece','Carrie (1976) — the original weird girl revenge fantasy']);
let ytIdeasOther=ls('bb_ytidother',[]);
let ytTrends=ls(B.ytTrends,[]);
let ytJournals=ls(B.ytJournals,[]);
let ytDeals=ls(B.ytDeals,[]);
let ytPatreon=ls(B.ytPatreon,[{name:'Weird girl supporter',price:3,desc:'Early access + BTS updates'},{name:'Film theory club',price:7,desc:'Monthly deep-dive PDF + Discord access'},{name:'Weird girl inner circle',price:15,desc:'Everything above + monthly Q&A'}]);

const YT_STAGES=['idea','research','scripting','filming','editing','thumbnail','posting'];
const YT_STAGE_LABELS={idea:'💡 Ideas',research:'🔍 Research',scripting:'✍️ Script',filming:'🎬 Filming',editing:'✂️ Editing',thumbnail:'🖼️ Thumbnail',posting:'🚀 Posted'};
const YT_STEPS=[{icon:'📓',label:'Film journal / idea research'},{icon:'•',label:'Bullet point outline'},{icon:'🎙️',label:'Record voiceover'},{icon:'🎬',label:'Collect clips & footage'},{icon:'✂️',label:'Edit video'},{icon:'📝',label:'Write description & tags'},{icon:'🖼️',label:'Create thumbnail'},{icon:'📲',label:'TikTok & Shorts repurposing'},{icon:'🚀',label:'Post & schedule'}];

function renderYTKanban(){
  const kb=document.getElementById('yt-kanban');if(!kb)return;kb.innerHTML='';
  const cols=['idea','research','scripting','filming','editing','posting'];
  const colLabels={idea:'💡 Idea',research:'🔍 Research',scripting:'✍️ Script',filming:'🎬 Filming',editing:'✂️ Editing',posting:'🚀 Posted'};
  cols.forEach(status=>{
    const col=document.createElement('div');col.className='kanban-col';
    const items=ytVideos.filter(v=>v.status===status);
    col.innerHTML=`<div class="kanban-title"><span>${colLabels[status]}</span><span class="kanban-count">${items.length}</span></div><div id="ytkb-${status}"></div>`;
    kb.appendChild(col);
    items.forEach(video=>{
      const el=document.createElement('div');el.className='kitem';
      const nextStatuses=cols.filter(s=>s!==status);
      el.innerHTML=`<div class="kitem-title">${video.title}</div><div class="kitem-meta">${video.type}</div>${video.notes?`<div style="font-size:9px;color:var(--muted);margin-top:2px;font-style:italic">${video.notes}</div>`:''}<div style="display:flex;gap:3px;margin-top:5px;flex-wrap:wrap">${nextStatuses.slice(0,3).map(s=>`<button class="bsm" style="font-size:9px;padding:2px 5px" onclick="moveVideo(${video.id},'${s}')">→ ${s}</button>`).join('')}<button class="bsm" style="font-size:9px;padding:2px 5px;color:var(--muted)" onclick="openVideoSteps(${video.id})">📋 steps</button></div>`;
      document.getElementById('ytkb-'+status).appendChild(el);
    });
  });
}

window.moveVideo=(id,status)=>{const i=ytVideos.findIndex(v=>v.id===id);if(i>=0){ytVideos[i].status=status;ss(B.ytVideos,ytVideos);renderYTKanban()}};
window.openVideoSteps=id=>{
  const video=ytVideos.find(v=>v.id===id);if(!video)return;
  const area=document.getElementById('yt-video-detail-area');
  if(!video.steps)video.steps={};
  area.innerHTML=`<div class="card" style="border:2px solid var(--pink);margin-top:.5rem">
    <div class="ct"><div class="ci">📋</div>Production checklist: <em>${video.title}</em></div>
    <div class="video-steps">${YT_STEPS.map((step,i)=>`
      <div class="vstep ${video.steps[i]?' done':''}" onclick="toggleVideoStep(${id},${i})">
        <div class="vstep-icon">${step.icon}</div>
        <div class="vstep-label">${step.label}</div>
        <div class="vstep-cb">${video.steps[i]?'✓':''}</div>
      </div>`).join('')}
    </div>
    <div style="text-align:right"><button class="bsm" onclick="document.getElementById('yt-video-detail-area').innerHTML=''">Close</button></div>
  </div>`;
};
window.toggleVideoStep=(id,stepIdx)=>{const i=ytVideos.findIndex(v=>v.id===id);if(i<0)return;if(!ytVideos[i].steps)ytVideos[i].steps={};ytVideos[i].steps[stepIdx]=!ytVideos[i].steps[stepIdx];ss(B.ytVideos,ytVideos);openVideoSteps(id)};

window.saveVideo=()=>{const t=document.getElementById('vm-title').value.trim();if(!t)return;ytVideos.push({id:Date.now(),title:t,type:document.getElementById('vm-type').value,notes:document.getElementById('vm-notes').value,status:'idea',steps:{}});ss(B.ytVideos,ytVideos);renderYTKanban();bCloseMo('video-modal');['vm-title','vm-notes'].forEach(id=>document.getElementById(id).value='')};

window.addYTIdea=(type)=>{
  if(type==='film'){const v=document.getElementById('yt-idea-film-inp').value.trim();if(!v)return;ytIdeasFilm.push(v);ss('bb_ytidfilm',ytIdeasFilm);document.getElementById('yt-idea-film-inp').value='';renderYTIdeas()}
  else{const v=document.getElementById('yt-idea-other-inp').value.trim();if(!v)return;ytIdeasOther.push({text:v,cat:document.getElementById('yt-idea-other-cat').value});ss('bb_ytidother',ytIdeasOther);document.getElementById('yt-idea-other-inp').value='';renderYTIdeas()}
};
function renderYTIdeas(){
  const cf=document.getElementById('yt-ideas-film'),co=document.getElementById('yt-ideas-other');
  if(cf){cf.innerHTML='';ytIdeasFilm.forEach((idea,i)=>{const e=document.createElement('div');e.className='idea-item';e.innerHTML=`<div class="idea-dot"></div><span style="flex:1">${idea}</span><button class="bdel" onclick="removeYTIdeaFilm(${i})">×</button>`;cf.appendChild(e)})}
  if(co){co.innerHTML='';ytIdeasOther.forEach((idea,i)=>{const e=document.createElement('div');e.className='idea-item';e.innerHTML=`<div class="idea-dot"></div><span style="flex:1">${idea.text} <span class="tag" style="background:var(--pink-light);color:var(--pink-dark)">${idea.cat}</span></span><button class="bdel" onclick="removeYTIdeaOther(${i})">×</button>`;co.appendChild(e)})}
}
window.removeYTIdeaFilm=i=>{ytIdeasFilm.splice(i,1);ss('bb_ytidfilm',ytIdeasFilm);renderYTIdeas()};
window.removeYTIdeaOther=i=>{ytIdeasOther.splice(i,1);ss('bb_ytidother',ytIdeasOther);renderYTIdeas()};

window.addYTTrend=()=>{const v=document.getElementById('yt-trend-inp').value.trim();if(!v)return;ytTrends.push(v);ss(B.ytTrends,ytTrends);document.getElementById('yt-trend-inp').value='';renderYTTrends()};
function renderYTTrends(){const c=document.getElementById('yt-trending');if(!c)return;c.innerHTML='';ytTrends.forEach((t,i)=>{const e=document.createElement('div');e.className='idea-item';e.innerHTML=`<span style="font-size:14px">🔥</span><span style="flex:1">${t}</span><button class="bdel" onclick="removeYTTrend(${i})">×</button>`;c.appendChild(e)})}
window.removeYTTrend=i=>{ytTrends.splice(i,1);ss(B.ytTrends,ytTrends);renderYTTrends()};

window.saveJournal=()=>{const film=document.getElementById('jm-film').value.trim();if(!film)return;ytJournals.push({film,thesis:document.getElementById('jm-thesis').value,themes:document.getElementById('jm-themes').value,sources:document.getElementById('jm-sources').value,date:nowS()});ss(B.ytJournals,ytJournals);renderJournals();bCloseMo('journal-modal');['jm-film','jm-thesis','jm-themes','jm-sources'].forEach(id=>document.getElementById(id).value='')};
function renderJournals(){const c=document.getElementById('journal-list');if(!c)return;c.innerHTML='';if(!ytJournals.length){c.innerHTML='<div class="empty-s">No film journals yet. Start one!</div>';return}ytJournals.forEach((j,i)=>{const e=document.createElement('div');e.style.cssText='background:white;border:1px solid var(--border);border-radius:12px;padding:10px 12px;margin-bottom:6px';e.innerHTML=`<div style="font-family:Playfair Display,serif;font-size:13px;font-weight:700;color:var(--pink-dark)">${j.film}</div><div style="font-size:9px;color:var(--muted);margin-top:2px">${j.date}</div>${j.thesis?`<div style="font-size:10px;color:var(--text);margin-top:5px;font-style:italic">${j.thesis}</div>`:''}<button class="bdel" style="float:right;margin-top:-20px" onclick="removeJournal(${i})">×</button>`;c.appendChild(e)})}
window.removeJournal=i=>{ytJournals.splice(i,1);ss(B.ytJournals,ytJournals);renderJournals()};
window.saveResearchNotes=()=>{ss('bb_ytresnotes',document.getElementById('yt-research-notes').value)};

window.saveDeal=()=>{const brand=document.getElementById('dm-brand').value.trim();if(!brand)return;ytDeals.push({brand,amount:parseFloat(document.getElementById('dm-amount').value)||0,deliverables:document.getElementById('dm-deliverables').value,status:document.getElementById('dm-status').value,date:nowS()});ss(B.ytDeals,ytDeals);renderYTDeals();bCloseMo('deal-modal');['dm-brand','dm-amount','dm-deliverables'].forEach(id=>document.getElementById(id).value='')};
function renderYTDeals(){const c=document.getElementById('yt-deals');if(!c)return;c.innerHTML='';if(!ytDeals.length){c.innerHTML='<div class="empty-s">No deals yet — pitch away!</div>';return}const statusColor={Pitched:'#888',Negotiating:var_orange='#5C0300',Confirmed:'#4A6FA5',Delivered:'#5C0300',Paid:'#4A6FA5'};ytDeals.forEach((d,i)=>{const sc=statusColor[d.status]||'#888';const e=document.createElement('div');e.className='deal-card';e.innerHTML=`<div style="display:flex;align-items:flex-start;gap:8px"><div style="flex:1"><div class="deal-brand">${d.brand}</div><div class="deal-meta">${d.deliverables||''}</div></div><span class="deal-status" style="background:${sc}18;color:${sc};border:1px solid ${sc}33">${d.status}</span><div class="money-amount">${fmtMoney(d.amount)}</div></div>`;c.appendChild(e)})}

window.addPatreonTier=()=>{const n=document.getElementById('patreon-tier-inp').value.trim(),p=parseFloat(document.getElementById('patreon-tier-price').value)||0;if(!n)return;ytPatreon.push({name:n,price:p});ss(B.ytPatreon,ytPatreon);document.getElementById('patreon-tier-inp').value='';document.getElementById('patreon-tier-price').value='';renderPatreonTiers()};
function renderPatreonTiers(){const c=document.getElementById('patreon-tiers');if(!c)return;c.innerHTML='';ytPatreon.forEach((tier,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:8px;padding:7px 9px;background:var(--purple-light);border:1px solid rgba(142,68,173,.2);border-radius:9px;margin-bottom:4px;font-size:11px';e.innerHTML=`<span style="font-size:14px">💜</span><div style="flex:1"><div style="font-weight:700;color:var(--purple)">${tier.name}</div>${tier.desc?`<div style="font-size:9px;color:var(--muted)">${tier.desc}</div>`:''}</div><div style="font-weight:700;color:var(--purple)">$${tier.price}/mo</div><button class="bdel" onclick="removePatreonTier(${i})">×</button>`;c.appendChild(e)})}
window.removePatreonTier=i=>{ytPatreon.splice(i,1);ss(B.ytPatreon,ytPatreon);renderPatreonTiers()};

// ===== MODDING =====
let modProjects=ls(B.modProjects,[{id:1,name:'Weird Barbie CAS pack',game:'sims4',desc:'Custom accessories + facial hair + unconventional outfits',status:'Idea'},{id:2,name:'Cozy cottage biome expansion',game:'minecraft',desc:'New block types, plants, and mobs for an extended cottage aesthetic',status:'Learning'}]);
let modIdeas=ls(B.modIdeas,{sims4:['Career — doll restorer / vintage curator','Trait: Perpetually Unfinished Projects (ADHD lol)','Aesthetic CAS pack: 90s Weird Kid'],minecraft:['Firefly lighting overhaul mod','Cozy furniture pack'],hytale:[],stardew:['More romanceable NPCs mod','Extended farm customization'],skyrim:['Follower that gives ADHD advice','Cozy house expansion']});
let modResources=ls(B.modResources,['Sims 4 Studio (CAS modding)','Forge documentation (Minecraft)','PyTK (Stardew Valley modding)','Creation Kit (Skyrim)']);

const MOD_WORKFLOW=[
  {icon:'💡',label:'Concept & design — what does this mod DO and why is it fun?'},
  {icon:'📚',label:'Learn the tools — watch tutorials, read docs for that specific game'},
  {icon:'🛠️',label:'Set up dev environment — IDE, game mod tools, folder structure'},
  {icon:'✏️',label:'Build a minimum version — get ONE feature working first'},
  {icon:'🧪',label:'Playtest & iterate — does it work? Is it fun? Fix bugs'},
  {icon:'📸',label:'Create screenshots & preview GIFs for release'},
  {icon:'📦',label:'Package and upload — NexusMods, CurseForge, ModDB, itch.io'},
  {icon:'📢',label:'Post about it — TikTok, YouTube, Reddit communities'},
];
const MOD_TOOLS={sims4:['Sims 4 Studio','GIMP / Photoshop for textures','Blender (for meshes)'],minecraft:['IntelliJ IDEA','Minecraft Forge or Fabric','Blockbench (3D models)'],hytale:['Hytale modding SDK (when available)','Unity experience helpful'],stardew:['SMAPI','PyTK / Json Assets','Visual Studio Code'],skyrim:['Bethesda Creation Kit','xEdit / SSEEdit','NifSkope']};

function renderModWorkflow(){const c=document.getElementById('mod-workflow-steps');if(!c)return;c.innerHTML='';MOD_WORKFLOW.forEach((step,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:flex-start;gap:9px;padding:8px 11px;background:var(--pink-light);border-radius:9px;margin-bottom:4px;font-size:11px';e.innerHTML=`<span style="font-size:16px;flex-shrink:0">${step.icon}</span><div><span style="font-weight:600;color:var(--pink-dark)">Step ${i+1}: </span>${step.label}</div>`;c.appendChild(e)})}
function renderModResources(){const c=document.getElementById('mod-resources');if(!c)return;c.innerHTML='';modResources.forEach((r,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:6px;padding:5px 8px;background:var(--blue-light);border-radius:7px;margin-bottom:3px;font-size:11px;border:1px solid rgba(41,128,185,.15)';e.innerHTML=`<span>📚</span><span style="flex:1">${r}</span><button class="bdel" onclick="removeModResource(${i})">×</button>`;c.appendChild(e)})}
window.addModResource=()=>{const v=document.getElementById('mod-resource-inp').value.trim();if(!v)return;modResources.push(v);ss(B.modResources,modResources);document.getElementById('mod-resource-inp').value='';renderModResources()};
window.removeModResource=i=>{modResources.splice(i,1);ss(B.modResources,modResources);renderModResources()};

function renderModTools(){const c=document.getElementById('mod-tools-list');if(!c)return;c.innerHTML='';Object.entries(MOD_TOOLS).forEach(([game,tools])=>{const div=document.createElement('div');div.style.marginBottom='.7rem';div.innerHTML=`<div style="font-size:10px;font-weight:700;color:var(--pink-dark);margin-bottom:3px;text-transform:capitalize">${game}</div>${tools.map(t=>`<div style="font-size:10px;color:var(--muted);padding:2px 0">• ${t}</div>`).join('')}`;c.appendChild(div)})}

let modFilter='all';
window.filterMods=(game,btn)=>{modFilter=game;document.querySelectorAll('#mod-game-filter .bsm').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderModProjects()};
window.saveModProject=()=>{const n=document.getElementById('mpm-name').value.trim();if(!n)return;modProjects.push({id:Date.now(),name:n,game:document.getElementById('mpm-game').value.toLowerCase().replace(' ',''),desc:document.getElementById('mpm-desc').value,status:document.getElementById('mpm-status').value});ss(B.modProjects,modProjects);renderModProjects();bCloseMo('mod-project-modal');['mpm-name','mpm-desc'].forEach(id=>document.getElementById(id).value='')};
function renderModProjects(){const c=document.getElementById('mod-projects-list');if(!c)return;c.innerHTML='';const list=modFilter==='all'?modProjects:modProjects.filter(p=>p.game===modFilter);if(!list.length){c.innerHTML='<div class="empty-s">No mod projects yet</div>';return}const statusColor={Idea:'#888',Learning:'#4A6FA5','In progress':'#930500',Testing:'#5C0300',Released:'#4A6FA5'};const gameEmoji={sims4:'🏠',minecraft:'⛏️',hytale:'🌲',stardew:'🌾',skyrim:'🗡️'};list.forEach((p,i)=>{const sc=statusColor[p.status]||'#888';const e=document.createElement('div');e.className='project-card';e.innerHTML=`<div style="display:flex;align-items:flex-start;gap:8px"><span style="font-size:20px">${gameEmoji[p.game]||'🎮'}</span><div style="flex:1"><div class="project-name">${p.name}</div><div style="font-size:9px;color:var(--muted);margin-top:2px">${p.game}</div>${p.desc?`<div style="font-size:10px;color:var(--text);margin-top:4px">${p.desc}</div>`:''}</div><span class="project-status" style="background:${sc}18;color:${sc};border:1px solid ${sc}33">${p.status}</span><button class="bdel" onclick="removeModProject(${i})">×</button></div>`;c.appendChild(e)})}
window.removeModProject=i=>{modProjects.splice(i,1);ss(B.modProjects,modProjects);renderModProjects()};

window.addModIdea=(game)=>{const inp=document.getElementById(`mod-idea-${game}-inp`);const v=inp.value.trim();if(!v)return;modIdeas[game]=modIdeas[game]||[];modIdeas[game].push(v);ss(B.modIdeas,modIdeas);inp.value='';renderModIdeas()};
function renderModIdeas(){['sims4','minecraft','hytale','stardew','skyrim'].forEach(game=>{const c=document.getElementById(`mod-ideas-${game}`);if(!c)return;c.innerHTML='';(modIdeas[game]||[]).forEach((idea,i)=>{const e=document.createElement('div');e.className='idea-item';e.innerHTML=`<div class="idea-dot"></div><span style="flex:1">${idea}</span><button class="bdel" onclick="removeModIdea('${game}',${i})">×</button>`;c.appendChild(e)})})}
window.removeModIdea=(game,i)=>{modIdeas[game].splice(i,1);ss(B.modIdeas,modIdeas);renderModIdeas()};

// ===== ETSY =====
let etsyListings=ls(B.etsyListings,[]);
let etsyOrders=ls(B.etsyOrders,[]);
let etsyGoals=ls(B.etsyGoals,['Get first 10 listings live','Make first sale!','Get 5-star first review','Hit $100 in sales','Set up Shop Policies']);
let etsyPhotos=ls('bb_etsyphoto',[]);
let etsyCal=ls('bb_etsycal',[]);

const ETSY_CHECKLIST=[
  {text:'Write your shop bio & story',done:false},{text:'Upload a banner and profile photo',done:false},{text:'Set up your shop policies (shipping, returns, processing time)',done:false},{text:'List your first 5 items with 10-photo max each',done:false},{text:'Research keywords with eRank or Marmalead',done:false},{text:'Join Etsy seller Facebook groups',done:false},{text:'Set up free shipping threshold ($35+)',done:false},{text:'Enable "Message with order" auto-reply',done:false},{text:'Connect Instagram to shop',done:false},{text:'Add shop video',done:false},
];
let etsyPlannerChecklist=ls('bb_etsychk',ETSY_CHECKLIST);

window.addEtsyGoal=()=>{const v=document.getElementById('etsy-goal-inp').value.trim();if(!v)return;etsyGoals.push({text:v,done:false});ss(B.etsyGoals,etsyGoals);document.getElementById('etsy-goal-inp').value='';renderEtsyGoals()};
function renderEtsyGoals(){const c=document.getElementById('etsy-goals');if(!c)return;c.innerHTML='';etsyGoals.forEach((g,i)=>{const item=typeof g==='string'?{text:g,done:false}:g;const e=document.createElement('div');e.className='checklist-item';e.innerHTML=`<div class="check-box ${item.done?'done':''}" onclick="toggleEtsyGoal(${i})">${item.done?'✓':''}</div><span class="checklist-text ${item.done?'done-text':''}">${item.text}</span>`;c.appendChild(e)})}
window.toggleEtsyGoal=i=>{if(typeof etsyGoals[i]==='string')etsyGoals[i]={text:etsyGoals[i],done:true};else etsyGoals[i].done=!etsyGoals[i].done;ss(B.etsyGoals,etsyGoals);renderEtsyGoals()};
window.saveEtsyNotes=()=>{ss('bb_etsynotes',document.getElementById('etsy-shop-notes').value)};

window.saveListing=()=>{const t=document.getElementById('lm-title').value.trim();if(!t)return;etsyListings.push({id:Date.now(),title:t,cat:document.getElementById('lm-cat').value,price:parseFloat(document.getElementById('lm-price').value)||0,status:document.getElementById('lm-status').value,date:nowS()});ss(B.etsyListings,etsyListings);renderEtsyListings();bCloseMo('listing-modal');['lm-title','lm-price'].forEach(id=>document.getElementById(id).value='')};
let listingFilter='all';
window.filterListings=(status,btn)=>{listingFilter=status;document.querySelectorAll('[onclick*="filterListings"]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderEtsyListings()};
function renderEtsyListings(){const c=document.getElementById('etsy-listings-list');if(!c)return;c.innerHTML='';const list=listingFilter==='all'?etsyListings:etsyListings.filter(l=>l.status===listingFilter);if(!list.length){c.innerHTML='<div class="empty-s">No listings yet</div>';return}const statusColor={Active:'#4A6FA5',Draft:'#888',sold_out:'#930500'};list.forEach((l,i)=>{const sc=statusColor[l.status]||'#888';const e=document.createElement('div');e.className='listing-card';e.innerHTML=`<div style="display:flex;align-items:flex-start;gap:8px"><div style="flex:1"><div class="listing-title">${l.title}</div><div class="listing-meta"><span class="tag" style="background:var(--pink-light);color:var(--pink-dark)">${l.cat}</span><span style="color:var(--green);font-weight:600">$${l.price}</span></div></div><span class="project-status" style="background:${sc}18;color:${sc};border:1px solid ${sc}33">${l.status}</span><button class="bdel" onclick="removeListing(${i})">×</button></div>`;c.appendChild(e)})}
window.removeListing=i=>{etsyListings.splice(i,1);ss(B.etsyListings,etsyListings);renderEtsyListings()};

window.saveOrder=()=>{const item=document.getElementById('om-item').value.trim();if(!item)return;const price=parseFloat(document.getElementById('om-price').value)||0;etsyOrders.push({item,price,status:document.getElementById('om-status').value,date:nowS()});ss(B.etsyOrders,etsyOrders);document.getElementById('etsy-sales').textContent=etsyOrders.length;renderEtsyOrders();updateEtsyStats();bCloseMo('order-modal');['om-item','om-price'].forEach(id=>document.getElementById(id).value='')};
function renderEtsyOrders(){const c=document.getElementById('etsy-orders-list');if(!c)return;c.innerHTML='';if(!etsyOrders.length){c.innerHTML='<div class="empty-s">No orders yet — the first one is coming!</div>';return}const statusColor={New:'#4A6FA5',Shipped:'#5C0300',Delivered:'#4A6FA5',Issue:'#930500'};etsyOrders.forEach((o,i)=>{const sc=statusColor[o.status]||'#888';const e=document.createElement('div');e.style.cssText='background:white;border:1px solid var(--border);border-radius:10px;padding:9px 12px;margin-bottom:5px;display:flex;align-items:center;gap:8px;font-size:11px';e.innerHTML=`<span style="font-size:14px">📦</span><div style="flex:1"><div style="font-weight:600">${o.item}</div><div style="font-size:9px;color:var(--muted)">${o.date}</div></div><span class="project-status" style="background:${sc}18;color:${sc};border:1px solid ${sc}33">${o.status}</span><div class="money-amount">$${o.price}</div>`;c.appendChild(e)})}
function updateEtsyStats(){const gross=etsyOrders.reduce((a,b)=>a+b.price,0);const fees=gross*0.065;document.getElementById('etsy-gross').textContent=fmtMoney(gross);document.getElementById('etsy-fees').textContent=fmtMoney(fees);document.getElementById('etsy-net').textContent=fmtMoney(gross-fees);document.getElementById('etsy-rev').textContent=fmtMoney(gross);document.getElementById('etsy-sales').textContent=etsyOrders.length}

function renderEtsyPlannerChecklist(){const c=document.getElementById('etsy-planner-checklist');if(!c)return;c.innerHTML='';etsyPlannerChecklist.forEach((item,i)=>{const e=document.createElement('div');e.className='checklist-item';e.innerHTML=`<div class="check-box ${item.done?'done':''}" onclick="toggleEtsyPlan(${i})">${item.done?'✓':''}</div><span class="checklist-text ${item.done?'done-text':''}">${item.text}</span>`;c.appendChild(e)})}
window.toggleEtsyPlan=i=>{etsyPlannerChecklist[i].done=!etsyPlannerChecklist[i].done;ss('bb_etsychk',etsyPlannerChecklist);renderEtsyPlannerChecklist()};
window.addEtsyPhoto=()=>{const v=document.getElementById('etsy-photo-inp').value.trim();if(!v)return;etsyPhotos.push({text:v,done:false});ss('bb_etsyphoto',etsyPhotos);document.getElementById('etsy-photo-inp').value='';renderEtsyPhotos()};
function renderEtsyPhotos(){const c=document.getElementById('etsy-photo-todo');if(!c)return;c.innerHTML='';etsyPhotos.forEach((item,i)=>{const e=document.createElement('div');e.className='checklist-item';e.innerHTML=`<div class="check-box ${item.done?'done':''}" onclick="toggleEtsyPhoto(${i})">${item.done?'✓':''}</div><span class="checklist-text ${item.done?'done-text':''}">${item.text}</span><button class="bdel" onclick="removeEtsyPhoto(${i})">×</button>`;c.appendChild(e)})}
window.toggleEtsyPhoto=i=>{etsyPhotos[i].done=!etsyPhotos[i].done;ss('bb_etsyphoto',etsyPhotos);renderEtsyPhotos()};
window.removeEtsyPhoto=i=>{etsyPhotos.splice(i,1);ss('bb_etsyphoto',etsyPhotos);renderEtsyPhotos()};
window.addEtsyCal=()=>{const v=document.getElementById('etsy-cal-inp').value.trim(),d=document.getElementById('etsy-cal-date').value;if(!v)return;etsyCal.push({text:v,date:d});ss('bb_etsycal',etsyCal);document.getElementById('etsy-cal-inp').value='';document.getElementById('etsy-cal-date').value='';renderEtsyCal()};
function renderEtsyCal(){const c=document.getElementById('etsy-calendar');if(!c)return;c.innerHTML='';etsyCal.sort((a,b)=>a.date.localeCompare(b.date)).forEach((item,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:8px;padding:6px 9px;background:white;border:1px solid var(--border);border-radius:8px;margin-bottom:4px;font-size:11px';e.innerHTML=`<span style="font-size:14px">📅</span><span style="flex:1">${item.text}</span>${item.date?`<span style="font-size:9px;color:var(--muted)">${item.date}</span>`:''}<button class="bdel" onclick="removeEtsyCal(${i})">×</button>`;c.appendChild(e)})}
window.removeEtsyCal=i=>{etsyCal.splice(i,1);ss('bb_etsycal',etsyCal);renderEtsyCal()};

// ===== DOLLS =====
let dollProjects=ls(B.dollProjects,[{id:1,name:'1990s Barbie lot of 6',type:'Lot to clean & sell',todo:'Wash hair, clean bodies, re-string one',price:45,status:'Queue'},{id:2,name:'Plush bunny commission',type:'Commission',todo:'Re-stuff, new button eyes, clean',price:35,status:'In progress'}]);
let dollSupplies=ls(B.dollSupplies,[{name:'MSC sealer spray',status:'Need to buy'},{name:'Acrylic paints (face painting set)',status:'Have it'},{name:'Doll stand assortment',status:'Have it'},{name:'Needle felting kit',status:'Need to buy'},{name:'Re-rooting needle',status:'Need to buy'},{name:'Doll hair fibers (various)',status:'Need to buy'}]);
let dollTechniques=ls(B.dollTechniques,['Matte face sealant BEFORE any painting — prevents smearing','Hair washing: cold water + lots of conditioner, detangle when wet','Eye repaints: seal first, thin layers of acrylic, final gloss coat','For knots in doll hair: fabric softener + warm water soak overnight','Needle felting for stuffed animals: go slow, felt in one direction']);
let dollRefs=ls(B.dollRefs,['Doll Planet YouTube — best restoration tutorials','Reddit r/Barbie — community help and ID help','Dollasticdesigns — OOAK inspiration']);

const DOLL_WORKFLOW=[{icon:'🔍',step:'Assess condition — hair, body, face, joints'},{ icon:'🛁',step:'Clean body with mild soap and warm water'},{icon:'💇',step:'Hair wash, detangle, and style/dry'},{icon:'🎨',step:'Face restoration — seal, repaint, seal again'},{icon:'🪄',step:'Any custom work — reroot, repaint, OOAK modifications'},{icon:'📸',step:'Photography — good lighting, multiple angles'},{icon:'📦',step:'List on Etsy with SEO-optimized title and description'},{icon:'📬',step:'Packaging — tissue paper, branded message, safe shipping'}];

window.filterDolls=(status,btn)=>{document.querySelectorAll('[onclick*="filterDolls"]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderDollProjects(status)};
window.saveDollProject=()=>{const n=document.getElementById('doll-name').value.trim();if(!n)return;dollProjects.push({id:Date.now(),name:n,type:document.getElementById('doll-type').value,todo:document.getElementById('doll-todo').value,price:parseFloat(document.getElementById('doll-price').value)||0,status:document.getElementById('doll-status').value});ss(B.dollProjects,dollProjects);renderDollProjects('all');bCloseMo('doll-modal');['doll-name','doll-todo','doll-price'].forEach(id=>document.getElementById(id).value='')};
function renderDollProjects(filterStatus){const c=document.getElementById('doll-projects-list');if(!c)return;c.innerHTML='';const list=!filterStatus||filterStatus==='all'?dollProjects:dollProjects.filter(p=>p.status.toLowerCase().replace(' ','_')===filterStatus);if(!list.length){c.innerHTML='<div class="empty-s">No projects in this status</div>';return}const statusColor={Queue:'#888','In progress':'#930500',Done:'#4A6FA5',Listed:'#4A6FA5',Sold:'#5C0300'};list.forEach((p,i)=>{const sc=statusColor[p.status]||'#888';const e=document.createElement('div');e.className='project-card';e.innerHTML=`<div style="display:flex;align-items:flex-start;gap:8px"><span style="font-size:20px">🎀</span><div style="flex:1"><div class="project-name">${p.name}</div><div style="font-size:9px;color:var(--muted);margin-top:2px">${p.type}</div>${p.todo?`<div style="font-size:10px;color:var(--text);margin-top:4px">To do: ${p.todo}</div>`:''}</div>${p.price?`<div style="font-weight:700;color:var(--green);font-size:12px">$${p.price}</div>`:''}<span class="project-status" style="background:${sc}18;color:${sc};border:1px solid ${sc}33">${p.status}</span><button class="bdel" onclick="removeDollProject(${i})">×</button></div>`;c.appendChild(e)})}
window.removeDollProject=i=>{dollProjects.splice(i,1);ss(B.dollProjects,dollProjects);renderDollProjects('all')};

window.addSupply=()=>{const n=document.getElementById('supply-inp').value.trim();if(!n)return;dollSupplies.push({name:n,status:document.getElementById('supply-status').value});ss(B.dollSupplies,dollSupplies);document.getElementById('supply-inp').value='';renderDollSupplies()};
function renderDollSupplies(){const c=document.getElementById('doll-supplies'),shop=document.getElementById('doll-shopping-list');if(!c)return;c.innerHTML='';if(shop)shop.innerHTML='';dollSupplies.forEach((s,i)=>{const statusColor={'Have it':'#4A6FA5','Need to buy':'#930500','Running low':'#5C0300'}[s.status]||'#888';const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:7px;padding:5px 8px;background:white;border:1px solid var(--border);border-radius:7px;margin-bottom:3px;font-size:11px';e.innerHTML=`<span style="flex:1">${s.name}</span><span class="tag" style="background:${statusColor}18;color:${statusColor};border:1px solid ${statusColor}33">${s.status}</span><button class="bdel" onclick="removeSupply(${i})">×</button>`;c.appendChild(e);if(shop&&s.status==='Need to buy'){const se=document.createElement('div');se.style.cssText='display:flex;align-items:center;gap:6px;padding:5px 8px;background:var(--red-light);border-radius:7px;margin-bottom:3px;font-size:11px;border:1px solid rgba(192,57,43,.2)';se.innerHTML=`<span>🛒</span><span>${s.name}</span>`;shop.appendChild(se)}})};
window.removeSupply=i=>{dollSupplies.splice(i,1);ss(B.dollSupplies,dollSupplies);renderDollSupplies()};

function renderDollWorkflow(){const c=document.getElementById('doll-workflow');if(!c)return;c.innerHTML='';DOLL_WORKFLOW.forEach((step,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:flex-start;gap:9px;padding:7px 10px;background:var(--pink-light);border-radius:9px;margin-bottom:4px;font-size:11px';e.innerHTML=`<span style="font-size:16px;flex-shrink:0">${step.icon}</span><span><strong>${i+1}.</strong> ${step.step}</span>`;c.appendChild(e)})}
window.addTechnique=()=>{const v=document.getElementById('technique-inp').value.trim();if(!v)return;dollTechniques.push(v);ss(B.dollTechniques,dollTechniques);document.getElementById('technique-inp').value='';renderDollTechniques()};
function renderDollTechniques(){const c=document.getElementById('doll-techniques');if(!c)return;c.innerHTML='';dollTechniques.forEach((t,i)=>{const e=document.createElement('div');e.className='idea-item';e.innerHTML=`<span style="font-size:14px">💡</span><span style="flex:1">${t}</span><button class="bdel" onclick="removeTechnique(${i})">×</button>`;c.appendChild(e)})}
window.removeTechnique=i=>{dollTechniques.splice(i,1);ss(B.dollTechniques,dollTechniques);renderDollTechniques()};
window.addDollRef=()=>{const v=document.getElementById('doll-ref-inp').value.trim();if(!v)return;dollRefs.push(v);ss(B.dollRefs,dollRefs);document.getElementById('doll-ref-inp').value='';renderDollRefs()};
function renderDollRefs(){const c=document.getElementById('doll-references');if(!c)return;c.innerHTML='';dollRefs.forEach((r,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:6px;padding:5px 8px;background:var(--blue-light);border-radius:7px;margin-bottom:3px;font-size:11px;border:1px solid rgba(41,128,185,.15)';e.innerHTML=`<span>📚</span><span style="flex:1">${r}</span><button class="bdel" onclick="removeDollRef(${i})">×</button>`;c.appendChild(e)})}
window.removeDollRef=i=>{dollRefs.splice(i,1);ss(B.dollRefs,dollRefs);renderDollRefs()};

// ===== BADDIE =====
let baddieIdeas=ls(B.baddieIdeas,[{text:'GRWM getting ready for school on a good brain day',platform:'TikTok'},{text:'Day in the life of a para-educator + content creator',platform:'Both'},{text:'OOTD: professional but make it weird girl',platform:'Instagram'},{text:'Get ready with me for a lazy content day at home',platform:'TikTok'}]);
let baddieInspo=ls(B.baddieInspo,[]);
let baddieTreatments=ls(B.baddieTreatments,[{name:'Weekly blowout',status:'Want to do'},{name:'Wax appointment',status:'Want to do'},{name:'Gel nails',status:'Want to do'},{name:'Electrolysis (PCOS jaw)',status:'Want to do'}]);
let ugcDeals=ls(B.ugcDeals,[]);
let pitches=ls(B.pitches,[]);
let baddieBrands=ls(B.baddieBrands,['e.l.f. cosmetics','NYX Professional','Amazon beauty','SHEIN','Tarte Cosmetics','ColourPop']);
let baddieMilestones=ls(B.baddieMilestones,[{text:'Post first TikTok',done:false},{text:'Hit 100 followers',done:false},{text:'First UGC deal',done:false},{text:'1,000 followers',done:false},{text:'First brand deal',done:false},{text:'10,000 followers',done:false}]);
const BADDIE_SCHEDULE=[{day:'Monday',task:'Film content for the week — batch day'},{day:'Tuesday',task:'Edit + post 1 TikTok'},{day:'Wednesday',task:'Post Instagram story / reel'},{day:'Thursday',task:'Engage with comments, DMs, explore page'},{day:'Friday',task:'Post 1-2 TikToks'},{day:'Sat/Sun',task:'Film casual content, B-roll, try new ideas'}];

window.addBaddieIdea=()=>{const v=document.getElementById('baddie-idea-inp').value.trim();if(!v)return;baddieIdeas.push({text:v,platform:document.getElementById('baddie-idea-platform').value});ss(B.baddieIdeas,baddieIdeas);document.getElementById('baddie-idea-inp').value='';renderBaddieIdeas()};
function renderBaddieIdeas(){const c=document.getElementById('baddie-ideas');if(!c)return;c.innerHTML='';baddieIdeas.forEach((idea,i)=>{const platColor={TikTok:'#930500',Instagram:'#5C0300',Both:'#5C0300','YouTube Short':'#930500'}[idea.platform]||'#888';const e=document.createElement('div');e.className='idea-item';e.innerHTML=`<div class="idea-dot"></div><span style="flex:1">${idea.text} <span class="tag" style="background:${platColor}18;color:${platColor}">${idea.platform}</span></span><button class="bdel" onclick="removeBaddieIdea(${i})">×</button>`;c.appendChild(e)})}
window.removeBaddieIdea=i=>{baddieIdeas.splice(i,1);ss(B.baddieIdeas,baddieIdeas);renderBaddieIdeas()};

window.saveBaddieAesthetic=()=>{ss('bb_aesthetic',document.getElementById('baddie-aesthetic-notes').value)};
window.addBaddieInspo=()=>{const v=document.getElementById('baddie-inspo-inp').value.trim();if(!v)return;baddieInspo.push(v);ss(B.baddieInspo,baddieInspo);document.getElementById('baddie-inspo-inp').value='';renderBaddieInspo()};
function renderBaddieInspo(){const c=document.getElementById('baddie-inspo');if(!c)return;c.innerHTML='';baddieInspo.forEach((item,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:6px;padding:5px 8px;background:var(--pink-light);border-radius:7px;margin-bottom:3px;font-size:11px';e.innerHTML=`<span>✨</span><span style="flex:1">${item}</span><button class="bdel" onclick="removeBaddieInspo(${i})">×</button>`;c.appendChild(e)})}
window.removeBaddieInspo=i=>{baddieInspo.splice(i,1);ss(B.baddieInspo,baddieInspo);renderBaddieInspo()};

window.addBaddieTreatment=()=>{const n=document.getElementById('baddie-treatment-inp').value.trim();if(!n)return;baddieTreatments.push({name:n,status:document.getElementById('baddie-treatment-status').value});ss(B.baddieTreatments,baddieTreatments);document.getElementById('baddie-treatment-inp').value='';renderBaddieTreatments()};
function renderBaddieTreatments(){const c=document.getElementById('baddie-treatments');if(!c)return;c.innerHTML='';const statusColor={'Want to do':'#888',Booked:'#4A6FA5',Done:'#4A6FA5'};baddieTreatments.forEach((t,i)=>{const sc=statusColor[t.status]||'#888';const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:7px;padding:6px 9px;background:white;border:1px solid var(--border);border-radius:9px;margin-bottom:4px;font-size:11px';e.innerHTML=`<span>💄</span><span style="flex:1">${t.name}</span><span class="tag" style="background:${sc}18;color:${sc};border:1px solid ${sc}33">${t.status}</span><button class="bdel" onclick="removeBaddieTreatment(${i})">×</button>`;c.appendChild(e)})}
window.removeBaddieTreatment=i=>{baddieTreatments.splice(i,1);ss(B.baddieTreatments,baddieTreatments);renderBaddieTreatments()};

window.saveUGCDeal=()=>{const brand=document.getElementById('ugc-brand').value.trim();if(!brand)return;ugcDeals.push({brand,rate:parseFloat(document.getElementById('ugc-rate').value)||0,deliverable:document.getElementById('ugc-deliverable').value,deadline:document.getElementById('ugc-deadline').value,status:document.getElementById('ugc-status').value,date:nowS()});ss(B.ugcDeals,ugcDeals);renderUGCDeals();bCloseMo('ugc-deal-modal');['ugc-brand','ugc-rate','ugc-deliverable'].forEach(id=>document.getElementById(id).value='')};
function renderUGCDeals(){const c=document.getElementById('ugc-deals-list');if(!c)return;c.innerHTML='';if(!ugcDeals.length){c.innerHTML='<div class="empty-s">No UGC deals yet. Start pitching! 💪</div>';return}const statusColor={Pitched:'#888',Confirmed:'#4A6FA5','In production':'#5C0300',Delivered:'#5C0300',Paid:'#4A6FA5'};ugcDeals.forEach((d,i)=>{const sc=statusColor[d.status]||'#888';const e=document.createElement('div');e.className='deal-card';e.innerHTML=`<div style="display:flex;align-items:flex-start;gap:8px"><div style="flex:1"><div class="deal-brand">${d.brand}</div><div class="deal-meta">${d.deliverable||''} ${d.deadline?'· Due: '+d.deadline:''}</div></div><span class="deal-status" style="background:${sc}18;color:${sc};border:1px solid ${sc}33">${d.status}</span><div class="money-amount">${fmtMoney(d.rate)}</div></div>`;c.appendChild(e)})}

window.savePitch=()=>{const n=document.getElementById('pt-name').value.trim(),s=document.getElementById('pt-script').value.trim();if(!n)return;pitches.push({name:n,script:s});ss(B.pitches,pitches);document.getElementById('pt-name').value='';document.getElementById('pt-script').value='';bCloseMo('pitch-modal');renderPitches()};
function renderPitches(){const c=document.getElementById('ugc-pitch-templates');if(!c)return;c.innerHTML='';if(!pitches.length){c.innerHTML='<div class="empty-s">Save your best pitch templates here</div>';return}pitches.forEach((p,i)=>{const e=document.createElement('div');e.style.cssText='background:var(--pink-light);border:1px solid var(--border);border-radius:10px;padding:9px 11px;margin-bottom:5px;cursor:pointer;font-size:11px';e.innerHTML=`<div style="font-weight:700;color:var(--pink-dark);margin-bottom:4px">${p.name}</div><div style="font-size:10px;color:var(--muted);white-space:pre-wrap;max-height:60px;overflow:hidden">${p.script}</div>`;c.appendChild(e)})}

window.addBaddieBrand=()=>{const v=document.getElementById('baddie-brand-inp').value.trim();if(!v)return;baddieBrands.push(v);ss(B.baddieBrands,baddieBrands);document.getElementById('baddie-brand-inp').value='';renderBaddieBrands()};
function renderBaddieBrands(){const c=document.getElementById('baddie-brands-wishlist');if(!c)return;c.innerHTML='';baddieBrands.forEach((b,i)=>{const e=document.createElement('div');e.style.cssText='display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--pink-light);border-radius:20px;margin:3px;font-size:10px;font-weight:600;color:var(--pink-dark)';e.innerHTML=`<span>✨</span>${b}<button class="bdel" onclick="removeBaddieBrand(${i})" style="color:var(--pink-dark)">×</button>`;c.appendChild(e)})}
window.removeBaddieBrand=i=>{baddieBrands.splice(i,1);ss(B.baddieBrands,baddieBrands);renderBaddieBrands()};

window.addBaddieMilestone=()=>{const v=document.getElementById('baddie-milestone-inp').value.trim();if(!v)return;baddieMilestones.push({text:v,done:false});ss(B.baddieMilestones,baddieMilestones);document.getElementById('baddie-milestone-inp').value='';renderBaddieMilestones()};
function renderBaddieMilestones(){const c=document.getElementById('baddie-milestones');if(!c)return;c.innerHTML='';baddieMilestones.forEach((m,i)=>{const e=document.createElement('div');e.className='checklist-item';e.innerHTML=`<div class="check-box ${m.done?'done':''}" onclick="toggleBaddieMilestone(${i})">${m.done?'✓':''}</div><span class="checklist-text ${m.done?'done-text':''}">${m.text}</span>`;c.appendChild(e)})}
window.toggleBaddieMilestone=i=>{baddieMilestones[i].done=!baddieMilestones[i].done;ss(B.baddieMilestones,baddieMilestones);renderBaddieMilestones()};

function renderBaddieSchedule(){const c=document.getElementById('baddie-schedule');if(!c)return;c.innerHTML='';BADDIE_SCHEDULE.forEach(s=>{const e=document.createElement('div');e.style.cssText='display:flex;gap:9px;padding:5px 0;border-bottom:1px solid var(--border);font-size:11px';e.innerHTML=`<span style="font-weight:700;color:var(--pink);min-width:75px;flex-shrink:0">${s.day}</span><span>${s.task}</span>`;c.appendChild(e)})}
function renderBaddieWeekly(){const c=document.getElementById('baddie-weekly');if(!c)return;c.innerHTML='';['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].forEach(day=>{const e=document.createElement('div');e.style.cssText='display:flex;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);align-items:center;font-size:11px';e.innerHTML=`<span style="font-weight:700;color:var(--pink);min-width:75px;flex-shrink:0">${day}</span><input class="inp" placeholder="What are you posting / filming today?" style="flex:1;font-size:10px;padding:4px 7px">`;c.appendChild(e)})}
function renderBaddieKanban(){const kb=document.getElementById('baddie-kanban');if(!kb)return;kb.innerHTML='';const cols=['idea','filming','editing','posted'];const colLabels={idea:'💡 Idea',filming:'🎬 Filming',editing:'✂️ Editing',posted:'✅ Posted'};cols.forEach(status=>{const col=document.createElement('div');col.className='kanban-col';col.innerHTML=`<div class="kanban-title"><span>${colLabels[status]}</span></div><div id="bkb-${status}"></div>`;kb.appendChild(col)});}

// ===== STREAMING =====
let streamGames=ls(B.streamGames,{current:['Stardew Valley','Animal Crossing: New Horizons'],backlog:['Skyrim (modded)','The Sims 4','Minecraft','Cult of the Lamb','Spiritfarer']});
let streamSeries=ls(B.streamSeries,['Comfort game Sundays — cozy low-stress games','First playthrough Fridays — blind playthroughs only','Modding showcase streams']);
let streamGoals=ls(B.streamGoals,[{text:'Set up OBS and do a test stream',done:false},{text:'50 Twitch followers',done:false},{text:'Twitch Affiliate (75 followers + 500 min broadcast)',done:false},{text:'First $1 from bits/subs',done:false},{text:'Regular streaming schedule for 1 month',done:false},{text:'100 followers',done:false}]);
let streamLog=ls(B.streamLog,[]);
let streamSetupTodo=ls('bb_streamsetup',['Download and configure OBS','Set up scenes: starting soon, main, BRB, ending','Create a Twitch account and fill in bio','Pick a channel name and branding','Set up basic overlay or find a free template','Test audio levels — mic and game audio separate','Do one private test stream before going live']);

const STREAM_SCHEDULE=[{day:'Wednesday',time:'7pm–9pm CST',game:'TBD'},{day:'Saturday',time:'2pm–5pm CST',game:'TBD'}];
const STREAM_PROMO=[{platform:'TikTok',task:'Post "going live in 1 hour" clip'},{ platform:'Twitter/X',task:'Tweet going live with stream link'},{platform:'Instagram',task:'Story with countdown sticker'},{platform:'Discord',task:'Ping server if you have one'}];

window.addStreamGame=(type)=>{const inp=document.getElementById(`stream-game-${type}-inp`);const v=inp.value.trim();if(!v)return;streamGames[type]=streamGames[type]||[];streamGames[type].push(v);ss(B.streamGames,streamGames);inp.value='';renderStreamGames()};
function renderStreamGames(){['current','backlog'].forEach(type=>{const c=document.getElementById(`stream-games-${type}`);if(!c)return;c.innerHTML='';(streamGames[type]||[]).forEach((g,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:6px;padding:5px 8px;background:white;border:1px solid var(--border);border-radius:7px;margin-bottom:3px;font-size:11px';e.innerHTML=`<span>🎮</span><span style="flex:1">${g}</span><button class="bdel" onclick="removeStreamGame('${type}',${i})">×</button>`;c.appendChild(e)})})}
window.removeStreamGame=(type,i)=>{streamGames[type].splice(i,1);ss(B.streamGames,streamGames);renderStreamGames()};

window.addStreamSeries=()=>{const v=document.getElementById('stream-series-inp').value.trim();if(!v)return;streamSeries.push(v);ss(B.streamSeries,streamSeries);document.getElementById('stream-series-inp').value='';renderStreamSeries()};
function renderStreamSeries(){const c=document.getElementById('stream-series');if(!c)return;c.innerHTML='';streamSeries.forEach((s,i)=>{const e=document.createElement('div');e.className='idea-item';e.innerHTML=`<div class="idea-dot"></div><span style="flex:1">${s}</span><button class="bdel" onclick="removeStreamSeries(${i})">×</button>`;c.appendChild(e)})}
window.removeStreamSeries=i=>{streamSeries.splice(i,1);ss(B.streamSeries,streamSeries);renderStreamSeries()};

window.addStreamGoal=()=>{const v=document.getElementById('stream-goal-inp').value.trim();if(!v)return;streamGoals.push({text:v,done:false});ss(B.streamGoals,streamGoals);document.getElementById('stream-goal-inp').value='';renderStreamGoals()};
function renderStreamGoals(){const c=document.getElementById('stream-goals');if(!c)return;c.innerHTML='';streamGoals.forEach((g,i)=>{const e=document.createElement('div');e.className='checklist-item';e.innerHTML=`<div class="check-box ${g.done?'done':''}" onclick="toggleStreamGoal(${i})">${g.done?'✓':''}</div><span class="checklist-text ${g.done?'done-text':''}">${g.text}</span>`;c.appendChild(e)})}
window.toggleStreamGoal=i=>{streamGoals[i].done=!streamGoals[i].done;ss(B.streamGoals,streamGoals);renderStreamGoals()};

window.saveNextStream=()=>{ss('bb_nextstream',{game:document.getElementById('stream-next-game').value,date:document.getElementById('stream-next-date').value,title:document.getElementById('stream-next-title').value,goals:document.getElementById('stream-next-goals').value})};
window.saveOverlayNotes=()=>{ss('bb_overlaynotes',document.getElementById('stream-overlay-notes').value)};
window.saveCommunityNotes=()=>{ss('bb_commnotes',document.getElementById('stream-community-notes').value)};

window.saveStreamLog=()=>{const game=document.getElementById('sl-game').value.trim();if(!game)return;streamLog.unshift({game,date:document.getElementById('sl-date').value,duration:document.getElementById('sl-duration').value,viewers:parseInt(document.getElementById('sl-viewers').value)||0,notes:document.getElementById('sl-notes').value});ss(B.streamLog,streamLog);renderStreamLog();bCloseMo('stream-log-modal');['sl-game','sl-date','sl-duration','sl-viewers','sl-notes'].forEach(id=>document.getElementById(id).value='')};
function renderStreamLog(){const c=document.getElementById('stream-log');if(!c)return;c.innerHTML='';if(!streamLog.length){c.innerHTML='<div class="empty-s">No streams logged yet — first one\'s coming soon!</div>';return}streamLog.slice(0,10).forEach((s,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:flex-start;gap:8px;padding:8px 10px;background:white;border:1px solid var(--border);border-radius:9px;margin-bottom:5px;font-size:11px';e.innerHTML=`<span style="font-size:16px">📺</span><div style="flex:1"><div style="font-weight:700">${s.game}</div><div style="font-size:9px;color:var(--muted);margin-top:2px">${s.date||''} ${s.duration?'· '+s.duration:''} ${s.viewers?'· Peak: '+s.viewers+' viewers':''}</div>${s.notes?`<div style="font-size:9px;color:var(--text);margin-top:3px;font-style:italic">${s.notes}</div>`:''}</div>`;c.appendChild(e)})}

function renderStreamSchedule(){const c=document.getElementById('stream-schedule');if(!c)return;c.innerHTML='';STREAM_SCHEDULE.forEach(s=>{const e=document.createElement('div');e.style.cssText='display:flex;gap:9px;padding:8px 11px;background:var(--purple-light);border:1px solid rgba(142,68,173,.2);border-radius:9px;margin-bottom:5px;font-size:11px;align-items:center';e.innerHTML=`<span>📅</span><div style="flex:1"><div style="font-weight:700;color:var(--purple)">${s.day}</div><div style="font-size:9px;color:var(--muted)">${s.time}</div></div><input class="inp" placeholder="Game..." value="${s.game!=='TBD'?s.game:''}" style="max-width:150px;font-size:10px">`;c.appendChild(e)})}

function renderStreamSetupChecklist(){const c=document.getElementById('stream-setup-checklist');if(!c)return;c.innerHTML='';streamSetupTodo.forEach((item,i)=>{const e=document.createElement('div');e.className='checklist-item';const done=typeof item==='object'?item.done:false;const text=typeof item==='object'?item.text:item;e.innerHTML=`<div class="check-box ${done?'done':''}" onclick="toggleStreamSetup(${i})">${done?'✓':''}</div><span class="checklist-text ${done?'done-text':''}">${text}</span>`;c.appendChild(e)})}
window.toggleStreamSetup=i=>{if(typeof streamSetupTodo[i]==='string')streamSetupTodo[i]={text:streamSetupTodo[i],done:true};else streamSetupTodo[i].done=!streamSetupTodo[i].done;ss('bb_streamsetup',streamSetupTodo);renderStreamSetupChecklist()};

window.addStreamSetup=()=>{const v=document.getElementById('stream-setup-inp').value.trim();if(!v)return;streamSetupTodo.push({text:v,done:false});ss('bb_streamsetup',streamSetupTodo);document.getElementById('stream-setup-inp').value='';renderStreamSetupChecklist()};

function renderStreamPromo(){const c=document.getElementById('stream-promo-plan');if(!c)return;c.innerHTML='';STREAM_PROMO.forEach(s=>{const e=document.createElement('div');e.style.cssText='display:flex;gap:8px;padding:6px 9px;background:white;border:1px solid var(--border);border-radius:8px;margin-bottom:4px;font-size:11px;align-items:center';e.innerHTML=`<span class="tag" style="background:var(--purple-light);color:var(--purple);border:1px solid rgba(142,68,173,.2)">${s.platform}</span><span>${s.task}</span>`;c.appendChild(e)})}

// ===== EMPIRE MONEY =====
function renderEmpireMoney(){
  const sections={youtube:'YouTube',modding:'Modding',etsy:'Etsy',dolls:'Dolls',baddie:'Baddie',streaming:'Streaming'};
  const sectionKeys={youtube:'yt',modding:'mod',etsy:'etsy',dolls:'doll',baddie:'baddie',streaming:'stream'};
  const colors={youtube:'#930500',modding:'#5C0300',etsy:'#5C0300',dolls:'#930500',baddie:'#5C0300',streaming:'#4A6FA5'};
  const c=document.getElementById('empire-breakdown');if(!c)return;c.innerHTML='';
  let total=0;
  Object.entries(sections).forEach(([key,label])=>{
    const sk=sectionKeys[key];
    const amt=getIncomeBySection(sk);
    total+=amt;
    const pct=amt>0?Math.min(100,Math.round(amt/Math.max(getAllIncome(),1)*100)):0;
    const e=document.createElement('div');e.style.cssText='margin-bottom:.7rem';
    e.innerHTML=`<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px"><span style="font-weight:700">${label}</span><span style="font-weight:700;color:${colors[key]}">${fmtMoney(amt)}</span></div><div style="height:10px;background:rgba(233,30,140,.07);border-radius:5px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${colors[key]};border-radius:5px;transition:width .4s"></div></div>`;
    c.appendChild(e);
  });
  document.getElementById('empire-total').textContent=fmtMoney(total+bGetSchoolPay());
  document.getElementById('empire-hustle').textContent=fmtMoney(total);
  // sync status row
  const sr=document.getElementById('sync-status-row');if(sr){sr.innerHTML='<span style="font-size:10px;color:var(--green);background:var(--green-light);border:1px solid rgba(39,174,96,.2);padding:4px 10px;border-radius:20px;">✓ Auto-syncing to Weird Girl Life Dashboard money tab</span>'}
}

function renderEmpireRoadmap(){const c=document.getElementById('empire-roadmap');if(!c)return;[{phase:'Now (2026)',action:'School paycheck $1,005/mo · bumps to $1,500 on Aug 12 · Learn the tools',color:'#5C0300'},{phase:'Q2 2026',action:'First Etsy sales + UGC deals · $100–300/mo side hustle',color:'#5C0300'},{phase:'Q3 2026',action:'YouTube monetization threshold · doll sales growing',color:'#4A6FA5'},{phase:'Q4 2026',action:'Twitch Affiliate · brand deals rolling in · $500–1k/mo hustle',color:'#4A6FA5'},{phase:'2027',action:'Patreon + mod income + YouTube ads · $1k+ side hustle',color:'#5C0300'},{phase:'Dream',action:'Full creative living · $3k+/mo · all your jobs are your passion',color:'#930500'}].forEach(r=>{const e=document.createElement('div');e.style.cssText='display:flex;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);align-items:center;font-size:11px';e.innerHTML=`<span style="font-size:10px;font-weight:700;color:${r.color};min-width:90px;flex-shrink:0">${r.phase}</span><span>${r.action}</span>`;c.appendChild(e)})}

let empireGoals=ls('bb_empgoals',[]);
window.addEmpireGoal=()=>{const v=document.getElementById('empire-goal-inp').value.trim();if(!v)return;empireGoals.push({text:v,done:false});ss('bb_empgoals',empireGoals);document.getElementById('empire-goal-inp').value='';renderEmpireGoals()};
function renderEmpireGoals(){const c=document.getElementById('empire-goals');if(!c)return;c.innerHTML='';empireGoals.forEach((g,i)=>{const e=document.createElement('div');e.className='checklist-item';e.innerHTML=`<div class="check-box ${g.done?'done':''}" onclick="toggleEmpireGoal(${i})">${g.done?'✓':''}</div><span class="checklist-text ${g.done?'done-text':''}">${g.text}</span>`;c.appendChild(e)})}
window.toggleEmpireGoal=i=>{empireGoals[i].done=!empireGoals[i].done;ss('bb_empgoals',empireGoals);renderEmpireGoals()};

// ===== INIT =====
// Restore saved text fields
document.getElementById('school-today-focus').value=schoolChecklist.focus||'';
document.getElementById('school-music-plan').value=schoolChecklist.music||'';
document.getElementById('school-quick-notes').value=schoolChecklist.quickNotes||'';
document.getElementById('yt-research-notes').value=ls('bb_ytresnotes','');
document.getElementById('etsy-shop-notes').value=ls('bb_etsynotes','');
document.getElementById('baddie-aesthetic-notes').value=ls('bb_aesthetic','');
document.getElementById('stream-overlay-notes').value=ls('bb_overlaynotes','');
document.getElementById('stream-community-notes').value=ls('bb_commnotes','');

renderSchoolChecklist();renderFairyNotesList();renderStudents();renderFocusAreas();
renderMotorSkills();renderMotorWeek();renderGames();renderElfIdeas();renderSchoolFun();renderFairyVault();
renderYTKanban();renderYTIdeas();renderYTTrends();renderJournals();renderYTDeals();renderPatreonTiers();renderBIncomeLog();
renderModProjects();renderModIdeas();renderModWorkflow();renderModResources();renderModTools();
renderEtsyListings();renderEtsyOrders();renderEtsyGoals();renderEtsyPlannerChecklist();renderEtsyPhotos();renderEtsyCal();updateEtsyStats();
renderDollProjects('all');renderDollSupplies();renderDollWorkflow();renderDollTechniques();renderDollRefs();
renderBaddieIdeas();renderBaddieInspo();renderBaddieTreatments();renderUGCDeals();renderPitches();renderBaddieBrands();renderBaddieMilestones();renderBaddieSchedule();renderBaddieWeekly();renderBaddieKanban();
renderStreamGames();renderStreamSeries();renderStreamGoals();renderStreamLog();renderStreamSchedule();renderStreamSetupChecklist();renderStreamPromo();
renderMonetizationGrids();
renderEmpireRoadmap();renderEmpireGoals();

// ===== BEFORE/AFTER GALLERY =====
let dollGallery=ls('bb_doll_gallery',[]);
function renderDollGallery(){
  const list=document.getElementById('doll-gallery-list');if(!list)return;list.innerHTML='';
  if(!dollGallery.length){list.innerHTML='<div class="empty-s">No restorations logged yet — your first before/after is going to be 🔥</div>';return}
  dollGallery.forEach((g,i)=>{
    const diffColors={Easy:'var(--green)',Medium:'var(--gold)',Hard:'var(--orange)',Nightmare:'var(--red)'};
    const stars='⭐'.repeat(parseInt(g.rating)||3);
    const e=document.createElement('div');
    e.style.cssText='background:white;border:1px solid var(--border);border-radius:12px;padding:10px 12px;margin-bottom:8px;position:relative';
    e.innerHTML=`
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
        <div><div style="font-size:12px;font-weight:700;color:var(--pink-dark)">${g.name}</div><div style="font-size:9px;color:var(--muted)">${g.type} · ${g.date} · <span style="color:${diffColors[g.difficulty]||'var(--muted)'}">${g.difficulty}</span></div></div>
        <div style="display:flex;gap:4px;align-items:center"><span style="font-size:10px">${stars}</span><button class="bdel" onclick="delGallery(${i})">✕</button></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div style="background:var(--red-light);border:1px solid rgba(192,57,43,.15);border-radius:8px;padding:6px 8px"><div style="font-size:8px;text-transform:uppercase;letter-spacing:.5px;color:var(--red);font-weight:700;margin-bottom:3px">Before</div><div style="font-size:10px;line-height:1.4">${g.before}</div></div>
        <div style="background:var(--green-light);border:1px solid rgba(39,174,96,.15);border-radius:8px;padding:6px 8px"><div style="font-size:8px;text-transform:uppercase;letter-spacing:.5px;color:var(--green);font-weight:700;margin-bottom:3px">After</div><div style="font-size:10px;line-height:1.4">${g.after}</div></div>
      </div>
    `;
    list.appendChild(e);
  });
  // Stats
  const stats=document.getElementById('gallery-stats');if(!stats)return;
  const total=dollGallery.length;
  const avgRating=total?(dollGallery.reduce((a,b)=>a+parseInt(b.rating||3),0)/total).toFixed(1):0;
  const hardest=dollGallery.filter(g=>g.difficulty==='Hard'||g.difficulty==='Nightmare').length;
  stats.innerHTML=`
    <div class="stat-card"><div class="stat-label">Total restorations</div><div class="stat-val" style="color:var(--pink)">${total}</div></div>
    <div class="stat-card"><div class="stat-label">Avg rating</div><div class="stat-val" style="color:var(--gold)">${avgRating}⭐</div></div>
    <div class="stat-card"><div class="stat-label">Hard/Nightmare</div><div class="stat-val" style="color:var(--orange)">${hardest}</div></div>
    <div class="stat-card"><div class="stat-label">Content potential</div><div class="stat-val" style="color:var(--green)">${total} videos</div></div>
  `;
}
window.addGalleryEntry=()=>{
  const name=document.getElementById('gallery-name').value.trim();if(!name)return;
  dollGallery.unshift({name,type:document.getElementById('gallery-type').value,before:document.getElementById('gallery-before').value.trim(),after:document.getElementById('gallery-after').value.trim(),difficulty:document.getElementById('gallery-difficulty').value,rating:document.getElementById('gallery-rating').value,date:new Date().toLocaleDateString()});
  ss('bb_doll_gallery',dollGallery);
  ['gallery-name','gallery-before','gallery-after'].forEach(id=>document.getElementById(id).value='');
  renderDollGallery();
  addDone('Doll restoration: '+name+' 🧸');
};
window.delGallery=i=>{dollGallery.splice(i,1);ss('bb_doll_gallery',dollGallery);renderDollGallery()};
renderDollGallery();

// ===== DOLL CONTENT IDEAS =====
let dollContentIdeas=ls('bb_doll_content',[]);
function renderDollContentIdeas(){
  const list=document.getElementById('doll-content-ideas');if(!list)return;list.innerHTML='';
  if(!dollContentIdeas.length){list.innerHTML='<div class="empty-s">Every restoration is a video waiting to happen ✨</div>';return}
  dollContentIdeas.forEach((c,i)=>{
    const typeColors={'Restoration timelapse':'var(--pink)','Before/after reveal':'var(--green)','Tutorial':'var(--blue)','Thrift haul':'var(--gold)','ASMR cleaning':'var(--purple)','Story time':'var(--orange)','Other':'var(--muted)'};
    const tc=typeColors[c.type]||'var(--muted)';
    const e=document.createElement('div');
    e.style.cssText='display:flex;align-items:center;gap:8px;padding:6px 9px;background:white;border:1px solid var(--border);border-radius:8px;margin-bottom:4px;font-size:11px';
    e.innerHTML=`<span class="tag" style="background:${tc}15;color:${tc};border:1px solid ${tc}33">${c.type}</span><span style="flex:1">${c.idea}</span><button class="bdel" onclick="delDollContent(${i})">✕</button>`;
    list.appendChild(e);
  });
}
window.addDollContent=()=>{
  const v=document.getElementById('doll-content-inp').value.trim();if(!v)return;
  dollContentIdeas.push({idea:v,type:document.getElementById('doll-content-type').value});
  ss('bb_doll_content',dollContentIdeas);document.getElementById('doll-content-inp').value='';renderDollContentIdeas();
};
window.delDollContent=i=>{dollContentIdeas.splice(i,1);ss('bb_doll_content',dollContentIdeas);renderDollContentIdeas()};
renderDollContentIdeas();

// Content tips
const dollContentTips=document.getElementById('doll-content-tips');
if(dollContentTips){
  [{tip:'Before/after reveals',why:'Highest engagement format — the transformation is addictive to watch',icon:'📸'},
   {tip:'Thrift store blind bag hauls',why:'The mystery element drives views + comments',icon:'🛒'},
   {tip:'ASMR cleaning/detangling',why:'Insanely satisfying niche — crossover audience from ASMR world',icon:'🎧'},
   {tip:'Restoration timelapse with music',why:'Short form gold for TikTok/Reels/Shorts',icon:'⏱️'},
   {tip:'"Rescue" storyline framing',why:'People love a redemption arc — even for dolls',icon:'🦸'},
   {tip:'Dollar Tree/thrift challenge',why:'Budget constraint = more creativity = more views',icon:'💵'},
   {tip:'Viewer submissions / commissions on camera',why:'Community engagement drives algorithm + loyalty',icon:'💌'}
  ].forEach(t=>{
    const e=document.createElement('div');
    e.style.cssText='display:flex;gap:8px;padding:7px 9px;background:white;border:1px solid var(--border);border-radius:9px;margin-bottom:5px;font-size:11px;align-items:flex-start';
    e.innerHTML=`<span style="font-size:15px;flex-shrink:0">${t.icon}</span><div><div style="font-weight:600">${t.tip}</div><div style="font-size:9px;color:var(--muted);margin-top:1px">${t.why}</div></div>`;
    dollContentTips.appendChild(e);
  });
}

// ===== AUTO-INIT =====
initBarbie();
