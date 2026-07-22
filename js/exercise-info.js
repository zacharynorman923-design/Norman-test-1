/* ===================== EXERCISE INSTRUCTIONS + VISUALS =====================
   HOWTO      : exercise name -> ordered step cues (how to perform it)
   GROUP_TARGET: muscle group -> the muscles it works (shown as "Targets")
   PATTERN    : exercise name -> movement-pattern key (drives the animated demo)
   POSES      : pattern key  -> two stick-figure poses that cross-fade into a
                looping motion demo (or one pose for a static hold)
   All self-contained — no images, no network — so it works offline.          */

const GROUP_TARGET = {
  chest:'Chest · front delts · triceps',
  back:'Lats · upper back · biceps',
  shoulders:'Shoulders · triceps',
  biceps:'Biceps',
  triceps:'Triceps',
  quads:'Quads · glutes',
  posterior:'Hamstrings · glutes',
  calves:'Calves',
  core:'Core · abs',
  cardio:'Full body · conditioning',
};

const HOWTO = {
  /* chest */
  'Barbell Bench Press':['Lie flat, eyes under the bar, grip a little wider than shoulders.','Unrack, lower the bar to mid-chest with elbows ~45°.','Press up and slightly back until arms lock out.'],
  'Incline Dumbbell Press':['Set the bench to 30–45°, dumbbells at shoulder height.','Press up and slightly together until arms extend.','Lower under control until you feel a stretch in the chest.'],
  'Dumbbell Bench Press':['Lie flat holding dumbbells at chest height, palms forward.','Press up until the arms are straight over the shoulders.','Lower slowly to a deep but comfortable stretch.'],
  'Push-Up':['Hands under shoulders, body in a straight line head-to-heels.','Lower your chest to the floor, elbows ~45°.','Press back up and brace your abs the whole time.'],
  'Dumbbell Fly':['Lie flat, dumbbells above the chest, slight elbow bend.','Open the arms wide in an arc until you feel a chest stretch.','Squeeze the chest to bring them back together over you.'],
  'Chest Fly Machine':['Sit with back flat, forearms on the pads.','Bring the handles together in front of your chest.','Return slowly until you feel a stretch, no clanking weights.'],
  'Dips':['Support yourself on parallel bars, arms straight.','Lean forward slightly and lower until shoulders reach elbow height.','Press back up to lockout.'],
  'Decline Push-Up':['Feet elevated on a bench, hands under shoulders on the floor.','Lower your chest with elbows ~45°, body straight.','Press up powerfully — this loads the upper chest more.'],
  /* back */
  'Deadlift':['Bar over mid-foot, hinge and grip just outside your knees.','Chest up, flat back, take the slack out of the bar.','Drive the floor away and stand tall; lower with control.'],
  'Barbell Row':['Hinge to ~45°, flat back, bar hanging at arms length.','Pull the bar to your lower ribs, elbows past your torso.','Lower under control — no jerking or standing up.'],
  'Pull-Up':['Hang from the bar, hands just wider than shoulders.','Pull your chest toward the bar, driving elbows down.','Lower all the way to a full hang each rep.'],
  'Lat Pulldown':['Grip wide, thighs under the pads, slight lean back.','Pull the bar to your upper chest, squeezing the lats.','Return slowly until arms are fully extended.'],
  'One-Arm Dumbbell Row':['One hand and knee on a bench, back flat.','Row the dumbbell to your hip, elbow close to the body.','Lower to a full stretch; keep hips square.'],
  'Inverted Row':['Under a fixed bar, body straight, heels on the floor.','Pull your chest to the bar, squeezing shoulder blades.','Lower slowly to arms straight.'],
  'Seated Cable Row':['Sit tall, slight knee bend, grab the handle.','Pull to your belly, driving elbows back, chest proud.','Return under control without rounding your back.'],
  'Superman Hold':['Lie face down, arms extended overhead.','Lift arms, chest and legs off the floor.','Hold, squeezing the lower back and glutes; breathe.'],
  /* shoulders */
  'Overhead Press':['Bar on front delts, grip just outside shoulders, brace hard.','Press straight up, moving your head back then through.','Lock out overhead; lower to the collarbone.'],
  'Dumbbell Shoulder Press':['Seated or standing, dumbbells at shoulder height.','Press up until the arms extend overhead.','Lower under control to ear height.'],
  'Pike Push-Up':['Hands down, hips high in an inverted-V.','Bend the elbows to lower the crown of your head toward the floor.','Press back up — targets the shoulders.'],
  'Lateral Raise':['Stand with dumbbells at your sides, slight elbow bend.','Raise the arms out to the sides to shoulder height.','Lower slowly — lead with the elbows, no swinging.'],
  'Face Pull':['Set a rope at head height, grip thumbs-back.','Pull toward your forehead, flaring elbows wide.','Squeeze the rear delts; return under control.'],
  'Handstand Hold':['Kick up to a handstand against a wall.','Stack hands, shoulders and hips; squeeze everything.','Hold and breathe; come down under control.'],
  /* biceps */
  'Barbell Curl':['Stand tall, grip shoulder-width, elbows at your sides.','Curl the bar up without swinging the elbows forward.','Lower slowly to a full stretch.'],
  'Dumbbell Curl':['Dumbbells at your sides, palms forward.','Curl one or both up, keeping elbows pinned.','Lower under control; no body english.'],
  'Hammer Curl':['Hold dumbbells with palms facing each other.','Curl up keeping the neutral grip.','Lower slowly — hits the biceps and forearms.'],
  'Chin-Up':['Hang with palms facing you, shoulder-width.','Pull your chest to the bar, driving elbows down.','Lower to a full hang each rep.'],
  'Underhand Inverted Row':['Under a bar with an underhand grip, body straight.','Pull your chest to the bar, elbows tucked.','Lower slowly — rows with extra biceps.'],
  /* triceps */
  'Close-Grip Bench Press':['Lie flat, grip about shoulder-width.','Lower the bar to the lower chest, elbows tucked.','Press up, driving through the triceps to lockout.'],
  'Triceps Pushdown':['Face the cable, elbows pinned to your sides.','Push the bar down until the arms lock out.','Return only to elbow height — keep tension.'],
  'Overhead DB Extension':['Hold one dumbbell overhead with both hands.','Lower it behind your head, elbows pointing up.','Extend back to overhead, squeezing the triceps.'],
  'Bench Dip':['Hands on a bench behind you, legs out front.','Lower your hips until elbows reach ~90°.','Press back up through the triceps.'],
  'Diamond Push-Up':['Hands together forming a diamond under your chest.','Lower with elbows tucked to your sides.','Press up — extra triceps emphasis.'],
  /* quads */
  'Back Squat':['Bar on your upper back, feet shoulder-width, toes slightly out.','Break at hips and knees, sit down between your legs.','Descend to at least parallel, then drive up.'],
  'Goblet Squat':['Hold a dumbbell at your chest, elbows down.','Squat down between your knees, chest tall.','Stand back up, driving through the heels.'],
  'Leg Press':['Feet mid-platform, shoulder-width, back flat on the pad.','Lower until knees reach ~90°.','Press away without locking the knees hard.'],
  'Walking Lunge':['Step forward into a lunge, both knees ~90°.','Drive off the front foot to bring the back leg through.','Alternate legs, torso upright.'],
  'Bulgarian Split Squat':['Rear foot on a bench, front foot a stride ahead.','Lower straight down until the front thigh is parallel.','Drive up through the front heel.'],
  'Bodyweight Squat':['Feet shoulder-width, toes slightly out, arms forward.','Sit hips back and down to at least parallel.','Stand tall, squeezing the glutes.'],
  'Jump Squat':['Squat down to about parallel.','Explode up into a jump, arms driving.','Land soft, absorb into the next rep.'],
  /* posterior */
  'Romanian Deadlift':['Stand tall with the bar at your thighs, soft knees.','Push hips back, lowering the bar down your legs.','Feel the hamstring stretch, then drive hips forward.'],
  'Hip Thrust':['Upper back on a bench, bar over the hips.','Drive through the heels to lift hips to full extension.','Squeeze the glutes at the top; lower under control.'],
  'Lying Leg Curl':['Face down, pad on the back of your ankles.','Curl your heels toward your glutes.','Lower slowly — no swinging.'],
  'Single-Leg RDL':['Stand on one leg, soft knee, other leg back.','Hinge forward, lowering the weight as the rear leg rises.','Return to standing, squeezing the glute.'],
  'Glute Bridge':['Lie on your back, knees bent, feet flat.','Drive hips up to a straight line from knees to shoulders.','Squeeze the glutes hard; lower slowly.'],
  'Nordic Curl':['Kneel with your ankles anchored, body upright.','Lower forward as slowly as you can, resisting with hamstrings.','Catch with your hands and push back up.'],
  /* calves */
  'Standing Calf Raise':['Balls of the feet on a step, heels hanging.','Rise onto your toes as high as possible.','Lower slowly to a full stretch below the step.'],
  'Single-Leg Calf Raise':['Balance on one foot, ball of the foot on a step.','Rise up onto your toes.','Lower slowly under control; switch legs.'],
  /* core */
  'Plank':['Forearms and toes down, body in a straight line.','Brace the abs and squeeze the glutes.','Hold without letting the hips sag or pike.'],
  'Hanging Leg Raise':['Hang from a bar, shoulders active.','Raise your legs to at least parallel, curling the pelvis.','Lower slowly — no swinging.'],
  'Cable Crunch':['Kneel facing the stack, rope by your head.','Crunch down by rounding the spine, hips still.','Return slowly, resisting the weight.'],
  'Dead Bug':['On your back, arms up, knees over hips.','Lower the opposite arm and leg toward the floor.','Return and switch; keep your lower back flat.'],
  'Russian Twist':['Sit leaning back, feet up, hands together.','Rotate side to side, tapping near each hip.','Move with control — twist from the torso.'],
  'Ab Wheel Rollout':['Kneel gripping the wheel under your shoulders.','Roll forward as far as you control, abs braced.','Pull back with the abs — no lower-back sag.'],
  /* cardio */
  'Rowing Intervals':['Drive with the legs first, then lean back and pull.','Return arms-then-hips-then-knees in order.','Alternate hard intervals with easy recovery.'],
  'Assault Bike Sprints':['Grip the handles, push and pull with the arms.','Drive hard with the legs for each sprint.','Ease off during the rest windows.'],
  'Incline Treadmill Walk':['Set a challenging incline, walk tall.','Avoid holding the rails; let the arms swing.','Keep a steady pace you can sustain.'],
  'Kettlebell Swings':['Hinge and hike the bell back between your legs.','Snap the hips forward to float it to chest height.','Let it fall, absorb with a hinge, repeat.'],
  'Dumbbell Thrusters':['Dumbbells at the shoulders, feet shoulder-width.','Squat down, then drive up and press overhead in one move.','Lower to the shoulders and flow into the next rep.'],
  'Burpees':['Drop to a plank, chest to floor.','Jump the feet in and stand.','Finish with a jump and a clap overhead.'],
  'Jump Rope':['Turn the rope from the wrists, elbows in.','Bounce on the balls of your feet, small hops.','Keep a light, steady rhythm.'],
  'High Knees':['Run in place driving the knees to hip height.','Stay on the balls of your feet, quick cadence.','Pump the arms in time.'],
  'Shuttle Runs':['Sprint to a marker, touch down low.','Turn and sprint back to the start.','Repeat at pace with sharp changes of direction.'],
};

