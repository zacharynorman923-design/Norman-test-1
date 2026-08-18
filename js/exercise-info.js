/* ===================== EXERCISE INSTRUCTIONS + VISUALS =====================
   HOWTO      : exercise name -> ordered step cues (how to perform it)
   GROUP_TARGET: muscle group -> the muscles it works (shown as "Targets")
   PATTERN    : exercise name -> movement-pattern key (drives the animated demo)
   MOVES      : pattern key  -> two poses of an articulated figure, cross-faded
                through an interpolated mid-frame into a looping motion demo
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
  'Incline Barbell Bench Press':['Set the bench to 30°, grip a little wider than shoulders.','Lower the bar to your upper chest, elbows ~45°.','Press up and slightly back to lockout.'],
  'Decline Barbell Bench Press':['Lie on a declined bench, feet hooked, grip just wider than shoulders.','Lower the bar to your lower chest.','Press straight up — this hits the lower chest hardest.'],
  'Machine Chest Press':['Set the seat so the handles sit at mid-chest.','Press the handles forward until the arms extend.','Return slowly until you feel a stretch across the chest.'],
  'Cable Crossover':['Set the pulleys high, take a handle in each hand, stagger your stance.','Sweep the handles down and together in front of your hips.','Squeeze the chest, then let the arms open wide under control.'],
  'Incline Dumbbell Fly':['Bench at 30°, dumbbells above your chest, slight elbow bend.','Open the arms wide in an arc until you feel a stretch.','Squeeze the chest to bring them back together.'],
  'Wide-Grip Push-Up':['Hands noticeably wider than shoulders, body straight.','Lower your chest between your hands.','Press back up — the wide grip biases the chest.'],
  'Archer Push-Up':['Set up wide, then shift your weight over one hand.','Lower toward that hand, keeping the other arm straight.','Press up and alternate sides — a step toward one-arm push-ups.'],
  'Incline Push-Up':['Hands on a bench or box, body in a straight line.','Lower your chest to the edge, elbows ~45°.','Press back up — the higher the hands, the easier it is.'],
  /* back */
  'Deadlift':['Bar over mid-foot, hinge and grip just outside your knees.','Chest up, flat back, take the slack out of the bar.','Drive the floor away and stand tall; lower with control.'],
  'Barbell Row':['Hinge to ~45°, flat back, bar hanging at arms length.','Pull the bar to your lower ribs, elbows past your torso.','Lower under control — no jerking or standing up.'],
  'Pull-Up':['Hang from the bar, hands just wider than shoulders.','Pull your chest toward the bar, driving elbows down.','Lower all the way to a full hang each rep.'],
  'Lat Pulldown':['Grip wide, thighs under the pads, slight lean back.','Pull the bar to your upper chest, squeezing the lats.','Return slowly until arms are fully extended.'],
  'One-Arm Dumbbell Row':['One hand and knee on a bench, back flat.','Row the dumbbell to your hip, elbow close to the body.','Lower to a full stretch; keep hips square.'],
  'Inverted Row':['Under a fixed bar, body straight, heels on the floor.','Pull your chest to the bar, squeezing shoulder blades.','Lower slowly to arms straight.'],
  'Seated Cable Row':['Sit tall, slight knee bend, grab the handle.','Pull to your belly, driving elbows back, chest proud.','Return under control without rounding your back.'],
  'Superman Hold':['Lie face down, arms extended overhead.','Lift arms, chest and legs off the floor.','Hold, squeezing the lower back and glutes; breathe.'],
  'Pendlay Row':['Bent at the hips, back flat, bar resting on the floor each rep.','Pull explosively to your lower ribs.','Return the bar all the way to the floor and reset.'],
  'T-Bar Row':['Straddle the bar, chest against the pad if there is one.','Row the handles to your abdomen, elbows close.','Lower under control to a full stretch.'],
  'Chest-Supported Row':['Lie chest-down on the incline pad, arms hanging.','Row the weight up, squeezing your shoulder blades together.','Lower slowly — the pad stops you cheating with your hips.'],
  'Straight-Arm Pulldown':['Stand at a high pulley, arms straight, slight forward lean.','Sweep the bar down to your thighs using the lats only.','Return overhead under control; keep the elbows locked soft.'],
  'Trap Bar Deadlift':['Stand inside the trap bar, grip the handles at your sides.','Chest up, push the floor away and stand tall.','Lower under control — easier on the lower back than a straight bar.'],
  'Rack Pull':['Set the bar on pins just below or above the knee.','Grip, brace, and pull to lockout by driving the hips.','Lower to the pins and reset — heavy, short-range back work.'],
  'Renegade Row':['Start in a push-up position gripping two dumbbells.','Row one dumbbell to your hip without twisting the hips.','Replace it and alternate; keep the abs braced throughout.'],
  'Prone Y-Raise':['Lie face down, arms extended overhead in a Y, thumbs up.','Lift the arms as high as you can, squeezing the upper back.','Lower slowly — great for posture and rear delts.'],
  /* shoulders */
  'Overhead Press':['Bar on front delts, grip just outside shoulders, brace hard.','Press straight up, moving your head back then through.','Lock out overhead; lower to the collarbone.'],
  'Dumbbell Shoulder Press':['Seated or standing, dumbbells at shoulder height.','Press up until the arms extend overhead.','Lower under control to ear height.'],
  'Pike Push-Up':['Hands down, hips high in an inverted-V.','Bend the elbows to lower the crown of your head toward the floor.','Press back up — targets the shoulders.'],
  'Lateral Raise':['Stand with dumbbells at your sides, slight elbow bend.','Raise the arms out to the sides to shoulder height.','Lower slowly — lead with the elbows, no swinging.'],
  'Face Pull':['Set a rope at head height, grip thumbs-back.','Pull toward your forehead, flaring elbows wide.','Squeeze the rear delts; return under control.'],
  'Handstand Hold':['Kick up to a handstand against a wall.','Stack hands, shoulders and hips; squeeze everything.','Hold and breathe; come down under control.'],
  'Arnold Press':['Start with dumbbells at your chest, palms facing you.','Rotate the palms out as you press overhead.','Reverse the rotation on the way down.'],
  'Push Press':['Bar on your front delts, brace hard.','Dip a few inches with the legs, then drive the bar overhead.','Lock out, then lower to the shoulders and reset.'],
  'Machine Shoulder Press':['Set the seat so the handles start at shoulder height.','Press overhead until the arms extend.','Lower under control to ear height.'],
  'Cable Lateral Raise':['Stand side-on to a low pulley, handle in the far hand.','Raise your arm out to shoulder height.','Lower slowly — the cable keeps tension all the way down.'],
  'Rear Delt Fly':['Hinge forward, dumbbells hanging under your chest.','Open the arms out to the sides, leading with the elbows.','Squeeze the rear delts, then lower under control.'],
  'Upright Row':['Stand with a bar or dumbbells at your thighs, grip shoulder-width.','Pull up along your body, leading with the elbows to chest height.','Lower slowly; stop if your shoulders pinch.'],
  'Front Raise':['Dumbbells at your thighs, palms facing you.','Raise straight in front to shoulder height.','Lower slowly without swinging.'],
  'Wall Walk':['Start face-down with your feet against a wall.','Walk your feet up and your hands in until you are near-vertical.','Walk back down under control — one up-and-down is a rep.'],
  /* biceps */
  'Barbell Curl':['Stand tall, grip shoulder-width, elbows at your sides.','Curl the bar up without swinging the elbows forward.','Lower slowly to a full stretch.'],
  'Dumbbell Curl':['Dumbbells at your sides, palms forward.','Curl one or both up, keeping elbows pinned.','Lower under control; no body english.'],
  'Hammer Curl':['Hold dumbbells with palms facing each other.','Curl up keeping the neutral grip.','Lower slowly — hits the biceps and forearms.'],
  'Chin-Up':['Hang with palms facing you, shoulder-width.','Pull your chest to the bar, driving elbows down.','Lower to a full hang each rep.'],
  'Underhand Inverted Row':['Under a bar with an underhand grip, body straight.','Pull your chest to the bar, elbows tucked.','Lower slowly — rows with extra biceps.'],
  'Incline Dumbbell Curl':['Sit back on a 45–60° bench, arms hanging straight down.','Curl the dumbbells up without letting the elbows drift forward.','Lower slowly — the stretched start makes this brutal.'],
  'Preacher Curl':['Sit with the backs of your arms flat on the pad.','Curl the bar up, keeping your arms glued to the pad.','Lower until the arms are nearly straight.'],
  'Cable Curl':['Face a low pulley, elbows at your sides.','Curl the bar up without swinging.','Lower under control; the cable keeps constant tension.'],
  'Concentration Curl':['Sit, elbow braced against the inside of your thigh.','Curl the dumbbell up, squeezing hard at the top.','Lower all the way; do all reps, then switch arms.'],
  'EZ-Bar Curl':['Grip the angled bar at the inner bends, elbows at your sides.','Curl up without swinging the elbows forward.','Lower slowly — easier on the wrists than a straight bar.'],
  'Zottman Curl':['Curl up with palms facing you.','At the top, rotate the palms to face down.','Lower slowly in that position, then rotate back at the bottom.'],
  'Bodyweight Bicep Curl':['Grip a waist-height bar underhand and walk your feet forward.','Keeping the elbows high and fixed, curl your body up to the bar.','Lower under control — walk the feet further forward to make it harder.'],
  'Towel Curl':['Loop a towel under one foot and grip both ends, palms up.','Curl your hands up while pushing down with the foot to resist.','Fight the weight back down slowly — you set the resistance.'],
  /* triceps */
  'Close-Grip Bench Press':['Lie flat, grip about shoulder-width.','Lower the bar to the lower chest, elbows tucked.','Press up, driving through the triceps to lockout.'],
  'Triceps Pushdown':['Face the cable, elbows pinned to your sides.','Push the bar down until the arms lock out.','Return only to elbow height — keep tension.'],
  'Overhead DB Extension':['Hold one dumbbell overhead with both hands.','Lower it behind your head, elbows pointing up.','Extend back to overhead, squeezing the triceps.'],
  'Bench Dip':['Hands on a bench behind you, legs out front.','Lower your hips until elbows reach ~90°.','Press back up through the triceps.'],
  'Diamond Push-Up':['Hands together forming a diamond under your chest.','Lower with elbows tucked to your sides.','Press up — extra triceps emphasis.'],
  'Skull Crusher':['Lie flat, bar or dumbbells held over your chest, arms straight.','Bend the elbows to lower the weight toward your forehead.','Extend back to lockout, keeping the upper arms still.'],
  'Cable Overhead Extension':['Face away from a high pulley, rope held behind your head.','Extend the arms overhead until they lock out.','Lower slowly, keeping the elbows pointing forward.'],
  'Dumbbell Kickback':['Hinge forward, upper arm pinned against your side.','Extend the elbow until the arm is straight behind you.','Squeeze the triceps, then lower under control.'],
  'Single-Arm Overhead Extension':['Hold one dumbbell overhead, elbow pointing forward.','Lower it behind your head under control.','Extend back to overhead; do all reps, then switch.'],
  'Bodyweight Skull Crusher':['Set a bar at hip height and lean into it, arms straight.','Bend at the elbows to lower your head toward the bar.','Extend the arms to press back up — harder the lower the bar.'],
  /* quads */
  'Back Squat':['Bar on your upper back, feet shoulder-width, toes slightly out.','Break at hips and knees, sit down between your legs.','Descend to at least parallel, then drive up.'],
  'Goblet Squat':['Hold a dumbbell at your chest, elbows down.','Squat down between your knees, chest tall.','Stand back up, driving through the heels.'],
  'Leg Press':['Feet mid-platform, shoulder-width, back flat on the pad.','Lower until knees reach ~90°.','Press away without locking the knees hard.'],
  'Walking Lunge':['Step forward into a lunge, both knees ~90°.','Drive off the front foot to bring the back leg through.','Alternate legs, torso upright.'],
  'Bulgarian Split Squat':['Rear foot on a bench, front foot a stride ahead.','Lower straight down until the front thigh is parallel.','Drive up through the front heel.'],
  'Bodyweight Squat':['Feet shoulder-width, toes slightly out, arms forward.','Sit hips back and down to at least parallel.','Stand tall, squeezing the glutes.'],
  'Jump Squat':['Squat down to about parallel.','Explode up into a jump, arms driving.','Land soft, absorb into the next rep.'],
  'Front Squat':['Bar resting on your front delts, elbows high.','Squat down with a tall torso, knees tracking your toes.','Drive up, keeping the elbows from dropping.'],
  'Pause Squat':['Squat down as normal to at least parallel.','Hold still at the bottom for 2–3 seconds.','Drive up from a dead stop — no bouncing.'],
  'Hack Squat':['Shoulders under the pads, feet mid-platform.','Lower until your knees reach about 90°.','Press back up without locking the knees hard.'],
  'Leg Extension':['Sit with the pad on the front of your ankles.','Extend the knees until the legs are straight.','Squeeze the quads, then lower slowly.'],
  'Step-Up':['Stand facing a box or bench about knee height.','Step up, driving through the top foot — don\u2019t push off the back leg.','Lower under control and alternate.'],
  'Reverse Lunge':['Stand tall, then step backwards into a lunge.','Lower until both knees reach about 90°.','Drive through the front heel to stand; alternate legs.'],
  'Sissy Squat':['Stand tall, rise onto the balls of your feet.','Lean back and bend the knees, keeping hips and shoulders in line.','Come back up using the quads — go only as far as you control.'],
  'Wall Sit':['Slide down a wall until your thighs are parallel to the floor.','Knees over ankles, back flat against the wall.','Hold and breathe; the quads should be burning.'],
  /* posterior */
  'Romanian Deadlift':['Stand tall with the bar at your thighs, soft knees.','Push hips back, lowering the bar down your legs.','Feel the hamstring stretch, then drive hips forward.'],
  'Hip Thrust':['Upper back on a bench, bar over the hips.','Drive through the heels to lift hips to full extension.','Squeeze the glutes at the top; lower under control.'],
  'Lying Leg Curl':['Face down, pad on the back of your ankles.','Curl your heels toward your glutes.','Lower slowly — no swinging.'],
  'Single-Leg RDL':['Stand on one leg, soft knee, other leg back.','Hinge forward, lowering the weight as the rear leg rises.','Return to standing, squeezing the glute.'],
  'Glute Bridge':['Lie on your back, knees bent, feet flat.','Drive hips up to a straight line from knees to shoulders.','Squeeze the glutes hard; lower slowly.'],
  'Nordic Curl':['Kneel with your ankles anchored, body upright.','Lower forward as slowly as you can, resisting with hamstrings.','Catch with your hands and push back up.'],
  'Sumo Deadlift':['Wide stance, toes out, hands gripping inside your knees.','Chest up, push the floor apart and stand tall.','Lower under control — more hips and quads than a conventional pull.'],
  'Good Morning':['Bar on your upper back, soft knees.','Push the hips back, hinging until your torso is near parallel.','Drive the hips forward to stand; go lighter than you think.'],
  'Seated Leg Curl':['Sit with the pad across your lower shins.','Curl your heels down and under the seat.','Return slowly — a great hamstring stretch under load.'],
  'Cable Pull-Through':['Face away from a low pulley, rope between your legs.','Hinge forward, letting the rope travel back.','Snap the hips forward and squeeze the glutes.'],
  'Hyperextension':['Hips on the pad, feet anchored, body in a straight line.','Lower your torso by hinging at the hips.','Rise until your body is straight — don\u2019t arch past it.'],
  'Single-Leg Hip Thrust':['Upper back on a bench, one foot planted, other leg lifted.','Drive through the planted heel to lift your hips level.','Squeeze the glute at the top; do all reps, then switch.'],
  'Frog Pump':['Lie on your back, soles of your feet together, knees out wide.','Drive the hips up, squeezing the glutes hard.','Lower slowly — high reps work best here.'],
  /* calves */
  'Standing Calf Raise':['Balls of the feet on a step, heels hanging.','Rise onto your toes as high as possible.','Lower slowly to a full stretch below the step.'],
  'Single-Leg Calf Raise':['Balance on one foot, ball of the foot on a step.','Rise up onto your toes.','Lower slowly under control; switch legs.'],
  'Seated Calf Raise':['Sit with the pad across your thighs, balls of the feet on the block.','Rise up onto your toes as high as you can.','Lower slowly to a deep stretch — this one hits the soleus.'],
  'Leg Press Calf Raise':['Sit in the leg press with only the balls of your feet on the platform.','Push the platform away by extending the ankles.','Lower slowly and let the heels drop below the platform.'],
  'Donkey Calf Raise':['Hinge forward and rest your forearms on a support.','Rise onto your toes as high as possible.','Lower slowly to a full stretch.'],
  'Farmer Walk on Toes':['Hold a heavy weight in each hand, stand tall.','Rise onto the balls of your feet and stay there.','Walk in small steps for the set time without dropping the heels.'],
  'Calf Jump':['Stand tall, knees almost locked.','Bounce off the balls of your feet, using ankles not knees.','Land soft and repeat quickly.'],
  'Tibialis Raise':['Sit or stand with your heels down and toes free.','Pull your toes up toward your shins as far as they go.','Lower slowly — this balances all the calf work.'],
  /* core */
  'Plank':['Forearms and toes down, body in a straight line.','Brace the abs and squeeze the glutes.','Hold without letting the hips sag or pike.'],
  'Hanging Leg Raise':['Hang from a bar, shoulders active.','Raise your legs to at least parallel, curling the pelvis.','Lower slowly — no swinging.'],
  'Cable Crunch':['Kneel facing the stack, rope by your head.','Crunch down by rounding the spine, hips still.','Return slowly, resisting the weight.'],
  'Dead Bug':['On your back, arms up, knees over hips.','Lower the opposite arm and leg toward the floor.','Return and switch; keep your lower back flat.'],
  'Russian Twist':['Sit leaning back, feet up, hands together.','Rotate side to side, tapping near each hip.','Move with control — twist from the torso.'],
  'Ab Wheel Rollout':['Kneel gripping the wheel under your shoulders.','Roll forward as far as you control, abs braced.','Pull back with the abs — no lower-back sag.'],
  'Hanging Knee Raise':['Hang from a bar, shoulders active.','Draw your knees up toward your chest, curling the pelvis.','Lower slowly without swinging.'],
  'Toes-to-Bar':['Hang from a bar with an active shoulder position.','Curl the pelvis and bring your toes up to touch the bar.','Lower under control; keep the swing to a minimum.'],
  'Bicycle Crunch':['On your back, hands by your ears, legs off the floor.','Bring one elbow toward the opposite knee as that leg draws in.','Alternate smoothly — quality beats speed.'],
  'Mountain Climber':['Start in a push-up position, body straight.','Drive one knee toward your chest, then switch quickly.','Keep the hips low and the abs braced.'],
  'V-Up':['Lie flat, arms overhead, legs straight.','Lift arms and legs at once to meet over your middle.','Lower under control without letting the feet touch down.'],
  'Side Plank':['On your side, forearm under your shoulder, feet stacked.','Lift the hips so your body forms a straight line.','Hold and breathe; do both sides.'],
  'Hollow Body Hold':['On your back, press the lower back flat into the floor.','Lift the shoulders and legs, arms overhead.','Hold that dish shape without the back arching up.'],
  'Pallof Press':['Stand side-on to a cable at chest height, handle at your sternum.','Press the handle straight out and resist the twist.','Return to your chest; do all reps, then switch sides.'],
  'Weighted Sit-Up':['Lie back with knees bent, holding a weight at your chest.','Sit all the way up, curling the spine.','Lower slowly under control.'],
  'Farmer Carry':['Pick up a heavy weight in each hand and stand tall.','Brace the abs, shoulders back, and walk with short quick steps.','Keep walking for the set time without letting the shoulders slump.'],
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
  'Ski Erg Intervals':['Stand tall, grip the handles overhead.','Drive down with the arms and crunch the torso to pull through.','Return under control and repeat at a hard, steady pace.'],
  'Stair Climber':['Set a challenging pace and stand tall.','Take full steps rather than shuffling; avoid leaning on the rails.','Keep the pace steady for the set duration.'],
  'Battle Ropes':['Hold an end in each hand, athletic stance, hips down.','Drive alternating waves down the ropes from the shoulders.','Keep the waves fast and even for the full interval.'],
  'Kettlebell Snatch':['Hike the bell back between your legs.','Snap the hips and pull it straight overhead in one motion.','Lock out overhead, then guide it back down and repeat.'],
  'Dumbbell Clean and Press':['Start with the dumbbells hanging at your thighs.','Pull them to your shoulders, dipping under to catch.','Press overhead, then return to the start and repeat.'],
  'Sprint Intervals':['Run at near maximum effort for the work interval.','Keep the arms driving and the strides powerful.','Walk or jog the recovery, then repeat.'],
  'Bear Crawl':['On hands and toes, knees hovering just off the floor.','Crawl forward moving the opposite hand and foot together.','Keep the hips low and the back flat.'],
  'Jumping Jacks':['Start with feet together, arms at your sides.','Jump the feet wide as the arms sweep overhead.','Jump back in and keep a steady rhythm.'],
};

