renderNav('hobbies');
window.ckTab=t=>{document.querySelectorAll('.ck-tc').forEach(c=>c.classList.remove('active'));document.querySelectorAll('.ck-tab').forEach(b=>b.classList.remove('active'));document.getElementById('ckt-'+t).classList.add('active');document.querySelectorAll('.ck-tab').forEach(b=>{if(b.textContent.toLowerCase().includes(t.substring(0,3)))b.classList.add('active')})};

// Recipe book
let recipeBook=ls('wh_recipe_book',[]);
function renderBook(){const c=document.getElementById('recipe-book');if(!c)return;c.innerHTML='';if(!recipeBook.length){c.innerHTML='<div style="text-align:center;padding:1rem;color:var(--tmut);font-size:10px;font-style:italic">Your recipe book is empty — cook something and add it!</div>';return}
recipeBook.forEach((r,i)=>{const stars='⭐'.repeat(r.rating||0)+'☆'.repeat(5-(r.rating||0));const e=document.createElement('div');e.className='recipe-card';e.innerHTML='<div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div style="font-size:12px;font-weight:700;color:#5C0300">'+r.name+'</div><div style="font-size:9px;color:var(--tmut);margin-top:2px">'+(r.cuisine||'')+(r.notes?' · '+r.notes:'')+'</div></div><div style="display:flex;gap:2px;align-items:center">'+[1,2,3,4,5].map(s=>'<button class="star-btn" onclick="rateRecipe('+i+','+s+')">'+(s<=(r.rating||0)?'⭐':'☆')+'</button>').join('')+'<button class="ri-del" style="margin-left:4px" onclick="delBook('+i+')">×</button></div></div>';c.appendChild(e)})}
window.addRecipeBook=()=>{const n=document.getElementById('rb-name').value.trim();if(!n)return;recipeBook.push({name:n,cuisine:document.getElementById('rb-cuisine').value.trim(),rating:0,notes:''});ss('wh_recipe_book',recipeBook);document.getElementById('rb-name').value='';document.getElementById('rb-cuisine').value='';renderBook()};
window.rateRecipe=(i,r)=>{recipeBook[i].rating=r;ss('wh_recipe_book',recipeBook);renderBook()};
window.delBook=i=>{recipeBook.splice(i,1);ss('wh_recipe_book',recipeBook);renderBook()};
renderBook();

// To try
let toTry=ls('wh_recipes_try',[]);
function renderTry(){const c=document.getElementById('recipes-try');if(!c)return;c.innerHTML='';if(!toTry.length){c.innerHTML='<div style="text-align:center;padding:.5rem;color:var(--tmut);font-size:10px;font-style:italic">Nothing queued up</div>';return}
toTry.forEach((r,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;gap:6px;padding:5px 8px;border:1px solid rgba(0,0,0,.07);border-radius:7px;font-size:11px;margin-bottom:3px;align-items:center';e.innerHTML='<span style="flex:1;font-weight:500">'+r.name+'</span><span style="font-size:9px;color:var(--tmut)">'+( r.source||'')+'</span><button class="ri-btn" style="font-size:9px;padding:2px 6px" onclick="triedIt('+i+')">Tried it!</button><button class="ri-del" onclick="delTry('+i+')">×</button>';c.appendChild(e)})}
window.addToTry=()=>{const n=document.getElementById('rt-name').value.trim();if(!n)return;toTry.push({name:n,source:document.getElementById('rt-source').value.trim()});ss('wh_recipes_try',toTry);document.getElementById('rt-name').value='';document.getElementById('rt-source').value='';renderTry()};
window.triedIt=i=>{const r=toTry.splice(i,1)[0];ss('wh_recipes_try',toTry);recipeBook.push({name:r.name,cuisine:'',rating:0,notes:'From: '+(r.source||'')});ss('wh_recipe_book',recipeBook);renderTry();renderBook();alert(r.name+' moved to your recipe book! Rate it there ⭐')};
window.delTry=i=>{toTry.splice(i,1);ss('wh_recipes_try',toTry);renderTry()};
renderTry();

// Archives
function renderArch(type){const c=document.getElementById('archive-'+type);if(!c)return;const items=ls('wh_cook_archive_'+type,[]);c.innerHTML='';if(!items.length){c.innerHTML='<div style="text-align:center;padding:.5rem;color:var(--tmut);font-size:10px;font-style:italic">None yet</div>';return}
items.forEach((item,i)=>{const e=document.createElement('div');e.style.cssText='padding:5px 8px;border:1px solid rgba(0,0,0,.06);border-radius:7px;margin-bottom:3px;font-size:11px;display:flex;gap:6px;align-items:flex-start;position:relative';e.innerHTML='<div style="flex:1"><span style="font-weight:600">'+item.name+'</span>'+(item.why?' — <span style="font-style:italic;color:var(--tmut)">'+item.why+'</span>':'')+'</div><button class="ri-del" onclick="delArch(\''+type+'\','+i+')">×</button>';c.appendChild(e)})}
window.addArch=type=>{const n=document.getElementById('a'+type.charAt(0)+'-name').value.trim();if(!n)return;const w=document.getElementById('a'+type.charAt(0)+'-why').value.trim();const items=ls('wh_cook_archive_'+type,[]);items.push({name:n,why:w});ss('wh_cook_archive_'+type,items);document.getElementById('a'+type.charAt(0)+'-name').value='';document.getElementById('a'+type.charAt(0)+'-why').value='';renderArch(type)};
window.delArch=(type,i)=>{const items=ls('wh_cook_archive_'+type,[]);items.splice(i,1);ss('wh_cook_archive_'+type,items);renderArch(type)};
renderArch('liked');renderArch('nope');

// Tips
let tips=ls('wh_cooking_tips',[]);
function renderTips(){const c=document.getElementById('cooking-tips');if(!c)return;c.innerHTML='';tips.forEach((t,i)=>{const e=document.createElement('div');e.style.cssText='display:flex;gap:6px;padding:5px 8px;background:white;border:1px solid rgba(0,0,0,.06);border-radius:7px;font-size:11px;margin-bottom:3px;align-items:center';e.innerHTML='<span>💡</span><span style="flex:1">'+t+'</span><button class="ri-del" onclick="delTip('+i+')">×</button>';c.appendChild(e)})}
window.addTip=()=>{const v=document.getElementById('tip-inp').value.trim();if(!v)return;tips.push(v);ss('wh_cooking_tips',tips);document.getElementById('tip-inp').value='';renderTips()};
window.delTip=i=>{tips.splice(i,1);ss('wh_cooking_tips',tips);renderTips()};
renderTips();

// T1D tips
[{t:'Pair carbs with protein + fat',d:'Slows glucose spike'},{t:'Eat within 30min of waking',d:'Stabilize blood sugar'},{t:'Prep base proteins on Sunday',d:'Low-energy day insurance'},{t:'Cauliflower rice swap',d:'Fraction of the carbs'},{t:'Test blood sugar before & 2hrs after new recipes',d:'Know YOUR body\'s response'}].forEach(tip=>{const e=document.createElement('div');e.style.cssText='display:flex;gap:8px;padding:7px 9px;background:#fef3e7;border:1px solid rgba(224,123,57,.15);border-radius:8px;margin-bottom:5px;font-size:11px';e.innerHTML='<span>🩸</span><div><div style="font-weight:600">'+tip.t+'</div><div style="font-size:9px;color:var(--tmut);margin-top:1px">'+tip.d+'</div></div>';document.getElementById('t1d-tips').appendChild(e)});
