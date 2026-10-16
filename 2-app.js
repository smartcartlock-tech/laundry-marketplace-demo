/* וולט למכבסות — אב־טיפוס דמו (ללא שרת; נתונים לוקליים בלבד) */
const LAUNDRIES=[
{id:'achuza',name:'מכבסת האחוזה',letter:'א',color:'#0e7a8a',rating:4.8,rc:212,from:25,win:'איסוף היום 14:00–16:00',open:true,badge:'הכי קרוב',svc:['כביסה','ניקוי יבש','גיהוץ'],
 items:[{n:'שק כביסה 8 ק״ג',p:56},{n:'חולצה — כביסה וקיפול',p:8},{n:'מכנסיים — כביסה וגיהוץ',p:12},{n:'חליפה — ניקוי יבש',p:45},{n:'שמיכת פוך — ניקוי',p:70}],
 revs:[{a:'דנה כ.',t:'שירות מעולה, הכביסה חזרה ריחנית ומקופלת. האיסוף היה בזמן!'},{a:'משה ל.',t:'מחיר הוגן ומהיר. ממליץ.'}]},
{id:'express',name:'כביסה אקספרס',letter:'כ',color:'#c26a12',rating:4.6,rc:98,from:22,win:'איסוף מחר 09:00',open:true,badge:'מחיר',
 items:[{n:'שק כביסה 8 ק״ג',p:49},{n:'חולצה — כביסה וקיפול',p:7},{n:'מכנסיים — כביסה וגיהוץ',p:11},{n:'שמיכה — כביסה',p:55}],
 revs:[{a:'רותי ש.',t:'זול ומהיר, בדיוק מה שצריך באמצע שבוע.'}]},
{id:'mumchim',name:'ניקוי יבש המומחים',letter:'נ',color:'#3557c9',rating:4.9,rc:340,from:30,win:'איסוף היום 18:00–20:00',open:true,badge:'מומחים',svc:['ניקוי יבש'],
 items:[{n:'חליפה — ניקוי יבש',p:45},{n:'שמלה — ניקוי יבש',p:38},{n:'מעיל — ניקוי יבש',p:52},{n:'מפה — ניקוי יבש',p:25}],
 revs:[{a:'אבי ר.',t:'החליפה חזרה כמו חדשה. שווה כל שקל.'}]},
{id:'carmel',name:'מכבסת הכרמל',letter:'ה',color:'#178a4c',rating:4.7,rc:156,from:24,win:'איסוף היום 16:00–18:00',open:true,
 items:[{n:'שק כביסה 8 ק״ג',p:52},{n:'חולצה — כביסה וקיפול',p:8},{n:'שטיח קטן — ניקוי',p:60}],
 revs:[{a:'יוסי מ.',t:'איסוף מהבית זה game changer.'}]},
{id:'sharon',name:'כביסת השרון',letter:'ש',color:'#7c5cbf',rating:4.7,rc:203,from:26,win:'איסוף מחר 11:00',open:false,
 items:[{n:'שק כביסה 8 ק״ג',p:54},{n:'חולצה — כביסה וקיפול',p:9},{n:'וילון — ניקוי',p:48}],
 revs:[{a:'נועה ב.',t:'שירות אדיב, חבל שסגור היום.'}]},
{id:'butik',name:'בוטיק כביסה',letter:'ב',color:'#b23b6d',rating:4.5,rc:87,from:36,win:'איסוף היום 18:00–20:00',open:true,
 items:[{n:'שק כביסה יוקרה 6 ק״ג',p:75},{n:'חולצת משי — טיפול עדין',p:22},{n:'שמלת ערב — ניקוי',p:95}],
 revs:[{a:'לימור א.',t:'טיפול עדין בבגדים יקרים. מקצוענים.'}]}
];
const STATUSES=['נאסף','בעבודה','מוכן','בדרך','הוחזר'];
const $=s=>document.querySelector(s);
const store={
 get(k,d){try{const v=localStorage.getItem('wlm_'+k);return v?JSON.parse(v):d}catch(e){return d}},
 set(k,v){localStorage.setItem('wlm_'+k,JSON.stringify(v))}
};
let state={cart:store.get('cart',[]),orders:store.get('orders',[]),points:store.get('points',420),user:store.get('user',null),
 courier:store.get('courier',null),demoOrders:store.get('demoOrders',null)};
