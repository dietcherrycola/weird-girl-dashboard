renderNav('hobbies');

// ===== NAV =====
window.goGame=id=>{document.querySelectorAll('.game-page').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.gn-btn').forEach(b=>b.classList.remove('active'));document.getElementById('gp-'+id).classList.add('active');document.querySelector(`.gn-btn[onclick="goGame('${id}')"]`).classList.add('active');window.scrollTo(0,0)};

// ===== LIST SYSTEM =====
function gRender(c,k){const el=document.getElementById(c);if(!el)return;const items=ls(k,[]);el.innerHTML='';if(!items.length){el.innerHTML='<div style="text-align:center;padding:.5rem;color:var(--tmut);font-size:10px;font-style:italic;opacity:.7">Nothing yet</div>';return}items.forEach((item,i)=>{const text=typeof item==='string'?item:(item.text||item.name||'');const price=item.price?' · $'+item.price:'';const e=document.createElement('div');e.className='gi';e.innerHTML=`<span style="flex:1">${text}${price}</span><button class="gi-del" onclick="gDel('${c}','${k}',${i})">×</button>`;el.appendChild(e)})}
window.gAdd=(c,iid,k)=>{const inp=document.getElementById(iid);if(!inp)return;const v=inp.value.trim();if(!v)return;const items=ls(k,[]);items.push(v);ss(k,items);inp.value='';gRender(c,k)};
window.gDel=(c,k,i)=>{const items=ls(k,[]);items.splice(i,1);ss(k,items);gRender(c,k)};
window.gWishAdd=()=>{const n=document.getElementById('ov-wish-inp').value.trim();if(!n)return;const p=document.getElementById('ov-wish-price').value.trim();const items=ls('wh_gaming_wishlist',[]);items.push({text:n,price:p});ss('wh_gaming_wishlist',items);document.getElementById('ov-wish-inp').value='';document.getElementById('ov-wish-price').value='';gRender('ov-wishlist','wh_gaming_wishlist')};
window.gSaveText=(id,key)=>{const el=document.getElementById(id);if(el)ss(key,el.value)};
function gLoadText(id,key){const el=document.getElementById(id);if(el)el.value=ls(key,'')||''}

// ===== SESSION LOGGING =====
let sessions=ls('wh_game_sessions',[]);
window.logSession=()=>{
  const game=document.getElementById('ov-sess-game').value;
  const hours=parseFloat(document.getElementById('ov-sess-hours').value)||0;
  const note=document.getElementById('ov-sess-note').value.trim();
  if(!hours&&!note)return;
  sessions.unshift({game,hours,note,date:new Date().toLocaleDateString(),ts:Date.now()});
  ss('wh_game_sessions',sessions);document.getElementById('ov-sess-hours').value='';document.getElementById('ov-sess-note').value='';
  renderSessions();renderOvStats();
  const s=document.getElementById('ov-session-saved');s.textContent='Logged ✨';setTimeout(()=>s.textContent='',2000);
};
window.quickLog=(game,hid,nid)=>{
  const hours=parseFloat(document.getElementById(hid).value)||0;
  const note=document.getElementById(nid).value.trim();
  if(!hours&&!note)return;
  sessions.unshift({game,hours,note,date:new Date().toLocaleDateString(),ts:Date.now()});
  ss('wh_game_sessions',sessions);document.getElementById(hid).value='';document.getElementById(nid).value='';
  renderSessions();renderOvStats();addDone('Played '+game+' for '+hours+'h 🎮');
};
function renderSessions(){
  const c=document.getElementById('ov-session-log');if(!c)return;c.innerHTML='';
  if(!sessions.length){c.innerHTML='<div style="text-align:center;padding:.5rem;color:var(--tmut);font-size:10px;font-style:italic">No sessions logged yet</div>';return}
  sessions.slice(0,20).forEach((s,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;gap:6px;padding:5px 8px;border:1px solid rgba(0,0,0,.06);border-radius:7px;font-size:10px;margin-bottom:3px;align-items:center';e.innerHTML=`<span style="font-size:9px;color:var(--tmut);min-width:55px">${s.date}</span><span style="font-weight:600;color:var(--gc);min-width:80px">${s.game}</span><span style="font-weight:700">${s.hours}h</span><span style="flex:1;color:var(--tmut);font-style:italic;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.note||''}</span><button class="gi-del" onclick="delSession(${i})">×</button>`;c.appendChild(e)});
}
window.delSession=i=>{sessions.splice(i,1);ss('wh_game_sessions',sessions);renderSessions();renderOvStats()};

// OVERVIEW STATS
function renderOvStats(){
  const c=document.getElementById('ov-stats');if(!c)return;
  const week=sessions.filter(s=>Date.now()-s.ts<604800000);
  const totalHours=week.reduce((a,s)=>a+s.hours,0);
  const gamesPlayed=new Set(week.map(s=>s.game)).size;
  const totalSessions=week.length;
  const fav=week.length?Object.entries(week.reduce((a,s)=>{a[s.game]=(a[s.game]||0)+s.hours;return a},{})).sort((a,b)=>b[1]-a[1])[0]?.[0]||'—':'—';
  c.innerHTML=`<div class="session-stat"><div class="ss-val">${totalHours.toFixed(1)}</div><div class="ss-lbl">Hours this week</div></div><div class="session-stat"><div class="ss-val">${totalSessions}</div><div class="ss-lbl">Sessions</div></div><div class="session-stat"><div class="ss-val">${gamesPlayed}</div><div class="ss-lbl">Games played</div></div><div class="session-stat"><div class="ss-val" style="font-size:13px">${fav}</div><div class="ss-lbl">Most played</div></div>`;
}

// WEEKLY GOALS
let weeklyGoals=ls('wh_gaming_weekly',[]);
function renderWeeklyGoals(){
  const c=document.getElementById('ov-weekly-goals');if(!c)return;c.innerHTML='';
  if(!weeklyGoals.length){c.innerHTML='<div style="text-align:center;padding:.5rem;color:var(--tmut);font-size:10px;font-style:italic">Set some goals for this week!</div>';return}
  weeklyGoals.forEach((g,i)=>{const e=document.createElement('div');e.className='quest-item';e.onclick=()=>{weeklyGoals[i].done=!weeklyGoals[i].done;ss('wh_gaming_weekly',weeklyGoals);renderWeeklyGoals()};e.innerHTML=`<div class="quest-cb ${g.done?'done':''}">${g.done?'✓':''}</div><span class="quest-text ${g.done?'done-t':''}" style="flex:1">${g.text}</span><button class="gi-del" onclick="event.stopPropagation();weeklyGoals.splice(${i},1);ss('wh_gaming_weekly',weeklyGoals);renderWeeklyGoals()">×</button>`;c.appendChild(e)});
}
window.addWeeklyGoal=()=>{const v=document.getElementById('ov-wg-inp').value.trim();if(!v)return;weeklyGoals.push({text:v,done:false});ss('wh_gaming_weekly',weeklyGoals);document.getElementById('ov-wg-inp').value='';renderWeeklyGoals()};

// ===== SAVE FILE SYSTEM =====
const SAVE_GAMES=['skyrim','sims4','stardew','minecraft','hytale','echos'];
const MAX_SAVES=8;
function svInit(){SAVE_GAMES.forEach(game=>{const saves=ls('sv_'+game,[{name:'Save 1',slot:0}]);const sel=document.getElementById(game+'-sv-sel');if(!sel)return;sel.innerHTML='';saves.forEach((s,i)=>{const o=document.createElement('option');o.value=i;o.textContent=s.name||('Save '+(i+1));sel.appendChild(o)});if(saves.length<MAX_SAVES){const o=document.createElement('option');o.value='new';o.textContent='+ New save';sel.appendChild(o)}const ne=document.getElementById(game+'-sv-name');if(ne&&saves[0])ne.value=saves[0].name||''})}
window.svSwitch=game=>{const sel=document.getElementById(game+'-sv-sel');if(!sel)return;const saves=ls('sv_'+game,[{name:'Save 1',slot:0}]);if(sel.value==='new'){if(saves.length>=MAX_SAVES){alert('Max 8 saves!');sel.value=0;return}saves.push({name:'Save '+(saves.length+1),slot:saves.length});ss('sv_'+game,saves);svInit();sel.value=saves.length-1}const ne=document.getElementById(game+'-sv-name');const idx=parseInt(sel.value)||0;if(ne&&saves[idx])ne.value=saves[idx].name||''};
window.svLabel=game=>{const sel=document.getElementById(game+'-sv-sel');const ne=document.getElementById(game+'-sv-name');if(!sel||!ne)return;const saves=ls('sv_'+game,[{name:'Save 1',slot:0}]);const idx=parseInt(sel.value)||0;if(saves[idx]){saves[idx].name=ne.value;ss('sv_'+game,saves);const opt=sel.options[idx];if(opt)opt.textContent=ne.value||('Save '+(idx+1))}};
window.svSaveChar=game=>{const c=document.getElementById(game+'-char')?.value||'';const r=document.getElementById(game+'-race')?.value||'';const b=document.getElementById(game+'-build')?.value||'';ss('wh_'+game+'_char',{name:c,race:r,build:b});const d=document.getElementById(game+'-char-display');if(d)d.textContent=`${r} ${b} — ${c||'Unnamed'}`};

// ===== SKYRIM QUESTLINES =====
const SKY_QUESTS=['Main Quest (Dragonborn)','Companions','College of Winterhold','Thieves Guild','Dark Brotherhood','Civil War (Stormcloaks)','Civil War (Imperial)','Dragonborn DLC','Dawnguard DLC','Bards College','Daedric Artifacts (15 total)'];
function renderSkyrimQuests(){
  const c=document.getElementById('skyrim-questlines');if(!c)return;c.innerHTML='';
  const data=ls('wh_skyrim_questlines',{});
  let done=0;
  SKY_QUESTS.forEach((q,i)=>{const d=data[i];if(d)done++;const e=document.createElement('div');e.className='quest-item';e.onclick=()=>{data[i]=!data[i];ss('wh_skyrim_questlines',data);renderSkyrimQuests()};e.innerHTML=`<div class="quest-cb ${d?'done':''}">${d?'✓':''}</div><span class="quest-text ${d?'done-t':''}">${q}</span>`;c.appendChild(e)});
  const pct=document.getElementById('sky-quest-pct');if(pct)pct.textContent=done+'/'+SKY_QUESTS.length+' complete';
}
renderSkyrimQuests();

// ===== DAILY CHECKLISTS =====
function renderDaily(cid,tasks,sk,color){
  const c=document.getElementById(cid);if(!c)return;c.innerHTML='';
  const today=new Date().toISOString().split('T')[0];
  let d=ls(sk,{});if(d.date!==today)d={date:today,checks:{}};
  let done=0;
  tasks.forEach((t,i)=>{const dn=d.checks[i];if(dn)done++;const lbl=document.createElement('label');lbl.className='daily-item';lbl.innerHTML=`<input type="checkbox" ${dn?'checked':''} style="accent-color:${color}"><span style="${dn?'text-decoration:line-through;opacity:.5':''}">${t}</span>`;lbl.querySelector('input').onchange=()=>{d.checks[i]=!d.checks[i];ss(sk,d);renderDaily(cid,tasks,sk,color)};c.appendChild(lbl)});
  const bar=document.createElement('div');bar.className='daily-bar';bar.innerHTML=`<div class="daily-fill" style="width:${Math.round(done/tasks.length*100)}%;background:${color}"></div>`;c.appendChild(bar);
  const lbl=document.createElement('div');lbl.style.cssText='font-size:9px;color:var(--tmut);text-align:center;margin-top:3px';lbl.textContent=done+'/'+tasks.length+' done today';c.appendChild(lbl);
}

// STARDEW DAILY
renderDaily('stardew-daily',['Water all crops','Check animals (pet, milk, collect eggs)','Check Traveling Cart (Fri/Sun)','Harvest ripe crops','Process artisan goods','Check crab pots','Forage around town','Check mail & TV (Queen of Sauce on Sundays!)','Talk to villagers (2+ per day for friendship)','Check mines/skull cavern if energy allows'],'wh_stardew_daily','#5a8c3c');

// ACNH DAILY
const ACNH_DAILIES=['Check in at Resident Services','Hit money rock (8 hits!)','Dig up fossils (4 per day)','Check Nook\'s Cranny','Check Able Sisters','Shake trees for furniture','Collect shells on beach','Talk to villagers','Water flowers','Check message bottle','Pick weeds','Shoot balloon presents'];
renderDaily('acnh-daily',ACNH_DAILIES,'wh_acnh_daily','#3d9e5e');

// ACNH STREAK
function updateACNHStreak(){const streak=ls('wh_acnh_streak',{count:0,lastDate:null,history:[]});const today=new Date().toISOString().split('T')[0];const data=ls('wh_acnh_daily',{});const done=data.date===today?Object.values(data.checks).filter(Boolean).length:0;if(done>=6&&streak.lastDate!==today){streak.count++;streak.lastDate=today;streak.history.push({date:today,done});ss('wh_acnh_streak',streak)}document.getElementById('acnh-streak-num').textContent=streak.count;const hist=document.getElementById('acnh-history');if(!hist)return;hist.innerHTML='';(streak.history||[]).slice(-14).forEach(h=>{const dot=document.createElement('div');dot.style.cssText=`width:12px;height:12px;border-radius:3px;background:#3d9e5e;opacity:${h.done/ACNH_DAILIES.length}`;dot.title=h.date+': '+h.done+'/'+ACNH_DAILIES.length;hist.appendChild(dot)})}
updateACNHStreak();

// ===== STARDEW SEASON GUIDE =====
[{s:'🌸 Spring',tips:'Best crops: Strawberries (from Egg Festival day 13!), Cauliflower, Potatoes. Fish: Legend (rainy day, Mountain Lake). Events: Egg Festival (13th), Flower Dance (24th). Forage: Leek, Daffodil, Dandelion, Spring Onion.'},
{s:'☀️ Summer',tips:'Best crops: Blueberries (multi-harvest!), Starfruit (Oasis), Melons. Fish: Super Cucumber, Octopus (night). Events: Luau (11th), Dance of Moonlight Jellies (28th). Start saving for Fall seeds!'},
{s:'🍂 Fall',tips:'Best crops: Cranberries (multi-harvest!), Pumpkins, Artichokes. Fish: Walleye (rainy night). Events: Stardew Valley Fair (16th) — display 9 best items! Spirit\'s Eve (27th). LAST chance to complete Community Center bundles before Winter.'},
{s:'❄️ Winter',tips:'No crops (unless greenhouse/ginger island). Focus on: Mining, fishing, upgrading tools, socializing. Fish: Squid (night), Sturgeon (for Caviar). Forage: Crystal Fruit, Crocus, Holly, Snow Yam. Perfect time to redesign farm layout.'}
].forEach(season=>{const e=document.createElement('div');e.className='guide-block';e.innerHTML=`<div class="guide-h">${season.s}</div><div class="guide-p">${season.tips}</div>`;document.getElementById('stardew-seasons').appendChild(e)});

// ===== TIPS =====
function renderTips(containerId, tips){
  const c=document.getElementById(containerId);if(!c)return;
  tips.forEach(t=>{const e=document.createElement('div');e.className='tip-card';e.innerHTML=`<span class="tip-icon">${t.icon||'💡'}</span><div><div style="font-weight:600">${t.tip}</div>${t.detail?'<div style="font-size:9px;color:var(--tmut);margin-top:2px">'+t.detail+'</div>':''}</div>`;c.appendChild(e)});
}
renderTips('skyrim-tips',[
  {icon:'⚔️',tip:'Don\'t spread skill points too thin',detail:'Pick 3-4 skills to focus on. A focused build dominates, a scattered build struggles.'},
  {icon:'🛡️',tip:'Smithing + Enchanting = god mode',detail:'Level both to 100 and you can make gear stronger than anything you\'ll find.'},
  {icon:'💰',tip:'Transmute iron ore → gold ore → gold jewelry → enchant → sell',detail:'Best money loop in the game. Transmute spell found in Halted Stream Camp.'},
  {icon:'🏃',tip:'Sneak everywhere early game',detail:'Sneak levels fast, and sneak attack bonuses are insane (15x dagger, 3x bow).'},
  {icon:'🗺️',tip:'Get a horse ASAP',detail:'Costs 1000g at Whiterun stables. Can climb mountains at absurd angles.'},
  {icon:'📚',tip:'Sell enchanted gear to level Speech',detail:'Higher value items = more Speech XP. Enchant cheap daggers with Banish Daedra.'}
]);
renderTips('sims-tips',[
  {icon:'💡',tip:'bb.moveobjects on',detail:'The #1 build cheat. Place objects anywhere, clip through walls, stack items.'},
  {icon:'🏠',tip:'Hold Alt while placing objects',detail:'Free placement — objects snap to a finer grid instead of the normal one.'},
  {icon:'💰',tip:'motherlode / rosebud',detail:'50k / 1k simoleons. Or use: money [amount] for exact amounts.'},
  {icon:'🎭',tip:'MCCommand Center mod is essential',detail:'Automates story progression, fixes bugs, adds control. The #1 mod for gameplay.'},
  {icon:'📸',tip:'Tab mode for screenshots',detail:'Press Tab in live mode for cinematic camera. Use C to capture.'},
  {icon:'🌳',tip:'Legacy tip: write a family bio for each generation',detail:'Future you will forget storylines. Keep notes in the legacy tracker above!'}
]);
renderTips('stardew-tips',[
  {icon:'⛏️',tip:'Bring food to the mines for healing',detail:'Common Gold Star Cheese from cows heals 225 energy and 101 health.'},
  {icon:'🌾',tip:'Quality Sprinklers by Summer Year 1',detail:'Iron bar + Gold bar + Refined Quartz. Automates watering = way more free time.'},
  {icon:'💕',tip:'Loved gifts: check the Wiki',detail:'Each villager has 2 "loved" gifts. Giving loved gifts = fastest friendship.'},
  {icon:'💰',tip:'Ancient Fruit + Greenhouse = infinite money',detail:'Once you get one Ancient Fruit seed, you can fill the greenhouse and make wine forever.'},
  {icon:'🎣',tip:'Level Fishing early — it gets easier',detail:'Fishing feels impossible at level 1. By level 5 it\'s actually fun.'}
]);
renderTips('mc-tips',[
  {icon:'⛏️',tip:'Never dig straight down',detail:'Classic rule. Always dig stairs or stand on the edge of a block.'},
  {icon:'🛏️',tip:'Sleep on Day 1',detail:'Skipping the first night avoids hostile mobs before you have gear.'},
  {icon:'💎',tip:'Diamonds spawn between Y -64 and Y 16',detail:'Best level is Y -59. Use Fortune III pickaxe for multiple drops.'},
  {icon:'🏠',tip:'Build a starter base on Day 1',detail:'Dirt hut counts. Just need walls, a door, a crafting table, and a furnace.'},
  {icon:'🔥',tip:'Smelt while you mine',detail:'Bring a furnace to the mine. Process ores while you keep digging.'}
]);
renderTips('dbd-tips',[
  {icon:'🏃',tip:'Windows are stronger than pallets',detail:'A well-timed vault wastes more of the killer\'s time than dropping a pallet.'},
  {icon:'👂',tip:'Listen for the heartbeat (Terror Radius)',detail:'It tells you how close the killer is. Learn the different sounds for different killers.'},
  {icon:'🎯',tip:'Do gens. Seriously.',detail:'Hiding in lockers or urban evading around the map loses games. Do generators.'},
  {icon:'🔪',tip:'As killer: patrol gens, don\'t chase one survivor forever',detail:'If a chase takes more than 30 seconds, break off and pressure gens.'},
  {icon:'💀',tip:'Learn 2-3 killers well rather than all of them',detail:'Muscle memory and map knowledge matter more than having every killer at level 10.'}
]);
renderTips('acnh-tips',[
  {icon:'💰',tip:'Hit rocks for 8 resources',detail:'Dig 2 holes behind you so you don\'t bounce back. Hit fast — each rock gives 8 drops.'},
  {icon:'🌺',tip:'Water flowers to breed hybrids',detail:'Place flowers in a checkerboard pattern. Water daily. Rare colors take time but are worth it.'},
  {icon:'🎈',tip:'Balloons spawn every 5 minutes',detail:'They come from one side of the island. Stand on the beach and listen for the whoosh sound.'},
  {icon:'🏝️',tip:'Use the Happy Island Designer to plan',detail:'eugeneration.github.io/happy-island-designer — plan before you terraform!'},
  {icon:'📦',tip:'Always buy the item of the day at Nook\'s',detail:'The daily special rotates. Some rare items only appear a few times ever.'}
]);

// ===== INIT ALL LISTS =====
const ALL_LISTS=[
  ['ov-current','wh_gaming_current'],['ov-backlog','wh_gaming_backlog'],['ov-completed','wh_gaming_completed'],['ov-wishlist','wh_gaming_wishlist'],
  ['skyrim-mods','wh_skyrim_mods'],
  ['sims-households','wh_sims_households'],['sims-builds','wh_sims_builds'],['sims-challenges','wh_sims_challenges'],['sims-packs','wh_sims_packs'],['sims-packs-wish','wh_sims_packs_wish'],['sims-cc','wh_sims_cc'],['sims-cc-want','wh_sims_cc_want'],
  ['stardew-goals','wh_stardew_goals'],['stardew-rels','wh_stardew_rels'],
  ['mc-worlds','wh_mc_worlds'],['mc-builds','wh_mc_builds'],['mc-achievements','wh_mc_achievements'],['mc-mods','wh_mc_mods'],
  ['hytale-plans','wh_hytale_plans'],['hytale-news','wh_hytale_news'],
  ['echos-villagers','wh_echos_villagers'],['echos-goals','wh_echos_goals'],
  ['dbd-killers','wh_dbd_killers'],['dbd-survivors','wh_dbd_survivors'],['dbd-perks','wh_dbd_perks'],['dbd-builds','wh_dbd_builds'],
  ['acnh-villagers','wh_acnh_villagers'],['acnh-dreamvils','wh_acnh_dreamvils'],['acnh-wishlist','wh_acnh_wishlist'],
];
ALL_LISTS.forEach(([c,k])=>gRender(c,k));
['ov-notes/wh_gaming_notes','skyrim-quests/wh_skyrim_quests','skyrim-notes/wh_skyrim_notes','sims-notes/wh_sims_notes','sims-legacy/wh_sims_legacy','stardew-notes/wh_stardew_notes','mc-notes/wh_mc_notes','hytale-hype/wh_hytale_hype','echos-notes/wh_echos_notes','dbd-notes/wh_dbd_notes','acnh-design-notes/wh_acnh_design'].forEach(p=>{const[id,key]=p.split('/');gLoadText(id,key)});
const sc=ls('wh_skyrim_char',null);
if(sc){const d=document.getElementById('skyrim-char-display');if(d)d.textContent=`${sc.race||''} ${sc.build||''} — ${sc.name||'Unnamed'}`;if(document.getElementById('skyrim-char'))document.getElementById('skyrim-char').value=sc.name||'';if(document.getElementById('skyrim-race'))document.getElementById('skyrim-race').value=sc.race||'';if(document.getElementById('skyrim-build'))document.getElementById('skyrim-build').value=sc.build||''}
svInit();renderSessions();renderOvStats();renderWeeklyGoals();