/* Which movement each exercise looks like (drives the animation). */
const PATTERN = {
  'Barbell Bench Press':'pressh','Incline Dumbbell Press':'pressh','Dumbbell Bench Press':'pressh','Push-Up':'pushup','Dumbbell Fly':'pressh','Chest Fly Machine':'pressh','Dips':'dip','Decline Push-Up':'pushup',
  'Deadlift':'hinge','Barbell Row':'pullh','Pull-Up':'pullv','Lat Pulldown':'pullv','One-Arm Dumbbell Row':'pullh','Inverted Row':'pullh','Seated Cable Row':'pullh','Superman Hold':'hold',
  'Overhead Press':'pressv','Dumbbell Shoulder Press':'pressv','Pike Push-Up':'pressv','Lateral Raise':'raise','Face Pull':'pullh','Handstand Hold':'hold',
  'Barbell Curl':'curl','Dumbbell Curl':'curl','Hammer Curl':'curl','Chin-Up':'pullv','Underhand Inverted Row':'pullh',
  'Close-Grip Bench Press':'pressh','Triceps Pushdown':'ext','Overhead DB Extension':'ext','Bench Dip':'dip','Diamond Push-Up':'pushup',
  'Back Squat':'squat','Goblet Squat':'squat','Leg Press':'squat','Walking Lunge':'lunge','Bulgarian Split Squat':'lunge','Bodyweight Squat':'squat','Jump Squat':'squat',
  'Romanian Deadlift':'hinge','Hip Thrust':'bridge','Lying Leg Curl':'hinge','Single-Leg RDL':'hinge','Glute Bridge':'bridge','Nordic Curl':'hinge',
  'Standing Calf Raise':'calf','Single-Leg Calf Raise':'calf',
  'Plank':'hold','Hanging Leg Raise':'core','Cable Crunch':'core','Dead Bug':'core','Russian Twist':'core','Ab Wheel Rollout':'core',
  'Rowing Intervals':'cardio','Assault Bike Sprints':'cardio','Incline Treadmill Walk':'cardio','Kettlebell Swings':'hinge','Dumbbell Thrusters':'squat','Burpees':'cardio','Jump Rope':'cardio','High Knees':'cardio','Shuttle Runs':'cardio',

  'Incline Barbell Bench Press':'pressh',
  'Decline Barbell Bench Press':'pressh',
  'Machine Chest Press':'pressh',
  'Cable Crossover':'pressh',
  'Incline Dumbbell Fly':'pressh',
  'Wide-Grip Push-Up':'pushup',
  'Archer Push-Up':'pushup',
  'Incline Push-Up':'pushup',
  'Pendlay Row':'pullh',
  'T-Bar Row':'pullh',
  'Chest-Supported Row':'pullh',
  'Straight-Arm Pulldown':'pullv',
  'Trap Bar Deadlift':'hinge',
  'Rack Pull':'hinge',
  'Renegade Row':'pullh',
  'Prone Y-Raise':'core',
  'Arnold Press':'pressv',
  'Push Press':'pressv',
  'Machine Shoulder Press':'pressv',
  'Cable Lateral Raise':'raise',
  'Rear Delt Fly':'raise',
  'Upright Row':'raise',
  'Front Raise':'raise',
  'Wall Walk':'pressv',
  'Incline Dumbbell Curl':'curl',
  'Preacher Curl':'curl',
  'Cable Curl':'curl',
  'Concentration Curl':'curl',
  'EZ-Bar Curl':'curl',
  'Zottman Curl':'curl',
  'Bodyweight Bicep Curl':'curl',
  'Towel Curl':'curl',
  'Skull Crusher':'ext',
  'Cable Overhead Extension':'ext',
  'Dumbbell Kickback':'ext',
  'Single-Arm Overhead Extension':'ext',
  'Bodyweight Skull Crusher':'ext',
  'Front Squat':'squat',
  'Pause Squat':'squat',
  'Hack Squat':'squat',
  'Leg Extension':'squat',
  'Step-Up':'lunge',
  'Reverse Lunge':'lunge',
  'Sissy Squat':'squat',
  'Wall Sit':'hold',
  'Sumo Deadlift':'hinge',
  'Good Morning':'hinge',
  'Seated Leg Curl':'hinge',
  'Cable Pull-Through':'hinge',
  'Hyperextension':'hinge',
  'Single-Leg Hip Thrust':'bridge',
  'Frog Pump':'bridge',
  'Seated Calf Raise':'calf',
  'Leg Press Calf Raise':'calf',
  'Donkey Calf Raise':'calf',
  'Farmer Walk on Toes':'carry',
  'Calf Jump':'calf',
  'Tibialis Raise':'calf',
  'Hanging Knee Raise':'core',
  'Toes-to-Bar':'core',
  'Bicycle Crunch':'core',
  'Mountain Climber':'core',
  'V-Up':'core',
  'Side Plank':'hold',
  'Hollow Body Hold':'hold',
  'Pallof Press':'core',
  'Weighted Sit-Up':'core',
  'Farmer Carry':'carry',
  'Ski Erg Intervals':'cardio',
  'Stair Climber':'cardio',
  'Battle Ropes':'cardio',
  'Kettlebell Snatch':'cardio',
  'Dumbbell Clean and Press':'cardio',
  'Sprint Intervals':'cardio',
  'Bear Crawl':'cardio',
  'Jumping Jacks':'cardio',
};
const GROUP_PATTERN = {chest:'pressh',back:'pullh',shoulders:'pressv',biceps:'curl',triceps:'ext',quads:'squat',posterior:'hinge',calves:'calf',core:'core',cardio:'cardio'};

