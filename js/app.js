/* ============================ STATE ============================ */
const state = { goal:'muscle', split:'auto', days:4, exp:'intermediate', equip:'gym', length:45,
                abs:false, unit:'kg', bw:'', max:{bench:'',squat:'',deadlift:'',press:'',row:''} };
/* Each log is stored against the specific occurrence you did it on
   (week + day + slot + exercise), so it never bleeds onto other days or
   weeks. History for the same exercise drives suggestions for next time. */
const LOG = { sets:{} };  // `${week}:${di}:${li}:${name}` (or `hist:name`) -> entry
let PROGRAM = null, WEEK = 1, EDIT = null;

function occKey(di,li,name){ return `${WEEK}:${di}:${li}:${name}`; }
/* Most recent logged entry for an exercise, across every day/week — used to
   suggest a starting weight/reps the next time it comes up. */
function lastForName(name){
  let best=null;
  for(const k in LOG.sets){ const e=LOG.sets[k];
    if(e && e.name===name && (!best || (e.ts||0)>=(best.ts||0))) best=e; }
  return best;
}
function loggedNames(){ const s=new Set(); for(const k in LOG.sets){ const e=LOG.sets[k]; if(e&&e.name) s.add(e.name); } return s; }

/* persistence — survives reloads on a served page (https or localhost);
   silent no-op if storage is blocked (e.g. opened directly as a file://). */
function saveStore(){ try{ localStorage.setItem('split_log_v2', JSON.stringify(LOG.sets)); }catch(e){} }
/* Bring any stored entry up to the per-set shape {unit,type,sets:[{w,r}],e1rm}.
   Older logs held a single {weight,reps,...}; convert them to one set. */
function normalizeEntry(e){
  if(!e || typeof e!=='object') return null;
  if(Array.isArray(e.sets)){
    if(e.metric==='time' || (e.sets[0] && e.sets[0].sec!=null)){
      const sets=e.sets.filter(s=>s && s.sec>0).map(s=>({sec:s.sec}));
      return sets.length ? {unit:e.unit||'kg', metric:'time', sets, e1rm:null} : null;
    }
    const sets=e.sets.filter(s=>s && s.r>0).map(s=>({w:s.w>0?s.w:0, r:s.r}));
    if(!sets.length) return null;
    const metric = e.metric || (sets.some(s=>s.w>0)||e.type ? 'weight' : 'reps');
    const out={unit:e.unit||'kg', type:e.type, sets, metric, e1rm:null};
    out.e1rm = metric==='weight' ? (e.e1rm!=null?e.e1rm:bestE1RM(out)) : null;
    return out;
  }
  const r=parseInt(e.reps,10); if(!(r>0)) return null;
  const w=e.weight>0?e.weight:0;
  const metric = (w>0||e.type) ? 'weight' : 'reps';
  const out={unit:e.unit||'kg', type:e.type, sets:[{w,r}], metric, e1rm:null};
  out.e1rm = metric==='weight' ? (e.e1rm!=null?e.e1rm:bestE1RM(out)) : null;
  return out;
}
function loadStore(){ try{
  const r2=localStorage.getItem('split_log_v2');
  if(r2){ const o=JSON.parse(r2);
    if(o&&typeof o==='object'){ const out={};
      for(const k in o){ const n=normalizeEntry(o[k]); if(n){ n.name=o[k].name; n.ts=o[k].ts||0; out[k]=n; } }
      LOG.sets=out; }
    return; }
  // migrate the old name-keyed store: those become history-only suggestions
  const r1=localStorage.getItem('split_log_v1');
  if(r1){ const o=JSON.parse(r1);
    if(o&&typeof o==='object'){ for(const name in o){ const n=normalizeEntry(o[name]); if(n){ n.name=name; n.ts=0; LOG.sets['hist:'+name]=n; } } } }
}catch(e){} }

/* Whole-session persistence: the brief, the generated program and the current
   week — so a reload drops you back exactly where you left off. */
