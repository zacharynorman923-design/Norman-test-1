/* ================ RIGHT HIP IR · PROGRESS + REMINDERS ================
   The tracking side of the "Right Hip Mobility (IR Restriction)" routine:
   a weekly seated internal-rotation check (right and left, in degrees, with
   an optional photo), the right-vs-left gap over the four weeks, a week-4
   verdict, and two reminders. The blocks themselves live in the plan like
   any other routine; this panel only appears once the routine is in it (or
   once there are checks to show).

   Reminders: a web page can't schedule a notification for when it's closed,
   so the evening reminder comes two ways — a calendar file (fires even with
   the app closed) and an in-app nudge whenever the app is open past the
   reminder time. The sitting reminder only runs while the app is open. */

const IR_KEY = 'split_irhip_v1';
const IR_AB = 'Right hip IR · A+B Mobility & control';
const IR_C  = 'Right hip IR · C Strength';
const IR_WEEKS = 4;
const IR_NORMAL = [30, 45];
let IR = { start:'', checks:[], remind:{on:true, time:'19:00', last:''}, sit:{on:false, every:45} };

/* ---- dates, as local calendar days ---- */
const irPad = n => String(n).padStart(2,'0');
function irISO(d){ return d.getFullYear()+'-'+irPad(d.getMonth()+1)+'-'+irPad(d.getDate()); }
function irDate(iso){ const [y,m,d]=String(iso).split('-').map(Number); return new Date(y, m-1, d); }
function irDays(a, b){ return Math.round((irDate(b)-irDate(a))/86400000); }
function irFmt(iso, opts){ return irDate(iso).toLocaleDateString(undefined, opts||{weekday:'short', day:'numeric', month:'short'}); }
function irToday(){ return irISO(new Date()); }
function irNextSunday(){ const d=new Date(); d.setDate(d.getDate()+((7-d.getDay())%7)); return irISO(d); }

/* ---- storage ---- */
function irSave(){ try{ localStorage.setItem(IR_KEY, JSON.stringify(IR)); }catch(e){} }
function irLoad(){
  try{
    const o=JSON.parse(localStorage.getItem(IR_KEY)||'null');
    if(o && typeof o==='object') irRestore(o, true);
  }catch(e){}
}
function irRestore(o, quiet){
  IR = {
    start: typeof o.start==='string' ? o.start : '',
    checks: Array.isArray(o.checks) ? o.checks.filter(c=>c && c.d && isFinite(c.r) && isFinite(c.l)) : [],
    remind: Object.assign({on:true, time:'19:00', last:''}, o.remind||{}),
    sit: Object.assign({on:false, every:45}, o.sit||{}),
  };
  IR.checks.sort((a,b)=>a.d<b.d?-1:1);
  if(!quiet){ irSave(); irRender(); }
}
/* Called when the routine goes into the plan. Starts the four weeks, unless a
   block is already running (or finished less than a week ago). */
function irStart(){
  if(!IR.start || irDays(IR.start, irToday()) > IR_WEEKS*7+7){ IR.start=irToday(); }
  irSave();
}

/* ---- what's happened ---- */
function irInPlan(){
  if(!PROGRAM) return false;
  const weeks = PROGRAM.weeks ? Object.values(PROGRAM.weeks) : [PROGRAM.weekdays];
  return weeks.some(days=>days.some(d=>d && d.lifts && d.lifts.some(l=>l.addon===IR_AB || l.addon===IR_C)));
}
/* Calendar days on which any set of a block was logged. */
function irLoggedDays(block){
  const s=new Set();
  for(const k in LOG.sets){ const e=LOG.sets[k]; if(e && e.addon===block && e.ts) s.add(irISO(new Date(e.ts))); }
  return s;
}
function irWeekNo(){ return IR.start ? Math.floor(irDays(IR.start, irToday())/7)+1 : 1; }
function irGap(c){ return c.l - c.r; }     // the right side is the restricted one
function irWeekOf(iso){ return Math.floor(irDays(IR.start, iso)/7)+1; }

