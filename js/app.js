/* ============================ STATE ============================ */
const state = { goal:'muscle', split:'auto', days:4, exp:'intermediate', equip:'gym', length:45,
                abs:false, unit:'kg', bw:'', max:{bench:'',squat:'',deadlift:'',press:'',row:''} };
const LOG = { byExercise:{} };  // name -> {weight, reps, unit, e1rm, type}
let PROGRAM = null, WEEK = 1, EDIT = null;

/* persistence — survives reloads when opened as a file; silent no-op if blocked */
function saveStore(){ try{ localStorage.setItem('split_log_v1', JSON.stringify(LOG.byExercise)); }catch(e){} }
function loadStore(){ try{ const r=localStorage.getItem('split_log_v1'); if(r){ const o=JSON.parse(r); if(o&&typeof o==='object') LOG.byExercise=o; } }catch(e){} }

document.querySelectorAll('.chips').forEach(group=>{
  const key = group.dataset.key;
  group.addEventListener('click', e=>{
    const btn = e.target.closest('.chip'); if(!btn) return;
    group.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed','false'));
    btn.setAttribute('aria-pressed','true');
    const v = btn.dataset.val;
    state[key] = (key==='days'||key==='length') ? parseInt(v,10) : v;
  });
});
document.getElementById('bw').addEventListener('input',e=>{ state.bw=e.target.value; });
document.querySelectorAll('input[data-max]').forEach(inp=>{
  inp.addEventListener('input',e=>{ state.max[e.target.dataset.max]=e.target.value; });
});
const absBtn=document.getElementById('absToggle');
absBtn.addEventListener('click',()=>{ state.abs=!state.abs; absBtn.setAttribute('aria-checked', state.abs?'true':'false'); });

