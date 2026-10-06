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
  'Zone 2 Bike':['Set a resistance you could hold for the full 40 minutes.','Ride where you can still speak a full sentence — that is zone 2.','Keep the cadence around 80–90 rpm, steady rather than surging.'],
  'Steady Row':['Drive with the legs, then swing the back, then pull the arms.','Return in reverse — arms, body, then legs.','Hold a split you could keep for half an hour.'],
  'Steady Run':['Run at a conversational pace, not a hard one.','Land under your hips with a quick, light cadence.','Keep the effort even and finish feeling you could go further.'],
  'Ruck Walk':['Load a pack to 10–20% of bodyweight, straps snug and high on the back.','Walk tall — chest up, ribs down, steady stride.','Rolling ground beats flat; keep the pace brisk but conversational.'],
  'Weighted Vest Walk':['Start with a vest around 10% of bodyweight.','Walk tall and brisk, arms swinging naturally.','Add incline before you add weight.'],
  'Reverse Crunch':['Lie on your back, knees bent at 90°, hands by your sides.','Curl your hips off the floor by tilting the pelvis back toward your ribs — not by swinging the legs.','Lower slowly until the low back is flat again; stop before it arches.'],
  'Swim Laps':['Push off long, body flat and level at the surface.','Roll to breathe rather than lifting the head.','Swim easy laps with short rests — the effort stays conversational.'],
};

/* Which movement each exercise looks like (drives the animation). */
const PATTERN = {
  'Barbell Bench Press':'pressh','Incline Dumbbell Press':'pressh','Dumbbell Bench Press':'pressh','Push-Up':'pushup','Dumbbell Fly':'pressh','Chest Fly Machine':'pressh','Dips':'dip','Decline Push-Up':'pushup',
  'Deadlift':'hinge','Barbell Row':'pullh','Pull-Up':'pullv','Lat Pulldown':'pullv','One-Arm Dumbbell Row':'pullh','Inverted Row':'invrow','Seated Cable Row':'pullh','Superman Hold':'prone',
  'Overhead Press':'pressv','Dumbbell Shoulder Press':'pressv','Pike Push-Up':'pike','Lateral Raise':'raise','Face Pull':'facepull','Handstand Hold':'handstand',
  'Barbell Curl':'curl','Dumbbell Curl':'curl','Hammer Curl':'curl','Chin-Up':'pullv','Underhand Inverted Row':'invrow',
  'Close-Grip Bench Press':'pressh','Triceps Pushdown':'ext','Overhead DB Extension':'ohext','Bench Dip':'dip','Diamond Push-Up':'pushup',
  'Back Squat':'squat','Goblet Squat':'squat','Leg Press':'legpress','Walking Lunge':'lunge','Bulgarian Split Squat':'lunge','Bodyweight Squat':'squat','Jump Squat':'squat',
  'Romanian Deadlift':'hinge','Hip Thrust':'bridge','Lying Leg Curl':'legcurl','Single-Leg RDL':'hinge','Glute Bridge':'bridge','Nordic Curl':'nordic',
  'Standing Calf Raise':'calf','Single-Leg Calf Raise':'calf',
  'Plank':'hold','Hanging Leg Raise':'hang','Cable Crunch':'core','Dead Bug':'deadbug','Russian Twist':'twist','Ab Wheel Rollout':'rollout',
  'Kettlebell Swings':'swing','Dumbbell Thrusters':'squat','Burpees':'burpee','Jump Rope':'jumprope','High Knees':'cardio','Shuttle Runs':'cardio',

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
  'Prone Y-Raise':'prone',
  'Arnold Press':'pressv',
  'Push Press':'pressv',
  'Machine Shoulder Press':'pressv',
  'Cable Lateral Raise':'raise',
  'Rear Delt Fly':'reardelt',
  'Upright Row':'raise',
  'Front Raise':'frontraise',
  'Wall Walk':'pressv',
  'Incline Dumbbell Curl':'curl',
  'Preacher Curl':'curl',
  'Cable Curl':'curl',
  'Concentration Curl':'curl',
  'EZ-Bar Curl':'curl',
  'Zottman Curl':'curl',
  'Bodyweight Bicep Curl':'curl',
  'Towel Curl':'curl',
  'Skull Crusher':'skull',
  'Cable Overhead Extension':'ohext',
  'Dumbbell Kickback':'kickback',
  'Single-Arm Overhead Extension':'ohext',
  'Bodyweight Skull Crusher':'ext',
  'Front Squat':'squat',
  'Pause Squat':'squat',
  'Hack Squat':'squat',
  'Leg Extension':'legext',
  'Step-Up':'lunge',
  'Reverse Lunge':'lunge',
  'Sissy Squat':'squat',
  'Wall Sit':'wallsit',
  'Sumo Deadlift':'hinge',
  'Good Morning':'hinge',
  'Seated Leg Curl':'legcurl',
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
  'Hanging Knee Raise':'hang',
  'Toes-to-Bar':'hang',
  'Bicycle Crunch':'core',
  'Mountain Climber':'climber',
  'V-Up':'core',
  'Side Plank':'sideplank',
  'Hollow Body Hold':'hollow',
  'Pallof Press':'core',
  'Weighted Sit-Up':'core',
  'Farmer Carry':'carry',
  'Ski Erg Intervals':'cardio',
  'Battle Ropes':'cardio',
  'Kettlebell Snatch':'cardio',
  'Dumbbell Clean and Press':'cardio',
  'Sprint Intervals':'cardio',
  'Bear Crawl':'cardio',
  'Jumping Jacks':'jacks',
  'Zone 2 Bike':'bike', 'Assault Bike Sprints':'bike',
  'Steady Row':'row', 'Rowing Intervals':'row',
  'Steady Run':'cardio',
  'Ruck Walk':'walk', 'Weighted Vest Walk':'walk',
  'Incline Treadmill Walk':'walk', 'Stair Climber':'walk',
  'Swim Laps':'swim',
  'Reverse Crunch':'core',
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
  // Face-on, the two sides sit apart across the body: shoulders a shoulder-
  // width either side of the spine, hips a little less. Side-on they overlap.
  const across=at([0,0], torso+90, 1);
  const spread=(w,i)=> f.flat ? [across[0]*w*(i?1:-1), across[1]*w*(i?1:-1)] : null;
  const arms=hands.map((h,i)=>{
    const o = spread(7,i) || (i===0 ? off : [0,0]);
    const root=[sh[0]+o[0], sh[1]+o[1]], tgt = f.flat ? h : [h[0]+o[0], h[1]+o[1]];
    const r=ik(root,tgt,BONE.uarm,BONE.farm,eb[i]);
    return {sh:root, el:r.j, wr:r.end};
  });
  const legs=feet.map((ft,i)=>{
    const sp=spread(3.6,i);
    const o = sp || (i===0 ? off : [0,0]);
    const root=[hip[0]+o[0], hip[1]+o[1]], tgt = sp ? ft : [ft[0]+o[0], ft[1]+o[1]];
    const r=ik(root,tgt,BONE.thigh,BONE.shin,kn[i]);
    const tw=(f.toes && f.toes[i]!=null) ? f.toes[i] : (f.toe!=null?f.toe:0);
    return {hip:root, kn:r.j, an:r.end, toe:at(r.end, tw, BONE.foot)};
  });
  return {hip,sh,nk,hd,hAng,torso,arms,legs};
}
/* Equipment held in the hands, drawn from the solved skeleton. */
function grip(kind, s, spec){
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
  if(kind==='db1'){                                       // one dumbbell, near hand only
    const h=hands[1];
    return `<g class="ld"><rect x="${n1(h[0]-3.6)}" y="${n1(h[1]-5.6)}" width="7.2" height="11.2" rx="2.6"/></g>`;
  }
  if(kind==='wheel'){                                     // ab wheel under the hands
    const h=hands[1];
    return `<circle class="ld ring" cx="${n1(h[0])}" cy="${n1(h[1]+4.5)}" r="5"/><circle class="ld" cx="${n1(h[0])}" cy="${n1(h[1]+4.5)}" r="1.6"/>`;
  }
  if(kind==='sled'){                                      // leg-press platform at the feet
    const a=s.legs[1].an, t=s.legs[1].toe, c=[(a[0]+t[0])/2,(a[1]+t[1])/2];
    return `<rect class="eq" x="${n1(c[0]-2.5)}" y="${n1(c[1]-11)}" width="5" height="22" rx="1.6" transform="rotate(-45 ${n1(c[0])} ${n1(c[1])})"/>`;
  }
  if(kind==='cable'){                                     // rope to a pulley
    const h=hands[1], k=(spec&&spec.anchor)||[96,30];
    return `<line class="cab" x1="${n1(k[0])}" y1="${n1(k[1])}" x2="${n1(h[0])}" y2="${n1(h[1])}"/>`
         + `<circle class="eq" cx="${n1(k[0])}" cy="${n1(k[1])}" r="3"/><circle class="ld" cx="${n1(h[0])}" cy="${n1(h[1])}" r="2.2"/>`;
  }
  if(kind==='kb'){                                        // kettlebell
    const h=hands[1];
    return `<path class="ld" d="M${n1(h[0]-3.5)},${n1(h[1])} a3.5,3.5 0 0 1 7,0"/>`
         + `<circle class="ld" cx="${n1(h[0])}" cy="${n1(h[1]+7)}" r="6"/>`;
  }
  return '';
}
/* ---- muscles ----
   Each region is a band along one bone: which bone, which side (+1 the front of
   the body, -1 the back, 0 all the way round), how far along it runs, and how
   much of the limb's width it covers. "Front" comes from the skeleton itself —
   the torso's front is its direction turned a quarter-turn toward the way the
   body faces, and each limb's front turns with the limb — so a highlight stays
   on the right muscle through every frame of a movement. */