function saveSession(){
  try{ localStorage.setItem('split_session_v1', JSON.stringify({state, program:PROGRAM, week:WEEK})); }catch(e){}
}
function loadSession(){
  try{ const r=localStorage.getItem('split_session_v1'); if(!r) return null;
       const o=JSON.parse(r); return (o && o.state) ? o : null; }catch(e){ return null; }
}

/* Reflect the current `state` back onto the brief controls (after a restore). */
function syncBriefUI(){
  document.querySelectorAll('.chips').forEach(group=>{
    const val=String(state[group.dataset.key]);
    group.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed', c.dataset.val===val?'true':'false'));
  });
  document.getElementById('bw').value = state.bw || '';
  document.querySelectorAll('input[data-max]').forEach(inp=>{ inp.value = (state.max&&state.max[inp.dataset.max]) || ''; });
  absBtn.setAttribute('aria-checked', state.abs?'true':'false');
}

document.querySelectorAll('.chips').forEach(group=>{
  const key = group.dataset.key;
  group.addEventListener('click', e=>{
    const btn = e.target.closest('.chip'); if(!btn) return;
    group.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed','false'));
    btn.setAttribute('aria-pressed','true');
    const v = btn.dataset.val;
    state[key] = (key==='days'||key==='length') ? parseInt(v,10) : v;
    saveSession();
  });
});
document.getElementById('bw').addEventListener('input',e=>{ state.bw=e.target.value; saveSession(); });
document.querySelectorAll('input[data-max]').forEach(inp=>{
  inp.addEventListener('input',e=>{ state.max[e.target.dataset.max]=e.target.value; saveSession(); });
});
const absBtn=document.getElementById('absToggle');
absBtn.addEventListener('click',()=>{ state.abs=!state.abs; absBtn.setAttribute('aria-checked', state.abs?'true':'false'); saveSession(); });

/* ===================== RENDER ===================== */
/* Estimated 1RM of a single set (Epley). Dumbbell weight is per-hand, so the
   working load is doubled. Returns null for a set with no external load. */
function setE1RM(entry, s){
  const total = entry.type==='dumbbell' ? s.w*2 : s.w;
  return total>0 ? total*(1+s.r/30) : null;
}
function bestE1RM(entry){
  let best=null;
  entry.sets.forEach(s=>{ const e=setE1RM(entry,s); if(e!=null && (best===null||e>best)) best=e; });
  return best;
}
function logMode(l){
  if(l.w) return 'weight';                                   // external load
  if(typeof PATTERN!=='undefined' && PATTERN[l.name]==='hold') return 'time'; // isometric hold
  return 'reps';                                             // bodyweight reps
}
function loggedText(l, entry){
  const u=entry.unit, dh=entry.type==='dumbbell'?'/hand':'';
  if(entry.metric==='time'){
    return `logged ${entry.sets.map(s=>s.sec).join(' · ')} s`;
  }
  if(entry.metric==='weight' || l.w){
    const parts=entry.sets.map(s=> s.w>0 ? `${fmt(s.w)}×${s.r}` : `bw×${s.r}`);
    return `logged ${parts.join(' · ')} ${u}${dh}`;
  }
  // bodyweight reps — show added weight only if the lifter used some
  const weighted = entry.sets.some(s=>s.w>0);
  if(weighted){
    const parts=entry.sets.map(s=> s.w>0 ? `+${fmt(s.w)}×${s.r}` : `bw×${s.r}`);
    return `logged ${parts.join(' · ')} reps (+${u})`;
  }
  return `logged ${entry.sets.map(s=>s.r).join(' · ')} reps`;
}
/* The current week's training days (each week has its own exercise picks over
   the same fixed structure). Falls back to the single-week shape for sessions
   saved before week-to-week variation existed. */