/* ===================== RENDER ===================== */
function loggedText(l, entry){
  if(l.w && entry.weight>0) return `logged ${fmt(entry.weight)} ${entry.unit}${entry.type==='dumbbell'?'/hand':''} × ${entry.reps}`;
  return `logged ${entry.weight>0?'+'+fmt(entry.weight)+' '+entry.unit+' × ':''}${entry.reps} reps`;
}
function renderProgram(animate){
  const p=PROGRAM, wi=WEEK_INFO[WEEK], factor=WEEK_FACTOR[WEEK];
  const anchors=anchorMaxes(), unit=state.unit;
  const anchorsAvail=Object.values(anchors).some(v=>v), anyLog=Object.keys(LOG.byExercise).length>0;
  const prog=document.getElementById('program');
  let totalSets=0, daysHTML='', delay=0;

  p.weekdays.forEach((d,di)=>{
    if(d.rest){
      daysHTML+=`<div class="day rest"><span class="dow">${d.label}</span><span class="rfocus">Rest</span>
        <span class="rnote">${restNotes[d.label.charCodeAt(0)%restNotes.length]}</span></div>`;
      return;
    }
    delay+=0.06; let finisherShown=false, liftsHTML='';
    d.lifts.forEach((l,li)=>{
      if(l.finisher && !finisherShown){ liftsHTML+=`<div class="finisher-label">＋ Abs finisher</div>`; finisherShown=true; }
      const v=weekAdjust(l.base,WEEK,l.compound);
      if(v.sets) totalSets+=parseInt(v.sets,10);
      const rxTxt = v.sets ? `${v.sets} × ${v.reps}` : v.reps;
      const entry=LOG.byExercise[l.name];
      let metaTxt=v.rest, num='';
      if(v.sets!==''){
        const load=suggestLoad(l, v.reps, WEEK, anchors, unit);
        if(load){ metaTxt=`<span class="load">${load.txt}</span> · ${v.rest}`; if(load.num!=null) num=load.num; }
      }
      const loggedLine = entry ? `<div class="logged">✓ ${loggedText(l,entry)}</div>` : '';
      const key=`${di}:${li}`;
      const logBtn = v.sets!=='' ? `<button class="logbtn${entry?' done':''}" data-k="${key}" aria-label="Log ${l.name}">${entry?'✓ log':'log'}</button>` : '';
      liftsHTML+=`<div class="lift">
        <div class="nm">${l.name}<em>${v.tag}</em></div>
        <div class="prescribe"><div class="rx">${rxTxt}</div><div class="meta">${metaTxt}</div>${loggedLine}</div>
        ${logBtn}
        <button class="swap" data-di="${di}" data-li="${li}" aria-label="Swap ${l.name}" title="Swap this exercise">⇄</button>
      </div>`;
      if(EDIT===key){
        const wLabel = l.w ? `${unit}${l.w[2]==='dumbbell'?' /hand':''}` : `added ${unit}`;
        const prefW = num!==''?num:(entry?(entry.weight||''):'');
        const prefR = entry?entry.reps:repTop(v.reps);
        liftsHTML+=`<div class="logbox" data-di="${di}" data-li="${li}">
          <div class="lb-head">Log what you actually hit</div>
          <div class="lb-row">
            <label>${wLabel}<input class="lw" type="number" inputmode="decimal" value="${prefW}" placeholder="—"></label>
            <span class="lb-x">×</span>
            <label>reps<input class="lr" type="number" inputmode="numeric" value="${prefR}"></label>
            <button class="logcancel" type="button">Cancel</button>
            <button class="logsave" type="button">Save</button>
          </div>
          ${entry?`<button class="logclear" data-name="${l.name}">Clear this log</button>`:''}
        </div>`;
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
      : `tap <span class="wt">log</span> on any lift, or add a max in the brief, for suggested weights`);
  const logCount=Object.keys(LOG.byExercise).length;

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
    <div class="hint">↻ regenerate · ⇄ swap · log a set to make the weights yours · tap a week to progress<br>${wtNote}</div>
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
  if(EDIT){ const box=prog.querySelector('.logbox .lw'); if(box) box.focus(); }
}

/* ===================== LOGGING + INTERACTIONS ===================== */
function logLift(di,li, weightStr, repsStr){
  const l=PROGRAM.weekdays[di].lifts[li];
  const wnum=parseFloat(weightStr);
  const reps=parseInt(repsStr,10) || repTop(l.base.reps);
  const entry={ weight:(wnum>0?wnum:0), reps, unit:state.unit };
  if(l.w){
    const type=l.w[2];
    const total = type==='dumbbell' ? (wnum>0?wnum*2:0) : (wnum>0?wnum:0);
    entry.type=type;
    entry.e1rm = total>0 ? total*(1+reps/30) : null;
  }
  LOG.byExercise[l.name]=entry; saveStore(); EDIT=null; renderProgram(false);
}
function clearLift(name){ delete LOG.byExercise[name]; saveStore(); renderProgram(false); }
function swapLift(di,li){
  const day=PROGRAM.weekdays[di]; if(!day||day.rest) return;
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
  const lb=e.target.closest('.logbtn'); if(lb){ const k=lb.dataset.k; EDIT=(EDIT===k?null:k); renderProgram(false); return; }
  const sv=e.target.closest('.logsave'); if(sv){ const box=sv.closest('.logbox'); logLift(+box.dataset.di,+box.dataset.li, box.querySelector('.lw').value, box.querySelector('.lr').value); return; }
  const cc=e.target.closest('.logcancel'); if(cc){ EDIT=null; renderProgram(false); return; }
  const cl=e.target.closest('.logclear'); if(cl){ clearLift(cl.dataset.name); return; }
  const wk=e.target.closest('.wk'); if(wk){ EDIT=null; WEEK=parseInt(wk.dataset.wk,10); renderProgram(false); return; }
  const sw=e.target.closest('.swap'); if(sw){ swapLift(+sw.dataset.di,+sw.dataset.li); return; }
  if(e.target.closest('#regen')){ EDIT=null; PROGRAM=generate(); WEEK=1; renderProgram(true); return; }
  if(e.target.closest('#edit')){ document.querySelector('.brief').scrollIntoView({behavior:'smooth',block:'start'}); return; }
  if(e.target.closest('#clearlog')){ if(confirm('Clear all logged sets? This cannot be undone.')){ LOG.byExercise={}; saveStore(); renderProgram(false); } return; }
});
document.getElementById('build').addEventListener('click',()=>{
  EDIT=null; PROGRAM=generate(); WEEK=1; renderProgram(true);
  requestAnimationFrame(()=>document.getElementById('program').scrollIntoView({behavior:'smooth',block:'start'}));
});

loadStore();