const REGIONS = {
  chest:    [['torso', 1, .58, .96, .62]],
  abs:      [['torso', 1, .1, .58, .58]],
  obliques: [['torso', 0, .14, .56, .7]],
  lats:     [['torso',-1, .42, .86, .6]],
  upperback:[['torso',-1, .72, 1.02, .62]],
  lowback:  [['torso',-1, .06, .42, .56]],
  glutes:   [['torso',-1, -.06, .16, .7], ['thigh',-1, 0, .3, .62]],
  quads:    [['thigh', 1, .12, .9, .62]],
  hams:     [['thigh',-1, .22, .92, .6]],
  calves:   [['shin', -1, .06, .56, .66]],
  tibialis: [['shin',  1, .1, .72, .52]],
  delts:    [['uarm',  0, -.14, .3, .96]],
  frontdelt:[['uarm',  1, -.12, .34, .66]],
  sidedelt: [['uarm',  0, -.14, .28, .9]],
  reardelt: [['uarm', -1, -.12, .34, .66]],
  biceps:   [['uarm',  1, .26, .92, .6]],
  triceps:  [['uarm', -1, .22, .96, .62]],
  forearms: [['farm',  0, .05, .76, .86]],
};
const MUSCLE_NAMES = {
  chest:'Chest', abs:'Abs', obliques:'Obliques', lats:'Lats', upperback:'Upper back',
  lowback:'Lower back', glutes:'Glutes', quads:'Quads', hams:'Hamstrings', calves:'Calves',
  tibialis:'Shins', delts:'Shoulders', frontdelt:'Front delts', sidedelt:'Side delts',
  reardelt:'Rear delts', biceps:'Biceps', triceps:'Triceps', forearms:'Forearms',
};
function band(a,b,wa,wb,side,t0,t1,frac,nrm){
  const L=[], R=[], steps=6;
  for(let i=0;i<=steps;i++){
    const t=t0+(t1-t0)*i/steps, tc=Math.max(0,Math.min(1,t));
    const p=[a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];
    const w=wa+(wb-wa)*tc;
    const c=side ? side*w*(1-frac) : 0, h=w*frac;
    L.push([p[0]+nrm[0]*(c+h), p[1]+nrm[1]*(c+h)]);
    R.push([p[0]+nrm[0]*(c-h), p[1]+nrm[1]*(c-h)]);
  }
  return 'M'+L.concat(R.reverse()).map(q=>n1(q[0])+','+n1(q[1])).join(' L')+' Z';
}
function unit(deg){ const r=deg*Math.PI/180; return [Math.cos(r), Math.sin(r)]; }
function angOf(a,b){ return Math.atan2(b[1]-a[1], b[0]-a[0])*180/Math.PI; }
/* Paint the regions for one body part. `which` picks the near limb, or both
   in a front/back view, where you see each side equally. */