function curWeekdays(){ return (PROGRAM.weeks && PROGRAM.weeks[WEEK]) || PROGRAM.weekdays; }
function renderProgram(animate){
  const p=PROGRAM, wi=WEEK_INFO[WEEK], factor=WEEK_FACTOR[WEEK];
  const anchors=anchorMaxes(), unit=state.unit;
  const logNames=loggedNames(), anyLog=logNames.size>0;
  const anchorsAvail=Object.values(anchors).some(v=>v);
  const prog=document.getElementById('program');
  let totalSets=0, daysHTML='', delay=0;

  curWeekdays().forEach((d,di)=>{
    if(d.rest){
      daysHTML+=`<div class="day rest"><span class="dow">${d.label}</span><span class="rfocus">Rest</span>
        <span class="rnote">${restNotes[d.label.charCodeAt(0)%restNotes.length]}</span></div>`;
      return;
    }
    delay+=0.06; let finisherShown=false, blockShown=null, liftsHTML='';
    d.lifts.forEach((l,li)=>{
      if(l.finisher && !finisherShown){ liftsHTML+=`<div class="finisher-label">＋ Abs finisher</div>`; finisherShown=true; }
      if(l.addon && l.addon!==blockShown){
        blockShown=l.addon;
        liftsHTML+=`<div class="finisher-label addon-label">＋ ${l.addon}
          <button class="blockrm" data-di="${di}" data-title="${l.addon}" title="Remove this block" aria-label="Remove the ${l.addon} block">✕</button></div>`;
      }
      const v=weekAdjust(l.base,WEEK,l.compound);
      if(v.sets) totalSets+=parseInt(v.sets,10);
      const mode = logMode(l);
      const rxTxt = v.sets ? (mode==='time' ? `${v.sets} × hold` : `${v.sets} × ${v.reps}`) : v.reps;
      const done = LOG.sets[occKey(di,li,l.name)];       // logged on THIS day/week
      const suggest = done ? null : lastForName(l.name);  // else: last time you did it
      const src = done || suggest;                        // prefill source for the logger
      let metaTxt=v.rest, num='';
      if(v.sets!==''){
        const load=suggestLoad(l, v.reps, WEEK, anchors, unit);
        if(load){ metaTxt=`<span class="load">${load.txt}</span> · ${v.rest}`; if(load.num!=null) num=load.num; }
      }
      const key=`${di}:${li}`;
      const loggable = v.sets!=='';
      const open = EDIT===key;
      let loggedLine='';
      if(done){
        const be=bestE1RM(done);
        const beTxt = be!=null ? ` <span class="e1rm">e1RM ${fmt(Math.round(be))} ${done.unit}</span>` : '';
        loggedLine = `<div class="logged">✓ ${loggedText(l,done)}${beTxt}</div>`;
      } else if(suggest){
        loggedLine = `<div class="suggest">↝ last: ${loggedText(l,suggest).replace(/^logged /,'')}</div>`;
      }
      const chevron = `<span class="liftexp" aria-hidden="true">${open?'▾':'▸'}</span>`;
      liftsHTML+=`<div class="lift expandable${open?' open':''}" data-k="${key}" data-di="${di}" data-li="${li}" role="button" tabindex="0" aria-expanded="${open}">
        <div class="nm">${l.name}<em>${v.tag}</em></div>
        <div class="prescribe"><div class="rx">${rxTxt}</div><div class="meta">${metaTxt}</div></div>
        ${chevron}
        <button class="swap" data-di="${di}" data-li="${li}" aria-label="Swap ${l.name}" title="Swap this exercise">⇄</button>
        ${loggedLine}
      </div>`;
      if(open){
        let logHTML='';
        if(loggable){
          const nSets=parseInt(v.sets,10)||1;
          const rows=Math.max(nSets, src?src.sets.length:0);
          const dh = l.w && l.w[2]==='dumbbell' ? ' /hand' : '';
          const targetR=repTop(v.reps);
          let head, rowsHTML='';
          for(let i=0;i<rows;i++){
            const s = src && src.sets[i];
            if(mode==='time'){
              const pv = s ? s.sec : '';
              rowsHTML+=`<div class="lb-set">
                <span class="lb-n">Set ${i+1}</span>
                <input class="lt" type="number" inputmode="numeric" value="${pv}" placeholder="—" aria-label="Set ${i+1} hold seconds">
                <span class="lb-u">sec</span>
              </div>`;
            } else if(mode==='weight'){
              const pw = s ? (s.w>0?s.w:'') : (num!==''?num:'');
              const pr = s ? s.r : targetR;
              rowsHTML+=`<div class="lb-set">
                <span class="lb-n">Set ${i+1}</span>
                <input class="lw" type="number" inputmode="decimal" value="${pw}" placeholder="—" aria-label="Set ${i+1} weight ${unit}${dh}">
                <span class="lb-x">×</span>
                <input class="lr" type="number" inputmode="numeric" value="${pr}" placeholder="reps" aria-label="Set ${i+1} reps">
              </div>`;
            } else { // reps (bodyweight) — reps first, added weight optional/hidden
              const pr = s ? s.r : targetR;
              const pw = s ? (s.w>0?s.w:'') : '';
              rowsHTML+=`<div class="lb-set">
                <span class="lb-n">Set ${i+1}</span>
                <input class="lr" type="number" inputmode="numeric" value="${pr}" placeholder="—" aria-label="Set ${i+1} reps">
                <span class="lb-u">reps</span>
                <input class="lw opt" type="number" inputmode="decimal" value="${pw}" placeholder="+${unit}" aria-label="Set ${i+1} added weight ${unit}">
              </div>`;
            }
          }
          head = mode==='time' ? 'Log each set — hold time in seconds'
               : mode==='weight' ? `Log each set — weight ${unit}${dh} × completed reps`
               : 'Log each set — completed reps';
          const showWeight = mode==='reps' && src && src.metric!=='time' && src.sets.some(s=>s.w>0);
          const addWtBtn = mode==='reps' ? `<button class="addwt" type="button">＋ Add weight (vest / belt)</button>` : '';
          logHTML=`<div class="logbox${showWeight?' show-weight':''}" data-di="${di}" data-li="${li}">
            <div class="lb-head">${head}</div>
            <div class="lb-sets">${rowsHTML}</div>
            ${addWtBtn}
            <div class="lb-foot">
              ${done?`<button class="logclear" data-di="${di}" data-li="${li}">Clear</button>`:'<span></span>'}
              <div class="lb-btns">
                <button class="logcancel" type="button">Cancel</button>
                <button class="logsave" type="button">Save sets</button>
              </div>
            </div>
          </div>`;
        }
        liftsHTML+=`<div class="expando">${howtoBlock(l)}${logHTML}</div>`;
      }
    });
    const pct=Math.round(Math.max(.2,Math.min(1,d.inten*factor))*100);
    const style = animate ? `style="animation-delay:${delay.toFixed(2)}s"` : '';
    daysHTML+=`<div class="day train" ${style}>
      <div class="day-top"><span class="dow">${d.label}</span><span class="focus">${d.type}</span>
        <span class="intensity"><div class="lab">${intensityLabel(d.inten*factor)}</div>
          <div class="bar"><i data-w="${pct}"></i></div></span></div>
      <div class="lifts">${liftsHTML}</div></div>`;
  });

  const weekPills=[1,2,3,4,5].map(w=>`<button class="wk${w===5?' deload':''}" data-wk="${w}" aria-pressed="${w===WEEK}">${w===5?'Deload':'Wk '+w}</button>`).join('');
  const wtNote = anyLog ? `weights <span class="wt">personalised from your logged sets</span>`
      : (anchorsAvail ? `<span class="wt">≈ weights</span> from your numbers, scaled per week`
      : `tap a lift to <span class="wt">log every set</span>, or add a max in the brief, for suggested weights`);
  const logCount=logNames.size;

  prog.innerHTML=`
    <div class="prog-head">
      <div class="rail"></div>
      <div class="prog-eyebrow">${p.days}-day week · ${p.splitName}${p.abs?' · +abs':''}</div>
      <h2 class="prog-title">${p.meta.title}</h2>
      <p class="prog-sub">${p.meta.sub}</p>
      <div class="stats">
        <div class="stat"><div class="k">Sessions</div><div class="v">${p.days}<small>/wk</small></div></div>
        <div class="stat"><div class="k">Working sets</div><div class="v">${totalSets}<small>/wk</small></div></div>
        <div class="stat"><div class="k">Logged lifts</div><div class="v">${logCount}</div></div>
      </div>
      <div class="weeks" role="group" aria-label="Progression week">${weekPills}</div>
      <div class="wknote"><b>${wi.tag}</b><span>${wi.note}</span></div>
    </div>
    <div class="hint">↻ regenerate · ⇄ swap · tap a lift to log every set · tap a week — same split, fresh exercises<br>${wtNote}</div>
    <div class="week${animate?'':' static'}">${daysHTML}</div>
    <div class="actions">
      <button class="ghost" id="regen">↻ Regenerate exercises</button>
      <button class="ghost" id="edit">↑ Change brief</button>
      ${anyLog?`<button class="ghost" id="clearlog">⌫ Clear all logs (${logCount})</button>`:''}
    </div>`;

  prog.classList.remove('hidden');
  document.getElementById('empty').classList.add('hidden');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    prog.querySelectorAll('.bar i').forEach(el=>{ el.style.width=el.dataset.w+'%'; });
  }));
  if(EDIT){ const box=prog.querySelector('.logbox .lb-set input'); if(box) box.focus(); }
  if(typeof refreshAddonUI==='function') refreshAddonUI();   // optional AI add-on panel
  saveSession();
}

