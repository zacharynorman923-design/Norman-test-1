/* ===================== AI COACH — natural-language brief =====================
   Bring-your-own-key: the user's Anthropic API key is stored only in this
   browser's localStorage and sent directly to api.anthropic.com. It never
   touches any SPLIT server (there isn't one — this is a static site).
   Claude maps a free-text description onto the brief fields, then the app
   builds the week exactly as if the chips had been set by hand. */

const AI_KEY_STORE = 'split_anthropic_key_v1';
const AI_MODEL_STORE = 'split_anthropic_model_v1';

const aiText  = document.getElementById('aiText');
const aiKey   = document.getElementById('aiKey');
const aiModel = document.getElementById('aiModel');
const aiBuild = document.getElementById('aiBuild');
const aiStatus= document.getElementById('aiStatus');

/* restore saved key + model choice */
try{
  const k=localStorage.getItem(AI_KEY_STORE); if(k) aiKey.value=k;
  const m=localStorage.getItem(AI_MODEL_STORE); if(m) aiModel.value=m;
}catch(e){}
aiKey.addEventListener('input', ()=>{ try{ localStorage.setItem(AI_KEY_STORE, aiKey.value.trim()); }catch(e){} });
aiModel.addEventListener('change', ()=>{ try{ localStorage.setItem(AI_MODEL_STORE, aiModel.value); }catch(e){} });

function aiSetStatus(msg, kind){ aiStatus.textContent=msg||''; aiStatus.className='ai-status'+(kind?' '+kind:''); }

/* Tool Claude fills in. Fields are all optional — only what the user implies is
   set; everything else keeps its current value in the brief. */
const AI_TOOL = {
  name:'set_brief',
  description:'Set the training-brief fields from the user\'s description, then the app builds their week. Only include fields the user states or clearly implies; omit anything uncertain so its current value is kept.',
  input_schema:{
    type:'object',
    properties:{
      goal:{type:'string', enum:['muscle','strength','fatloss','endurance','general'],
        description:'Primary goal. muscle=build muscle/hypertrophy/tone; strength=get stronger/powerlifting; fatloss=lose fat/lean out/conditioning; endurance=stamina/work capacity; general=balanced overall fitness.'},
      split:{type:'string', enum:['auto','muscle'],
        description:"Split style. 'auto' matches the goal (default). Use 'muscle' only if the user explicitly wants a body-part / bro split (one muscle group per day)."},
      days:{type:'integer', enum:[2,3,4,5,6], description:'Training days per week.'},
      exp:{type:'string', enum:['beginner','intermediate','advanced'],
        description:'Experience. beginner=under ~1 year; intermediate=~1-3 years; advanced=3+ years.'},
      equip:{type:'string', enum:['gym','dumbbell','bodyweight'],
        description:'Equipment. gym=full gym (barbells + machines); dumbbell=dumbbells/bands/home setup; bodyweight=no equipment.'},
      length:{type:'integer', enum:[30,45,60,75], description:'Session length in minutes; round to the nearest of these.'},
      abs:{type:'boolean', description:'True if the user wants dedicated ab/core work added to each day.'},
      unit:{type:'string', enum:['kg','lb'], description:'Weight unit — lb for pounds/US context, otherwise kg.'},
      bw:{type:'number', description:'Bodyweight in the chosen unit, only if the user gives it.'},
      max:{type:'object', description:'Any 1-rep-max or heavy top-set numbers the user mentions, in the chosen unit. Do not invent numbers.',
        properties:{ bench:{type:'number'}, squat:{type:'number'}, deadlift:{type:'number'}, press:{type:'number'}, row:{type:'number'} }}
    }
  }
};
const AI_SYSTEM =
  "You convert a person's plain-language description of their training into structured inputs for a workout program generator. "+
  "Call the set_brief tool exactly once. Only set fields the user states or clearly implies — leave the rest unset so their current defaults are kept. "+
  "Map natural phrasing to the allowed values (e.g. 'home with dumbbells' -> equip=dumbbell; 'four times a week' -> days=4; 'tone up' or 'lose weight' -> goal=fatloss/muscle as appropriate). "+
  "Never invent 1-rep-max numbers. Respond with the tool call only.";