/* Which movement each exercise looks like (drives the animation). */
const PATTERN = {
  'Barbell Bench Press':'pressh','Incline Dumbbell Press':'pressh','Dumbbell Bench Press':'pressh','Push-Up':'pressh','Dumbbell Fly':'pressh','Chest Fly Machine':'pressh','Dips':'pressh','Decline Push-Up':'pressh',
  'Deadlift':'hinge','Barbell Row':'pullh','Pull-Up':'pullv','Lat Pulldown':'pullv','One-Arm Dumbbell Row':'pullh','Inverted Row':'pullh','Seated Cable Row':'pullh','Superman Hold':'hold',
  'Overhead Press':'pressv','Dumbbell Shoulder Press':'pressv','Pike Push-Up':'pressv','Lateral Raise':'raise','Face Pull':'pullh','Handstand Hold':'hold',
  'Barbell Curl':'curl','Dumbbell Curl':'curl','Hammer Curl':'curl','Chin-Up':'pullv','Underhand Inverted Row':'pullh',
  'Close-Grip Bench Press':'pressh','Triceps Pushdown':'ext','Overhead DB Extension':'ext','Bench Dip':'pressh','Diamond Push-Up':'pressh',
  'Back Squat':'squat','Goblet Squat':'squat','Leg Press':'squat','Walking Lunge':'squat','Bulgarian Split Squat':'squat','Bodyweight Squat':'squat','Jump Squat':'squat',
  'Romanian Deadlift':'hinge','Hip Thrust':'hinge','Lying Leg Curl':'hinge','Single-Leg RDL':'hinge','Glute Bridge':'hinge','Nordic Curl':'hinge',
  'Standing Calf Raise':'calf','Single-Leg Calf Raise':'calf',
  'Plank':'hold','Hanging Leg Raise':'core','Cable Crunch':'core','Dead Bug':'core','Russian Twist':'core','Ab Wheel Rollout':'core',
  'Rowing Intervals':'cardio','Assault Bike Sprints':'cardio','Incline Treadmill Walk':'cardio','Kettlebell Swings':'hinge','Dumbbell Thrusters':'squat','Burpees':'cardio','Jump Rope':'cardio','High Knees':'cardio','Shuttle Runs':'cardio',
};
const GROUP_PATTERN = {chest:'pressh',back:'pullh',shoulders:'pressv',biceps:'curl',triceps:'ext',quads:'squat',posterior:'hinge',calves:'calf',core:'core',cardio:'cardio'};

