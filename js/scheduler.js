/* ===================== SPLIT SELECTION ===================== */
function chooseSplit(days, goal, exp){
  const strengthy = (goal==='strength'||goal==='muscle');
  if(goal==='endurance'){
    return {2:['Full Body','Conditioning'],3:['Full Body','Conditioning','Full Body'],
            4:['Upper Body','Conditioning','Lower Body','Conditioning'],
            5:['Push','Conditioning','Pull','Conditioning','Legs'],
            6:['Push','Conditioning','Pull','Conditioning','Legs','Conditioning']}[days];
  }
  if(days===2) return ['Full Body','Full Body'];
  if(days===3) return (strengthy && exp!=='beginner') ? ['Push','Pull','Legs'] : ['Full Body','Full Body','Full Body'];
  if(days===4) return ['Upper Body','Lower Body','Upper Body','Lower Body'];
  if(days===5) return goal==='fatloss' ? ['Upper Body','Lower Body','Conditioning','Push','Pull'] : ['Push','Pull','Legs','Upper Body','Lower Body'];
  if(days===6) return ['Push','Pull','Legs','Push','Pull','Legs'];
}
function muscleSplit(days){
  return {2:['Chest & Back','Legs & Shoulders'],
          3:['Chest & Triceps','Back & Biceps','Legs & Shoulders'],
          4:['Chest','Back','Shoulders & Arms','Legs'],
          5:['Chest','Back','Shoulders','Arms','Legs'],
          6:['Chest','Back','Shoulders','Arms','Legs','Chest & Arms']}[days];
}

/* ===================== PROGRESSION ===================== */
function weekAdjust(base, week, compound){
  if(base.sets==='') return {sets:'',reps:base.reps,rest:base.rest,tag:base.tag};
  let sets = parseInt(base.sets,10);
  if(week===3 && compound) sets += 1;
  if(week===5) sets = Math.max(2, Math.round(sets*0.5));
  return {sets:String(sets), reps:base.reps, rest:base.rest, tag:base.tag};
}

/* ===================== WEIGHTS + PERSONALISATION ===================== */
function exE1RM(name){ const e=lastForName(name); return e && e.e1rm ? e.e1rm : null; }
function anchorMaxes(){
  const bw=parseFloat(state.bw)||0, ef=EXP_F[state.exp], out={};
  for(const a in BW_MULT){
    const logged=exE1RM(ANCHOR_LIFT[a]);
    const entered=parseFloat(state.max[a]);
    out[a]= logged || (entered>0?entered:(bw>0?bw*BW_MULT[a]*ef:null));
  }
  return out;
}
function pctForReps(reps){
  const nums=(reps.match(/\d+/g)||['10']).map(Number);
  const mid = nums.length>1 ? (nums[0]+nums[1])/2 : nums[0];
  return 1/(1 + mid/30);
}
function repTop(reps){ const n=(reps.match(/\d+/g)||['10']).map(Number); return n[n.length-1]; }
function fmt(n){ return Number.isInteger(n)?String(n):n.toFixed(1).replace(/\.0$/,''); }
function suggestLoad(l, reps, week, anchors, unit){
  const w=l.w;
  let base=exE1RM(l.name);                       // personal number wins
  if(base===null && w){ const [a,k]=w; base = (anchors&&anchors[a]) ? anchors[a]*k : null; }
  if(base===null) return w ? null : {txt:'bodyweight', bw:true};
  const type = w? w[2] : 'barbell';
  const val = base*pctForReps(reps)*LOAD_FACTOR[week];
  const step = unit==='lb'?5:2.5;
  const round = v=>Math.max(step, Math.round(v/step)*step);
  if(type==='dumbbell'){ const ph=round(val/2); return {txt:`${fmt(ph)} ${unit}/hand`, num:ph, type}; }
  const r=round(val); return {txt:`${fmt(r)} ${unit}`, num:r, type};
}

