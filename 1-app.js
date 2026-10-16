/* מכבסה בקליק — אב־טיפוס דמו (ללא שרת; נתונים לוקליים בלבד) */
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
  <div class="big">מכבסה בקליק</div>
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
  <div class="card" style="cursor:pointer;background:#e6f4f6;text-align:center" onclick="go('#/modules')"><b style="color:#0e7a8a">▣ מפת כל מסכי הדמו — 27 מסכים: לקוח, מועדון, B2B, שליחים, ניהול, אדמין</b></div>
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
 <div class="hdr" style="text-align:center;padding-top:34px;padding-bottom:34px"><div class="big">מכבסה בקליק</div><p>כביסה נקייה, בלחיצה אחת</p></div>
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


/* ---- stage 2 ---- */
function toast(m){const t=document.createElement('div');t.className='toast show';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
function hdr2(t,s){return `<div class="demo">דמו אינטראקטיבי · נתונים לצורך הדגמה בלבד</div><div class="hdr" style="padding-top:22px"><div class="big" style="font-size:20px">${t}</div>${s?`<p style="font-size:12.5px">${s}</p>`:''}</div>`}
function vRate(){return hdr2('איך היה?','הזמנה #4821 · מכבסת האחוזה')+`<div class="body">
 <div class="card" style="text-align:center"><div style="font-size:34px;letter-spacing:6px;cursor:pointer" onclick="this.innerHTML='★★★★★';toast('תודה על הדירוג!')"><span class="stars">★★★★</span><span style="color:#cfd8dd">★</span></div><div class="mut" style="margin-top:6px">דרג את האיסוף והשירות</div></div>
 <div class="sec">מה היה טוב?</div>
 <div style="margin:2px"><span class="chip" onclick="this.classList.toggle('on')">איסוף בזמן</span><span class="chip" onclick="this.classList.toggle('on')">ניקיון מעולה</span><span class="chip" onclick="this.classList.toggle('on')">אריזה</span><span class="chip" onclick="this.classList.toggle('on')">שליח נעים</span><span class="chip" onclick="this.classList.toggle('on')">מחיר הוגן</span></div>
 <div class="card" style="margin-top:10px"><textarea class="inp" rows="3" placeholder="משוב חופשי (לא חובה)…" style="width:100%"></textarea></div>
 <button class="btn" onclick="toast('המשוב נשלח · נוספו 20 נקודות למועדון');go('#/orders')">שליחת משוב · +20 נקודות</button>
 <div class="note">משוב משפיע על דירוג המכבסה והשליח, ומזכה בנקודות מועדון</div></div>`}
function vSub(){return hdr2('המנוי שלי','מנוי משפחתי · חודשי')+`<div class="body">
 <div class="card" style="background:linear-gradient(135deg,#0a4f5c,#12869b);color:#fff"><div style="display:flex;justify-content:space-between"><b>מנוי משפחתי</b><span class="tag tg">פעיל</span></div><div style="font-size:26px;font-weight:800;margin:8px 0">4 שקים בחודש</div><div class="mut" style="color:#cfe8ee">חיסכון של ~60₪ בחודש · ביטול בכל עת</div><div class="bar-wrap" style="background:rgba(255,255,255,.25);margin-top:10px"><div class="bar-fill" style="width:50%"></div></div><div class="mut" style="color:#cfe8ee;margin-top:4px">נוצלו 2 מתוך 4 שקים החודש</div></div>
 <div style="display:flex;gap:8px;margin-top:10px"><button class="btn" style="flex:1" onclick="toast('שק נוסף נוסף להזמנה הבאה')">הוספת שק</button><button class="btn tl" style="flex:1" onclick="toast('בקשת השהיה נרשמה (דמו)')">השהיית מנוי</button></div>
 <div class="sec">חיובים</div>
 <div class="card"><div style="display:flex;justify-content:space-between"><span>01.10 · מנוי חודשי</span><b>₪199</b></div><div class="mut" style="display:flex;justify-content:space-between;margin-top:6px"><span>01.09 · מנוי חודשי</span><b>₪199</b></div></div>
 <div class="note">המנוי מזכה בעדיפות איסוף, ניקוי יבש בהנחה ו־10% נקודות בונוס</div></div>`}
function vB2bAccount(){return hdr2('חשבון עסקי — מלון הכרמל','חשבון B2B · תנאי תשלום שוהם +30')+`<div class="body">
 <div class="kpis"><div class="kpi"><div class="mut">הזמנות החודש</div><b>86</b></div><div class="kpi"><div class="mut">נפח (ק״ג)</div><b>1,240</b></div><div class="kpi"><div class="mut">יתרה לחיוב</div><b>₪18,420</b></div></div>
 <div class="card" style="margin-top:10px"><b>איסוף קבוע</b><div class="mut" style="margin-top:4px">א׳, ד׳ · 08:00–10:00 · מכבסת האחוזה (הסכם בלעדי)</div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn" style="flex:1" onclick="toast('איסוף חריג נקבע למחר 08:00 (דמו)')">איסוף חריג</button><button class="btn tl" style="flex:1" onclick="toast('דוח חודשי נשלח (דמו)')">דוח חודשי</button></div></div>
 <div class="sec">הזמנות אחרונות</div>
 ${[['#B-2210','מצעים · 180 ק״ג','בדרך','₪3,240'],['#B-2204','מגבות ספא · 95 ק״ג','נמסר','₪1,710'],['#B-2198','מפות אירועים · 60 ק״ג','נמסר','₪1,080']].map(o=>`<div class="card" style="display:flex;justify-content:space-between;align-items:center"><div><b>${o[0]}</b><div class="mut">${o[1]}</div></div><div style="text-align:left"><span class="tag ${o[2]==='נמסר'?'tg':'tb'}">${o[2]}</span><div class="mut">${o[3]}</div></div></div>`).join('')}
 <div class="note">חשבונית מרוכזת בסוף חודש · מחירון B2B מוסכם · מנהל חשבון אישי</div></div>`}
function vBrand(){return `<div class="demo">דמו · אפליקציה ממותגת (White Label) של המכבסה</div>
 <div class="hdr" style="background:linear-gradient(135deg,#3b2f6b,#7a5fd0);text-align:center;padding-top:26px"><div class="big">קלין שופ</div><p style="font-size:13px">האפליקציה שלנו — מופעלת על ידי מכבסה בקליק</p><div class="mut" style="color:#e3dcff;font-size:11.5px;margin-top:4px">מיתוג אישי: שם, לוגו, צבעים, דומיין משלה</div></div>
 <div class="body">
 <div class="card"><b>הזמנה מהירה</b><div class="mut" style="margin-top:4px">איסוף היום 15:00–17:00 · תשלום באשראי/ביט</div><button class="btn" style="margin-top:8px;background:#3b2f6b" onclick="toast('הזמנה נוצרה באפליקציה הממותגת (דמו)')">הזמנת איסוף</button></div>
 <div class="card"><b>ההזמנות שלי</b><div class="mut" style="margin-top:4px">#CS-118 · בעבודה · צפי מחר 18:00</div></div>
 <div class="card"><b>המועדון של קלין שופ</b><div class="mut" style="margin-top:4px">340 נקודות · קופון 15₪ זמין</div></div>
 <div class="note">כל ההזמנות זורמות לניהול המכבסה ולרשת השליחים של מכבסה בקליק · המכבסה שולטת במחירון ובמבצעים</div></div>`}
function vManagePrices(){return hdr2('מחירון וזמינות','מכבסת האחוזה · עדכון מיידי לאפליקציה')+`<div class="body">
 <div class="sec">מחירון</div>
 ${[['כביסה + קיפול','ק״ג',25],['ניקוי יבש חולצה','יח׳',18],['גיהוץ','יח׳',8],['שמיכה','יח׳',55],['שטיח','מ״ר',35]].map(p=>`<div class="card" style="display:flex;justify-content:space-between;align-items:center"><div><b>${p[0]}</b><div class="mut">ל${p[1]}</div></div><div class="stepper"><button onclick="toast('מחיר עודכן (דמו)')">−</button><b>₪${p[2]}</b><button onclick="toast('מחיר עודכן (דמו)')">+</button></div></div>`).join('')}
 <div class="sec">זמינות</div>
 <div class="card" style="display:flex;justify-content:space-between;align-items:center"><b>קבלת הזמנות חדשות</b><span class="chip on" onclick="this.classList.toggle('on');this.textContent=this.classList.contains('on')?'פתוח':'סגור'">פתוח</span></div>
 <div class="card" style="display:flex;justify-content:space-between;align-items:center"><b>חלון איסוף הבא</b><span class="mut">היום 16:00–18:00 · 3/12 תורים</span></div>
 <button class="btn" onclick="toast('המחירון והזמינות עודכנו בכל הערוצים')">שמירת שינויים</button></div>`}
function vManageCampaigns(){return hdr2('קמפיינים ושימור','מכבסת האחוזה · יציאה ללקוחות בוואטסאפ/דיוור')+`<div class="body">
 <div class="card"><b>לקוחות שלא הזמינו 30+ יום</b><div class="mut" style="margin-top:4px">214 לקוחות · הצעה: קופון 20% לחזרה</div><button class="btn" style="margin-top:8px" onclick="toast('קמפיין שימור נשלח ל־214 לקוחות (דמו)')">שליחת קמפיין שימור</button></div>
 <div class="card"><b>מבצע סוף שבוע</b><div class="mut" style="margin-top:4px">גיהוץ חינם בכל הזמנה מעל ₪80 · ו׳–שבת</div> <span class="tag tg">פעיל</span></div>
 <div class="card"><b>תבנית מהירה</b><div class="mut" style="margin-top:4px">״שבוע טוב! כביסה ב־22₪ לק״ג עד יום ד׳ — קליק להזמנה״</div><button class="btn tl" style="margin-top:8px" onclick="toast('נשלח ל־1,150 אישורי דיוור (דמו)')">שליחה</button></div>
 <div class="sec">ביצועים אחרונים</div>
 <div class="kpis"><div class="kpi"><div class="mut">נשלחו</div><b>1,150</b></div><div class="kpi"><div class="mut">נפתחו</div><b>61%</b></div><div class="kpi"><div class="mut">הזמנות</div><b>96</b></div></div>
 <div class="note">הקמפיינים משולבים בבוט קלין שופ ובמועדון · עמלת פלטפורמה רגילה בלבד</div></div>`}
function vManageReports(){const bars=[40,55,48,70,62,85,78];return hdr2('דוחות — אוקטובר 2026','מכבסת האחוזה')+`<div class="body">
 <div class="kpis"><div class="kpi"><div class="mut">הכנסות</div><b>₪38,900</b></div><div class="kpi"><div class="mut">הזמנות</div><b>412</b></div><div class="kpi"><div class="mut">לקוחות חדשים</div><b>67</b></div></div>
 <div class="card" style="margin-top:10px"><b>הזמנות לפי יום</b><div style="display:flex;align-items:flex-end;gap:6px;height:90px;margin-top:10px">${bars.map(h=>`<div style="flex:1;background:linear-gradient(180deg,#12869b,#0a4f5c);border-radius:6px 6px 0 0;height:${h}%"></div>`).join('')}</div><div class="mut" style="display:flex;justify-content:space-between;margin-top:4px"><span>א׳</span><span>ד׳</span><span>ש׳</span></div></div>
 <div class="card"><b>פילוח שירותים</b><div class="mut" style="margin-top:6px">כביסה 58% · ניקוי יבש 24% · גיהוץ 12% · אחר 6%</div><div class="bar-wrap" style="margin-top:8px"><div class="bar-fill" style="width:58%"></div></div></div>
 <div class="card"><b>מקורות הזמנה</b><div class="mut" style="margin-top:6px">אפליקציית מכבסה בקליק 46% · אפליקציה ממותגת 22% · בוט וואטסאפ 19% · טלפון 13%</div></div>
 <button class="btn tl" onclick="toast('הדוח יוצא ל־Excel (דמו)')">ייצוא דוח</button></div>`}
function vManagePickups(){return hdr2('איסופים והחזרות — יום ו׳','מכבסת האחוזה · שיבוץ לשליחים')+`<div class="body">
 ${[['16:00–18:00','3 איסופים · 2 החזרות','אבי ר. (פרטי)','tg','שובץ'],['18:00–20:00','4 איסופים · 3 החזרות','שליח קלאסטר השרון','tb','משותף'],['20:00–22:00','2 איסופים','לא שובץ','to','ממתין']].map(w=>`<div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><b>${w[0]}</b><span class="tag ${w[3]}">${w[4]}</span></div><div class="mut" style="margin-top:4px">${w[1]} · ${w[2]}</div>${w[4]==='ממתין'?`<button class="btn" style="margin-top:8px" onclick="toast('בקשת שיבוץ נשלחה לרשת השליחים')">שליחת בקשת שיבוץ</button>`:''}</div>`).join('')}
 <div class="note">שיבוץ אוטומטי לפי קרבה וזמינות · שליח פרטי, משותף (קלאסטר) או עצמאי</div></div>`}
function vManageCouriers(){return hdr2('ניהול שליחים','מכבסת האחוזה')+`<div class="body">
 ${[['אבי ר.','פרטי · קבוע','4.9 · 214 משלוחים','פעיל היום'],['קלאסטר השרון','משותף · רשת מכבסה בקליק','עלות אחרי פיצול ₪22','משובץ ל־4 איסופים'],['דני כ.','עצמאי לפי קריאה','4.7 · 96 משלוחים','לא פעיל']].map(c=>`<div class="card" style="display:flex;justify-content:space-between;align-items:center"><div><b>${c[0]}</b><div class="mut">${c[1]} · ${c[2]}</div></div><span class="mut">${c[3]}</span></div>`).join('')}
 <div class="card"><b>פיצול עלויות קלאסטר — השבוע</b><div class="mut" style="margin-top:6px">22 איסופים משותפים עם 3 מכבסות · חיסכון 40% · חלקך: ₪310 (מתוך ₪780)</div></div>
 <button class="btn" onclick="toast('הזמנה נשלחה (דמו)')">הזמנת שליח חד פעמי</button></div>`}
function vCourierJoin(){return hdr2('הצטרפות כשליח לפלטפורמה','השתלבות ברשת השליחים של מכבסה בקליק')+`<div class="body">
 <div class="card"><b>דרישות</b><div class="mut" style="margin-top:6px">רישיון נהיגה + רכב/קטנוע/אופניים · טלפון חכם · זמינות 3 משמרות בשבוע</div></div>
 <div class="card"><b>פרטים</b><input class="inp" placeholder="שם מלא" style="width:100%;margin:6px 0 8px"><input class="inp" placeholder="טלפון" style="width:100%;margin-bottom:8px"><input class="inp" placeholder="אזור פעילות מועדף" style="width:100%"></div>
 <div class="card"><b>מודל עבודה</b><div style="margin-top:6px"><span class="chip" onclick="this.classList.toggle('on')">משמרות קבועות</span><span class="chip" onclick="this.classList.toggle('on')">קלאסטר משותף</span><span class="chip on" onclick="this.classList.toggle('on')">קריאות חד פעמיות</span></div><div class="mut" style="margin-top:8px">שכר ממוצע: ₪38–52 לשעה · תשלום שבועי · דירוג שקוף</div></div>
 <button class="btn" onclick="toast('הבקשה התקבלה · ניצור קשר לאימות (דמו)')">שליחת בקשת הצטרפות</button></div>`}
function vCourierRequests(){return hdr2('בקשות שיבוץ','שליח · בקשות חדשות באזורך')+`<div class="body">
 ${[['מכבסת האחוזה','איסוף 20:00–22:00 · 2 תיקים · הרצל 12','₪34'],['כביסה אקספרס','איסוף מחר 09:00 · 1 תיק · בגין 8','₪22'],['מלון הכרמל (B2B)','החזרה 08:00 · 6 ארגזים · חוף הכרמל','₪58']].map(r=>`<div class="card"><div style="display:flex;justify-content:space-between"><b>${r[0]}</b><b style="color:#0e7a8a">${r[2]}</b></div><div class="mut" style="margin:4px 0 8px">${r[1]}</div><div style="display:flex;gap:8px"><button class="btn" style="flex:1" onclick="toast('שובצת! נוסף למסלול שלך')">קבלה</button><button class="btn tl" style="flex:1" onclick="toast('נדחה · יוצע לשליח אחר')">דחייה</button></div></div>`).join('')}
 <div class="note">דחייה אינה פוגעת בדירוג · שיבוץ אוטומטי לשליחי קלאסטר</div></div>`}
function vCourierEarnings(){return hdr2('רווחים — שבוע 42','שליח · אבי ר.')+`<div class="body">
 <div class="kpis"><div class="kpi"><div class="mut">משלוחים</div><b>61</b></div><div class="kpi"><div class="mut">שעות</div><b>32</b></div><div class="kpi"><div class="mut">דירוג</div><b>★4.9</b></div></div>
 <div class="card" style="margin-top:10px"><b>פירוט</b><div class="row mut" style="display:flex;justify-content:space-between;margin-top:6px"><span>מסלולים פרטיים (34)</span><b>₪612</b></div><div class="row mut" style="display:flex;justify-content:space-between;margin-top:6px"><span>קלאסטר משותף (27)</span><b>₪486</b></div><div class="row mut" style="display:flex;justify-content:space-between;margin-top:6px;color:#c0392b"><span>עמלת פלטפורמה 12%</span><b>−₪132</b></div><div class="row" style="display:flex;justify-content:space-between;margin-top:8px;font-weight:800"><span>לתשלום ביום א׳</span><b>₪966</b></div></div>
 <div class="card"><b>בונוסים</b><div class="mut" style="margin-top:4px">דירוג 4.8+ שבועי: +₪50 · 40+ משלוחים: +₪80</div></div></div>`}
function vAdmin(){return hdr2('לוח פלטפורמה — מנהל מרכזי','מכבסה בקליק · תמונת מצב ארצית')+`<div class="body">
 <div class="kpis"><div class="kpi"><div class="mut">מכבסות פעילות</div><b>127</b></div><div class="kpi"><div class="mut">הזמנות היום</div><b>1,842</b></div><div class="kpi"><div class="mut">GMV חודשי</div><b>₪2.4M</b></div></div>
 <div class="kpis" style="margin-top:8px"><div class="kpi"><div class="mut">שליחים פעילים</div><b>310</b></div><div class="kpi"><div class="mut">עמלות החודש</div><b>₪288K</b></div><div class="kpi"><div class="mut">דירוג ממוצע</div><b>★4.8</b></div></div>
 <div class="sec">ממתינות לאישור (3)</div>
 ${[['מכבסת הכרמליה','חיפה · מחירון ותמונות הושלמו'],['כביסה אקווה','באר שבע · ממתין חוזה חתום'],['ניקוי פרימיום','ת״א · אימות בעלות']].map(l=>`<div class="card" style="display:flex;justify-content:space-between;align-items:center"><div><b>${l[0]}</b><div class="mut">${l[1]}</div></div><button class="btn tl" onclick="toast('אושרה ועלתה לאוויר (דמו)')">אישור</button></div>`).join('')}
 <div class="sec">התראות</div>
 <div class="card warn" style="background:#fff7e6">שיעור ביטולים חריג בצפון (4.2%) · מומלץ לבדוק זמינות שליחים באזור</div>
 <button class="btn tl" onclick="go('#/admin-couriers')">רשת שליחים ←</button></div>`}
function vAdminCouriers(){return hdr2('רשת שליחים — מנהל פלטפורמה','310 שליחים · 14 אזורים')+`<div class="body">
 <div class="kpis"><div class="kpi"><div class="mut">במשמרת כעת</div><b>96</b></div><div class="kpi"><div class="mut">קלאסטרים</div><b>14</b></div><div class="kpi"><div class="mut">כיסוי SLA</div><b>97%</b></div></div>
 ${[['קלאסטר מרכז ת״א','38 שליחים · כיסוי מלא','tg','ירוק'],['קלאסטר השרון','22 שליחים · עומס ערב צפוי','to','צהוב'],['קלאסטר חיפה','18 שליחים · כיסוי מלא','tg','ירוק']].map(c=>`<div class="card" style="display:flex;justify-content:space-between;align-items:center"><div><b>${c[0]}</b><div class="mut">${c[1]}</div></div><span class="tag ${c[2]}">${c[3]}</span></div>`).join('')}
 <div class="card"><b>איזון עומסים</b><div class="mut" style="margin-top:6px">הצעה: העברת 3 שליחים ממרכז ת״א לשרון בין 17:00–21:00 · עלות ₪90 · חיסכון צפוי באיחורים</div><button class="btn" style="margin-top:8px" onclick="toast('בוצע (דמו)')">אישור העברה</button></div></div>`}
function vB2b(){return hdr2('קהילת מנהלי המכבסות','אזור B2B · פורום, מכרזים, רכש משותף ותוכן מקצועי')+`<div class="body">
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
 ${[['#/b2b-forum','פורום מנהלים','248 דיונים פעילים'],['#/b2b-tender','מכרזים','3 מכרזים פתוחים'],['#/b2b-group','רכש משותף','חיסכון ממוצע 18%'],['#/b2b-content','תוכן ומדריכים','36 מדריכים']].map(m=>`<div class="card" style="text-align:center;cursor:pointer" onclick="go('${m[0]}')"><div style="font-size:26px">▣</div><b>${m[1]}</b><div class="mut">${m[2]}</div></div>`).join('')}
 </div><div class="note">גישה למכבסות מאומתות בלבד</div></div>`}
function vB2bForum(){return hdr2('פורום מנהלים','קהילת מנהלי המכבסות')+`<div class="body">
 ${[['איך אתם מתמחרים שמיכות בעונה?','רוני · מכבסת הכרמל','34 תגובות · לפני שעתיים'],['מכונת 18 ק״ג — המלצות לדגם חסכוני במים?','דנה · כביסה אקספרס','21 תגובות · אתמול'],['טיפול בלקוח B2B שדורש SLA של 12 שעות','משה · מכבסת האחוזה','12 תגובות · אתמול']].map(t=>`<div class="card"><b>${t[0]}</b><div class="mut" style="margin-top:4px">${t[1]} · ${t[2]}</div></div>`).join('')}
 <button class="btn" onclick="toast('פתיחת דיון חדש (דמו)')">דיון חדש</button></div>`}
function vB2bTender(){return hdr2('מכרז #T-104','אספקת שירותי כביסה לרשת הוסטלים · 12 סניפים')+`<div class="body">
 <div class="card"><b>היקף</b><div class="mut" style="margin-top:6px">~3,000 ק״ג לחודש · מצעים ומגבות · איסוף יומי 06:00 · חוזה 12 חודשים</div></div>
 <div class="card"><b>תנאים</b><div class="mut" style="margin-top:6px">SLA 24 שעות · קנס איחור 2% · תשלום שוהם +45 · נדרשת יכולת 500 ק״ג/יום</div></div>
 <div class="kpis"><div class="kpi"><div class="mut">הצעות</div><b>7</b></div><div class="kpi"><div class="mut">הצעה מובילה</div><b>₪16.4/ק״ג</b></div><div class="kpi"><div class="mut">סגירה</div><b>3 ימים</b></div></div>
 <div class="card" style="margin-top:10px"><b>ההצעה שלך</b><input class="inp" placeholder="מחיר לק״ג (₪)" style="width:100%;margin-top:6px"><button class="btn" style="margin-top:8px" onclick="toast('ההצעה נשלחה למכרז (דמו)')">הגשת הצעה</button></div>
 <div class="note">הצעות סגורות · זכיינות לפי מחיר, דירוג ויכולת</div></div>`}
function vB2bGroup(){return hdr2('רכש משותף ושיתופי פעולה','קנייה קבוצתית מוזלת למכבסות')+`<div class="body">
 ${[['אבקת כביסה תעשייתית · מ״ט','₪4.1/ק״ג במקום ₪5.2','נותרו 8 מקומות · נסגר ב־20.10'],['שקיות אריזה שקופות ×10K','₪310 במקום ₪395','נותרו 3 מקומות'],['כימיקלים לניקוי יבש','חיסכון 15% בהזמנה משותפת','פתוח']].map(d=>`<div class="card"><b>${d[0]}</b><div class="mut" style="margin:4px 0 8px">${d[1]} · ${d[2]}</div><button class="btn tl" onclick="toast('הצטרפת לרכש המשותף (דמו)')">הצטרפות</button></div>`).join('')}
 <div class="card"><b>שיתופי פעולה באזורך</b><div class="mut" style="margin-top:6px">השאלת מכונת 18 ק״ג בשעות עומס · חלוקת שליח קלאסטר · גיבוי תקלות</div></div></div>`}
function vB2bContent(){return hdr2('תוכן ומדריכים לענף','ידע מקצועי למכבסות')+`<div class="body">
 ${[['מדריך תמחור 2026 — איך לתמחר בלי לאבד לקוחות','12 דק׳ קריאה'],['חיסכון במים וחשמל: 9 צעדים שמחזירים 8% מהעלויות','8 דק׳ קריאה'],['וידאו: תחזוקת מייבש תעשייתי — בדיקה שבועית','6 דק׳ צפייה'],['העברת עובדים למודל משמרות גמיש','10 דק׳ קריאה']].map(a=>`<div class="card" style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:14px">${a[0]}</b><span class="mut">${a[1]}</span></div>`).join('')}
 <div class="note">תוכן חדש כל שבוע · מבוסס נתוני פלטפורמה</div></div>`}
function vModules(){const M=[
 ['#/login','כניסה / OTP','אימות'],['#/','חיפוש מכבסות','לקוח'],['#/laundry/achuza','דף מכבסה','לקוח'],['#/cart','סיכום הזמנה','לקוח'],['#/track/4821','מעקב הזמנה','לקוח'],['#/rate','דירוג שירות','לקוח'],['#/club','מועדון לקוחות','לקוח'],['#/sub','המנוי שלי','לקוח'],['#/b2b-account','חשבון עסקי B2B','מלון'],['#/brand','אפליקציה ממותגת','מותג'],
 ['#/manage','לוח ניהול','מכבסה'],['#/manage-prices','מחירון וזמינות','מכבסה'],['#/manage-campaigns','קמפיינים ושימור','מכבסה'],['#/manage-reports','דוחות','מכבסה'],['#/manage-pickups','איסופים והחזרות','מכבסה'],['#/manage-couriers','ניהול שליחים','מכבסה'],
 ['#/courier','המסלול שלי','שליח'],['#/courier-requests','בקשות שיבוץ','שליח'],['#/courier-earnings','רווחים','שליח'],['#/courier-join','הצטרפות כשליח','שליח'],
 ['#/b2b','קהילת מנהלים','B2B'],['#/b2b-forum','פורום מנהלים','B2B'],['#/b2b-tender','מכרז T-104','B2B'],['#/b2b-group','רכש משותף','B2B'],['#/b2b-content','תוכן ומדריכים','B2B'],
 ['#/admin','לוח פלטפורמה','אדמין'],['#/admin-couriers','רשת שליחים','אדמין']];
 return hdr2('כל מסכי הדמו','27 מסכים · ניווט חופשי לכל המודולים')+`<div class="body">
 ${M.map(m=>`<div class="card" style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" onclick="go('${m[0]}')"><div><b>${m[1]}</b><div class="mut">${m[2]}</div></div><span style="color:#8a99a3">‹</span></div>`).join('')}</div>`}

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
 if(seg[0]==='rate')return{html:vRate(),tab:'#/orders'};
 if(seg[0]==='sub')return{html:vSub(),tab:'#/club'};
 if(seg[0]==='b2b-account')return{html:vB2bAccount(),tab:'#/'};
 if(seg[0]==='brand')return{html:vBrand(),tab:'#/'};
 if(seg[0]==='manage-prices')return{html:vManagePrices(),tab:'#/manage'};
 if(seg[0]==='manage-campaigns')return{html:vManageCampaigns(),tab:'#/manage'};
 if(seg[0]==='manage-reports')return{html:vManageReports(),tab:'#/manage'};
 if(seg[0]==='manage-pickups')return{html:vManagePickups(),tab:'#/manage'};
 if(seg[0]==='manage-couriers')return{html:vManageCouriers(),tab:'#/manage'};
 if(seg[0]==='courier-join')return{html:vCourierJoin(),tab:'#/courier'};
 if(seg[0]==='courier-requests')return{html:vCourierRequests(),tab:'#/courier'};
 if(seg[0]==='courier-earnings')return{html:vCourierEarnings(),tab:'#/courier'};
 if(seg[0]==='admin')return{html:vAdmin(),tab:'#/manage'};
 if(seg[0]==='admin-couriers')return{html:vAdminCouriers(),tab:'#/manage'};
 if(seg[0]==='b2b')return{html:vB2b(),tab:'#/'};
 if(seg[0]==='b2b-forum')return{html:vB2bForum(),tab:'#/'};
 if(seg[0]==='b2b-tender')return{html:vB2bTender(),tab:'#/'};
 if(seg[0]==='b2b-group')return{html:vB2bGroup(),tab:'#/'};
 if(seg[0]==='b2b-content')return{html:vB2bContent(),tab:'#/'};
 if(seg[0]==='modules')return{html:vModules(),tab:'#/'};

 return{html:vHome(q),tab:'#/'};
}
function render(){const r=route();$('#app').innerHTML=r.html;renderTabs(r.tab);
 const otp=document.querySelectorAll('#otp input');otp.forEach((inp,i)=>inp.addEventListener('input',()=>{if(inp.value&&otp[i+1])otp[i+1].focus()}));
 window.scrollTo(0,0)}
window.addEventListener('hashchange',render);
render();
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