/* ===================== MOVEMENT DEMOS =====================
   The figure is built from one skeleton with fixed bone lengths, so it keeps
   human proportions in every frame. A pose says where the hips, hands and feet
   are and how the torso leans; elbows and knees are solved from that (two-bone
   IK), which is what makes the joints bend the way a body does and keeps the
   hands on the bar. Frames cross-fade a → mid → b → mid → a, with the mid frame
   interpolated, so the motion reads as movement rather than a jump cut.
   Coordinates run 0–100 with y downward; the floor is at 97.               */
const BONE = {spine:26, neck:6, head:8, uarm:14, farm:13, hand:3, thigh:20, shin:19, foot:7.5};
const WID  = {sh:8.6, waist:6.2, uarm:[3.9,3.1], farm:[3.1,2.4], thigh:[5.4,4.1], shin:[4.1,2.7]};
const FLOOR = 97;

function at(p,deg,len){ const r=deg*Math.PI/180; return [p[0]+Math.cos(r)*len, p[1]+Math.sin(r)*len]; }
function n1(v){ return Math.round(v*10)/10; }
/* Two-bone IK. Returns the mid joint and the reachable end point, so an
   over-extended pose keeps the hand attached to the arm. */
function ik(root, target, l1, l2, bend){
  let dx=target[0]-root[0], dy=target[1]-root[1];
  let d=Math.hypot(dx,dy) || 0.001;
  const max=l1+l2-0.02, min=Math.abs(l1-l2)+0.02;
  if(d>max){ const k=max/d; dx*=k; dy*=k; d=max; }
  if(d<min){ const k=min/d; dx*=k; dy*=k; d=min; }
  const end=[root[0]+dx, root[1]+dy];
  const a=(d*d + l1*l1 - l2*l2)/(2*d);
  const h=Math.sqrt(Math.max(0, l1*l1 - a*a));
  const ux=dx/d, uy=dy/d;
  return { j:[root[0]+ux*a - uy*h*bend, root[1]+uy*a + ux*h*bend], end };
}
/* A limb segment: a quad that tapers from wa to wb, capped with round joints. */
function limb(a,b,wa,wb,cls){
  const dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1;
  const nx=-dy/L, ny=dx/L;
  const p=(pt,w,s)=>`${n1(pt[0]+nx*w*s)},${n1(pt[1]+ny*w*s)}`;
  return `<path class="${cls}" d="M${p(a,wa,1)} L${p(b,wb,1)} L${p(b,wb,-1)} L${p(a,wa,-1)} Z"/>`
       + `<circle class="${cls}" cx="${n1(a[0])}" cy="${n1(a[1])}" r="${wa}"/>`
       + `<circle class="${cls}" cx="${n1(b[0])}" cy="${n1(b[1])}" r="${wb}"/>`;
}
/* Solve one frame into joint positions. */
function build(f){
  const hip=f.hip, torso=f.torso;
  const sh=at(hip,torso,BONE.spine);
  const hAng=(f.head!=null?f.head:torso);
  const nk=at(sh,hAng,BONE.neck);
  const hd=at(nk,hAng,BONE.head*0.95);
  const o2=at([0,0], torso-90, 2.3);                      // far side sits behind
  const off=f.flat ? [0,0] : o2;
  const hands=f.hands || [f.hand,f.hand];
  const feet =f.feet  || [f.foot,f.foot];
  const eb=f.elbows || [f.elbow!=null?f.elbow:1, f.elbow!=null?f.elbow:1];
  const kn=f.knees  || [f.knee!=null?f.knee:1, f.knee!=null?f.knee:1];
  const arms=hands.map((h,i)=>{
    const o = i===0 ? off : [0,0];
    const root=[sh[0]+o[0], sh[1]+o[1]], tgt=[h[0]+o[0], h[1]+o[1]];
    const r=ik(root,tgt,BONE.uarm,BONE.farm,eb[i]);
    return {sh:root, el:r.j, wr:r.end};
  });
  const legs=feet.map((ft,i)=>{
    const o = i===0 ? off : [0,0];
    const root=[hip[0]+o[0], hip[1]+o[1]], tgt=[ft[0]+o[0], ft[1]+o[1]];
    const r=ik(root,tgt,BONE.thigh,BONE.shin,kn[i]);
    const tw=(f.toes && f.toes[i]!=null) ? f.toes[i] : (f.toe!=null?f.toe:0);
    return {hip:root, kn:r.j, an:r.end, toe:at(r.end, tw, BONE.foot)};
  });
  return {hip,sh,nk,hd,hAng,torso,arms,legs};
}
/* Equipment held in the hands, drawn from the solved skeleton. */
function grip(kind, s){
  if(!kind || kind==='none') return '';
  const hands = s.arms.map(a=>a.wr);
  if(kind==='plate'){                                     // a barbell seen end-on
    const h=hands[1];
    return `<circle class="ld" cx="${n1(h[0])}" cy="${n1(h[1])}" r="8.5"/>`
         + `<circle class="ldh" cx="${n1(h[0])}" cy="${n1(h[1])}" r="3"/>`;
  }
  if(kind==='plateshoulder'){                             // bar racked on the back
    const p=at(s.sh, s.torso+90, 5.5);
    return `<circle class="ld" cx="${n1(p[0])}" cy="${n1(p[1])}" r="8.5"/>`
         + `<circle class="ldh" cx="${n1(p[0])}" cy="${n1(p[1])}" r="3"/>`;
  }
  if(kind==='db'){                                        // a dumbbell in each hand
    return hands.map((h,i)=>`<g class="${i?'ld':'ld far'}">
      <rect x="${n1(h[0]-3.6)}" y="${n1(h[1]-5.6)}" width="7.2" height="11.2" rx="2.6"/></g>`).join('');
  }
  if(kind==='bar'){                                       // a bar across both hands
    const a=hands[0], b=hands[1];
    return `<line class="ld bar" x1="${n1(a[0]-7)}" y1="${n1(a[1])}" x2="${n1(b[0]+7)}" y2="${n1(b[1])}"/>`
         + `<rect class="ld" x="${n1(a[0]-9)}" y="${n1(a[1]-6)}" width="4" height="12" rx="1.6"/>`
         + `<rect class="ld" x="${n1(b[0]+5)}" y="${n1(b[1]-6)}" width="4" height="12" rx="1.6"/>`;
  }
  if(kind==='kb'){                                        // kettlebell
    const h=hands[1];
    return `<path class="ld" d="M${n1(h[0]-3.5)},${n1(h[1])} a3.5,3.5 0 0 1 7,0"/>`
         + `<circle class="ld" cx="${n1(h[0])}" cy="${n1(h[1]+7)}" r="6"/>`;
  }
  return '';
}
function figure(f, spec, cls){
  const s=build(f);
  const far=(x)=>x, N='seg', F='seg far';
  let g='';
  g += spec.back || '';
  if(spec.gripBehind) g += grip(spec.grip, s);
  // far side first, then the trunk, then the near side — reads as depth
  g += limb(s.legs[0].hip, s.legs[0].kn, WID.thigh[0], WID.thigh[1], F)
     + limb(s.legs[0].kn, s.legs[0].an, WID.shin[0], WID.shin[1], F)
     + limb(s.legs[0].an, s.legs[0].toe, 3.1, 2.2, F);
  g += limb(s.arms[0].sh, s.arms[0].el, WID.uarm[0], WID.uarm[1], F)
     + limb(s.arms[0].el, s.arms[0].wr, WID.farm[0], WID.farm[1], F);
  g += limb(s.hip, s.sh, WID.waist, WID.sh, N);            // trunk
  g += limb(s.sh, s.nk, 4.2, 3.4, N);                      // neck
  g += `<ellipse class="seg" cx="${n1(s.hd[0])}" cy="${n1(s.hd[1])}" rx="6.1" ry="6.9"
         transform="rotate(${n1(s.hAng+90)} ${n1(s.hd[0])} ${n1(s.hd[1])})"/>`;
  g += limb(s.legs[1].hip, s.legs[1].kn, WID.thigh[0], WID.thigh[1], N)
     + limb(s.legs[1].kn, s.legs[1].an, WID.shin[0], WID.shin[1], N)
     + limb(s.legs[1].an, s.legs[1].toe, 3.2, 2.3, N);
  g += limb(s.arms[1].sh, s.arms[1].el, WID.uarm[0], WID.uarm[1], N)
     + limb(s.arms[1].el, s.arms[1].wr, WID.farm[0], WID.farm[1], N);
  if(!spec.gripBehind) g += grip(spec.grip, s);
  g += spec.front || '';
  return `<svg class="fig ${cls}" viewBox="${spec.box||'0 0 100 100'}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${g}</svg>`;
}
/* Interpolated mid-frame, so two authored poses give three drawn ones. */
function lerp(a,b,t){ return a+(b-a)*t; }
function lerpPt(a,b,t){ return [lerp(a[0],b[0],t), lerp(a[1],b[1],t)]; }
function lerpFrame(A,B,t){
  const out={};
  for(const k of ['torso','head','toe']) if(A[k]!=null && B[k]!=null) out[k]=lerp(A[k],B[k],t);
  for(const k of ['elbow','knee','flat']) if(A[k]!=null) out[k]=A[k];
  for(const k of ['elbows','knees','toes']) if(A[k]) out[k]=A[k];
  out.hip=lerpPt(A.hip,B.hip,t);
  const pair=(k,s)=>{
    const a=A[k]||[A[s],A[s]], b=B[k]||[B[s],B[s]];
    return [lerpPt(a[0],b[0],t), lerpPt(a[1],b[1],t)];
  };
  out.hands=pair('hands','hand');
  out.feet =pair('feet','foot');
  return out;
}