/* ===================== GENERATION ===================== */
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;}
function getPool(group,equip){
  let pool = EX[group].filter(x=>x.eq.includes(equip));
  if(!pool.length) pool = EX[group].filter(x=>x.eq.includes('bodyweight'));
  return pool;
}
function buildQueues(equip){
  const q={},idx={};
  for(const g in EX){ q[g]=shuffle(getPool(g,equip)); idx[g]=0; }
  return { take(group){ const pool=q[group]; if(!pool||!pool.length) return null;
    if(idx[group]>=pool.length){ q[group]=shuffle(pool); idx[group]=0; } return pool[idx[group]++]; }};
}
function targetCount(length, exp){
  const base={30:4,45:5,60:6,75:7}[length];
  const adj={beginner:-1,intermediate:0,advanced:1}[exp];
  return Math.max(3,Math.min(8,base+adj));
}
function liftBase(ex,group,goal){
  if(group==='cardio') return {sets:'',reps:CARDIO_RX[Math.floor(Math.random()*CARDIO_RX.length)],rest:'—',tag:'metcon'};
  const sp=(SCHEME[goal]||SCHEME.general)[ex.c?'comp':'iso'];
  return {sets:sp.s,reps:sp.r,rest:sp.rest,tag:ex.c?'compound':'accessory'};
}
function mkLift(ex,group,goal,finisher){ return {name:ex.n,group,compound:ex.c,w:ex.w,base:liftBase(ex,group,goal),finisher:!!finisher}; }
function pickLifts(dayType,count,queues,goal){
  const template=TEMPLATES[dayType]||['chest','back','quads','shoulders'];
  const lifts=[],used=new Set();
  let i=0, misses=0, maxMiss=template.length*4;
  while(lifts.length<count && misses<maxMiss){
    const group=template[i%template.length]; i++;
    let ex=null,tries=0;
    do{ ex=queues.take(group); tries++; }while(ex && used.has(ex.n) && tries<10);
    if(!ex || used.has(ex.n)){ misses++; continue; }
    used.add(ex.n); misses=0; lifts.push(mkLift(ex,group,goal));
  }
  return {lifts,used};
}
function absFinisher(usedNames, equip, goal){
  const pool=getPool('core',equip).filter(x=>!usedNames.has(x.n));
  return shuffle(pool).slice(0,2).map(ex=>{ const l=mkLift(ex,'core',goal,true); l.base={sets:'3',reps:'12–15',rest:'30 s',tag:'abs'}; return l; });
}
function dayIntensity(lifts, goal){
  if(!lifts.length) return 0;
  const cr = lifts.filter(l=>l.compound).length / lifts.length;
  const size = Math.min(1, lifts.length/8);
  const bump = {strength:.18,muscle:.12,fatloss:.1,endurance:.1,general:.04}[goal]||0;
  return Math.max(.28, Math.min(1, size*.45 + cr*.4 + bump));
}
function intensityLabel(v){ return v<0.5?'Light':v<0.72?'Moderate':'Hard'; }
/* Build one week of training days for a fixed structure. The queues are shared
   across weeks and keep advancing, so each week draws different exercises for
   the same day focus — cycling through the library rather than repeating. */
function buildWeekdays(layout, slots, count, queues, goal, equip, abs){
  const weekdays=WEEKDAYS.map(l=>({label:l,rest:true}));
  layout.forEach((type,k)=>{
    const {lifts,used}=pickLifts(type,count,queues,goal);
    if(abs && type!=='Conditioning'){ absFinisher(used,equip,goal).forEach(l=>lifts.push(l)); }
    const slot=slots[k];
    weekdays[slot]={label:WEEKDAYS[slot],rest:false,type,lifts,inten:dayIntensity(lifts,goal)};
  });
  return weekdays;
}
const PROG_WEEKS = 5;
function generate(){
  const {goal,days,exp,equip,length,split,abs}=state;
  const layout = (split==='muscle') ? muscleSplit(days) : chooseSplit(days,goal,exp);
  const queues=buildQueues(equip);           // shared across weeks -> week-to-week variation
  const count=targetCount(length,exp);
  const slots=DAY_SLOTS[days];
  const weeks={};
  for(let w=1; w<=PROG_WEEKS; w++){ weeks[w]=buildWeekdays(layout, slots, count, queues, goal, equip, abs); }
  const uniq=[...new Set(layout)];
  const splitName = split==='muscle' ? 'Body-part split'
      : (uniq.length<=2 ? uniq.join(' / ') : (days===6?'Push · Pull · Legs ×2':uniq.slice(0,3).join(' · ')));
  return {meta:GOAL_META[goal], weeks, weekdays:weeks[1], days, length, splitName, goal, equip, abs};
}