/* Two poses per pattern (side view, facing right). body = shoulder→hip→knee→
   ankle→toe; arms = shoulder→elbow→hand; loads = a barbell/weight line. */
const POSES = {
  squat:{
    a:{head:[52,17],body:[[50,30],[50,56],[50,78],[50,93],[60,93]],arms:[[[50,31],[58,39],[66,47]]]},
    b:{head:[45,26],body:[[44,37],[53,58],[41,73],[50,91],[61,91]],arms:[[[44,38],[56,45],[67,47]]]},
  },
  hinge:{
    a:{head:[52,17],body:[[50,30],[50,56],[50,78],[50,93],[60,93]],arms:[[[50,31],[50,45],[50,59]]],loads:[[[43,59],[57,59]]]},
    b:{head:[70,42],body:[[62,44],[50,55],[49,77],[49,93],[59,93]],arms:[[[62,46],[61,60],[60,72]]],loads:[[[53,72],[67,72]]]},
  },
  pressh:{
    a:{head:[50,17],body:[[50,30],[50,57],[50,79],[50,93],[60,93]],arms:[[[50,32],[41,38],[51,45]]],loads:[[[46,46],[46,44]]]},
    b:{head:[50,17],body:[[50,30],[50,57],[50,79],[50,93],[60,93]],arms:[[[50,32],[63,36],[76,39]]],loads:[[[76,37],[76,41]]]},
  },
  pressv:{
    a:{head:[50,18],body:[[50,31],[50,57],[50,79],[50,93],[60,93]],arms:[[[50,32],[42,40],[51,46]]],loads:[[[44,46],[58,46]]]},
    b:{head:[50,18],body:[[50,31],[50,57],[50,79],[50,93],[60,93]],arms:[[[50,32],[52,18],[52,7]]],loads:[[[44,7],[60,7]]]},
  },
  pullv:{
    a:{head:[50,28],body:[[50,40],[50,63],[50,82],[50,96]],arms:[[[50,40],[50,24],[50,11]]],loads:[[[38,10],[62,10]]]},
    b:{head:[50,21],body:[[50,33],[50,56],[50,75],[50,89]],arms:[[[50,33],[41,20],[50,11]]],loads:[[[38,10],[62,10]]]},
  },
  pullh:{
    a:{head:[68,40],body:[[60,42],[50,54],[49,76],[49,92],[59,92]],arms:[[[60,44],[60,58],[60,71]]],loads:[[[53,71],[67,71]]]},
    b:{head:[68,40],body:[[60,42],[50,54],[49,76],[49,92],[59,92]],arms:[[[60,44],[66,52],[59,61]]],loads:[[[52,61],[66,61]]]},
  },
  curl:{
    a:{head:[52,17],body:[[50,30],[50,57],[50,79],[50,93],[60,93]],arms:[[[50,32],[50,46],[50,60]]],loads:[[[43,60],[57,60]]]},
    b:{head:[52,17],body:[[50,30],[50,57],[50,79],[50,93],[60,93]],arms:[[[50,32],[50,46],[41,36]]],loads:[[[34,34],[48,38]]]},
  },
  ext:{
    a:{head:[50,18],body:[[50,31],[50,57],[50,79],[50,93],[60,93]],arms:[[[50,32],[52,20],[43,25]]],loads:[[[38,24],[48,27]]]},
    b:{head:[50,18],body:[[50,31],[50,57],[50,79],[50,93],[60,93]],arms:[[[50,32],[52,20],[54,7]]],loads:[[[47,6],[61,8]]]},
  },
  raise:{
    a:{head:[52,17],body:[[50,30],[50,57],[50,79],[50,93],[60,93]],arms:[[[50,32],[50,45],[50,58]]],loads:[[[44,58],[56,58]]]},
    b:{head:[52,17],body:[[50,30],[50,57],[50,79],[50,93],[60,93]],arms:[[[50,32],[63,32],[75,32]]],loads:[[[75,29],[75,35]]]},
  },
  calf:{
    a:{head:[52,18],body:[[50,31],[50,56],[50,78],[50,92],[61,92]],arms:[[[50,32],[50,46],[50,60]]]},
    b:{head:[52,13],body:[[50,26],[50,51],[50,73],[50,86],[61,90]],arms:[[[50,27],[50,41],[50,55]]]},
  },
  core:{
    a:{head:[24,72],body:[[32,74],[56,80],[68,66],[70,82]],arms:[[[32,74],[26,82]]]},
    b:{head:[34,60],body:[[40,64],[57,80],[68,66],[70,82]],arms:[[[40,64],[36,74]]]},
  },
  hold:{
    static:true,
    a:{head:[22,58],body:[[30,60],[54,69],[74,79],[84,81]],arms:[[[30,60],[30,80]]]},
  },
  cardio:{
    a:{head:[52,16],body:[[50,28],[50,52],[43,70],[38,86],[46,88]],arms:[[[50,31],[42,38],[37,48]]]},
    b:{head:[52,16],body:[[50,28],[50,52],[57,70],[62,86],[70,88]],arms:[[[50,31],[58,38],[63,48]]]},
  },
};