async function aiCall(apiKey, model, text){
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{
      'content-type':'application/json',
      'x-api-key': apiKey,
      'anthropic-version':'2023-06-01',
      'anthropic-dangerous-direct-browser-access':'true'
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: AI_SYSTEM,
      tools: [AI_TOOL],
      messages: [{ role:'user', content: text }]
    })
  });
  if(!res.ok){
    let detail=''; try{ const e=await res.json(); detail=e.error&&e.error.message?e.error.message:''; }catch(_){}
    if(res.status===401) throw new Error('That API key was rejected. Double-check it and try again.');
    if(res.status===429) throw new Error('Anthropic is rate-limiting — wait a moment and retry.');
    if(res.status===402||/credit|billing/i.test(detail)) throw new Error('Your Anthropic account needs credit to make requests.');
    throw new Error(detail || `Anthropic returned an error (${res.status}).`);
  }
  const data = await res.json();
  if(data.stop_reason==='refusal') throw new Error('Claude declined that request. Try rephrasing.');
  const tu = (data.content||[]).find(b=>b.type==='tool_use' && b.name==='set_brief');
  if(tu && tu.input && typeof tu.input==='object') return tu.input;
  // fallback: a JSON object in a text block
  const txt=(data.content||[]).find(b=>b.type==='text');
  if(txt){ try{ const m=txt.text.match(/\{[\s\S]*\}/); if(m) return JSON.parse(m[0]); }catch(_){} }
  throw new Error("Couldn't read a brief from Claude's reply. Try adding more detail.");
}

/* Apply only valid fields onto the shared brief state (defined in app.js). */
function aiApplyBrief(b){
  const inSet=(v,arr)=>arr.indexOf(v)!==-1;
  if(inSet(b.goal,['muscle','strength','fatloss','endurance','general'])) state.goal=b.goal;
  if(inSet(b.split,['auto','muscle'])) state.split=b.split;
  if([2,3,4,5,6].indexOf(+b.days)!==-1) state.days=+b.days;
  if(inSet(b.exp,['beginner','intermediate','advanced'])) state.exp=b.exp;
  if(inSet(b.equip,['gym','dumbbell','bodyweight'])) state.equip=b.equip;
  if([30,45,60,75].indexOf(+b.length)!==-1) state.length=+b.length;
  if(typeof b.abs==='boolean') state.abs=b.abs;
  if(inSet(b.unit,['kg','lb'])) state.unit=b.unit;
  if(b.bw>0) state.bw=String(b.bw);
  if(b.max && typeof b.max==='object'){
    ['bench','squat','deadlift','press','row'].forEach(k=>{ if(b.max[k]>0) state.max[k]=String(b.max[k]); });
  }
}

/* ===================== ADD-ON BLOCK =====================
   Appends a small extra block (like the abs finisher) to one training day,
   targeting whatever the user asks for. Claude may only choose exercises that
   already exist in the library for their equipment, so the added moves keep
   their how-to cues, demo, suggested loads and per-set logging. */

const addonSec   = document.getElementById('addon');
const addonText  = document.getElementById('addonText');
const addonDay   = document.getElementById('addonDay');
const addonEvery = document.getElementById('addonEvery');
const addonBuild = document.getElementById('addonBuild');
const addonStatus= document.getElementById('addonStatus');

let addonAllWeeks = true;
addonEvery.addEventListener('click', ()=>{
  addonAllWeeks=!addonAllWeeks;
  addonEvery.setAttribute('aria-pressed', addonAllWeeks?'true':'false');
});
function addonSetStatus(msg, kind){ addonStatus.textContent=msg||''; addonStatus.className='ai-status'+(kind?' '+kind:''); }

/* Called from renderProgram(): show the panel and list the current week's days. */
function refreshAddonUI(){
  if(typeof PROGRAM==='undefined' || !PROGRAM){ addonSec.classList.add('hidden'); return; }
  addonSec.classList.remove('hidden');
  const prev=addonDay.value;
  addonDay.innerHTML = curWeekdays()
    .map((d,di)=> d.rest ? '' : `<option value="${di}">${d.label} · ${d.type}</option>`)
    .join('');
  if(prev && addonDay.querySelector(`option[value="${prev}"]`)) addonDay.value=prev;
}