/* ---- chart: both sides over time, the normal band, and the gap ---- */
function irChart(){
  const C=IR.checks;
  if(!C.length) return `<div class="ir-empty">No checks yet. Your first one sets the baseline.</div>`;
  const W=320, H=170, L=30, R=20, T=12, B=26, maxY=60;
  const x=i=> C.length===1 ? (L+(W-R))/2 : L + i*((W-R-L)/(C.length-1));
  const y=v=> T + (1-Math.max(0,Math.min(maxY,v))/maxY)*(H-T-B);
  const line=(k,cls)=>`<polyline class="${cls}" points="${C.map((c,i)=>x(i).toFixed(1)+','+y(c[k]).toFixed(1)).join(' ')}"/>`
    + C.map((c,i)=>`<circle class="${cls}" cx="${x(i).toFixed(1)}" cy="${y(c[k]).toFixed(1)}" r="3.4"><title>${c[k]}°</title></circle>`).join('');
  const grid=[0,15,30,45,60].map(v=>`<line class="ir-grid" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text class="ir-ax" x="${L-6}" y="${y(v)+3.5}" text-anchor="end">${v}°</text>`).join('');
  const band=`<rect class="ir-band" x="${L}" y="${y(IR_NORMAL[1])}" width="${W-R-L}" height="${y(IR_NORMAL[0])-y(IR_NORMAL[1])}"/>`
    + `<text class="ir-bandt" x="${L+5}" y="${y(IR_NORMAL[0])-4}">normal ${IR_NORMAL[0]}–${IR_NORMAL[1]}°</text>`;
  const gaps=C.map((c,i)=>{
    const ya=y(c.r), yb=y(c.l);
    return `<line class="ir-gapl" x1="${x(i).toFixed(1)}" x2="${x(i).toFixed(1)}" y1="${ya.toFixed(1)}" y2="${yb.toFixed(1)}"/>`;
  }).join('');
  const anchor=i=> C.length>1 && i===C.length-1 ? 'end' : (C.length>1 && i===0 ? 'start' : 'middle');
  const labels=C.map((c,i)=>`<text class="ir-ax" x="${x(i).toFixed(1)}" y="${H-8}" text-anchor="${anchor(i)}">${irFmt(c.d,{day:'numeric',month:'short'})}</text>`).join('');
  return `<svg class="ir-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Seated internal rotation, right and left, over time">
    ${band}${grid}${gaps}${line('l','ir-left')}${line('r','ir-right')}${labels}</svg>
    <div class="ir-legend"><span class="k r"></span>Right <span class="k l"></span>Left <span class="k g"></span>Gap</div>`;
}