/* ---- builders (pure; called from the renderer) ---- */
function figSVG(pose, cls){
  const pl = a => a.map(p=>p.join(',')).join(' ');
  let inner = `<circle cx="${pose.head[0]}" cy="${pose.head[1]}" r="7"/>`;
  inner += `<polyline points="${pl(pose.body)}"/>`;
  (pose.arms||[]).forEach(a => { inner += `<polyline points="${pl(a)}"/>`; });
  (pose.loads||[]).forEach(a => { inner += `<line class="ld" x1="${a[0][0]}" y1="${a[0][1]}" x2="${a[1][0]}" y2="${a[1][1]}"/>`; });
  return `<svg class="fig ${cls}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${inner}</svg>`;
}
function movementDemo(l){
  const key = PATTERN[l.name] || GROUP_PATTERN[l.group] || 'cardio';
  const P = POSES[key]; if(!P) return '';
  if(P.static) return `<div class="figwrap hold">${figSVG(P.a,'figS')}</div>`;
  return `<div class="figwrap">${figSVG(P.a,'figA')}${figSVG(P.b,'figB')}</div>`;
}
function howtoBlock(l){
  const steps = HOWTO[l.name] || ['Perform with control through a full range of motion.'];
  const targets = GROUP_TARGET[l.group] || '';
  const stepsHTML = steps.map(s=>`<li>${s}</li>`).join('');
  return `<div class="howto">
    <div class="demo">${movementDemo(l)}</div>
    <div class="howto-txt">
      <div class="howto-h">How to do it<span class="tg">${targets}</span></div>
      <ol class="howto-steps">${stepsHTML}</ol>
    </div>
  </div>`;
}
