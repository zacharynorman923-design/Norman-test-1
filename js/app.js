/* The deployed version, shown in the footer so you can tell which build is
   running. Keep in step with VERSION in sw.js. */
const APP_VERSION = 'split-v24';
/* ============================ STATE ============================ */
const state = { goal:'muscle', split:'auto', days:4, exp:'intermediate', equip:'gym', length:45,
                abs:false, cardio:'all', unit:'kg', bw:'',
                max:{bench:'',squat:'',deadlift:'',press:'',row:''} };
/* Each log is stored against the specific occurrence you did it on
   (week + day + slot + exercise), so it never bleeds onto other days or
   weeks. History for the same exercise drives suggestions for next time. */
const LOG = { sets:{} };  // `${week}:${di}:${li}:${name}` (or `hist:name`) -> entry
let PROGRAM = null, WEEK = 1, EDIT = null;
/* Difficulty picked before any set of that lift is logged — held here until
   there is an entry to attach it to. */
const PENDING_DIFF = {};
/* Which set row to focus after the next render: null = the first one,
   {row:-1} = leave focus where it is. */
let FOCUS = null;
/* Whether the movement demo is shown large — stays as you leave it. */
let BIGDEMO = false;

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
/* Sets are positional: `null` marks a set that hasn't been logged yet, so a
   lift logged one set at a time keeps every set on its own slot. Trailing
   blanks are trimmed. */
function trimSets(a){ let n=a.length; while(n>0 && a[n-1]==null) n--; return a.slice(0,n); }
/* Bring any stored entry up to the per-set shape {unit,type,sets:[{w,r}],diff,
   e1rm}. Older logs held a single {weight,reps,...}; convert them to one set. */