const FLOORSVG = `<line class="gr" x1="3" y1="97" x2="97" y2="97"/>`;
const BENCH = `<rect class="eq" x="26" y="64" width="54" height="6" rx="2.4"/>
  <rect class="eq" x="31" y="70" width="4" height="27" rx="1.4"/>
  <rect class="eq" x="72" y="70" width="4" height="27" rx="1.4"/>` + FLOORSVG;
const BARFIX = `<line class="eq bar" x1="18" y1="9" x2="82" y2="9"/>
  <rect class="eq" x="16" y="4" width="4" height="10" rx="1.4"/>
  <rect class="eq" x="80" y="4" width="4" height="10" rx="1.4"/>`;
const DIPBAR_B = `<line class="eq bar dim" x1="52" y1="50" x2="88" y2="50"/>
  <rect class="eq dim" x="84" y="50" width="4" height="47" rx="1.4"/>` + FLOORSVG;
const DIPBAR_F = `<line class="eq bar" x1="54" y1="59" x2="92" y2="59"/>
  <rect class="eq" x="88" y="59" width="4" height="38" rx="1.4"/>`;
const STEP = `<rect class="eq" x="28" y="88" width="62" height="9" rx="2.2"/>` + FLOORSVG;

/* Each pattern: two authored poses plus the props behind and in front. */
const MOVES = {
  squat:{ grip:'plate', gripBehind:true, back:FLOORSVG,
    a:{hip:[50,58], torso:-86, feet:[[45,97],[55,97]], hand:[42,37], elbow:1},
    b:{hip:[48,76], torso:-66, feet:[[45,97],[55,97]], hand:[49,56], elbow:1} },

  lunge:{ grip:'db', back:FLOORSVG,
    a:{hip:[50,58], torso:-88, feet:[[45,97],[55,97]], hands:[[46,58],[56,58]]},
    b:{hip:[50,74], torso:-84, feet:[[32,95],[68,97]], toes:[-45,0], hands:[[46,74],[58,74]]} },

  hinge:{ grip:'plate', back:FLOORSVG,
    a:{hip:[50,58], torso:-86, feet:[[46,97],[54,97]], hand:[52,60], elbow:1},
    b:{hip:[54,64], torso:-38, feet:[[46,97],[54,97]], hand:[60,80], elbow:1} },

  bridge:{ grip:'none', back:FLOORSVG, box:'18 60 72 40',
    a:{hip:[54,90], torso:172, foot:[78,97], hand:[30,95], elbow:-1, head:186, knee:-1, toe:-25},
    b:{hip:[54,71], torso:127, foot:[78,97], hand:[34,90], elbow:-1, head:144, knee:-1, toe:-25} },

  pressh:{ grip:'plate', back:BENCH, box:'8 24 86 76',
    a:{hip:[36,62], torso:4, feet:[[18,93],[22,95]], hand:[62,56], elbow:-1, toe:35, head:-8},
    b:{hip:[36,62], torso:4, feet:[[18,93],[22,95]], hand:[62,37], elbow:-1, toe:35, head:-8} },

  pushup:{ grip:'none', back:FLOORSVG, box:'8 56 86 45',
    a:{hip:[46,78], torso:203, foot:[82,93], hand:[20,95], elbow:1, toe:-42, head:210},
    b:{hip:[46,88], torso:190, foot:[82,93], hand:[20,95], elbow:1, toe:-42, head:198} },

  dip:{ grip:'none', back:DIPBAR_B, front:DIPBAR_F,
    a:{hip:[48,58], torso:-84, hand:[58,59], elbow:1, feet:[[40,88],[44,90]], toe:-25},
    b:{hip:[48,72], torso:-78, hand:[58,59], elbow:1, feet:[[40,96],[44,97]], toe:-25} },

  pressv:{ grip:'bar', back:FLOORSVG,
    a:{hip:[50,58], torso:-90, feet:[[44,97],[56,97]], hands:[[38,36],[62,36]], elbows:[1,-1], flat:true},
    b:{hip:[50,58], torso:-90, feet:[[44,97],[56,97]], hands:[[40,8],[60,8]], elbows:[1,-1], flat:true} },

  pullv:{ grip:'none', back:BARFIX,
    a:{hip:[50,60], torso:-90, feet:[[47,92],[53,92]], hands:[[40,9],[60,9]], elbows:[1,-1], flat:true, toe:-30},
    b:{hip:[50,44], torso:-90, feet:[[47,78],[53,78]], hands:[[40,9],[60,9]], elbows:[1,-1], flat:true, toe:-30} },

  pullh:{ grip:'plate', back:FLOORSVG,
    a:{hip:[56,64], torso:-32, feet:[[48,97],[56,97]], hand:[44,82], elbow:1, head:-20},
    b:{hip:[56,64], torso:-32, feet:[[48,97],[56,97]], hand:[42,66], elbow:1, head:-20} },

  curl:{ grip:'plate', back:FLOORSVG,
    a:{hip:[50,58], torso:-88, feet:[[46,97],[54,97]], hand:[52,58], elbow:1},
    b:{hip:[50,58], torso:-88, feet:[[46,97],[54,97]], hand:[58,40], elbow:1} },

  ext:{ grip:'bar', back:FLOORSVG,
    a:{hip:[50,58], torso:-88, feet:[[44,97],[56,97]], hands:[[42,48],[58,48]], elbows:[1,-1], flat:true},
    b:{hip:[50,58], torso:-88, feet:[[44,97],[56,97]], hands:[[42,62],[58,62]], elbows:[1,-1], flat:true} },

  raise:{ grip:'db', back:FLOORSVG,
    a:{hip:[50,58], torso:-90, feet:[[42,97],[58,97]], hands:[[38,58],[62,58]], elbows:[1,-1], flat:true},
    b:{hip:[50,58], torso:-90, feet:[[42,97],[58,97]], hands:[[22,31],[78,31]], elbows:[1,-1], flat:true} },

  calf:{ grip:'none', back:STEP,
    a:{hip:[50,50], torso:-90, feet:[[50,88],[56,88]], hand:[52,50], toe:0},
    b:{hip:[50,43], torso:-90, feet:[[50,81],[56,81]], hand:[52,43], toe:48} },

  core:{ grip:'none', back:FLOORSVG, box:'18 62 72 38',
    a:{hip:[56,92], torso:178, foot:[80,93], hand:[28,86], elbow:-1, head:190, knee:-1, toe:-35},
    b:{hip:[56,92], torso:200, foot:[74,80], hand:[30,76], elbow:-1, head:212, knee:-1, toe:-35} },

  hold:{ static:true, grip:'none', back:FLOORSVG, box:'8 56 86 45',
    a:{hip:[46,78], torso:203, foot:[82,93], hand:[20,95], elbow:1, toe:-42, head:210} },

  carry:{ grip:'db', back:FLOORSVG,
    a:{hip:[50,58], torso:-88, feet:[[40,97],[60,95]], hands:[[46,58],[57,58]], toes:[0,-14]},
    b:{hip:[50,58], torso:-88, feet:[[60,97],[40,95]], hands:[[46,58],[57,58]], toes:[-14,0]} },

  cardio:{ grip:'none', back:FLOORSVG,
    a:{hip:[50,58], torso:-82, feet:[[38,92],[64,84]], hands:[[62,50],[38,52]], elbows:[-1,1], knees:[1,1], toe:-15},
    b:{hip:[50,58], torso:-82, feet:[[64,84],[38,92]], hands:[[38,52],[62,50]], elbows:[1,-1], knees:[1,1], toe:-15} },
};

/* Patterns logged in seconds rather than reps (isometric holds and carries). */
const TIME_PATTERNS = ['hold','carry'];
function isTimedExercise(name){ return TIME_PATTERNS.indexOf(PATTERN[name])!==-1; }

/* ---- builders (pure; called from the renderer) ---- */
function movementDemo(l){
  const key = PATTERN[l.name] || GROUP_PATTERN[l.group] || 'cardio';
  const M = MOVES[key]; if(!M) return '';
  if(M.static) return `<div class="figwrap hold">${figure(M.a,M,'figS')}</div>`;
  const mid = M.m || lerpFrame(M.a, M.b, 0.5);
  return `<div class="figwrap">${figure(M.a,M,'figA')}${figure(mid,M,'figM')}${figure(M.b,M,'figB')}</div>`;
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
