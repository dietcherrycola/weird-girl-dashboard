renderNav('money');

let incomeLog=ls(K.income,[]);
let wishlist=ls(K.wishlist,[{name:'Electrolysis session (PCOS jaw)',cost:150,saved:0},{name:'Medical grade facial',cost:200,saved:0},{name:'Weekly blowout x4',cost:160,saved:0},{name:'Wax appointment',cost:65,saved:0}]);
function getSchoolPay(){const now=new Date();return now>=new Date(2026,7,12)?1500:1005}
function updatePay(){const p=getSchoolPay();document.getElementById('life-school-pay').textContent='$'+p.toLocaleString();document.getElementById('life-school-sub').textContent=p===1500?'monthly paycheck':'→ $1,500 from Aug 12'}
updatePay();

function renderIncome(){const list=document.getElementById('income-list');if(!list)return;list.innerHTML='';const pay=getSchoolPay();[{source:'Job (school para)',amt:pay,cat:'Primary',color:'#27ae60'},...incomeLog.slice(0,10)].forEach(item=>{const e=document.createElement('div');e.style.cssText='display:flex;align-items:center;gap:8px;padding:6px 9px;background:white;border:1px solid var(--cbr);border-radius:8px;font-size:11px;margin-bottom:4px';e.innerHTML=`<div style="width:6px;height:6px;border-radius:50%;background:${item.color||'#2980b9'};flex-shrink:0"></div><span style="font-weight:500;flex:1">${item.source}</span><span style="font-size:10px;color:var(--tmut)">${item.cat}</span><span style="font-weight:500;color:var(--green)">$${item.amt}</span>`;list.appendChild(e)});document.getElementById('total-hustle').textContent='$'+incomeLog.reduce((a,b)=>a+b.amt,0)}

function renderWishlist(){const list=document.getElementById('wish-list');if(!list)return;list.innerHTML='';wishlist.forEach((w,i)=>{const pct=Math.min(100,Math.round(w.saved/w.cost*100));const e=document.createElement('div');e.className='wish-item';e.innerHTML=`<span style="flex:1;font-weight:500">${w.name}</span><span style="font-size:10px;color:var(--tmut);margin-right:4px">$${w.saved}/$${w.cost}</span><div class="wish-progress"><div class="wish-fill" style="width:${pct}%"></div></div><button class="btn-sm primary" style="font-size:9px;padding:2px 6px;margin-left:5px" onclick="addToWish(${i})">+$5</button><button class="btn-del" onclick="delWish(${i})">×</button>`;list.appendChild(e)});document.getElementById('beauty-fund').textContent='$'+wishlist.reduce((a,b)=>a+b.saved,0)}
window.addToWish=i=>{wishlist[i].saved=Math.min(wishlist[i].cost,wishlist[i].saved+5);ss(K.wishlist,wishlist);renderWishlist()};
window.delWish=i=>{wishlist.splice(i,1);ss(K.wishlist,wishlist);renderWishlist()};
document.getElementById('wish-add-btn').onclick=()=>{const n=document.getElementById('wish-inp').value.trim(),c=parseFloat(document.getElementById('wish-cost').value)||50;if(!n)return;wishlist.push({name:n,cost:c,saved:0});ss(K.wishlist,wishlist);document.getElementById('wish-inp').value='';document.getElementById('wish-cost').value='';renderWishlist()};

const incomeModal=document.getElementById('income-modal');
document.getElementById('open-income-modal').onclick=()=>incomeModal.classList.add('open');
document.getElementById('inc-cancel').onclick=()=>incomeModal.classList.remove('open');
incomeModal.onclick=e=>{if(e.target===incomeModal)incomeModal.classList.remove('open')};
document.getElementById('inc-save').onclick=()=>{const source=document.getElementById('inc-source').value.trim(),amt=parseFloat(document.getElementById('inc-amt').value)||0;if(!source)return;incomeLog.push({source,amt,cat:document.getElementById('inc-cat').value,color:'#2980b9'});ss(K.income,incomeLog);renderIncome();incomeModal.classList.remove('open');document.getElementById('inc-source').value='';document.getElementById('inc-amt').value=''};

renderIncome();renderWishlist();

[{phase:'Now',action:'$1,005/mo job · bumps to $1,500 Aug 12 · survive & build',color:'#e67e22'},{phase:'Soon',action:'UGC brand deals · $50–200/video',color:'#f0a500'},{phase:'Q3 2026',action:'Etsy shop + first doll sales',color:'#27ae60'},{phase:'Q4 2026',action:'YouTube monetization threshold',color:'#2980b9'},{phase:'2027',action:'Patreon for mods · YouTube ad rev',color:'#8e44ad'},{phase:'Goal',action:'$3,000+/mo · beauty fund funded',color:'#c0392b'}].forEach(r=>{const e=document.createElement('div');e.style.cssText='display:flex;gap:10px;padding:6px 0;border-bottom:1px solid var(--cbr);align-items:center;font-size:11px';e.innerHTML=`<span style="font-size:10px;font-weight:500;color:${r.color};min-width:68px;flex-shrink:0">${r.phase}</span><span>${r.action}</span>`;document.getElementById('money-roadmap').appendChild(e)});