function normalizeEntry(e){
  if(!e || typeof e!=='object') return null;
  if(Array.isArray(e.sets)){
    const first=e.sets.filter(s=>s)[0];
    const diff=(e.diff && DIFF_BY[e.diff]) ? e.diff : null;
    if(e.metric==='mins' || (first && first.min!=null)){
      const sets=trimSets(e.sets.map(s=> s && s.min>0 ? {min:s.min} : null));
      return sets.some(s=>s) ? {unit:e.unit||'kg', metric:'mins', sets, diff, e1rm:null} : null;
    }
    if(e.metric==='time' || (first && first.sec!=null)){
      const sets=trimSets(e.sets.map(s=> s && s.sec>0 ? {sec:s.sec} : null));
      return sets.some(s=>s) ? {unit:e.unit||'kg', metric:'time', sets, diff, e1rm:null} : null;
    }
    const sets=trimSets(e.sets.map(s=> s && s.r>0 ? {w:s.w>0?s.w:0, r:s.r} : null));
    if(!sets.some(s=>s)) return null;
    const metric = e.metric || (sets.some(s=>s&&s.w>0)||e.type ? 'weight' : 'reps');
    const out={unit:e.unit||'kg', type:e.type, sets, metric, diff, e1rm:null};
    out.e1rm = metric==='weight' ? (e.e1rm!=null?e.e1rm:bestE1RM(out)) : null;
    return out;
  }
  const r=parseInt(e.reps,10); if(!(r>0)) return null;
  const w=e.weight>0?e.weight:0;
  const metric = (w>0||e.type) ? 'weight' : 'reps';
  const out={unit:e.unit||'kg', type:e.type, sets:[{w,r}], metric, diff:null, e1rm:null};
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
  cardioBtn.setAttribute('aria-checked', cardioOn()?'true':'false');
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
const cardioBtn=document.getElementById('cardioToggle');
cardioBtn.addEventListener('click',()=>{
  state.cardio = cardioOn() ? 'none' : 'all';
  cardioBtn.setAttribute('aria-checked', cardioOn()?'true':'false');
  saveSession();
});

/* ===================== RENDER ===================== */
/* Estimated 1RM of a single set (Epley). Dumbbell weight is per-hand, so the
   working load is doubled. Returns null for a set with no external load. */
function setE1RM(entry, s){
  const total = entry.type==='dumbbell' ? s.w*2 : s.w;
  return total>0 ? total*(1+s.r/30) : null;
}
function bestE1RM(entry){
  let best=null;
  entry.sets.forEach(s=>{ if(!s) return; const e=setE1RM(entry,s); if(e!=null && (best===null||e>best)) best=e; });
  return best;
}
function doneSets(entry){ return entry && entry.sets ? entry.sets.filter(Boolean).length : 0; }
function lastBanked(entry){ const a=(entry&&entry.sets||[]).filter(Boolean); return a.length?a[a.length-1]:null; }
function logMode(l){
  if(l.cardio) return 'mins';                                // a cardio session
  if(l.w) return 'weight';                                   // external load
  if(typeof isTimedExercise==='function' && isTimedExercise(l.name)) return 'time'; // holds and carries
  return 'reps';                                             // bodyweight reps
}
/* Minutes to start from for a session that has never been logged: read them off
   the prescription, but only when it is a plain duration — "5 × 3 min hard"
   is not 3 minutes of work. */
function rxMinutes(rx){
  if(!rx || /[×x]/.test(rx)) return '';
  const m=String(rx).match(/(\d+)\s*(?:–\s*\d+\s*)?min/);
  return m ? m[1] : '';
}
function nextMins(m, diff){
  const d=diff&&DIFF_BY[diff];
  if(!d || !d.rep) return m;
  return Math.max(5, Math.round(m*(d.rep>0?1.1:0.9)/5)*5);
}
function loggedText(l, entry){
  const u=entry.unit, dh=entry.type==='dumbbell'?'/hand':'';
  const join=parts=>parts.join(' · ');                 // “—” marks a set not logged yet
  if(entry.metric==='mins'){
    const m=entry.sets.filter(Boolean).reduce((n,s)=>n+s.min,0);
    return `logged ${m} min`;
  }
  if(entry.metric==='time'){
    return `logged ${join(entry.sets.map(s=> s ? s.sec : '—'))} s`;
  }
  if(entry.metric==='weight' || l.w){
    const parts=entry.sets.map(s=> !s ? '—' : (s.w>0 ? `${fmt(s.w)}×${s.r}` : `bw×${s.r}`));
    return `logged ${join(parts)} ${u}${dh}`;
  }
  // bodyweight reps — show added weight only if the lifter used some
  const weighted = entry.sets.some(s=>s && s.w>0);
  if(weighted){
    const parts=entry.sets.map(s=> !s ? '—' : (s.w>0 ? `+${fmt(s.w)}×${s.r}` : `bw×${s.r}`));
    return `logged ${join(parts)} reps (+${u})`;
  }
  return `logged ${join(entry.sets.map(s=> s ? s.r : '—'))} reps`;
}
function diffChip(entry, cls){
  const d = entry && entry.diff && DIFF_BY[entry.diff];
  return d ? ` <span class="diff d-${d.k} ${cls||''}">${d.short}</span>` : '';
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
  const today=(new Date().getDay()+6)%7;          // WEEKDAYS starts on Monday
  let totalSets=0, daysHTML='', delay=0;

  curWeekdays().forEach((d,di)=>{
    if(d.rest){
      daysHTML+=`<div class="day rest${di===today?' today':''}"><span class="dow">${d.label}</span><span class="rfocus">Rest</span>
        <span class="rnote">${restNotes[d.label.charCodeAt(0)%restNotes.length]}</span></div>`;
      return;
    }
    delay+=0.06; let finisherShown=false, blockShown=null, cardioShown=null, liftsHTML='';
    d.lifts.forEach((l,li)=>{
      if(l.finisher && !finisherShown){ liftsHTML+=`<div class="finisher-label">＋ Abs finisher</div>`; finisherShown=true; }
      if(l.cardio && !d.cardioDay && l.cardio!==cardioShown){
        cardioShown=l.cardio;
        liftsHTML+=`<div class="finisher-label cardio-label">＋ ${l.cardio}</div>`;
      }
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
      const loggable = v.sets!=='' || mode==='mins';
      const open = EDIT===key;
      let loggedLine='';
      if(done){
        const be=bestE1RM(done);
        const beTxt = be!=null ? ` <span class="e1rm">e1RM ${fmt(Math.round(be))} ${done.unit}</span>` : '';
        const nWant=parseInt(v.sets,10)||0, nDone=doneSets(done);
        const partTxt = (nWant && nDone<nWant) ? ` <span class="part">${nDone}/${nWant} sets</span>` : '';
        loggedLine = `<div class="logged">✓ ${loggedText(l,done)}${beTxt}${partTxt}${diffChip(done)}</div>`;
      } else if(suggest){
        loggedLine = `<div class="suggest">↝ last: ${loggedText(l,suggest).replace(/^logged /,'')}${diffChip(suggest)}</div>`;
      }
      const chevron = `<span class="liftexp" aria-hidden="true">${open?'▾':'▸'}</span>`;
      liftsHTML+=`<div class="lift expandable${open?' open':''}${l.cardio?' cardio-row':''}" data-k="${key}" data-di="${di}" data-li="${li}" role="button" tabindex="0" aria-expanded="${open}">
        <div class="nm">${l.name}<em>${v.tag}</em></div>
        <div class="prescribe"><div class="rx">${rxTxt}</div><div class="meta">${metaTxt}</div></div>
        ${chevron}
        <label class="swap" title="Pick another exercise"><span aria-hidden="true">⇄</span>
          <select class="swapsel" data-di="${di}" data-li="${li}" aria-label="Swap ${l.name} for another exercise">${swapOptionsHTML(d,l)}</select></label>
        ${loggedLine}
      </div>`;
      if(open){
        let logHTML='';
        if(loggable){
          const nSets=mode==='mins' ? 1 : (parseInt(v.sets,10)||1);
          const rows=Math.max(nSets, src?src.sets.length:0);
          const dh = l.w && l.w[2]==='dumbbell' ? ' /hand' : '';
          const targetR=repTop(v.reps);
          /* Prefills come from this occurrence's own log if it has one; otherwise
             from last time, shifted by how that session felt. */
          const lastDiff = suggest ? suggest.diff : null;
          const carry = done ? lastBanked(done) : null;   // most recent set banked today
          let head, rowsHTML='';
          for(let i=0;i<rows;i++){
            const s = done ? done.sets[i] : null;          // this row, already banked
            const last = suggest ? suggest.sets[i] : null; // the same set last time
            const isDone = !!s;
            const what = mode==='mins' ? 'session' : 'set';
            const tick = `<button class="lb-done${isDone?' on':''}" type="button" data-i="${i}"
              title="${isDone?'Update this '+what:'Log this '+what+' now'}" aria-label="Log ${mode==='mins'?'this session':'set '+(i+1)}" aria-pressed="${isDone}">✓</button>`;
            const cls = `lb-set${isDone?' is-done':''}`;
            /* An unlogged row starts from whatever is most useful: the set you
               just banked (so the working weight carries down the list), else
               the suggestion for a fresh occurrence, else last time's numbers. */
            if(mode==='mins'){
              const pv = s ? s.min : (last ? nextMins(last.min,lastDiff) : rxMinutes(v.reps));
              rowsHTML+=`<div class="${cls}">
                <span class="lb-n">Session</span>
                <input class="lm" type="number" inputmode="numeric" value="${pv}" placeholder="—" aria-label="Minutes done">
                <span class="lb-u">min</span>${tick}
              </div>`;
            } else if(mode==='time'){
              const pv = s ? s.sec : carry ? carry.sec : (last ? nextSecs(last.sec,lastDiff) : '');
              rowsHTML+=`<div class="${cls}">
                <span class="lb-n">Set ${i+1}</span>
                <input class="lt" type="number" inputmode="numeric" value="${pv}" placeholder="—" aria-label="Set ${i+1} hold seconds">
                <span class="lb-u">sec</span>${tick}
              </div>`;
            } else if(mode==='weight'){
              // a fresh occurrence starts from the suggested load, which already
              // carries last session's difficulty
              const ref = s || carry;
              const pw = ref ? (ref.w>0?ref.w:'') : (num!=='' ? num : (last && last.w>0 ? last.w : ''));
              const pr = ref ? ref.r : (last ? last.r : targetR);
              rowsHTML+=`<div class="${cls}">
                <span class="lb-n">Set ${i+1}</span>
                <input class="lw" type="number" inputmode="decimal" value="${pw}" placeholder="—" aria-label="Set ${i+1} weight ${unit}${dh}">
                <span class="lb-x">×</span>
                <input class="lr" type="number" inputmode="numeric" value="${pr}" placeholder="reps" aria-label="Set ${i+1} reps">${tick}
              </div>`;
            } else { // reps (bodyweight) — reps first, added weight optional/hidden
              const ref = s || carry;
              const pr = ref ? ref.r : (last ? nextReps(last.r,lastDiff) : targetR);
              const pw = ref ? (ref.w>0?ref.w:'') : (last && last.w>0 ? last.w : '');
              rowsHTML+=`<div class="${cls}">
                <span class="lb-n">Set ${i+1}</span>
                <input class="lr" type="number" inputmode="numeric" value="${pr}" placeholder="—" aria-label="Set ${i+1} reps">
                <span class="lb-u">reps</span>
                <input class="lw opt" type="number" inputmode="decimal" value="${pw}" placeholder="+${unit}" aria-label="Set ${i+1} added weight ${unit}">${tick}
              </div>`;
            }
          }
          head = mode==='mins' ? 'Log the session — minutes done'
               : mode==='time' ? 'Log each set — hold time in seconds'
               : mode==='weight' ? `Log each set — weight ${unit}${dh} × completed reps`
               : 'Log each set — completed reps';
          const curDiff = PENDING_DIFF[key] || (done && done.diff) || '';
          const dchips = DIFF_LEVELS.map(d=>{
            // "missed reps" means nothing on a 40-minute walk
            const lab = (mode==='mins' && d.k==='fail') ? 'Cut it short' : d.label;
            return `<button class="dchip${curDiff===d.k?' on':''}" type="button" data-diff="${d.k}" aria-pressed="${curDiff===d.k}">${lab}</button>`;
          }).join('');
          const dNote = curDiff && DIFF_BY[curDiff] ? DIFF_BY[curDiff].note
                      : (mode==='mins' ? 'Sets the starting point for the next session of this kind.'
                                       : 'Sets the starting point for the next time this lift comes up.');
          const diffHTML = `<div class="lb-diff">
            <div class="lb-dlab">How did it feel?</div>
            <div class="lb-dchips" role="group" aria-label="How did that feel">${dchips}</div>
            <div class="lb-dnote">${dNote}</div>
          </div>`;
          const showWeight = mode==='reps' && src && src.metric!=='time' && src.sets.some(s=>s && s.w>0);
          const addWtBtn = mode==='reps' ? `<button class="addwt" type="button">＋ Add weight (vest / belt)</button>` : '';
          logHTML=`<div class="logbox${showWeight?' show-weight':''}" data-di="${di}" data-li="${li}">
            <div class="lb-head">${head}</div>
            <div class="lb-sub">${mode==='mins' ? 'Tick it off when the session is done.' : 'Hit ✓ on a set to bank it mid-workout — or fill them all in and save at the end.'}</div>
            <div class="lb-sets">${rowsHTML}</div>
            ${addWtBtn}
            ${diffHTML}
            <div class="lb-foot">
              ${parseRest(v.rest)?`<button class="restnow" type="button" data-sec="${parseRest(v.rest)}" data-name="${l.name}">⏱ Rest ${v.rest}</button>`:''}
              ${done?`<button class="logclear" data-di="${di}" data-li="${li}">Clear</button>`:'<span></span>'}
              <div class="lb-btns">
                <button class="logcancel" type="button">Close</button>
                <button class="logsave" type="button">${mode==='mins'?'Save':'Save all'}</button>
              </div>
            </div>
          </div>`;
        }
        const cueHTML = l.cue ? `<div class="cardio-cue">${l.cue}</div>` : '';
        liftsHTML+=`<div class="expando">${cueHTML}${howtoBlock(l, BIGDEMO)}${logHTML}</div>`;
      }
    });
    const pct=Math.round(Math.max(.2,Math.min(1,d.inten*factor))*100);
    const style = animate ? `style="animation-delay:${delay.toFixed(2)}s"` : '';
    daysHTML+=`<div class="day train${di===today?' today':''}" ${style}>
      <div class="day-top"><span class="dow">${d.label}</span><span class="focus">${d.type}</span>
        <span class="intensity"><div class="lab">${intensityLabel(d.inten*factor)}</div>
          <div class="bar"><i data-w="${pct}"></i></div></span></div>
      <div class="lifts">${liftsHTML}</div></div>`;
  });

  const weekPills=[1,2,3,4,5].map(w=>`<button class="wk${w===5?' deload':''}" data-wk="${w}" aria-pressed="${w===WEEK}">${w===5?'Deload':'Wk '+w}</button>`).join('');
  const wtNote = anyLog ? `weights <span class="wt">personalised from your logged sets</span>`
      : (anchorsAvail ? `<span class="wt">≈ weights</span> from your numbers, scaled per week`
      : `tap a lift to <span class="wt">log your sets</span>, or add a max in the brief, for suggested weights`);
  const logCount=logNames.size;
  /* The cardio schedule for the chosen aim: what each session is for, how
     often, and which days it landed on. */
  let cardioHTML='';
  if(p.cardio){
    const goalName=g=>(CARDIO_GOALS[g]||{label:g}).label;
    const rows=p.cardio.sessions.map(s=>`<li>
      <div class="cs-top"><b>${s.n} × ${s.kind}</b><span class="cs-rx">${s.rx}</span></div>
      <div class="cs-days">${s.days.join(' · ')} &nbsp;—&nbsp; ${s.moves.join(', ')}</div>
      ${(s.covers||[]).length?`<div class="cs-covers">${s.covers.map(g=>`<span class="cov cov-${g}">${goalName(g)}</span>`).join('')}</div>`:''}
    </li>`).join('');
    /* Check the week against each goal: what it asks for, and what delivers it. */
    const cover=Object.keys(CARDIO_GOALS).map(g=>{
      const by=p.cardio.sessions.filter(s=>(s.covers||[]).indexOf(g)!==-1);
      return `<li class="${by.length?'ok':'miss'}">
        <div class="cg-top"><span class="cg-tick">${by.length?'✓':'—'}</span><b>${CARDIO_GOALS[g].label}</b></div>
        <div class="cg-asks">${CARDIO_GOALS[g].asks}</div>
        <div class="cg-by">${by.length ? '→ '+by.map(s=>`${s.n} × ${s.kind}`).join(' · ') : 'not covered this week'}</div>
      </li>`;
    }).join('');
    const total=p.cardio.sessions.reduce((n,s)=>n+s.n,0);
    cardioHTML=`<div class="cardio-plan">
      <div class="cp-head">Cardio schedule<span class="cp-aim">${total} sessions / wk · all four goals</span></div>
      <p class="cp-note">${p.cardio.note}</p>
      <ul class="cp-list">${rows}</ul>
      <div class="cp-sub">What it covers</div>
      <ul class="cp-goals">${cover}</ul>
      <p class="cp-foot">Tap any session in the week for how to pace it, and log the minutes when it's done. The deload week keeps the easy sessions and drops the two hard ones.</p>
    </div>`;
  }

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
        ${p.cardio?`<div class="stat"><div class="k">Cardio</div><div class="v">${p.cardio.sessions.reduce((n,s)=>n+s.n,0)}<small>/wk</small></div></div>`:''}
      </div>
      <div class="weeks" role="group" aria-label="Progression week">${weekPills}</div>
      <div class="wknote"><b>${wi.tag}</b><span>${wi.note}</span></div>
    </div>
    <div class="hint">↻ regenerate · ⇄ swap · tap a lift to log sets as you go · tap a week — same split, fresh exercises<br>${wtNote}</div>
    <div class="week${animate?'':' static'}">${daysHTML}</div>
    ${cardioHTML}
    <div class="actions">
      <button class="ghost" id="regen">↻ Regenerate exercises</button>
      <button class="ghost" id="edit">↑ Change brief</button>
      ${anyLog?`<button class="ghost" id="clearlog">⌫ Clear all logs (${logCount})</button>`:''}
    </div>
    <div class="datarow">
      Your logs live in this browser only.
      <button class="linkbtn" id="expdata" type="button">⭳ Export a backup</button>
      <button class="linkbtn" id="impdata" type="button">⭱ Restore one</button>
    </div>`;

  prog.classList.remove('hidden');
  document.getElementById('empty').classList.add('hidden');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    prog.querySelectorAll('.bar i').forEach(el=>{ el.style.width=el.dataset.w+'%'; });
  }));
  if(EDIT){
    const rows=prog.querySelectorAll('.logbox .lb-set');
    const want = FOCUS ? FOCUS.row : 0;
    if(want>=0 && rows.length){
      const inp=(rows[Math.min(want,rows.length-1)]).querySelector('input');
      if(inp) inp.focus();
    }
  }
  FOCUS=null;
  if(typeof refreshAddonUI==='function') refreshAddonUI();   // optional AI add-on panel
  saveSession();
}

/* ===================== LOGGING + INTERACTIONS ===================== */
/* Read every set row in the open log box and store them against THIS
   occurrence (week + day + slot + exercise). A set counts only if reps (or
   seconds) were entered. Saving with nothing clears this occurrence's log. */
function readSetRow(row, mode){
  if(mode==='mins'){
    const min=parseInt(row.querySelector('.lm').value,10);
    return min>0 ? {min} : null;
  }
  if(mode==='time'){
    const sec=parseInt(row.querySelector('.lt').value,10);
    return sec>0 ? {sec} : null;
  }
  const r=parseInt(row.querySelector('.lr').value,10);
  if(!(r>0)) return null;
  const wi=row.querySelector('.lw');
  const w=wi?parseFloat(wi.value):NaN;
  return { w:w>0?w:0, r };
}
/* Write a set list against this occurrence. An all-null list clears it. */
function commitSets(di,li,l,mode,sets){
  const key=occKey(di,li,l.name);
  sets=trimSets(sets);
  if(!sets.some(s=>s)){ delete LOG.sets[key]; saveStore(); return null; }
  const prev=LOG.sets[key];
  const entry={ unit:state.unit, type: l.w?l.w[2]:undefined, sets, metric:mode, name:l.name,
                diff: PENDING_DIFF[key] || (prev&&prev.diff) || null, ts:Date.now() };
  entry.e1rm = mode==='weight' ? bestE1RM(entry) : null;
  LOG.sets[key]=entry; saveStore();
  return entry;
}
/* Save every row at once — the fill-it-in-afterwards path. */
function logSets(box){
  const di=+box.dataset.di, li=+box.dataset.li;
  const l=curWeekdays()[di].lifts[li];
  const mode=logMode(l);
  const sets=[...box.querySelectorAll('.lb-set')].map(row=>readSetRow(row,mode));
  commitSets(di,li,l,mode,sets);
  EDIT=null; renderProgram(false);
}
/* Bank a single set mid-workout, leaving the panel open on the next one. */
function logOneSet(box, idx){
  const di=+box.dataset.di, li=+box.dataset.li;
  const l=curWeekdays()[di].lifts[li];
  const mode=logMode(l);
  const rows=[...box.querySelectorAll('.lb-set')];
  const prev=LOG.sets[occKey(di,li,l.name)];
  const sets=prev ? prev.sets.slice() : [];
  while(sets.length<=idx) sets.push(null);
  const val=readSetRow(rows[idx],mode);
  sets[idx]=val;
  const entry=commitSets(di,li,l,mode,sets);
  FOCUS={row: Math.min(idx+1, rows.length-1)};
  renderProgram(false);
  /* Straight into the rest between sets — but not after the last one, and
     never for a cardio session, which has no sets to rest between. */
  if(val && entry && mode!=='mins'){
    const v=weekAdjust(l.base,WEEK,l.compound);
    const nWant=parseInt(v.sets,10)||0;
    if(!nWant || doneSets(entry)<nWant) startRest(parseRest(v.rest), l.name);
  }
}
/* Rate the lift. Applies to the stored entry right away when there is one. */
function setDiff(box, val){
  const di=+box.dataset.di, li=+box.dataset.li;
  const l=curWeekdays()[di].lifts[li];
  const key=occKey(di,li,l.name);
  const cur = PENDING_DIFF[key] || (LOG.sets[key] && LOG.sets[key].diff) || '';
  const next = cur===val ? '' : val;                 // tap the active one to clear it
  PENDING_DIFF[key]=next;
  if(LOG.sets[key]){
    LOG.sets[key].diff = next||null;
    LOG.sets[key].ts = Date.now();
    saveStore();
  }
  FOCUS={row:-1};
  renderProgram(false);
}
function clearLog(di,li){
  const l=curWeekdays()[di].lifts[li], key=occKey(di,li,l.name);
  delete LOG.sets[key]; delete PENDING_DIFF[key];
  saveStore(); renderProgram(false);
}
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
/* What a lift can be swapped for: the same category, filtered by your
   equipment. A cardio session offers its own modalities, an added block its
   target's movements, and a regular lift its muscle group — split into
   compound and accessory. Anything already on the day is listed but can't be
   picked twice. */
function swapChoices(day, l){
  const eq=PROGRAM.equip;
  if(l.cardio) return [{label:l.cardio+' options', items:cardioPool(l.pool||[], eq)}];
  if(l.addon){
    const t=findTarget(l.addon);
    const slot = t && t.slots && l.lever!=null ? t.slots[l.lever] : null;
    if(t) return [{label:l.addon, items:targetPool(slot ? slot.names : t.names, eq).map(f=>f.ex)}];
  }
  const pool=getPool(l.group, eq);
  if(l.finisher) return [{label:'Core', items:pool}];
  return [{label:'Compound', items:pool.filter(x=>x.c)},
          {label:'Accessory', items:pool.filter(x=>!x.c)}].filter(g=>g.items.length);
}
function swapOptionsHTML(day, l){
  const taken=new Set(day.lifts.map(x=>x.name));
  return swapChoices(day,l).map(g=>`<optgroup label="${g.label}">${g.items.map(x=>{
    const cur=x.n===l.name, dup=!cur && taken.has(x.n);
    return `<option value="${x.n}"${cur?' selected':''}${dup?' disabled':''}>${x.n}${dup?' — already today':''}</option>`;
  }).join('')}</optgroup>`).join('');
}
/* Put the chosen exercise in this slot, for the week you're viewing. It keeps
   whatever role the slot had — an abs-finisher set, an added block's scheme
   and label, a cardio session's prescription — and otherwise takes the
   sets and reps that suit the new exercise. */
function replaceLift(di, li, name){
  const day=curWeekdays()[di]; if(!day||day.rest) return;
  const cur=day.lifts[li]; if(!cur || cur.name===name) return;
  let nl;
  if(cur.cardio){
    nl=Object.assign({}, cur, {name});
  } else {
    const found=findExercise(name); if(!found) return;
    nl=mkLift(found.ex, found.group, PROGRAM.goal, cur.finisher);
    if(cur.finisher) nl.base={sets:'3',reps:'12–15',rest:'30 s',tag:'abs'};
    if(cur.addon){
      const iso=(SCHEME[PROGRAM.goal]||SCHEME.general).iso;
      if(found.group!=='cardio') nl.base={sets:iso.s, reps:iso.r, rest:iso.rest, tag:'added'};
      else nl.base.tag='added';
      nl.addon=cur.addon;
      if(cur.lever!=null){ nl.lever=cur.lever; nl.cue=cur.cue; }
    }
  }
  day.lifts[li]=nl; day.inten=dayIntensity(day.lifts,PROGRAM.goal);
  EDIT=null; renderProgram(false);
}
document.getElementById('program').addEventListener('click', e=>{
  const br=e.target.closest('.blockrm'); if(br){ removeBlock(+br.dataset.di, br.dataset.title); return; }
  const aw=e.target.closest('.addwt'); if(aw){ aw.closest('.logbox').classList.toggle('show-weight'); return; }
  const sd=e.target.closest('.lb-done'); if(sd){ logOneSet(sd.closest('.logbox'), +sd.dataset.i); return; }
  const dc=e.target.closest('.dchip'); if(dc){ setDiff(dc.closest('.logbox'), dc.dataset.diff); return; }
  const sv=e.target.closest('.logsave'); if(sv){ logSets(sv.closest('.logbox')); return; }
  const cc=e.target.closest('.logcancel'); if(cc){ EDIT=null; renderProgram(false); return; }
  const rn=e.target.closest('.restnow'); if(rn){ startRest(+rn.dataset.sec, rn.dataset.name); return; }
  const cl=e.target.closest('.logclear'); if(cl){ clearLog(+cl.dataset.di,+cl.dataset.li); return; }
  const wk=e.target.closest('.wk'); if(wk){ EDIT=null; WEEK=parseInt(wk.dataset.wk,10); renderProgram(false); return; }
  if(e.target.closest('.swap')) return;            // the picker opens; the row stays as it is
  const dm=e.target.closest('.demo');
  if(dm){
    BIGDEMO=!BIGDEMO;
    document.querySelectorAll('#program .howto').forEach(h=>h.classList.toggle('big', BIGDEMO));
    dm.setAttribute('aria-label', (BIGDEMO?'Shrink':'Enlarge')+' the demo');
    return;
  }
  const lift=e.target.closest('.lift'); if(lift && lift.dataset.k){ const k=lift.dataset.k; EDIT=(EDIT===k?null:k); renderProgram(false); return; }
  if(e.target.closest('#regen')){ EDIT=null; PROGRAM=generate(); WEEK=1; renderProgram(true); return; }
  if(e.target.closest('#edit')){ document.querySelector('.brief').scrollIntoView({behavior:'smooth',block:'start'}); return; }
  if(e.target.closest('#expdata')){ exportData(); return; }
  if(e.target.closest('#impdata')){ document.getElementById('impfile').click(); return; }
  if(e.target.closest('#clearlog')){ if(confirm('Clear all logged sets? This cannot be undone.')){ LOG.sets={}; for(const k in PENDING_DIFF) delete PENDING_DIFF[k]; saveStore(); renderProgram(false); } return; }
});
document.getElementById('program').addEventListener('change', e=>{
  const sel=e.target.closest('.swapsel'); if(!sel) return;
  replaceLift(+sel.dataset.di, +sel.dataset.li, sel.value);
});
/* Keyboard: Enter/Space toggles a focused lift row (but not while typing in it). */
document.getElementById('program').addEventListener('keydown', e=>{
  // Enter inside a set row banks that set, so you can log without reaching for ✓
  if(e.key==='Enter' && e.target.tagName==='INPUT'){
    const row=e.target.closest('.lb-set');
    if(row){
      e.preventDefault();
      const box=row.closest('.logbox');
      logOneSet(box, [...box.querySelectorAll('.lb-set')].indexOf(row));
      return;
    }
  }
  if(e.key!=='Enter' && e.key!==' ') return;
  if(e.target.closest('input,button,select')) return;
  const lift=e.target.closest('.lift'); if(!lift || !lift.dataset.k) return;
  e.preventDefault();
  const k=lift.dataset.k; EDIT=(EDIT===k?null:k); renderProgram(false);
});
document.getElementById('build').addEventListener('click',()=>{
  EDIT=null; PROGRAM=generate(); WEEK=1; renderProgram(true);
  requestAnimationFrame(()=>document.getElementById('program').scrollIntoView({behavior:'smooth',block:'start'}));
});

/* ===================== ADD A BLOCK =====================
   Appends a short extra block to one training day, targeting a specific muscle
   region picked from a dropdown. Draws from the same exercise library, so the
   added moves keep their how-to cues, demo, suggested loads and per-set
   logging. Works offline — no API key involved. */

const addonSec   = document.getElementById('addon');
const addonTarget= document.getElementById('addonTarget');
const addonDay   = document.getElementById('addonDay');
const addonEvery = document.getElementById('addonEvery');
const addonBuild = document.getElementById('addonBuild');
const addonStatus= document.getElementById('addonStatus');

let addonAllWeeks = true;
addonTarget.addEventListener('change', refreshAddonNote);
addonEvery.addEventListener('click', ()=>{
  addonAllWeeks=!addonAllWeeks;
  addonEvery.setAttribute('aria-pressed', addonAllWeeks?'true':'false');
});
function addonSetStatus(msg,kind){ addonStatus.textContent=msg||''; addonStatus.className='addon-status'+(kind?' '+kind:''); }

function findExercise(name){
  for(const g in EX){ const hit=EX[g].filter(x=>x.n===name)[0]; if(hit) return {ex:hit, group:g}; }
  return null;
}
/* Movements for a target that the user's equipment can actually do. */
function targetPool(names, equip){
  return names.map(findExercise).filter(f=>f && f.ex.eq.indexOf(equip)!==-1);
}
const addonNote = document.getElementById('addonNote');
const TARGET_NOTES = {
  desk:'Supportive strengthening for muscles that commonly weaken with desk work. This is general fitness guidance, not treatment — see a clinician for pain that is severe, persistent, or follows an injury.',
  apt:'Anterior pelvic tilt is a balance problem: hip flexors and the lower back pull the pelvis forward, and glutes, hamstrings and the deep core don\u2019t pull it back enough. These moves build the side that pulls back, with a cue on each for doing them in a posterior tilt — pair them with hip-flexor stretching. General fitness guidance, not treatment; see a clinician for back pain that is severe, persistent, or follows an injury.',
};
function targetNote(label){
  const t=findTarget(label);
  return !t ? '' : t.apt ? TARGET_NOTES.apt : t.desk ? TARGET_NOTES.desk : '';
}
function refreshAddonNote(){
  const note=targetNote(addonTarget.value);
  addonNote.textContent=note;
  addonNote.classList.toggle('hidden', !note);
}

function findTarget(label){
  for(const cat in MUSCLE_TARGETS){
    const t=MUSCLE_TARGETS[cat].filter(x=>x.label===label)[0];
    if(t) return t;
  }
  return null;
}

/* Populate both dropdowns; only show targets trainable with this equipment. */
function refreshAddonUI(){
  if(!PROGRAM){ addonSec.classList.add('hidden'); return; }
  addonSec.classList.remove('hidden');

  const prevDay=addonDay.value;
  addonDay.innerHTML = curWeekdays()
    .map((d,di)=> (d.rest || d.cardioDay) ? '' : `<option value="${di}">${d.label} · ${d.type}</option>`).join('');
  if(prevDay && addonDay.querySelector(`option[value="${prevDay}"]`)) addonDay.value=prevDay;

  const prevTarget=addonTarget.value;
  let html='';
  for(const cat in MUSCLE_TARGETS){
    const opts=MUSCLE_TARGETS[cat]
      .filter(t=>targetPool(t.names, PROGRAM.equip).length)
      .map(t=>`<option value="${t.label}">${t.label}</option>`).join('');
    if(opts) html+=`<optgroup label="${cat}">${opts}</optgroup>`;
  }
  addonTarget.innerHTML=html;
  if(prevTarget && addonTarget.querySelector(`option[value="${prevTarget}"]`)) addonTarget.value=prevTarget;
  refreshAddonNote();
}

function addBlock(label, di, everyWeek){
  const target=findTarget(label); if(!target) return 0;
  const iso=(SCHEME[PROGRAM.goal]||SCHEME.general).iso;

  const targets=[];
  if(PROGRAM.weeks){
    if(everyWeek){ for(const w in PROGRAM.weeks) targets.push(PROGRAM.weeks[w]); }
    else targets.push(PROGRAM.weeks[WEEK] || PROGRAM.weekdays);
  } else targets.push(PROGRAM.weekdays);

  let added=0;
  targets.forEach(days=>{
    const day=days[di]; if(!day || day.rest) return;
    day.lifts = day.lifts.filter(l=>l.addon!==label);           // replace a block of the same target
    const already = new Set(day.lifts.map(l=>l.name));          // don't repeat what the day already programs
    const add=(f, lever, cue)=>{
      const l=mkLift(f.ex, f.group, PROGRAM.goal, false);
      if(f.group!=='cardio') l.base={sets:iso.s, reps:iso.r, rest:iso.rest, tag:'added'};
      else l.base.tag='added';
      l.addon=label;
      if(lever!=null){ l.lever=lever; l.cue=cue; }
      day.lifts.push(l); already.add(f.ex.n); added++;
    };
    if(target.slots && target.slots.length>1){
      // one move from each lever, so the block is balanced
      target.slots.forEach((slot,si)=>{
        const all=targetPool(slot.names, PROGRAM.equip);
        const fresh=all.filter(f=>!already.has(f.ex.n));
        const pick=shuffle(fresh.length?fresh:all)[0];
        if(pick) add(pick, si, slot.cue);
      });
    } else {
      const slot = target.slots ? target.slots[0] : null;
      let pool = targetPool(target.names, PROGRAM.equip).filter(f=>!already.has(f.ex.n));
      if(!pool.length) pool = targetPool(target.names, PROGRAM.equip);
      shuffle(pool).slice(0,3).forEach(f=>add(f, slot?0:null, slot?slot.cue:null));
    }
    day.inten=dayIntensity(day.lifts, PROGRAM.goal);
  });
  return added ? Math.min(target.slots ? Math.max(3,target.slots.length) : 3, added) : 0;
}

addonBuild.addEventListener('click', ()=>{
  if(!PROGRAM){ addonSetStatus('Build your week first.','err'); return; }
  const label=addonTarget.value;
  const di=parseInt(addonDay.value,10);
  const day=curWeekdays()[di];
  if(!label){ addonSetStatus('Pick a muscle to target.','err'); return; }
  if(!day || day.rest){ addonSetStatus('Pick a training day.','err'); return; }

  const n=addBlock(label, di, addonAllWeeks);
  if(!n){ addonSetStatus('No movements available for that target with your equipment.','err'); return; }
  saveSession(); EDIT=null; renderProgram(false);
  addonSetStatus(`Added “${label}” — ${n} move${n>1?'s':''} on ${day.label}${addonAllWeeks?', every week':' (this week only)'}. Remove it with the ✕ on the block.`,'ok');
});

/* ===================== REST TIMER =====================
   Lives outside #program, so re-rendering the week never interrupts a running
   countdown. Starts itself when you bank a set, using that lift's prescribed
   rest, and can be started by hand from the log panel. */
const restEl=document.getElementById('rest'), restTimeEl=document.getElementById('restTime'),
      restFill=document.getElementById('restFill'), restLabelEl=document.getElementById('restLabel');
let restEnd=0, restTotal=0, restTick=null;
/* '2 min' | '75 s' | '90 s' | '—'  ->  seconds */
function parseRest(txt){
  const m=String(txt||'').match(/(\d+(?:\.\d+)?)\s*(min|s)\b/i);
  if(!m) return 0;
  return Math.round(parseFloat(m[1]) * (m[2].toLowerCase()==='min' ? 60 : 1));
}
function fmtClock(sec){ return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'); }
function drawRest(){
  const left=Math.max(0, Math.ceil((restEnd-Date.now())/1000));
  restTimeEl.textContent=fmtClock(left);
  restFill.style.width=(restTotal ? Math.max(0,left/restTotal)*100 : 0)+'%';
  if(left<=0 && !restEl.classList.contains('done')){
    restEl.classList.add('done');
    restLabelEl.textContent='Next set';
    restChime();
    clearInterval(restTick); restTick=null;
  }
}
function startRest(sec, label){
  sec=Math.round(sec);
  if(!(sec>0)) return;
  restTotal=sec; restEnd=Date.now()+sec*1000;
  restLabelEl.textContent=label||'Rest';
  restEl.classList.remove('hidden','done');
  drawRest();
  clearInterval(restTick); restTick=setInterval(drawRest,250);
}
function stopRest(){
  clearInterval(restTick); restTick=null; restEnd=0;
  restEl.classList.add('hidden'); restEl.classList.remove('done');
}
/* A short tone and a buzz — both best-effort, both silent if the platform
   says no. */
function restChime(){
  try{ if(navigator.vibrate) navigator.vibrate([140,70,140]); }catch(e){}
  try{
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    const c=new AC(), o=c.createOscillator(), g=c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type='sine'; o.frequency.value=880;
    g.gain.setValueAtTime(0.0001,c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.22,c.currentTime+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+0.6);
    o.start(); o.stop(c.currentTime+0.62);
    setTimeout(()=>{ try{ c.close(); }catch(e){} },900);
  }catch(e){}
}
document.getElementById('restSkip').addEventListener('click', stopRest);
document.getElementById('restAdd').addEventListener('click', ()=>{
  if(!restEnd) return;
  const left=Math.max(0, Math.ceil((restEnd-Date.now())/1000)) + 30;
  startRest(left, restLabelEl.textContent==='Next set' ? 'Rest' : restLabelEl.textContent);
});

/* ===================== BACKUP =====================
   Everything lives in this browser's localStorage, which a cleared cache or a
   new phone takes with it. Export writes the lot to a file; restore reads one
   back. */
function exportData(){
  const payload={app:'SPLIT', format:1, exportedAt:new Date().toISOString(),
                 state, week:WEEK, program:PROGRAM, logs:LOG.sets};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download='split-backup-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}
function importData(file){
  const reader=new FileReader();
  reader.onload=()=>{
    let o=null;
    try{ o=JSON.parse(reader.result); }catch(e){}
    if(!o || typeof o!=='object' || (!o.logs && !o.program)){
      alert('That does not look like a SPLIT backup.'); return;
    }
    const incoming=o.logs ? Object.keys(o.logs).length : 0;
    const have=Object.keys(LOG.sets).length;
    const when=o.exportedAt ? new Date(o.exportedAt).toLocaleDateString() : 'an unknown date';
    if(!confirm(`Restore the backup from ${when}?\n\nIt replaces what is in this browser — ${have} logged lift${have===1?'':'s'} and your current week — with ${incoming} logged lift${incoming===1?'':'s'}. This cannot be undone.`)) return;
    if(o.logs && typeof o.logs==='object'){
      const out={};
      for(const k in o.logs){ const n=normalizeEntry(o.logs[k]); if(n){ n.name=o.logs[k].name; n.ts=o.logs[k].ts||0; out[k]=n; } }
      LOG.sets=out; saveStore();
    }
    if(o.state) Object.assign(state, o.state);
    if(!state.max) state.max={bench:'',squat:'',deadlift:'',press:'',row:''};
    syncBriefUI();
    EDIT=null;
    if(o.program){ PROGRAM=o.program; WEEK=o.week||1; }
    if(PROGRAM){ saveSession(); renderProgram(false); }
  };
  reader.readAsText(file);
}
document.getElementById('impfile').addEventListener('change', e=>{
  const f=e.target.files && e.target.files[0];
  if(f) importData(f);
  e.target.value='';                       // so the same file can be picked twice
});

/* The AI coach was removed — clear any API key it left in this browser. */
try{ localStorage.removeItem('split_anthropic_key_v1'); localStorage.removeItem('split_anthropic_model_v1'); }catch(e){}

/* Abs work now lives only in the finisher (and in blocks you add yourself), so
   a week saved before that change still has core exercises sitting in its main
   list. Drop them and slide the logs of everything below them up a slot, rather
   than making you regenerate and lose the week you've been training. */
function stripCoreFromMain(program){
  if(!program) return false;
  const weeks = program.weeks ? Object.keys(program.weeks) : [];
  const map = {}; let changed = false;
  const strip = (week, w)=>{
    if(!Array.isArray(week)) return;
    week.forEach((day,di)=>{
      if(!day || day.rest || !Array.isArray(day.lifts)) return;
      const keep=[];
      day.lifts.forEach((l,li)=>{
        if(l && l.group==='core' && !l.finisher && !l.addon){ changed=true; return; }
        if(keep.length!==li) map[`${w}:${di}:${li}:${l.name}`] = `${w}:${di}:${keep.length}:${l.name}`;
        keep.push(l);
      });
      day.lifts=keep;
      if(typeof dayIntensity==='function') day.inten = dayIntensity(keep, program.goal);
    });
  };
  weeks.forEach(w=>strip(program.weeks[w], w));
  if(!weeks.length) strip(program.weekdays, 1);
  if(!changed) return false;
  const out={}; for(const k in LOG.sets) out[map[k]||k]=LOG.sets[k];
  LOG.sets=out;
  if(program.weeks && program.weeks[1]) program.weekdays = program.weeks[1];
  return true;
}

try{ document.getElementById('appver').textContent = APP_VERSION.replace('split-','version '); }catch(e){}

/* On load: restore logs, then the last session (brief + program + week). */
loadStore();
(function restore(){
  const sess = loadSession();
  if(!sess) return;
  Object.assign(state, sess.state);
  if(!state.max) state.max = {bench:'',squat:'',deadlift:'',press:'',row:''};
  syncBriefUI();
  if(sess.program){
    PROGRAM = sess.program; WEEK = sess.week || 1;
    if(stripCoreFromMain(PROGRAM)){ saveSession(); saveStore(); }
    renderProgram(false);
  }
})();