function save(){store.set('cart',state.cart);store.set('orders',state.orders);store.set('points',state.points);store.set('user',state.user);store.set('courier',state.courier);store.set('demoOrders',state.demoOrders)}
function toast(m){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function L(id){return LAUNDRIES.find(l=>l.id===id)}
function cartTotal(){return state.cart.reduce((s,c)=>s+c.p*c.q,0)}
function cartCount(){return state.cart.reduce((s,c)=>s+c.q,0)}

/* ---- tabs ---- */
const TABS=[['#/','⌂','בית'],['#/orders','▤','הזמנות'],['#/club','★','מועדון'],['#/courier','▸','שליח'],['#/manage','⚙','ניהול']];
function renderTabs(route){$('#tabs').innerHTML='<div class="in">'+TABS.map(t=>`<a href="${t[0]}" class="${route===t[0]||(t[0]!=='#/'&&route.startsWith(t[0]))?'on':''}"><span class="ic">${t[1]}</span>${t[2]}</a>`).join('')+'</div>'}

/* ---- views ---- */
function vHome(q){
 const list=LAUNDRIES.filter(l=>!q||l.name.includes(q)||(l.svc&&l.svc.join().includes(q)));
 return `<div class="demo">דמו אינטראקטיבי · נתונים לצורך הדגמה בלבד</div>
 <div class="hdr" style="text-align:center;padding-top:26px">
  <div class="big">וולט למכבסות</div>
  <p style="font-size:13px">כל המכבסות באזורך — במקום אחד</p>
  <p style="font-size:11.5px">השוואת מחירים וזמני אספקה · איסוף והחזרה עד הבית · מועדון הטבות</p>
  <div class="searchbar" style="margin-top:14px"><input id="q" placeholder="שכונה, עיר, שירות…" value="${esc(q||'')}" onkeydown="if(event.key==='Enter')go('#/?q='+encodeURIComponent(this.value))"><button class="go" onclick="go('#/?q='+encodeURIComponent($('#q').value))">חיפוש</button></div>
 </div>
 <div class="body">
  <div style="margin:4px 2px 10px">
   <span class="chip on" onclick="go('#/')">הכל</span><span class="chip" onclick="go('#/?q=כביסה')">כביסה</span><span class="chip" onclick="go('#/?q=ניקוי יבש')">ניקוי יבש</span><span class="chip" onclick="go('#/?q=גיהוץ')">גיהוץ</span><span class="chip" onclick="go('#/?q=שטיח')">שטיחים</span>
  </div>
  ${list.map(l=>`<div class="card lcard" style="cursor:pointer" onclick="go('#/laundry/${l.id}')">
    <span class="logo" style="background:${l.color}">${l.letter}</span>
    <div style="flex:1">
     <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><b>${l.name}</b>${l.open?'<span class="tag tg">היום</span>':'<span class="tag to">מחר</span>'}${l.badge?`<span class="tag tb">${l.badge}</span>`:''}</div>
     <div class="mut" style="margin-top:3px"><span class="stars">★</span> ${l.rating} (${l.rc}) · החל מ־₪${l.from} לק״ג</div>
     <div class="mut">${l.win}</div>
    </div>
    <span style="color:#8a99a3">‹</span>
   </div>`).join('')||'<div class="card mut">לא נמצאו מכבסות מתאימות</div>'}
  <div class="note">✓ מעל 120 מכבסות מחוברות · ממוצע דירוג 4.8 · איסוף באותו יום באזורים נבחרים</div>
 </div>`;
}

function vLaundry(id){
 const l=L(id);if(!l)return vHome();
 const cartItems=state.cart.filter(c=>c.lid===id);
 return `<div class="demo">דמו אינטראקטיבי · נתונים לצורך הדגמה בלבד</div>
 <div class="hdr">
  <div style="display:flex;gap:12px;align-items:center">
   <span class="logo" style="background:${l.color}">${l.letter}</span>
   <div><h2>${l.name}</h2><p><span class="stars">★</span> ${l.rating} (${l.rc} ביקורות) · ${l.open?'פתוח — '+l.win:'סגור כרגע — '+l.win}</p></div>
  </div>
 </div>
 <div class="body">
  <div style="margin:2px 2px 8px"><span class="chip on">מחירון</span><span class="chip" onclick="toast('מידע: שעות פעילות 08:00–20:00 · אזורי איסוף: המרכז')">מידע</span><span class="chip" onclick="document.getElementById('revs').scrollIntoView({behavior:'smooth'})">ביקורות</span></div>
  <div class="card">
   <div class="sec" style="margin-top:0">מחירון</div>
   ${l.items.map((it,i)=>{const c=state.cart.find(c=>c.lid===id&&c.i===i);return `<div class="row">
     <div><div style="font-weight:600;font-size:13.5px">${it.n}</div><div class="mut">₪${it.p}</div></div>
     ${c?`<span class="stepper"><button onclick="dec('${id}',${i})">−</button><b>${c.q}</b><button onclick="inc('${id}',${i})">+</button></span>`
        :`<button class="btn2" onclick="inc('${id}',${i})">הוספה +</button>`}
    </div>`}).join('')}
  </div>
  <div class="card">
   <div class="sec" style="margin-top:0">חלון איסוף</div>
   <span class="chip on">היום 14:00–16:00</span><span class="chip">היום 18:00–20:00</span><span class="chip">מחר 09:00–11:00</span>
  </div>
  <div id="revs" class="card">
   <div class="sec" style="margin-top:0">ביקורות</div>
   ${l.revs.map(r=>`<div class="row"><div><b style="font-size:13px">${r.a}</b><div class="mut">${r.t}</div></div><span class="stars">★★★★★</span></div>`).join('')}
  </div>
  ${cartItems.length?`<button class="btn" onclick="go('#/cart')">לסל · ${cartCount()} פריטים · ₪${cartTotal()}</button>`:''}
 </div>`;
}

function vCart(){
 if(!state.cart.length)return `<div class="demo">דמו אינטראקטיבי · נתונים לצורך הדגמה בלבד</div><div class="hdr"><h2>הסל שלי</h2></div><div class="body"><div class="card mut" style="text-align:center;padding:34px">הסל ריק — בחרו מכבסה ופריטים</div><button class="btn" onclick="go('#/')">חיפוש מכבסות</button></div>`;
 const lid=state.cart[0].lid,l=L(lid),tot=cartTotal(),pickup=10,points=Math.floor(tot/2);
 return `<div class="demo">דמו אינטראקטיבי · נתונים לצורך הדגמה בלבד</div>
 <div class="hdr"><h2>הזמנה חדשה — ${l.name}</h2><p>איסוף והחזרה · תשלום מאובטח</p></div>
 <div class="body">
  <div class="card">
   ${state.cart.map(c=>{const it=L(c.lid).items[c.i];return `<div class="row"><span>${it.n} × ${c.q}</span><b>₪${it.p*c.q}</b></div>`}).join('')}
   <div class="row"><span class="mut">דמי איסוף והחזרה</span><b>₪${pickup}</b></div>
   <div class="row" style="font-weight:800"><span>סה״כ</span><span>₪${tot+pickup}</span></div>
  </div>
  <div class="card">
   <div class="sec" style="margin-top:0">חלון איסוף</div>
   <span class="chip on">היום 16:00–14:00</span><span class="chip">היום 20:00–18:00</span><span class="chip">מחר 11:00–09:00</span>
   <div class="sec">כתובת</div>
   <div class="mut">הרצל 12, דירה 3, תל אביב <button class="btn2" onclick="toast('בדמו — כתובת קבועה')">שינוי</button></div>
  </div>
  <div class="card">
   <div class="sec" style="margin-top:0">תשלום</div>
   <div class="row"><span>💳 כרטיס המסתיים ב־4821</span><span class="tag tg">מאומת</span></div>
   <div class="row"><span class="mut">תצברו בהזמנה זו</span><span class="stars">★ ${points} נקודות</span></div>
  </div>
  <button class="btn" onclick="placeOrder()">אישור ותשלום · ₪${tot+pickup}</button>
  <div class="mut" style="text-align:center;margin-top:8px">דמו — לא מתבצע חיוב אמיתי</div>
 </div>`;
}
function placeOrder(){
 if(!state.cart.length)return;
 const lid=state.cart[0].lid;
 const o={id:4800+Math.floor(Math.random()*200),lid,items:state.cart.map(c=>({n:L(c.lid).items[c.i].n,q:c.q,p:L(c.lid).items[c.i].p})),total:cartTotal()+10,st:0,ts:Date.now()};
 state.orders.unshift(o);state.cart=[];state.points+=Math.floor((o.total-10)/2);save();
 toast('ההזמנה נוצרה · #'+o.id);go('#/track/'+o.id);
}
function vOrders(){
 const list=state.orders;
 return `<div class="demo">דמו אינטראקטיבי · נתונים לצורך הדגמה בלבד</div>
 <div class="hdr"><h2>ההזמנות שלי</h2><p>${state.user?'שלום, '+esc(state.user.name):'התחברות מהירה ללא סיסמה'}</p></div>
 <div class="body">
  ${state.user?'':`<div class="card" style="text-align:center"><b>כניסה בטלפון עם קוד חד־פעמי</b><div class="mut" style="margin:6px 0 10px">SMS או וואטסאפ, בלי סיסמה</div><button class="btn2 on" onclick="go('#/login')">התחברות / הרשמה</button></div>`}
  ${list.length?list.map(o=>{const l=L(o.lid);return `<div class="card lcard" style="cursor:pointer" onclick="go('#/track/${o.id}')">
   <span class="logo sm" style="background:${l.color}">${l.letter}</span>
   <div style="flex:1"><b>הזמנה #${o.id}</b> · ${l.name}<div class="mut">${o.items.reduce((s,i)=>s+i.q,0)} פריטים · ₪${o.total}</div></div>
   <span class="tag ${o.st>=4?'tg':'tb'}">${STATUSES[o.st]}</span></div>`}).join(''):'<div class="card mut" style="text-align:center;padding:30px">אין עדיין הזמנות</div>'}
 </div>`;
}
function vTrack(id){
 const o=state.orders.find(x=>String(x.id)===String(id));
 if(!o)return vOrders();
 const l=L(o.lid);
 return `<div class="demo">דמו אינטראקטיבי · נתונים לצורך הדגמה בלבד</div>
 <div class="hdr" style="text-align:center"><h2>מעקב הזמנה #${o.id}</h2><p>${l.name} · נאסף 14:12</p></div>
 <div class="body">
  <div class="card"><div class="tl">
   ${STATUSES.map((s,i)=>`<div class="stop ${i<o.st?'done':i===o.st?'now':''}"><b style="font-size:13px;color:${i<=o.st?'#17303a':'#8a99a3'}">${s}</b><div class="mut">${i===0?'היום 14:12 · אבי (שליח)':i===1?'עכשיו · כביסה וגיהוץ':i===2?'צפי 10:00 מחר':i===3?'חלון החזרה: 20:00–18:00':i===4?'—':''}</div></div>`).join('')}
  </div></div>
  <div class="card lcard"><span class="logo sm" style="background:#0e7a8a">א</span><div style="flex:1"><b>אבי — שליח המכבסה</b><div class="mut">איסוף והחזרה · ★4.9</div></div><span class="btn2">☎ שיחה</span></div>
  <div class="card"><b style="font-size:13px">התראות על שינוי סטטוס</b><div class="mut" style="margin-top:4px">וואטסאפ ✓ · SMS ✓ · התראות דחיפה ✓</div></div>
  <button class="btn2" style="width:100%;margin-bottom:8px" onclick="advance(${o.id})">הדמיה: קדם סטטוס ▸</button>
  <button class="btn" onclick="toast('בדמו — קבלה תישלח ב־PDF')">⬇ קבלה וחשבונית PDF</button>
  <div class="note" style="margin-top:10px">★ סיום ההזמנה יזכה ב־${Math.floor((o.total-10)/2)} נקודות ויפתח בקשת דירוג אוטומטית</div>
 </div>`;
}
function advance(id){const o=state.orders.find(x=>x.id===id);if(o&&o.st<4){o.st++;save();toast('סטטוס: '+STATUSES[o.st]);render()}}
function vClub(){
 const p=state.points,pct=Math.min(100,Math.round(p/10));
 return `<div class="demo">דמו אינטראקטיבי · נתונים לצורך הדגמה בלבד</div>
 <div class="hdr"><h2>מועדון הלקוחות</h2><p>דנה, יש לך ★ ${p} נקודות</p></div>
 <div class="body">
  <div class="card" style="background:linear-gradient(120deg,#0a4f5c,#12869b);color:#fff;border:none">
   <div style="display:flex;justify-content:space-between;font-size:12.5px"><span>יתרת נקודות</span><span>שווה ₪${Math.floor(p/10)}</span></div>
   <div style="font-size:32px;font-weight:800;margin:4px 0">★ ${p}</div>
   <div class="bar-wrap" style="background:rgba(255,255,255,.25)"><div class="bar-fill" style="width:${pct}%;background:#fff"></div></div>
   <div style="font-size:11px;opacity:.85;margin-top:6px">עוד ${Math.max(0,1000-p)} נקודות ל־₪100 מתנה</div>
  </div>
  <div class="sec">הקופונים שלך</div>
  <div class="card">
   <div class="row"><div><b style="font-size:13.5px">10% הנחה על ניקוי יבש</b><div class="mut">בתוקף עד 31.10</div></div><span class="btn2">מימוש</span></div>
   <div class="row"><div><b style="font-size:13.5px">איסוף חינם להזמנה הבאה</b><div class="mut">בתוקף עד 15.11</div></div><span class="btn2">מימוש</span></div>
  </div>
  <div class="card" style="border:1.5px solid #0e7a8a">
   <div class="sec" style="margin-top:0">★ מנוי כביסה חודשי</div>
   <div style="display:flex;justify-content:space-between;align-items:center"><div><b>מנוי משפחתי — 4 שקים בחודש</b><div class="mut">חיסכון של ~60 ₪ בחודש · ביטול בכל עת</div></div><div style="text-align:left"><b style="font-size:17px">₪199</b><div class="mut">/חודש</div></div></div>
   <button class="btn" style="margin-top:10px" onclick="toast('בדמו — הצטרפות למנוי')">הצטרפות למנוי</button>
  </div>
  <div class="warn">מזמינים חברים: חבר שמזמין דרך הקישור שלך מקבל ₪25 — וגם את מקבלת ₪25 <button class="btn2" style="margin-top:6px" onclick="toast('הקישור הועתק (דמו)')">שיתוף קישור אישי</button></div>
 </div>`;
}
function vLogin(){
 return `<div class="demo">דמו אינטראקטיבי · נתונים לצורך הדגמה בלבד</div>
 <div class="hdr" style="text-align:center;padding-top:34px;padding-bottom:34px"><div class="big">וולט למכבסות</div><p>כביסה נקייה, בלחיצה אחת</p></div>
 <div class="body">
  <div class="card" style="text-align:center">
   <b style="font-size:15px">התחברות / הרשמה</b>
   <div class="mut" style="margin:6px 0 12px">נשלח אליך קוד חד־פעמי, בלי סיסמה</div>
   <div style="border:1px solid #d3e8ec;border-radius:10px;padding:11px;color:#8a99a3;direction:ltr" id="phone" contenteditable="true">05X-XXXXXXX</div>
   <div class="otp" id="otp">${'<input maxlength="1" inputmode="numeric">'.repeat(6)}</div>
   <div class="mut">בדמו: הקלידו 6 ספרות כלשהן</div>
   <button class="btn" style="margin-top:12px" onclick="doLogin()">שליחת קוד ב־SMS</button>
   <div class="mut" style="margin:12px 0">── או ──</div>
   <div style="display:flex;gap:8px;justify-content:center"><span class="btn2 green">וואטסאפ</span><span class="btn2">Google</span><span class="btn2">Apple</span></div>
  </div>
 </div>`;
}
function doLogin(){
 const vals=[...document.querySelectorAll('#otp input')].map(i=>i.value).join('');
 if(vals.length>=4){state.user={name:'דנה'};save();toast('התחברת בהצלחה');go('#/')}else toast('הזינו קוד (4+ ספרות בדמו)');
}
function vCourier(){
 if(!state.courier){state.courier={stops:[
  {t:'איסוף — מכבסת האחוזה',d:'הרצל 12 · הזמנות #4821, #4820',c:'#0e7a8a',l:'א',done:false},
  {t:'איסוף — כביסה אקספרס',d:'אבן גבירול 6 · הזמנה #4818',c:'#c26a12',l:'כ',done:false},
  {t:'איסוף — ניקוי יבש המומחים',d:'דיזנגוף 88 · 2 הזמנות',c:'#3557c9',l:'נ',done:false},
  {t:'החזרה — דנה כ.',d:'הרצל 12 דירה 3 · הזמנה #4821',c:'#8a99a3',l:'ד',done:false},
  {t:'החזרה — משה ל.',d:'אבן גבירול 12 · הזמנה #4820',c:'#8a99a3',l:'מ',done:false},
  {t:'החזרה — מלון הכרמל',d:'חוף הכרמל · חשבון עסקי #4809',c:'#178a4c',l:'מ',done:false} ],earn:486};save()}
 const c=state.courier,done=c.stops.filter(s=>s.done).length;
 return `<div class="demo">דמו אינטראקטיבי · נתונים לצורך הדגמה בלבד</div>
 <div class="hdr"><h2>אפליקציית שליח — המסלול שלי</h2><p>3 מכבסות · ${c.stops.length} נקודות · 18 ק״מ · ~2.5 שעות · ₪94 משוער</p></div>
 <div class="body">
  <div class="card"><div style="display:flex;justify-content:space-between;font-size:12.5px"><b>התקדמות</b><span>${done} / ${c.stops.length}</span></div><div class="bar-wrap"><div class="bar-fill" style="width:${Math.round(done/c.stops.length*100)}%"></div></div></div>
  <div class="card">
   ${c.stops.map((s,i)=>`<div class="row"><span style="display:flex;gap:10px;align-items:center"><span class="logo sm" style="background:${s.c}">${s.l}</span><span><b style="font-size:13px">${s.t}</b><br><span class="mut">${s.d}</span></span></span>
   ${s.done?'<span class="tag tg">✓</span>':`<button class="btn2" onclick="stop(${i})">סימון</button>`}</div>`).join('')}
  </div>
  <div class="note">✓ מסלול משולב — איסופים מ־3 מכבסות שכנות במסלול אחד; חלוקת התשלום בין המכבסות אוטומטית</div>
  <div class="card">
   <div class="sec" style="margin-top:0">רווחים — שבוע 42</div>
   <div class="kpis" style="margin-bottom:4px"><div class="kpi"><span class="mut">מסלולים</span><b>14</b></div><div class="kpi"><span class="mut">נקודות</span><b>61</b></div><div class="kpi"><span class="mut">דירוג</span><b>4.9<span class="stars">★</span></b></div></div>
   <div class="row"><span>מכבסת האחוזה · 7 מסלולים</span><b>₪168</b></div>
   <div class="row"><span>כביסה אקספרס · 4 מסלולים</span><b>₪142</b></div>
   <div class="row"><span>קלאסטר השרון — משולב (חלקך 40%)</span><b>₪80</b></div>
   <div class="row"><span class="mut">עמלת פלטפורמה 12%</span><span style="color:#b23b3b">−₪58</span></div>
   <div class="row" style="font-weight:800"><span>לתשלום ביום א׳</span><span style="color:#0b5563">₪448</span></div>
  </div>
 </div>`;
}
function stop(i){state.courier.stops[i].done=true;save();render()}
function vManage(){
 if(!state.demoOrders){state.demoOrders=[
  {id:4821,who:'דנה כ.',d:'איסוף 14:00–16:00 · הרצל 12 · ₪85',st:0},
  {id:4820,who:'משה ל.',d:'אספקה 13:06 · ק״ג 6 · ₪72',st:1},
  {id:4818,who:'רותי ש.',d:'החזרה 20:00–18:00 · ₪110',st:2},
  {id:4816,who:'אבי ר.',d:'הוחזר אתמול · ₪94',st:4}];save()}
 const st=['ממתין לאישור','בעבודה','מוכן','בדרך','נמסר'],cls=['to','tb','tg','tb','tg'];
 return `<div class="demo">דמו אינטראקטיבי · נתונים לצורך הדגמה בלבד</div>
 <div class="hdr"><h2>לוח ניהול — מכבסת האחוזה</h2><p>יום ו׳ 16.10 · שלום יוסי, הכל תקין ✓</p></div>
 <div class="body">
  <div class="kpis"><div class="kpi"><span class="mut">הזמנות היום</span><b>14</b><span class="mut" style="color:#178a4c">▲ +3</span></div><div class="kpi"><span class="mut">הכנסות היום</span><b>₪1,240</b><span class="mut" style="color:#178a4c">▲ 12%</span></div><div class="kpi"><span class="mut">לקוחות חדשים</span><b>38%</b><span class="mut">מתוך פעילים</span></div></div>
  <div class="card"><div style="display:flex;justify-content:space-between;font-size:12.5px"><b>קיבולת איסופים להיום</b><span class="mut">9 / 12 חלונות</span></div><div class="bar-wrap"><div class="bar-fill" style="width:75%"></div></div></div>
  <div class="sec">תור הזמנות חי</div>
  <div class="card">
   ${state.demoOrders.map((o,i)=>`<div class="row"><div><b style="font-size:13px">#${o.id} · ${o.who}</b><div class="mut">${o.d}</div></div>
    <span style="text-align:left"><span class="tag ${cls[o.st]}">${st[o.st]}</span>${o.st<4?`<br><button class="btn2" style="margin-top:5px" onclick="advDemo(${i})">קדם ▸</button>`:''}</span></div>`).join('')}
  </div>
  <div style="display:flex;gap:8px"><button class="btn2" style="flex:1" onclick="toast('מחירון וזמינות (דמו)')">מחירון</button><button class="btn2" style="flex:1" onclick="toast('קמפיין שימור (דמו)')">★ קמפיין</button><button class="btn2" style="flex:1" onclick="toast('דוחות (דמו)')">▤ דוחות</button></div>
  <div class="note" style="margin-top:10px">שליחים: אבי ר. (פרטי) במסלול · שליח קלאסטר השרון (משותף) משובץ ל־4 איסופים · עלות אחרי פיצול ₪22</div>
 </div>`;
}
function advDemo(i){if(state.demoOrders[i].st<4){state.demoOrders[i].st++;save();render()}}

/* ---- router ---- */
function go(h){location.hash=h}
function route(){
 const h=location.hash||'#/';
 const [path,qs]=h.slice(2).split('?');
 const q=new URLSearchParams(qs||'').get('q')||'';
 const seg=path.split('/');
 if(seg[0]==='laundry'&&seg[1])return{html:vLaundry(seg[1]),tab:'#/'};
 if(seg[0]==='cart')return{html:vCart(),tab:'#/'};
 if(seg[0]==='orders')return{html:vOrders(),tab:'#/orders'};
 if(seg[0]==='track'&&seg[1])return{html:vTrack(seg[1]),tab:'#/orders'};
 if(seg[0]==='club')return{html:vClub(),tab:'#/club'};
 if(seg[0]==='login')return{html:vLogin(),tab:'#/orders'};
 if(seg[0]==='courier')return{html:vCourier(),tab:'#/courier'};
 if(seg[0]==='manage')return{html:vManage(),tab:'#/manage'};
 return{html:vHome(q),tab:'#/'};
}
function render(){const r=route();$('#app').innerHTML=r.html;renderTabs(r.tab);
 const otp=document.querySelectorAll('#otp input');otp.forEach((inp,i)=>inp.addEventListener('input',()=>{if(inp.value&&otp[i+1])otp[i+1].focus()}));
 window.scrollTo(0,0)}
window.addEventListener('hashchange',render);
render();
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