function findExercise(name){
  for(const g in EX){ const hit=EX[g].filter(x=>x.n===name)[0]; if(hit) return {ex:hit, group:g}; }
  return null;
}
function libraryNames(equip){
  const out=[];
  for(const g in EX){ getPool(g,equip).forEach(x=>{ if(out.indexOf(x.n)===-1) out.push(x.n); }); }
  return out;
}

const AI_BLOCK_TOOL = {
  name:'add_block',
  description:'Add a short accessory block to one training day, targeting the muscle or quality the lifter asked for.',
  input_schema:{
    type:'object',
    properties:{
      title:{type:'string', description:'Short label for the block, 2-4 words, e.g. "Rear delt finisher" or "Calf work".'},
      exercises:{type:'array', description:'2 to 4 exercises, best first.',
        items:{type:'object', properties:{
          name:{type:'string', description:'Must be exactly one of the available exercise names given by the user.'},
          sets:{type:'integer', description:'Working sets, 2-5.'},
          reps:{type:'string', description:'Rep range like "10–12", or a hold like "30 s" for planks/holds.'},
          rest:{type:'string', description:'Rest between sets, e.g. "60 s".'}
        }, required:['name','sets','reps']}}
    },
    required:['title','exercises']
  }
};
const AI_BLOCK_SYSTEM =
  "You add a short accessory block to an existing workout day. Call the add_block tool exactly once. "+
  "Choose 2-4 exercises that best target what the lifter asked for, using ONLY the exact exercise names they list as available — never invent a name or alter its spelling. "+
  "This is supplementary work at the end of a session, so favour accessory-appropriate volume (2-4 sets, moderate to high reps, short rest) and don't add heavy compound lifts unless the request calls for it.";

async function aiCallBlock(apiKey, model, text, dayType, names){
  const goalTitle = (GOAL_META[PROGRAM.goal]||{}).title || 'general training';
  const equipLabel = {gym:'a full gym', dumbbell:'dumbbells and bands', bodyweight:'bodyweight only'}[PROGRAM.equip];
  const msg =
    `The lifter asked for: "${text}"\n\n`+
    `Add it to their ${dayType} day. Their programme is a ${goalTitle} and they train with ${equipLabel}.\n\n`+
    `Available exercise names (use these exactly):\n${names.join(', ')}`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST',
    headers:{
      'content-type':'application/json',
      'x-api-key': apiKey,
      'anthropic-version':'2023-06-01',
      'anthropic-dangerous-direct-browser-access':'true'
    },
    body: JSON.stringify({ model, max_tokens:1024, system:AI_BLOCK_SYSTEM, tools:[AI_BLOCK_TOOL],
                           messages:[{role:'user', content:msg}] })
  });
  if(!res.ok){
    let detail=''; try{ const e=await res.json(); detail=e.error&&e.error.message?e.error.message:''; }catch(_){}
    if(res.status===401) throw new Error('That API key was rejected. Check it in the Describe it card above.');
    if(res.status===429) throw new Error('Anthropic is rate-limiting — wait a moment and retry.');
    if(res.status===402||/credit|billing/i.test(detail)) throw new Error('Your Anthropic account needs credit to make requests.');
    throw new Error(detail || `Anthropic returned an error (${res.status}).`);
  }
  const data = await res.json();
  if(data.stop_reason==='refusal') throw new Error('Claude declined that request. Try rephrasing.');
  const tu=(data.content||[]).filter(b=>b.type==='tool_use' && b.name==='add_block')[0];
  if(!tu || !tu.input) throw new Error("Couldn't read a block from Claude's reply. Try describing it differently.");
  return tu.input;
}