/* ---- week-by-week: sessions done and the check ---- */
function irWeeksTable(){
  if(!IR.start) return '';
  const ab=irLoggedDays(IR_AB), c=irLoggedDays(IR_C), now=irWeekNo();
  const rows=[];
  for(let w=1; w<=IR_WEEKS; w++){
    const from=irDate(IR.start); from.setDate(from.getDate()+(w-1)*7);
    const days=[...Array(7)].map((_,i)=>{ const d=new Date(from); d.setDate(d.getDate()+i); return irISO(d); });
    const nAB=days.filter(d=>ab.has(d)).length, nC=days.filter(d=>c.has(d)).length;
    const chk=IR.checks.filter(k=>irWeekOf(k.d)===w).slice(-1)[0];
    const cls = w===now ? ' class="cur"' : (w>now ? ' class="later"' : '');
    rows.push(`<tr${cls}><td>Wk ${w}</td>
      <td><span class="ir-dots">${days.map(d=>`<i class="${ab.has(d)?'on':''}${d===irToday()?' today':''}"></i>`).join('')}</span> ${nAB}/7</td>
      <td>${nC}/3</td>
      <td>${chk ? `${chk.r}° / ${chk.l}° <b>Δ ${irGap(chk)}°</b>` : (w<now ? '—' : '')}</td></tr>`);
  }
  return `<table class="ir-weeks"><thead><tr><th></th><th>A + B days</th><th>C</th><th>Check R / L</th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
}

/* ---- the week-4 verdict ---- */
function irVerdict(){
  const wk=irWeekNo(), C=IR.checks;
  if(!IR.start || wk < IR_WEEKS) return '';
  if(C.length < 2) return `<p class="ir-verdict">Week ${Math.min(wk,IR_WEEKS)}: log at least two checks (a baseline and a later one) to see whether the gap has narrowed.</p>`;
  const g0=irGap(C[0]), g1=irGap(C[C.length-1]);
  if(g1 < g0) return `<p class="ir-verdict ok">The gap has narrowed from ${g0}° to ${g1}°. Keep the daily A + B going.</p>`;
  return `<p class="ir-verdict warn"><b>Consider PT evaluation / hip X-ray.</b> The right-vs-left gap hasn't narrowed (${g0}° at the start, ${g1}° now) after ${IR_WEEKS} weeks of daily work. A restriction that doesn't respond to mobility work can come from the joint's shape rather than tight muscles, and that's worth having checked.</p>`;
}

/* ---- render ---- */
const irSec=document.getElementById('irtrack'), irBody=document.getElementById('irBody');
let irPhoto=null;            // the downscaled photo waiting to be saved with a check
function irRender(){
  if(!irSec) return;
  const show = irInPlan() || IR.checks.length>0;
  irSec.classList.toggle('hidden', !show);
  if(!show) return;
  const wk=irWeekNo();
  document.getElementById('irWeek').textContent = IR.start ? (wk<=IR_WEEKS ? `week ${wk} of ${IR_WEEKS}` : `${IR_WEEKS} weeks done`) : '';
  const today=irToday(), sun=new Date().getDay()===0;
  // a week runs Sunday to Saturday, so a check counts from the latest Sunday on
  const lastSun=new Date(); lastSun.setDate(lastSun.getDate()-lastSun.getDay());
  const thisWeek=IR.checks.some(c=>c.d>=irISO(lastSun));
  const nextSun=new Date(lastSun); nextSun.setDate(nextSun.getDate()+7);
  const due = thisWeek ? `<span class="ir-due ok">✓ checked this week · next ${irFmt(irISO(nextSun))}</span>`
            : sun ? `<span class="ir-due now">Due today</span>` : `<span class="ir-due">Next check · ${irFmt(irNextSunday())}</span>`;
  const last=IR.checks[IR.checks.length-1];
  const list=IR.checks.slice().reverse().map(c=>`<li>
      ${c.photo?`<img class="ir-thumb" src="${c.photo}" alt="Check photo, ${irFmt(c.d)}">`:'<span class="ir-thumb none"></span>'}
      <span class="ir-d">${irFmt(c.d,{day:'numeric',month:'short'})}${IR.start?` <i>wk ${irWeekOf(c.d)}</i>`:''}</span>
      <span class="ir-v">R ${c.r}° · L ${c.l}°</span><b class="ir-g">Δ ${irGap(c)}°</b>
      <button class="ir-del" type="button" data-d="${c.d}" aria-label="Delete the check from ${irFmt(c.d)}">✕</button></li>`).join('');
  const notifOK = typeof Notification!=='undefined';
  const perm = notifOK ? Notification.permission : 'unsupported';
  irBody.innerHTML = `
    <div class="field" style="border-top:none;padding-top:8px">
      <label class="flabel">This block</label>
      ${irWeeksTable()}
      <p class="ir-sub">A + B every day, C on three days. Dots fill in as you log sets.</p>
    </div>

    <div class="field">
      <label class="flabel">Weekly check · Sundays ${due}</label>
      <details class="ir-how"><summary>How to measure</summary>
        <p>Sit on the edge of a chair, knees bent 90° and thighs still. Turn one foot out as far as it goes without the thigh moving or the hip lifting; that turns the hip inward. Measure the shin's angle from vertical. A clinometer or level app laid along the shin works. Do both sides the same way, at about the same time of day.</p></details>
      <div class="ir-form">
        <label class="numin"><span>Date</span><input id="irDate" type="date" value="${today}" max="${today}"></label>
        <label class="numin"><span>Right °</span><input id="irR" type="number" inputmode="numeric" min="0" max="90" placeholder="—"></label>
        <label class="numin"><span>Left °</span><input id="irL" type="number" inputmode="numeric" min="0" max="90" placeholder="—"></label>
      </div>
      <div class="ir-photo">
        <button class="linkbtn" id="irPhotoBtn" type="button">${irPhoto?'✓ Photo added · change':'＋ Add a photo (optional)'}</button>
        <input type="file" id="irPhotoIn" accept="image/*" hidden>
        <button class="build ir-save" id="irSaveBtn" type="button">Save check <span class="arrow">→</span></button>
      </div>
      <div id="irStatus" class="addon-status" role="status" aria-live="polite"></div>
    </div>

    <div class="field">
      <label class="flabel">Right vs left${last?` · gap now ${irGap(last)}°`:''}</label>
      ${irChart()}
      ${irVerdict()}
      ${list?`<ul class="ir-list">${list}</ul>`:''}
    </div>

    <div class="field">
      <label class="flabel">Reminders</label>
      <div class="ir-rem">
        <div class="tf-text"><b>A + B every evening</b><span class="sub">The app nudges you when it's open past this time and today's A + B isn't logged. Add it to your calendar to get it even when the app is closed.</span></div>
        <button class="switch" id="irRemOn" role="switch" aria-checked="${IR.remind.on}" aria-label="Daily A plus B reminder"><span class="knob"></span></button>
      </div>
      <div class="ir-remrow">
        <label class="numin ir-time"><span>Time</span><input id="irRemTime" type="time" value="${IR.remind.time}"></label>
        <button class="chip" id="irIcs" type="button">⭳ Add to calendar<small>daily · 4 weeks + Sunday checks</small></button>
      </div>
      <div class="ir-rem">
        <div class="tf-text"><b>Stand up while sitting</b><span class="sub">A nudge to get up and move every ${IR.sit.every} minutes. Only runs while the app is open, e.g. in a tab at your desk.</span></div>
        <button class="switch" id="irSitOn" role="switch" aria-checked="${IR.sit.on}" aria-label="Stand-up reminder"><span class="knob"></span></button>
      </div>
      <div class="chips ir-every" role="group" aria-label="Stand-up interval">
        ${[30,45].map(m=>`<button class="chip mini" data-every="${m}" aria-pressed="${IR.sit.every===m}">${m} min</button>`).join('')}
      </div>
      ${perm==='default' && (IR.remind.on || IR.sit.on) ? `<button class="linkbtn ir-perm" id="irPerm" type="button">Allow notifications so reminders can pop up</button>` : ''}
      ${perm==='denied' ? `<p class="ir-sub">Notifications are blocked for this site, so reminders show inside the app only.</p>` : ''}
    </div>`;
}

/* ---- saving a check ---- */
function irStatus(msg, kind){ const el=document.getElementById('irStatus'); if(el){ el.textContent=msg; el.className='addon-status'+(kind?' '+kind:''); } }
function irSaveCheck(){
  const d=document.getElementById('irDate').value || irToday();
  const r=parseFloat(document.getElementById('irR').value), l=parseFloat(document.getElementById('irL').value);
  if(!(r>=0 && r<=90) || !(l>=0 && l<=90)){ irStatus('Enter both angles in degrees (0–90).','err'); return; }
  const c={d, r:Math.round(r), l:Math.round(l)};
  if(irPhoto) c.photo=irPhoto;
  IR.checks=IR.checks.filter(x=>x.d!==d).concat(c).sort((a,b)=>a.d<b.d?-1:1);
  if(!IR.start) IR.start=d;
  irPhoto=null;
  irSave(); irRender();
  irStatus(`Saved ${irFmt(d)}: right ${c.r}°, left ${c.l}°, gap ${irGap(c)}°.`,'ok');
}
/* Photos are shrunk to 640 px JPEGs so a month of them fits in the browser's
   storage alongside everything else. */
function irReadPhoto(file){
  const img=new Image(), url=URL.createObjectURL(file);
  img.onload=()=>{
    const k=Math.min(1, 640/Math.max(img.width, img.height));
    const cv=document.createElement('canvas'); cv.width=Math.round(img.width*k); cv.height=Math.round(img.height*k);
    cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
    irPhoto=cv.toDataURL('image/jpeg', 0.72);
    URL.revokeObjectURL(url);
    const keep={r:document.getElementById('irR').value, l:document.getElementById('irL').value, d:document.getElementById('irDate').value};
    irRender();
    document.getElementById('irR').value=keep.r; document.getElementById('irL').value=keep.l; document.getElementById('irDate').value=keep.d;
    irStatus('Photo ready. It saves with the check.','ok');
  };
  img.onerror=()=>{ URL.revokeObjectURL(url); irStatus('Could not read that image.','err'); };
  img.src=url;
}

/* ---- calendar file: the reminder that works with the app closed ---- */
function irICS(){
  const [hh,mm]=(IR.remind.time||'19:00').split(':');
  // from today for what's left of the four weeks (a fresh four if they're over)
  const start=new Date(); start.setHours(0,0,0,0);
  const used = IR.start ? Math.max(0, irDays(IR.start, irToday())) : 0;
  const left = used < IR_WEEKS*7 ? IR_WEEKS*7-used : IR_WEEKS*7;
  const ymd=d=>d.getFullYear()+irPad(d.getMonth()+1)+irPad(d.getDate());
  const sunday=new Date(start); sunday.setDate(sunday.getDate()+((7-sunday.getDay())%7));
  const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
  const ev=(uid, day, summary, desc, rrule)=>[
    'BEGIN:VEVENT', `UID:${uid}-${ymd(start)}@split`, `DTSTAMP:${stamp}`,
    `DTSTART:${ymd(day)}T${hh}${mm}00`, 'DURATION:PT15M', `RRULE:${rrule}`,
    `SUMMARY:${summary}`, `DESCRIPTION:${desc}`,
    'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', `DESCRIPTION:${summary}`, 'END:VALARM',
    'END:VEVENT'];
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//SPLIT//Right hip IR//EN','CALSCALE:GREGORIAN',
    ...ev('irhip-ab', start, 'Right hip: Blocks A + B', 'Mobility then active control\\, about 14 minutes. Log it in SPLIT.', `FREQ=DAILY;COUNT=${left}`),
    ...ev('irhip-check', sunday, 'Right hip: weekly IR check', 'Seated internal rotation\\, right and left\\, in degrees. Log it in SPLIT.', `FREQ=WEEKLY;BYDAY=SU;COUNT=${Math.max(1, Math.ceil(left/7))}`),
    'END:VCALENDAR'];
  const blob=new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar'});
  const url=URL.createObjectURL(blob), a=document.createElement('a');
  a.href=url; a.download='right-hip-reminders.ics';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}

/* ---- in-app reminders ---- */
const irToastEl=document.getElementById('irToast');
let irSitAt=Date.now();
function irNotify(title, body, tag){
  if(irToastEl){
    irToastEl.innerHTML=`<b>${title}</b><span>${body}</span><button type="button" aria-label="Dismiss">✕</button>`;
    irToastEl.classList.remove('hidden');
  }
  if(typeof restChime==='function') restChime();
  try{
    if(typeof Notification!=='undefined' && Notification.permission==='granted'){
      const opts={body, tag, icon:'icons/icon-192.png', badge:'icons/icon-192.png'};
      if(navigator.serviceWorker && navigator.serviceWorker.controller)
        navigator.serviceWorker.ready.then(r=>r.showNotification(title, opts)).catch(()=>{ new Notification(title, opts); });
      else new Notification(title, opts);
    }
  }catch(e){}
}
function irTick(){
  const now=new Date(), today=irISO(now);
  if(irInPlan() && IR.remind.on && IR.remind.last!==today){
    const [h,m]=(IR.remind.time||'19:00').split(':').map(Number);
    if(now.getHours()*60+now.getMinutes() >= h*60+m){
      IR.remind.last=today; irSave();
      if(!irLoggedDays(IR_AB).has(today)) irNotify('Right hip: time for A + B', 'Mobility, then active control, about 14 minutes.', 'irhip-ab');
    }
  }
  if(IR.sit.on && Date.now()-irSitAt >= IR.sit.every*60000){
    irSitAt=Date.now();
    irNotify('Stand up and move', `You've been at it for ${IR.sit.every} minutes. Walk for a minute or do a few slow hip circles.`, 'irhip-sit');
  }
}
function irAskPermission(){
  try{ if(typeof Notification!=='undefined' && Notification.permission==='default') Notification.requestPermission().then(()=>irRender()); }catch(e){}
}