function musclesOn(part, s, spec, mus){
  if(!mus) return '';
  const f=spec.f||1, view=spec.view||'side';
  const segs=[];
  if(part==='torso') segs.push(['torso', s.hip, s.sh, WID.waist, WID.sh, angOf(s.hip,s.sh)+90*f]);
  const limbs = view==='side' ? [1] : [0,1];
  if(part==='leg') limbs.forEach(i=>{ const g=s.legs[i];
    segs.push(['thigh', g.hip, g.kn, WID.thigh[0], WID.thigh[1], angOf(g.hip,g.kn)-90*f]);
    segs.push(['shin', g.kn, g.an, WID.shin[0], WID.shin[1], angOf(g.kn,g.an)-90*f]); });
  if(part==='arm') limbs.forEach(i=>{ const g=s.arms[i];
    segs.push(['uarm', g.sh, g.el, WID.uarm[0], WID.uarm[1], angOf(g.sh,g.el)-90*f]);
    segs.push(['farm', g.el, g.wr, WID.farm[0], WID.farm[1], angOf(g.el,g.wr)-90*f]); });
  let out='';
  [['s',mus.s||[]],['p',mus.p||[]]].forEach(([cls,list])=>list.forEach(m=>{
    (REGIONS[m]||[]).forEach(([bone,side,t0,t1,frac])=>{
      // a face-on view only shows the regions on the side facing you
      if(view==='front' && side<0) return;
      if(view==='back'  && side>0) return;
      const sd = view==='side' ? side : 0;
      segs.filter(x=>x[0]===bone).forEach(([,a,b,wa,wb,nd])=>{
        out+=`<path class="mus ${cls}" d="${band(a,b,wa,wb,sd,t0,t1,frac,unit(nd))}"/>`;
      });
    });
  }));
  return out;
}
function figure(f, spec, cls, mus){
  const s=build(f);
  const flat=(spec.view||'side')!=='side';
  const N='seg', F = flat ? 'seg' : 'seg far';      // face-on, neither side is further away
  let g='';
  g += spec.back || '';
  if(f.fx && f.fxBehind) g += f.fx;
  if(spec.gripBehind) g += grip(spec.grip, s, spec);
  // far side first, then the trunk, then the near side — reads as depth
  g += limb(s.legs[0].hip, s.legs[0].kn, WID.thigh[0], WID.thigh[1], F)
     + limb(s.legs[0].kn, s.legs[0].an, WID.shin[0], WID.shin[1], F)
     + limb(s.legs[0].an, s.legs[0].toe, 3.1, 2.2, F);
  g += limb(s.arms[0].sh, s.arms[0].el, WID.uarm[0], WID.uarm[1], F)
     + limb(s.arms[0].el, s.arms[0].wr, WID.farm[0], WID.farm[1], F);
  g += limb(s.hip, s.sh, WID.waist, WID.sh, N);            // trunk
  g += musclesOn('torso', s, spec, mus);
  g += limb(s.sh, s.nk, 4.2, 3.4, N);                      // neck
  g += `<ellipse class="seg" cx="${n1(s.hd[0])}" cy="${n1(s.hd[1])}" rx="6.1" ry="6.9"
         transform="rotate(${n1(s.hAng+90)} ${n1(s.hd[0])} ${n1(s.hd[1])})"/>`;
  g += limb(s.legs[1].hip, s.legs[1].kn, WID.thigh[0], WID.thigh[1], N)
     + limb(s.legs[1].kn, s.legs[1].an, WID.shin[0], WID.shin[1], N)
     + limb(s.legs[1].an, s.legs[1].toe, 3.2, 2.3, N);
  g += musclesOn('leg', s, spec, mus);
  g += limb(s.arms[1].sh, s.arms[1].el, WID.uarm[0], WID.uarm[1], N)
     + limb(s.arms[1].el, s.arms[1].wr, WID.farm[0], WID.farm[1], N);
  g += musclesOn('arm', s, spec, mus);
  if(!spec.gripBehind) g += grip(spec.grip, s, spec);
  if(f.fx && !f.fxBehind) g += f.fx;
  g += spec.front || '';
  return `<svg class="fig ${cls}" viewBox="${spec.box||'0 0 100 100'}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${g}</svg>`;
}
/* The path the working point travels — the bar, a hand, the hips — drawn as a
   dashed curve through the start, middle and end of the rep, with an arrow at
   each end. It sits still over the moving figure, so the eye reads the motion
   against it. Alternating movements (walking, running, jacks) have none. */