/* ===================== LOGGING + INTERACTIONS ===================== */
/* Read every set row in the open log box and store them against THIS
   occurrence (week + day + slot + exercise). A set counts only if reps (or
   seconds) were entered. Saving with nothing clears this occurrence's log. */
function logSets(box){
  const di=+box.dataset.di, li=+box.dataset.li;
  const l=curWeekdays()[di].lifts[li];
  const mode=logMode(l);
  const sets=[];
  box.querySelectorAll('.lb-set').forEach(row=>{
    if(mode==='time'){
      const sec=parseInt(row.querySelector('.lt').value,10);
      if(sec>0) sets.push({ sec });
    } else {
      const r=parseInt(row.querySelector('.lr').value,10);
      if(!(r>0)) return;
      const wi=row.querySelector('.lw');
      const w=wi?parseFloat(wi.value):NaN;
      sets.push({ w:w>0?w:0, r });
    }
  });
  const key=occKey(di,li,l.name);
  if(!sets.length){ delete LOG.sets[key]; saveStore(); EDIT=null; renderProgram(false); return; }
  const entry={ unit:state.unit, type: l.w?l.w[2]:undefined, sets, metric:mode, name:l.name, ts:Date.now() };
  entry.e1rm = mode==='weight' ? bestE1RM(entry) : null;
  LOG.sets[key]=entry; saveStore(); EDIT=null; renderProgram(false);
}
function clearLog(di,li){ const l=curWeekdays()[di].lifts[li]; delete LOG.sets[occKey(di,li,l.name)]; saveStore(); renderProgram(false); }
/* Every week's copy of a given day — an AI block may span all weeks. */
function allWeekDays(di){
  const out=[];
  if(PROGRAM.weeks){ for(const w in PROGRAM.weeks){ const d=PROGRAM.weeks[w][di]; if(d && !d.rest) out.push(d); } }
  else if(PROGRAM.weekdays[di] && !PROGRAM.weekdays[di].rest) out.push(PROGRAM.weekdays[di]);
  return out;
}
function removeBlock(di,title){
  allWeekDays(di).forEach(day=>{
    day.lifts = day.lifts.filter(l=>l.addon!==title);
    day.inten = dayIntensity(day.lifts, PROGRAM.goal);
  });
  EDIT=null; renderProgram(false);
}
function swapLift(di,li){
  const day=curWeekdays()[di]; if(!day||day.rest) return;
  const cur=day.lifts[li], group=cur.group;
  const used=new Set(day.lifts.map(l=>l.name));
  let pool=getPool(group,PROGRAM.equip).filter(x=>!used.has(x.n));
  if(!pool.length) pool=getPool(group,PROGRAM.equip).filter(x=>x.n!==cur.name);
  if(!pool.length) return;
  const ex=pool[Math.floor(Math.random()*pool.length)];
  const nl=mkLift(ex,group,PROGRAM.goal,cur.finisher);
  if(cur.finisher) nl.base={sets:'3',reps:'12–15',rest:'30 s',tag:'abs'};
  day.lifts[li]=nl; day.inten=dayIntensity(day.lifts,PROGRAM.goal);
  EDIT=null; renderProgram(false);
}
document.getElementById('program').addEventListener('click', e=>{
  const br=e.target.closest('.blockrm'); if(br){ removeBlock(+br.dataset.di, br.dataset.title); return; }
  const aw=e.target.closest('.addwt'); if(aw){ aw.closest('.logbox').classList.toggle('show-weight'); return; }
  const sv=e.target.closest('.logsave'); if(sv){ logSets(sv.closest('.logbox')); return; }
  const cc=e.target.closest('.logcancel'); if(cc){ EDIT=null; renderProgram(false); return; }
  const cl=e.target.closest('.logclear'); if(cl){ clearLog(+cl.dataset.di,+cl.dataset.li); return; }
  const wk=e.target.closest('.wk'); if(wk){ EDIT=null; WEEK=parseInt(wk.dataset.wk,10); renderProgram(false); return; }
  const sw=e.target.closest('.swap'); if(sw){ swapLift(+sw.dataset.di,+sw.dataset.li); return; }
  const lift=e.target.closest('.lift'); if(lift && lift.dataset.k){ const k=lift.dataset.k; EDIT=(EDIT===k?null:k); renderProgram(false); return; }
  if(e.target.closest('#regen')){ EDIT=null; PROGRAM=generate(); WEEK=1; renderProgram(true); return; }
  if(e.target.closest('#edit')){ document.querySelector('.brief').scrollIntoView({behavior:'smooth',block:'start'}); return; }
  if(e.target.closest('#clearlog')){ if(confirm('Clear all logged sets? This cannot be undone.')){ LOG.sets={}; saveStore(); renderProgram(false); } return; }
});
/* Keyboard: Enter/Space toggles a focused lift row (but not while typing in it). */
document.getElementById('program').addEventListener('keydown', e=>{
  if(e.key!=='Enter' && e.key!==' ') return;
  if(e.target.closest('input,button')) return;
  const lift=e.target.closest('.lift'); if(!lift || !lift.dataset.k) return;
  e.preventDefault();
  const k=lift.dataset.k; EDIT=(EDIT===k?null:k); renderProgram(false);
});
document.getElementById('build').addEventListener('click',()=>{
  EDIT=null; PROGRAM=generate(); WEEK=1; renderProgram(true);
  requestAnimationFrame(()=>document.getElementById('program').scrollIntoView({behavior:'smooth',block:'start'}));
});

/* On load: restore logs, then the last session (brief + program + week). */
loadStore();
(function restore(){
  const sess = loadSession();
  if(!sess) return;
  Object.assign(state, sess.state);
  if(!state.max) state.max = {bench:'',squat:'',deadlift:'',press:'',row:''};
  syncBriefUI();
  if(sess.program){ PROGRAM = sess.program; WEEK = sess.week || 1; renderProgram(false); }
})();