/* Validate Claude's picks against the library and append them to the day. */
function aiApplyBlock(title, exercises, di, everyWeek){
  const built=[];
  (exercises||[]).slice(0,4).forEach(e=>{
    const found=findExercise(String(e && e.name));
    if(!found) return;                                   // unknown name -> drop
    built.push({
      found,
      sets: String(Math.max(1, Math.min(6, parseInt(e.sets,10)||3))),
      reps: String(e.reps||'10–12').slice(0,12),
      rest: String(e.rest||'60 s').slice(0,12),
    });
  });
  if(!built.length) return 0;

  const targets=[];
  if(PROGRAM.weeks){
    if(everyWeek){ for(const w in PROGRAM.weeks) targets.push(PROGRAM.weeks[w]); }
    else targets.push(PROGRAM.weeks[WEEK] || PROGRAM.weekdays);
  } else targets.push(PROGRAM.weekdays);

  targets.forEach(days=>{
    const day=days[di]; if(!day || day.rest) return;
    day.lifts = day.lifts.filter(l=>l.addon!==title);    // replace a block of the same name
    built.forEach(b=>{
      const l=mkLift(b.found.ex, b.found.group, PROGRAM.goal, false);
      l.base={sets:b.sets, reps:b.reps, rest:b.rest, tag:'added'};
      l.addon=title;
      day.lifts.push(l);
    });
    day.inten=dayIntensity(day.lifts, PROGRAM.goal);
  });
  return built.length;
}

addonBuild.addEventListener('click', async ()=>{
  const text=(addonText.value||'').trim();
  const key=(aiKey.value||'').trim();
  if(!PROGRAM){ addonSetStatus('Build your week first.', 'err'); return; }
  if(!text){ addonSetStatus('Say what extra work you want.', 'err'); addonText.focus(); return; }
  if(!key){ addonSetStatus('Add your Anthropic API key in the Describe it card above.', 'err'); aiKey.focus(); return; }
  const di=parseInt(addonDay.value,10);
  const day=curWeekdays()[di];
  if(!day || day.rest){ addonSetStatus('Pick a training day.', 'err'); return; }

  addonBuild.disabled=true; const label=addonBuild.innerHTML;
  addonBuild.innerHTML='Thinking… <span class="arrow">•••</span>';
  addonSetStatus('Asking Claude for a block…');
  try{
    const out=await aiCallBlock(key, aiModel.value, text, day.type, libraryNames(PROGRAM.equip));
    const title=String(out.title||'Extra work').replace(/[<>"'&]/g,'').trim().slice(0,40) || 'Extra work';
    const n=aiApplyBlock(title, out.exercises, di, addonAllWeeks);
    if(!n) throw new Error('Claude picked exercises that are not in your library. Try again, or rephrase.');
    saveSession(); EDIT=null; renderProgram(false);
    addonSetStatus(`Added “${title}” — ${n} move${n>1?'s':''} on ${day.label}${addonAllWeeks?', every week':' (this week only)'}. Remove it with the ✕ on the block.`, 'ok');
    addonText.value='';
  }catch(err){
    addonSetStatus(err.message || 'Something went wrong talking to Claude.', 'err');
  }finally{
    addonBuild.disabled=false; addonBuild.innerHTML=label;
  }
});

aiBuild.addEventListener('click', async ()=>{
  const text=(aiText.value||'').trim();
  const key=(aiKey.value||'').trim();
  if(!text){ aiSetStatus('Describe your training above first.', 'err'); aiText.focus(); return; }
  if(!key){ aiSetStatus('Paste your Anthropic API key to use the AI coach.', 'err'); aiKey.focus(); return; }

  aiBuild.disabled=true; const label=aiBuild.innerHTML; aiBuild.innerHTML='Thinking… <span class="arrow">•••</span>';
  aiSetStatus('Asking Claude to set your brief…');
  try{
    const brief = await aiCall(key, aiModel.value, text);
    aiApplyBrief(brief);
    syncBriefUI();                       // reflect onto the chips
    EDIT=null; PROGRAM=generate(); WEEK=1; saveSession();
    renderProgram(true);
    aiSetStatus('Brief set from your description — week built below. Tweak the chips and rebuild any time.', 'ok');
    requestAnimationFrame(()=>document.getElementById('program').scrollIntoView({behavior:'smooth',block:'start'}));
  }catch(err){
    aiSetStatus(err.message || 'Something went wrong talking to Claude.', 'err');
  }finally{
    aiBuild.disabled=false; aiBuild.innerHTML=label;
  }
});