/* ---- events ---- */
if(irSec){
  irSec.addEventListener('click', e=>{
    if(e.target.closest('#irSaveBtn')){ irSaveCheck(); return; }
    if(e.target.closest('#irPhotoBtn')){ document.getElementById('irPhotoIn').click(); return; }
    const del=e.target.closest('.ir-del');
    if(del){ if(confirm('Delete this check?')){ IR.checks=IR.checks.filter(c=>c.d!==del.dataset.d); irSave(); irRender(); } return; }
    if(e.target.closest('#irRemOn')){ IR.remind.on=!IR.remind.on; irSave(); if(IR.remind.on) irAskPermission(); irRender(); return; }
    if(e.target.closest('#irSitOn')){ IR.sit.on=!IR.sit.on; irSitAt=Date.now(); irSave(); if(IR.sit.on) irAskPermission(); irRender(); return; }
    const ev=e.target.closest('[data-every]');
    if(ev){ IR.sit.every=+ev.dataset.every; irSitAt=Date.now(); irSave(); irRender(); return; }
    if(e.target.closest('#irIcs')){ irICS(); return; }
    if(e.target.closest('#irPerm')){ irAskPermission(); return; }
  });
  irSec.addEventListener('change', e=>{
    if(e.target.id==='irPhotoIn'){ const f=e.target.files && e.target.files[0]; if(f) irReadPhoto(f); e.target.value=''; return; }
    if(e.target.id==='irRemTime'){ IR.remind.time=e.target.value||'19:00'; IR.remind.last=''; irSave(); }
  });
}
if(irToastEl) irToastEl.addEventListener('click', e=>{ if(e.target.closest('button')) irToastEl.classList.add('hidden'); });
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='visible'){ irTick(); irRender(); } });

irLoad();
irRender();
setInterval(irTick, 30000);
setTimeout(irTick, 1500);