function motionPath(M, frames){
  const key = M.path===false ? null : (M.path || (M.grip && M.grip!=='none' ? 'hand' : null));
  if(!key) return '';
  const pick=s=>({hand:s.arms[1].wr, hand0:s.arms[0].wr, hip:s.hip, sh:s.sh, head:s.hd,
                  foot:s.legs[1].an, knee:s.legs[1].kn})[key];
  const off=M.poff||[0,0];
  const [A,Mi,B]=frames.map(fr=>{ const q=pick(build(fr)); return [q[0]+off[0], q[1]+off[1]]; });
  if(Math.hypot(B[0]-A[0],B[1]-A[1])<5) return '';
  const C=[2*Mi[0]-(A[0]+B[0])/2, 2*Mi[1]-(A[1]+B[1])/2];
  const P=q=>n1(q[0])+','+n1(q[1]);
  const head=(tip,from)=>{
    const a=Math.atan2(tip[1]-from[1], tip[0]-from[0]), z=3.2;
    const l=[tip[0]-Math.cos(a-0.45)*z, tip[1]-Math.sin(a-0.45)*z],
          r=[tip[0]-Math.cos(a+0.45)*z, tip[1]-Math.sin(a+0.45)*z];
    return `<path class="mv-h" d="M${P(tip)} L${P(l)} L${P(r)} Z"/>`;
  };
  return `<svg class="fig figP" viewBox="${M.box||'0 0 100 100'}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">`
       + `<path class="mv" d="M${P(A)} Q${P(C)} ${P(B)}"/>${head(A,C)}${head(B,C)}</svg>`;
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
const BIKE = `<circle class="eq ring" cx="20" cy="82" r="13"/>
  <circle class="eq ring" cx="78" cy="82" r="13"/>
  <path class="eq frame" d="M20,82 L52,82 M52,82 L40,58 M40,58 L70,52 M70,52 L78,82 M52,82 L70,52"/>
  <rect class="eq" x="32" y="55" width="16" height="4" rx="1.8"/>
  <line class="eq bar" x1="68" y1="49" x2="82" y2="49"/>
  <circle class="eq" cx="52" cy="82" r="3"/>` + FLOORSVG;
const ERG = `<rect class="eq" x="14" y="80" width="58" height="4" rx="1.8"/>
  <rect class="eq" x="16" y="84" width="4" height="13" rx="1.4"/>
  <rect class="eq" x="66" y="84" width="4" height="13" rx="1.4"/>
  <circle class="eq ring" cx="84" cy="66" r="11"/>
  <rect class="eq" x="72" y="58" width="5" height="18" rx="2" transform="rotate(14 74 67)"/>` + FLOORSVG;
const WATER = `<line class="gr wave" x1="2" y1="72" x2="98" y2="72"/>
  <line class="gr wave" x1="8" y1="88" x2="92" y2="88"/>`;

/* Equipment for the movements added with the muscle overlays. */
const PRONEBENCH = `<rect class="eq" x="10" y="70" width="66" height="6" rx="2.4"/>
  <rect class="eq" x="16" y="76" width="4" height="21" rx="1.4"/><rect class="eq" x="66" y="76" width="4" height="21" rx="1.4"/>` + FLOORSVG;
const EXTSEAT = `<rect class="eq" x="24" y="66" width="34" height="6" rx="2.4"/><rect class="eq" x="22" y="34" width="6" height="38" rx="2.4"/>
  <rect class="eq" x="36" y="72" width="5" height="25" rx="1.4"/>` + FLOORSVG;
const PRESSSLED = `<line class="eq bar" x1="52" y1="78" x2="92" y2="30"/>
  <rect class="eq" x="12" y="76" width="36" height="6" rx="2.4" transform="rotate(-30 30 79)"/>
  <rect class="eq" x="26" y="82" width="5" height="15" rx="1.4"/>` + FLOORSVG;
const WALLL = `<rect class="eq" x="15" y="6" width="5" height="91" rx="1.6"/>` + FLOORSVG;
const WALLR = `<rect class="eq" x="60" y="2" width="5" height="95" rx="1.6"/>` + FLOORSVG;
const RACKBAR = `<rect class="eq" x="70" y="38" width="4" height="59" rx="1.4"/><circle class="eq" cx="64" cy="48" r="2.8"/>` + FLOORSVG;
const PULLEY = `<rect class="eq" x="94" y="6" width="4" height="91" rx="1.4"/>` + FLOORSVG;
const PAD = `<rect class="eq" x="14" y="91" width="12" height="6" rx="2"/>` + FLOORSVG;

/* Each pattern: two authored poses plus the props behind and in front. */
const MOVES = {
  squat:{ path:'hand', grip:'plate', gripBehind:true, back:FLOORSVG,
    a:{hip:[50,58], torso:-86, feet:[[45,97],[55,97]], hand:[42,37], elbow:1},
    b:{hip:[48,76], torso:-66, feet:[[45,97],[55,97]], hand:[49,56], elbow:1} },

  lunge:{ path:'hip', poff:[-12,0], grip:'db', back:FLOORSVG,
    a:{hip:[50,58], torso:-88, feet:[[45,97],[55,97]], hands:[[46,58],[56,58]]},
    b:{hip:[50,74], torso:-84, feet:[[32,95],[68,97]], toes:[-45,0], hands:[[46,74],[58,74]]} },

  hinge:{ grip:'plate', back:FLOORSVG,
    a:{hip:[50,58], torso:-86, feet:[[46,97],[54,97]], hand:[52,60], elbow:1},
    b:{hip:[54,64], torso:-38, feet:[[46,97],[54,97]], hand:[60,80], elbow:1} },

  bridge:{ path:'hip', poff:[0,-9], grip:'none', back:FLOORSVG, box:'8 56 86 44',
    a:{hip:[54,90], torso:172, foot:[78,97], hand:[30,95], elbow:-1, head:186, knee:-1, toe:-25},
    b:{hip:[54,71], torso:127, foot:[78,97], hand:[34,90], elbow:-1, head:144, knee:-1, toe:-25} },

  pressh:{ f:-1, grip:'plate', back:BENCH, box:'8 24 86 76',
    a:{hip:[36,62], torso:4, feet:[[18,93],[22,95]], hand:[62,56], elbow:-1, toe:35, head:-8},
    b:{hip:[36,62], torso:4, feet:[[18,93],[22,95]], hand:[62,37], elbow:-1, toe:35, head:-8} },

  pushup:{ f:-1, path:'sh', poff:[0,-9], grip:'none', back:FLOORSVG, box:'0 50 98 50',
    a:{hip:[46,78], torso:203, foot:[82,93], hand:[20,95], elbow:1, toe:-42, head:210},
    b:{hip:[46,88], torso:190, foot:[82,93], hand:[20,95], elbow:1, toe:-42, head:198} },

  dip:{ path:'sh', poff:[-11,0], grip:'none', back:DIPBAR_B, front:DIPBAR_F,
    a:{hip:[48,58], torso:-84, hand:[58,59], elbow:1, feet:[[40,88],[44,90]], toe:-25},
    b:{hip:[48,72], torso:-78, hand:[58,59], elbow:1, feet:[[40,96],[44,97]], toe:-25} },

  pressv:{ view:'front', grip:'bar', back:FLOORSVG,
    a:{hip:[50,58], torso:-90, feet:[[44,97],[56,97]], hands:[[38,36],[62,36]], elbows:[1,-1], flat:true},
    b:{hip:[50,58], torso:-90, feet:[[44,97],[56,97]], hands:[[40,8],[60,8]], elbows:[1,-1], flat:true} },

  pullv:{ view:'back', path:'head', poff:[16,0], grip:'none', back:BARFIX,
    a:{hip:[50,60], torso:-90, feet:[[47,92],[53,92]], hands:[[40,9],[60,9]], elbows:[1,-1], flat:true, toe:-30},
    b:{hip:[50,44], torso:-90, feet:[[47,78],[53,78]], hands:[[40,9],[60,9]], elbows:[1,-1], flat:true, toe:-30} },

  pullh:{ grip:'plate', back:FLOORSVG,
    a:{hip:[56,64], torso:-32, feet:[[48,97],[56,97]], hand:[44,82], elbow:1, head:-20},
    b:{hip:[56,64], torso:-32, feet:[[48,97],[56,97]], hand:[42,66], elbow:1, head:-20} },

  curl:{ grip:'plate', back:FLOORSVG,
    a:{hip:[50,58], torso:-88, feet:[[46,97],[54,97]], hand:[52,58], elbow:1},
    b:{hip:[50,58], torso:-88, feet:[[46,97],[54,97]], hand:[58,40], elbow:1} },

  ext:{ view:'back', grip:'bar', back:FLOORSVG,
    a:{hip:[50,58], torso:-88, feet:[[44,97],[56,97]], hands:[[42,48],[58,48]], elbows:[1,-1], flat:true},
    b:{hip:[50,58], torso:-88, feet:[[44,97],[56,97]], hands:[[42,62],[58,62]], elbows:[1,-1], flat:true} },

  raise:{ view:'front', grip:'db', back:FLOORSVG,
    a:{hip:[50,58], torso:-90, feet:[[42,97],[58,97]], hands:[[38,58],[62,58]], elbows:[1,-1], flat:true},
    b:{hip:[50,58], torso:-90, feet:[[42,97],[58,97]], hands:[[22,31],[78,31]], elbows:[1,-1], flat:true} },

  calf:{ path:'sh', poff:[13,0], grip:'none', back:STEP,
    a:{hip:[50,50], torso:-90, feet:[[50,88],[56,88]], hand:[52,50], toe:0},
    b:{hip:[50,43], torso:-90, feet:[[50,81],[56,81]], hand:[52,43], toe:48} },

  core:{ path:'sh', poff:[0,-8], grip:'none', back:FLOORSVG, box:'4 58 92 42',
    a:{hip:[56,92], torso:178, foot:[80,93], hand:[28,86], elbow:-1, head:190, knee:-1, toe:-35},
    b:{hip:[56,92], torso:200, foot:[74,80], hand:[30,76], elbow:-1, head:212, knee:-1, toe:-35} },

  hold:{ static:true, f:-1, grip:'none', back:FLOORSVG, box:'0 50 98 50',
    a:{hip:[46,78], torso:203, foot:[82,93], hand:[20,95], elbow:1, toe:-42, head:210} },

  carry:{ path:false, grip:'db', back:FLOORSVG,
    a:{hip:[50,58], torso:-88, feet:[[40,97],[60,95]], hands:[[46,58],[57,58]], toes:[0,-14]},
    b:{hip:[50,58], torso:-88, feet:[[60,97],[40,95]], hands:[[46,58],[57,58]], toes:[-14,0]} },

  cardio:{ path:false, grip:'none', back:FLOORSVG,
    a:{hip:[50,58], torso:-82, feet:[[38,92],[64,84]], hands:[[62,50],[38,52]], elbows:[-1,1], knees:[1,1], toe:-15},
    b:{hip:[50,58], torso:-82, feet:[[64,84],[38,92]], hands:[[38,52],[62,50]], elbows:[1,-1], knees:[1,1], toe:-15} },

  walk:{ path:false, grip:'none', back:FLOORSVG,
    a:{hip:[50,58], torso:-86, feet:[[38,96],[62,95]], hands:[[57,57],[44,58]], elbows:[-1,1], toes:[-12,0]},
    b:{hip:[50,58], torso:-86, feet:[[62,95],[38,96]], hands:[[44,58],[57,57]], elbows:[-1,1], toes:[0,-12]} },

  bike:{ path:false, grip:'none', back:BIKE, box:'2 28 96 72',
    a:{hip:[40,54], torso:-52, feet:[[52,74],[52,90]], hands:[[74,50],[74,50]], knees:[1,1], toe:0},
    b:{hip:[40,54], torso:-52, feet:[[52,90],[52,74]], hands:[[74,50],[74,50]], knees:[1,1], toe:0} },

  row:{ path:'hand', grip:'none', back:ERG, box:'6 26 92 74',
    a:{hip:[44,76], torso:-62, feet:[[68,70],[68,70]], hand:[78,58], elbow:1, toe:-55, head:-52},
    b:{hip:[28,76], torso:-104, feet:[[66,70],[66,70]], hand:[44,58], elbow:1, toe:-55, head:-96} },

  swim:{ f:-1, path:false, grip:'none', back:WATER, box:'4 52 92 42',
    a:{hip:[52,80], torso:186, feet:[[86,78],[88,84]], hands:[[16,72],[44,88]], elbows:[1,-1], toe:-8, head:194},
    b:{hip:[52,80], torso:186, feet:[[86,84],[88,78]], hands:[[22,84],[38,68]], elbows:[1,-1], toe:-8, head:194} },
  /* ---- one demo per movement that was borrowing someone else's ---- */
  legcurl:{ back:PRONEBENCH, box:'4 30 92 70', f:-1, path:'foot',
    a:{hip:[46,64], torso:182, hand:[16,72], elbow:-1, foot:[85,66], knee:1, toe:0, head:186},
    b:{hip:[46,64], torso:182, hand:[16,72], elbow:-1, foot:[70,42], knee:1, toe:-100, head:186} },

  nordic:{ back:PAD, path:'head',
    a:{hip:[40,75], torso:-90, hand:[47,68], elbow:1, foot:[21,94], knee:-1, toe:180},
    b:{hip:[56,83], torso:-36, hand:[82,88], elbow:1, foot:[21,94], knee:-1, toe:180} },

  legext:{ back:EXTSEAT, path:'foot',
    a:{hip:[40,63], torso:-96, hand:[46,68], elbow:1, foot:[59,84], knee:-1, toe:-10},
    b:{hip:[40,63], torso:-96, hand:[46,68], elbow:1, foot:[77,57], knee:-1, toe:-80} },

  legpress:{ grip:'sled', back:PRESSSLED, box:'-8 14 108 86', path:'foot',
    a:{hip:[38,74], torso:-150, hand:[44,78], elbow:1, foot:[56,52], knee:-1, toe:-45},
    b:{hip:[38,74], torso:-150, hand:[44,78], elbow:1, foot:[67,46], knee:-1, toe:-45} },

  hang:{ back:BARFIX, path:'foot',
    a:{hip:[50,63], torso:-90, hand:[50,9], elbow:1, feet:[[48,98],[51,98]], knee:1, toe:30},
    b:{hip:[50,63], torso:-94, hand:[50,9], elbow:1, feet:[[66,70],[68,70]], knee:-1, toe:-20} },

  rollout:{ grip:'wheel', back:FLOORSVG, path:'hand',
    a:{hip:[30,76], torso:-35, hand:[52,86], elbow:1, foot:[6,94], knee:-1, toe:180, head:-25},
    b:{hip:[42,87], torso:-5, hand:[90,86], elbow:1, foot:[6,94], knee:-1, toe:180, head:-2} },

  deadbug:{ back:FLOORSVG, box:'2 50 96 50', path:'hand',
    a:{hip:[58,90], torso:180, head:186, hands:[[32,64],[32,64]], elbows:[1,1], feet:[[76,74],[76,74]], knees:[-1,-1], toe:0},
    b:{hip:[58,90], torso:180, head:186, hands:[[32,64],[8,86]], elbows:[1,1], feet:[[95,86],[76,74]], knees:[-1,-1], toe:0} },

  twist:{ grip:'plate', back:FLOORSVG, view:'front', path:'hand',
    a:{flat:true, hip:[50,91], torso:-104, hands:[[30,76],[36,76]], elbows:[1,1], feet:[[31,96],[69,96]], knees:[1,-1]},
    b:{flat:true, hip:[50,91], torso:-76, hands:[[64,76],[70,76]], elbows:[-1,-1], feet:[[31,96],[69,96]], knees:[1,-1]} },

  climber:{ back:FLOORSVG, box:'4 50 92 50', f:-1, path:false,
    a:{hip:[46,78], torso:203, hand:[20,95], elbow:1, feet:[[50,90],[82,93]], knees:[1,1], toe:-42, head:210},
    b:{hip:[46,78], torso:203, hand:[20,95], elbow:1, feet:[[82,93],[50,90]], knees:[1,1], toe:-42, head:210} },

  prone:{ back:FLOORSVG, box:'2 56 96 44', f:-1, path:'hand',
    a:{hip:[60,92], torso:180, head:184, hand:[10,93], elbow:1, foot:[96,94], knee:1, toe:-80},
    b:{hip:[60,92], torso:196, head:212, hand:[15,72], elbow:1, foot:[95,82], knee:1, toe:-80} },

  wallsit:{ static:true, back:WALLL,
    a:{hip:[28,78], torso:-90, hand:[42,76], elbow:1, feet:[[46,97],[49,97]], knee:-1} },

  sideplank:{ static:true, back:FLOORSVG, box:'4 40 92 60', view:'front',
    a:{flat:true, hip:[54,88], torso:195, hands:[[40,95],[30,55]], elbows:[1,1], feet:[[90,95],[90,95]], toe:0, head:200} },

  hollow:{ static:true, back:FLOORSVG, box:'2 60 96 40',
    a:{hip:[54,90], torso:194, head:200, hand:[6,80], elbow:1, foot:[92,82], knee:1, toe:-15} },

  handstand:{ static:true, back:WALLR, f:1,
    a:{hip:[52,42], torso:90, hand:[52,95], elbow:1, foot:[54,4], knee:1, toe:-90} },

  jumprope:{ back:FLOORSVG, path:false,
    a:{hip:[50,55], torso:-88, hands:[[55,62],[57,62]], elbows:[1,1], feet:[[48,94],[52,94]], toe:35,
       fx:'<path class="rope" d="M57,62 C80,76 74,104 50,101 C26,104 24,78 55,62"/>'},
    b:{hip:[50,58], torso:-88, hands:[[55,64],[57,64]], elbows:[1,1], feet:[[48,97],[52,97]], toe:0,
       fx:'<path class="rope" d="M57,64 C82,48 74,6 50,4 C26,6 24,46 55,64"/>', fxBehind:true} },

  jacks:{ back:FLOORSVG, view:'front', path:false,
    a:{flat:true, hip:[50,58], torso:-90, hands:[[39,59],[61,59]], elbows:[1,-1], feet:[[46,97],[54,97]], knees:[1,-1]},
    b:{flat:true, hip:[50,60], torso:-90, hands:[[40,8],[60,8]], elbows:[1,-1], feet:[[31,96],[69,96]], knees:[1,-1]} },

  burpee:{ back:FLOORSVG, path:false,
    a:{hip:[50,54], torso:-88, hands:[[47,9],[53,9]], elbows:[1,1], feet:[[47,92],[53,92]], toe:40},
    m:{hip:[46,84], torso:-50, hands:[[60,96],[62,96]], elbows:[1,1], feet:[[44,97],[50,97]], knees:[1,1], toe:0},
    b:{hip:[54,78], torso:-23, hands:[[80,95],[80,95]], elbows:[1,1], feet:[[18,93],[18,93]], toe:-50, head:-30} },

  invrow:{ back:RACKBAR, f:-1, path:'sh', poff:[0,-7],
    a:{hip:[37.7,82.6], torso:-22, hand:[64,48], elbow:-1, foot:[2,96], knee:-1, toe:-70, head:-30},
    b:{hip:[33.9,75.5], torso:-34, hand:[64,48], elbow:-1, foot:[2,96], knee:-1, toe:-70, head:-44} },

  facepull:{ grip:'cable', anchor:[96,30], back:PULLEY, path:'hand',
    a:{hip:[48,58], torso:-92, hand:[74,33], elbow:-1, feet:[[42,97],[52,97]]},
    b:{hip:[48,58], torso:-92, hand:[56,25], elbow:-1, feet:[[42,97],[52,97]]} },

  reardelt:{ grip:'db', back:FLOORSVG, view:'back', path:'hand',
    a:{flat:true, hip:[50,60], torso:-90, hands:[[42,64],[58,64]], elbows:[1,-1], feet:[[43,97],[57,97]], knees:[1,-1]},
    b:{flat:true, hip:[50,60], torso:-90, hands:[[22,38],[78,38]], elbows:[1,-1], feet:[[43,97],[57,97]], knees:[1,-1]} },

  frontraise:{ grip:'db', back:FLOORSVG, path:'hand',
    a:{hip:[48,58], torso:-90, hand:[50,59], elbow:1, feet:[[44,97],[52,97]]},
    b:{hip:[48,58], torso:-90, hand:[75,32], elbow:1, feet:[[44,97],[52,97]]} },

  ohext:{ grip:'db1', back:FLOORSVG, path:'hand',
    a:{hip:[50,58], torso:-90, hand:[51,5], elbow:-1, feet:[[45,97],[54,97]]},
    b:{hip:[50,58], torso:-90, hand:[38,22], elbow:-1, feet:[[45,97],[54,97]]} },

  skull:{ grip:'plate', back:BENCH, box:'8 24 86 76', f:-1, path:'hand',
    a:{hip:[36,62], torso:4, feet:[[18,93],[22,95]], hand:[62,37], elbow:1, toe:35, head:-8},
    b:{hip:[36,62], torso:4, feet:[[18,93],[22,95]], hand:[73,52], elbow:1, toe:35, head:-8} },

  kickback:{ grip:'db1', back:FLOORSVG, path:'hand',
    a:{hip:[52,64], torso:-25, hands:[[64,78],[63,72]], elbows:[1,-1], feet:[[46,97],[56,97]], head:-20},
    b:{hip:[52,64], torso:-25, hands:[[64,78],[51,64]], elbows:[1,-1], feet:[[46,97],[56,97]], head:-20} },

  pike:{ back:FLOORSVG, f:-1, path:'head',
    a:{hip:[56,58], torso:136, hand:[18,95], elbow:1, foot:[68,95], knee:1, toe:-10, head:120},
    b:{hip:[50,64], torso:128, hand:[18,95], elbow:1, foot:[68,95], knee:1, toe:-10, head:110} },

  swing:{ grip:'kb', back:FLOORSVG, path:'hand',
    a:{hip:[44,64], torso:-40, hand:[52,74], elbow:1, feet:[[42,97],[52,97]], head:-30},
    b:{hip:[50,58], torso:-90, hand:[76,34], elbow:1, feet:[[42,97],[52,97]]} },

};

/* What each movement works — p: the main movers, s: the helpers. Patterns
   set the default; an exercise only overrides it where its emphasis
   genuinely differs (a close-grip bench is a triceps lift, say). */
const PATTERN_MUSCLES = {
  squat:{p:['quads','glutes'], s:['lowback']},       lunge:{p:['quads','glutes'], s:['hams']},
  hinge:{p:['hams','glutes'], s:['lowback','forearms']}, bridge:{p:['glutes'], s:['hams']},
  pressh:{p:['chest'], s:['frontdelt','triceps']},   pushup:{p:['chest'], s:['triceps','frontdelt','abs']},
  dip:{p:['triceps','chest'], s:['frontdelt']},      pressv:{p:['delts'], s:['triceps']},
  pullv:{p:['lats'], s:['biceps','upperback']},      pullh:{p:['lats','upperback'], s:['biceps','reardelt']},
  curl:{p:['biceps'], s:['forearms']},               ext:{p:['triceps']},
  raise:{p:['sidedelt'], s:['upperback']},           calf:{p:['calves']},
  core:{p:['abs'], s:['obliques']},                  hold:{p:['abs'], s:['delts','glutes']},
  carry:{p:['forearms','upperback'], s:['abs','glutes']}, cardio:{p:['quads','calves'], s:['glutes','hams']},
  walk:{p:['glutes','calves'], s:['quads','hams']},  bike:{p:['quads'], s:['glutes','calves']},
  row:{p:['quads','upperback'], s:['hams','biceps']}, swim:{p:['lats','delts'], s:['abs']},
  legcurl:{p:['hams'], s:['calves']},                nordic:{p:['hams'], s:['glutes']},
  legext:{p:['quads']},                              legpress:{p:['quads','glutes'], s:['hams']},
  hang:{p:['abs'], s:['forearms']},                  rollout:{p:['abs'], s:['lats']},
  deadbug:{p:['abs']},                               twist:{p:['obliques'], s:['abs']},
  climber:{p:['abs'], s:['quads','delts']},          prone:{p:['lowback','upperback'], s:['glutes','reardelt']},
  wallsit:{p:['quads'], s:['glutes']},               sideplank:{p:['obliques'], s:['delts']},
  hollow:{p:['abs']},                                handstand:{p:['delts'], s:['triceps','abs']},
  jumprope:{p:['calves'], s:['quads','delts']},      jacks:{p:['calves','delts'], s:['quads']},
  burpee:{p:['chest','quads'], s:['glutes','delts','abs']}, invrow:{p:['upperback','lats'], s:['biceps']},
  facepull:{p:['reardelt','upperback']},             reardelt:{p:['reardelt','upperback']},
  frontraise:{p:['frontdelt']},                      ohext:{p:['triceps']},
  skull:{p:['triceps']},                             kickback:{p:['triceps']},
  pike:{p:['delts'], s:['triceps','upperback']},     swing:{p:['glutes','hams'], s:['lowback','delts']},
};
const EX_MUSCLES = {
  'Close-Grip Bench Press':{p:['triceps','chest'], s:['frontdelt']},
  'Diamond Push-Up':{p:['triceps','chest'], s:['frontdelt']},
  'Chin-Up':{p:['lats','biceps'], s:['upperback']},
  'Underhand Inverted Row':{p:['upperback','biceps'], s:['lats']},
  'Straight-Arm Pulldown':{p:['lats'], s:['triceps']},
  'Hammer Curl':{p:['biceps','forearms']}, 'Zottman Curl':{p:['biceps','forearms']}, 'Towel Curl':{p:['forearms','biceps']},
  'Good Morning':{p:['hams','lowback'], s:['glutes']},
  'Hyperextension':{p:['lowback','glutes'], s:['hams']},
  'Cable Pull-Through':{p:['glutes','hams']},
  'Rack Pull':{p:['glutes','upperback'], s:['hams','forearms']},
  'Upright Row':{p:['sidedelt','upperback'], s:['biceps']},
  'Prone Y-Raise':{p:['upperback','reardelt'], s:['lowback']},
  'Superman Hold':{p:['lowback','glutes'], s:['upperback']},
  'Tibialis Raise':{p:['tibialis']},
  'Farmer Walk on Toes':{p:['calves','forearms'], s:['upperback']},
  'Sissy Squat':{p:['quads']}, 'Hack Squat':{p:['quads'], s:['glutes']}, 'Front Squat':{p:['quads'], s:['glutes','upperback']},
  'Step-Up':{p:['glutes','quads']},
  'Dumbbell Thrusters':{p:['quads','delts'], s:['glutes','triceps']},
  'Dumbbell Clean and Press':{p:['glutes','delts'], s:['hams','triceps']},
  'Kettlebell Snatch':{p:['glutes','delts'], s:['hams','upperback']},
  'Battle Ropes':{p:['delts','abs'], s:['forearms']},
  'Bear Crawl':{p:['delts','abs'], s:['quads']},
  'Ski Erg Intervals':{p:['lats','triceps'], s:['abs']},
  'Pallof Press':{p:['obliques','abs']},
  'Bicycle Crunch':{p:['abs','obliques']},
  'Renegade Row':{p:['lats','abs'], s:['biceps']},
  'Incline Treadmill Walk':{p:['glutes','calves'], s:['hams']},
  'Stair Climber':{p:['glutes','quads'], s:['calves']},
  'Assault Bike Sprints':{p:['quads','delts'], s:['glutes']},
};
function patternOf(l){ return PATTERN[l.name] || GROUP_PATTERN[l.group] || 'cardio'; }
function musclesFor(l){ return EX_MUSCLES[l.name] || PATTERN_MUSCLES[patternOf(l)] || null; }

/* Patterns logged in seconds rather than reps (isometric holds and carries). */
const TIME_PATTERNS = ['hold','carry','wallsit','sideplank','hollow','handstand'];
const TIMED_BY_NAME = { 'Superman Hold':true };   // shares a demo with a rep exercise
function isTimedExercise(name){ return !!TIMED_BY_NAME[name] || TIME_PATTERNS.indexOf(PATTERN[name])!==-1; }

/* ---- builders (pure; called from the renderer) ---- */
function movementDemo(l){
  const M = MOVES[patternOf(l)]; if(!M) return '';
  const mus = musclesFor(l);
  const hint = '<span class="fig-zoom" aria-hidden="true">⤢</span>';
  if(M.static) return `<div class="figwrap hold">${figure(M.a,M,'figS',mus)}${hint}</div>`;
  const mid = M.m || lerpFrame(M.a, M.b, 0.5);
  return `<div class="figwrap">${figure(M.a,M,'figA',mus)}${figure(mid,M,'figM',mus)}${figure(M.b,M,'figB',mus)}`
       + `${motionPath(M,[M.a,mid,M.b])}${hint}</div>`;
}
/* "Works" line under the heading: main movers bright, helpers muted, in the
   same two tones the figure is painted in. */
function musclesLine(l){
  const m=musclesFor(l);
  if(!m) return GROUP_TARGET[l.group] || '';
  const P=(m.p||[]).map(k=>`<b>${MUSCLE_NAMES[k]||k}</b>`), S=(m.s||[]).map(k=>MUSCLE_NAMES[k]||k);
  return P.concat(S).join(' · ');
}
function howtoBlock(l, big){
  const steps = HOWTO[l.name] || ['Perform with control through a full range of motion.'];
  const stepsHTML = steps.map(s=>`<li>${s}</li>`).join('');
  return `<div class="howto${big?' big':''}">
    <button class="demo" type="button" aria-label="${big?'Shrink':'Enlarge'} the demo">${movementDemo(l)}</button>
    <div class="howto-txt">
      <div class="howto-h">How to do it<span class="tg">${musclesLine(l)}</span></div>
      <ol class="howto-steps">${stepsHTML}</ol>
    </div>
  </div>`;
}
