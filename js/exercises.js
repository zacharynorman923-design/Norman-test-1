/* ======================= EXERCISE LIBRARY =======================
   eq = tiers that can perform it (gym has everything)
   c  = compound flag
   w  = [anchorLift, ratioOf1RM, loadType]  (omitted => bodyweight)
        loadType: barbell | machine | single | dumbbell(pair, shown /hand)  */
const ALL_EQ=['gym','dumbbell','bodyweight'], DB_EQ=['gym','dumbbell'], G=['gym'];
const EX = {
  chest:[
    {n:'Barbell Bench Press',eq:G,c:1,w:['bench',1.0,'barbell']},
    {n:'Incline Dumbbell Press',eq:DB_EQ,c:1,w:['bench',0.62,'dumbbell']},
    {n:'Dumbbell Bench Press',eq:DB_EQ,c:1,w:['bench',0.70,'dumbbell']},
    {n:'Push-Up',eq:ALL_EQ,c:1},
    {n:'Dumbbell Fly',eq:DB_EQ,c:0,w:['bench',0.34,'dumbbell']},
    {n:'Chest Fly Machine',eq:G,c:0,w:['bench',0.55,'machine']},
    {n:'Dips',eq:ALL_EQ,c:1},{n:'Decline Push-Up',eq:ALL_EQ,c:1},
    {n:'Incline Barbell Bench Press',eq:G,c:1,w:['bench',0.85,'barbell']},
    {n:'Decline Barbell Bench Press',eq:G,c:1,w:['bench',1.05,'barbell']},
    {n:'Machine Chest Press',eq:G,c:1,w:['bench',0.90,'machine']},
    {n:'Cable Crossover',eq:G,c:0,w:['bench',0.30,'machine']},
    {n:'Incline Dumbbell Fly',eq:DB_EQ,c:0,w:['bench',0.30,'dumbbell']},
    {n:'Wide-Grip Push-Up',eq:ALL_EQ,c:1},
    {n:'Archer Push-Up',eq:ALL_EQ,c:1},
    {n:'Incline Push-Up',eq:ALL_EQ,c:1},
  ],
  back:[
    {n:'Deadlift',eq:G,c:1,w:['deadlift',1.0,'barbell']},
    {n:'Barbell Row',eq:G,c:1,w:['row',1.0,'barbell']},
    {n:'Pull-Up',eq:ALL_EQ,c:1},
    {n:'Lat Pulldown',eq:G,c:1,w:['row',0.95,'machine']},
    {n:'One-Arm Dumbbell Row',eq:DB_EQ,c:1,w:['row',0.55,'single']},
    {n:'Inverted Row',eq:ALL_EQ,c:1},
    {n:'Seated Cable Row',eq:G,c:0,w:['row',0.90,'machine']},
    {n:'Superman Hold',eq:ALL_EQ,c:0},
    {n:'Pendlay Row',eq:G,c:1,w:['row',0.95,'barbell']},
    {n:'T-Bar Row',eq:G,c:1,w:['row',1.0,'machine']},
    {n:'Chest-Supported Row',eq:G,c:1,w:['row',0.85,'machine']},
    {n:'Straight-Arm Pulldown',eq:G,c:0,w:['row',0.45,'machine']},
    {n:'Trap Bar Deadlift',eq:G,c:1,w:['deadlift',1.05,'barbell']},
    {n:'Rack Pull',eq:G,c:1,w:['deadlift',1.20,'barbell']},
    {n:'Renegade Row',eq:DB_EQ,c:1,w:['row',0.40,'dumbbell']},
    {n:'Prone Y-Raise',eq:ALL_EQ,c:0},
  ],
  shoulders:[
    {n:'Overhead Press',eq:G,c:1,w:['press',1.0,'barbell']},
    {n:'Dumbbell Shoulder Press',eq:DB_EQ,c:1,w:['press',0.72,'dumbbell']},
    {n:'Pike Push-Up',eq:ALL_EQ,c:1},
    {n:'Lateral Raise',eq:DB_EQ,c:0,w:['press',0.28,'dumbbell']},
    {n:'Face Pull',eq:DB_EQ,c:0,w:['press',0.55,'machine']},
    {n:'Handstand Hold',eq:ALL_EQ,c:0},
    {n:'Arnold Press',eq:DB_EQ,c:1,w:['press',0.65,'dumbbell']},
    {n:'Push Press',eq:G,c:1,w:['press',1.25,'barbell']},
    {n:'Machine Shoulder Press',eq:G,c:1,w:['press',0.95,'machine']},
    {n:'Cable Lateral Raise',eq:G,c:0,w:['press',0.22,'machine']},
    {n:'Rear Delt Fly',eq:DB_EQ,c:0,w:['press',0.25,'dumbbell']},
    {n:'Upright Row',eq:DB_EQ,c:0,w:['press',0.55,'barbell']},
    {n:'Front Raise',eq:DB_EQ,c:0,w:['press',0.25,'dumbbell']},
    {n:'Wall Walk',eq:ALL_EQ,c:1},
  ],
  biceps:[
    {n:'Barbell Curl',eq:G,c:0,w:['bench',0.30,'barbell']},
    {n:'Dumbbell Curl',eq:DB_EQ,c:0,w:['bench',0.34,'dumbbell']},
    {n:'Hammer Curl',eq:DB_EQ,c:0,w:['bench',0.36,'dumbbell']},
    {n:'Chin-Up',eq:ALL_EQ,c:1},{n:'Underhand Inverted Row',eq:ALL_EQ,c:1},
    {n:'Incline Dumbbell Curl',eq:DB_EQ,c:0,w:['bench',0.28,'dumbbell']},
    {n:'Preacher Curl',eq:G,c:0,w:['bench',0.28,'barbell']},
    {n:'Cable Curl',eq:G,c:0,w:['bench',0.35,'machine']},
    {n:'Concentration Curl',eq:DB_EQ,c:0,w:['bench',0.25,'single']},
    {n:'EZ-Bar Curl',eq:G,c:0,w:['bench',0.32,'barbell']},
    {n:'Zottman Curl',eq:DB_EQ,c:0,w:['bench',0.28,'dumbbell']},
    {n:'Bodyweight Bicep Curl',eq:ALL_EQ,c:1},
    {n:'Towel Curl',eq:ALL_EQ,c:0},
  ],
  triceps:[
    {n:'Close-Grip Bench Press',eq:G,c:1,w:['bench',0.85,'barbell']},
    {n:'Triceps Pushdown',eq:G,c:0,w:['bench',0.45,'machine']},
    {n:'Overhead DB Extension',eq:DB_EQ,c:0,w:['bench',0.30,'dumbbell']},
    {n:'Bench Dip',eq:ALL_EQ,c:0},{n:'Diamond Push-Up',eq:ALL_EQ,c:1},
    {n:'Skull Crusher',eq:G,c:0,w:['bench',0.35,'barbell']},
    {n:'Cable Overhead Extension',eq:G,c:0,w:['bench',0.35,'machine']},
    {n:'Dumbbell Kickback',eq:DB_EQ,c:0,w:['bench',0.15,'dumbbell']},
    {n:'Single-Arm Overhead Extension',eq:DB_EQ,c:0,w:['bench',0.18,'single']},
    {n:'Bodyweight Skull Crusher',eq:ALL_EQ,c:1},
  ],
  quads:[
    {n:'Back Squat',eq:G,c:1,w:['squat',1.0,'barbell']},
    {n:'Goblet Squat',eq:DB_EQ,c:1,w:['squat',0.40,'single']},
    {n:'Leg Press',eq:G,c:1,w:['squat',2.0,'machine']},
    {n:'Walking Lunge',eq:ALL_EQ,c:1,w:['squat',0.50,'dumbbell']},
    {n:'Bulgarian Split Squat',eq:ALL_EQ,c:1,w:['squat',0.40,'dumbbell']},
    {n:'Bodyweight Squat',eq:ALL_EQ,c:0},{n:'Jump Squat',eq:ALL_EQ,c:0},
    {n:'Front Squat',eq:G,c:1,w:['squat',0.85,'barbell']},
    {n:'Pause Squat',eq:G,c:1,w:['squat',0.85,'barbell']},
    {n:'Hack Squat',eq:G,c:1,w:['squat',1.30,'machine']},
    {n:'Leg Extension',eq:G,c:0,w:['squat',0.45,'machine']},
    {n:'Step-Up',eq:ALL_EQ,c:1,w:['squat',0.35,'dumbbell']},
    {n:'Reverse Lunge',eq:ALL_EQ,c:1,w:['squat',0.45,'dumbbell']},
    {n:'Sissy Squat',eq:ALL_EQ,c:0},
    {n:'Wall Sit',eq:ALL_EQ,c:0},
  ],
  posterior:[
    {n:'Romanian Deadlift',eq:DB_EQ,c:1,w:['deadlift',0.75,'barbell']},
    {n:'Hip Thrust',eq:DB_EQ,c:1,w:['deadlift',1.05,'barbell']},
    {n:'Lying Leg Curl',eq:G,c:0,w:['deadlift',0.35,'machine']},
    {n:'Single-Leg RDL',eq:ALL_EQ,c:1,w:['deadlift',0.28,'dumbbell']},
    {n:'Glute Bridge',eq:ALL_EQ,c:0},{n:'Nordic Curl',eq:ALL_EQ,c:1},
    {n:'Sumo Deadlift',eq:G,c:1,w:['deadlift',1.0,'barbell']},
    {n:'Good Morning',eq:G,c:1,w:['deadlift',0.45,'barbell']},
    {n:'Seated Leg Curl',eq:G,c:0,w:['deadlift',0.35,'machine']},
    {n:'Cable Pull-Through',eq:G,c:1,w:['deadlift',0.50,'machine']},
    {n:'Hyperextension',eq:DB_EQ,c:0,w:['deadlift',0.25,'dumbbell']},
    {n:'Single-Leg Hip Thrust',eq:ALL_EQ,c:1,w:['deadlift',0.30,'dumbbell']},
    {n:'Frog Pump',eq:ALL_EQ,c:0},
  ],
  calves:[
    {n:'Standing Calf Raise',eq:DB_EQ,c:0,w:['squat',0.55,'machine']},
    {n:'Single-Leg Calf Raise',eq:ALL_EQ,c:0},
    {n:'Seated Calf Raise',eq:G,c:0,w:['squat',0.35,'machine']},
    {n:'Leg Press Calf Raise',eq:G,c:0,w:['squat',0.90,'machine']},
    {n:'Donkey Calf Raise',eq:DB_EQ,c:0,w:['squat',0.50,'machine']},
    {n:'Farmer Walk on Toes',eq:DB_EQ,c:0},
    {n:'Calf Jump',eq:ALL_EQ,c:0},
    {n:'Tibialis Raise',eq:ALL_EQ,c:0},
  ],
  core:[
    {n:'Plank',eq:ALL_EQ,c:0},{n:'Hanging Leg Raise',eq:ALL_EQ,c:0},
    {n:'Cable Crunch',eq:G,c:0,w:['bench',0.45,'machine']},
    {n:'Dead Bug',eq:ALL_EQ,c:0},{n:'Russian Twist',eq:ALL_EQ,c:0},{n:'Ab Wheel Rollout',eq:ALL_EQ,c:0},
    {n:'Hanging Knee Raise',eq:ALL_EQ,c:0},
    {n:'Toes-to-Bar',eq:ALL_EQ,c:1},
    {n:'Bicycle Crunch',eq:ALL_EQ,c:0},
    {n:'Mountain Climber',eq:ALL_EQ,c:0},
    {n:'V-Up',eq:ALL_EQ,c:0},
    {n:'Side Plank',eq:ALL_EQ,c:0},
    {n:'Hollow Body Hold',eq:ALL_EQ,c:0},
    {n:'Reverse Crunch',eq:ALL_EQ,c:0},
    {n:'Pallof Press',eq:G,c:0,w:['bench',0.25,'machine']},
    {n:'Weighted Sit-Up',eq:DB_EQ,c:0,w:['bench',0.25,'single']},
    {n:'Farmer Carry',eq:DB_EQ,c:0},
  ],
  /* Stretches and mobility drills. No split template draws from this group,
     so these only ever appear in blocks you add. `rx` is the move's own
     prescription — a stretch is held, not lifted for 10–12. */
  mobility:[
    {n:'Wall Calf Stretch',eq:ALL_EQ,c:0,rx:{s:'3',r:'30–45 s',rest:'15 s',tag:'stretch'}},
    {n:'Bent-Knee Calf Stretch',eq:ALL_EQ,c:0,rx:{s:'3',r:'30–45 s',rest:'15 s',tag:'stretch'}},
    {n:'Towel Calf Stretch',eq:ALL_EQ,c:0,rx:{s:'3',r:'30–45 s',rest:'15 s',tag:'stretch'}},
    {n:'Eccentric Heel Drop',eq:ALL_EQ,c:0,rx:{s:'3',r:'10–12',rest:'30 s',tag:'stretch'}},
    {n:'Deep Squat Hold',eq:ALL_EQ,c:0,rx:{s:'3',r:'30–45 s',rest:'20 s',tag:'mobility'}},
    {n:'Knee-to-Wall Ankle Mobilization',eq:ALL_EQ,c:0,rx:{s:'2',r:'10 / side',rest:'20 s',tag:'mobility'}},
    {n:'Heel Walks',eq:ALL_EQ,c:0,rx:{s:'3',r:'30 s',rest:'30 s',tag:'drill'}},
    {n:'Heel-to-Toe Walk',eq:ALL_EQ,c:0,rx:{s:'3',r:'45 s',rest:'20 s',tag:'drill'}},
    {n:'Half-Kneeling Hip Flexor Stretch',eq:ALL_EQ,c:0,rx:{s:'3',r:'30–45 s / side',rest:'15 s',tag:'stretch'}},
    {n:'Figure-4 Stretch',eq:ALL_EQ,c:0,rx:{s:'3',r:'30–45 s / side',rest:'15 s',tag:'stretch'}},
    {n:'90/90 Hip Switch',eq:ALL_EQ,c:0,rx:{s:'2',r:'8 / side',rest:'20 s',tag:'mobility'}},
    {n:'Side-Lying Hip Abduction',eq:ALL_EQ,c:0,rx:{s:'3',r:'12–15 / side',rest:'30 s',tag:'control'}},
    {n:'Clamshell',eq:ALL_EQ,c:0,rx:{s:'3',r:'15 / side',rest:'30 s',tag:'control'}},
    {n:'Banded Lateral Walk',eq:DB_EQ,c:0,rx:{s:'3',r:'12 steps / side',rest:'30 s',tag:'control'}},
    {n:'Copenhagen Plank',eq:ALL_EQ,c:0,rx:{s:'3',r:'15–30 s / side',rest:'30 s',tag:'control'}},
    {n:'Lacrosse Ball Glute Release',eq:ALL_EQ,c:0,rx:{s:'1',r:'60–90 s / side',rest:'—',tag:'release'}},
    /* neck and back */
    {n:'Chin Tuck',eq:ALL_EQ,c:0,rx:{s:'2',r:'10 (5 s hold)',rest:'30 s',tag:'control'}},
    {n:'Neck Isometric Hold',eq:ALL_EQ,c:0,rx:{s:'4',r:'10 s',rest:'15 s',tag:'control'}},
    {n:'Wall Angel',eq:ALL_EQ,c:0,rx:{s:'2',r:'10–12',rest:'30 s',tag:'control'}},
    {n:'Band Pull-Apart',eq:DB_EQ,c:0,rx:{s:'3',r:'15–20',rest:'30 s',tag:'control'}},
    {n:'Cat-Cow',eq:ALL_EQ,c:0,rx:{s:'2',r:'8–10 slow',rest:'15 s',tag:'mobility'}},
    {n:'Foam Roller Thoracic Extension',eq:ALL_EQ,c:0,rx:{s:'2',r:'8–10',rest:'20 s',tag:'mobility'}},
    {n:'Bird Dog',eq:ALL_EQ,c:0,rx:{s:'3',r:'8 / side (3 s hold)',rest:'30 s',tag:'control'}},
    /* hip internal rotation */
    {n:'Prone Hip Internal Rotation Stretch',eq:ALL_EQ,c:0,rx:{s:'3',r:'45 s',rest:'15 s',tag:'stretch'}},
    {n:'Supine Knee Drop-In',eq:ALL_EQ,c:0,rx:{s:'3',r:'30 s',rest:'15 s',tag:'stretch'}},
    {n:'90/90 Hold',eq:ALL_EQ,c:0,rx:{s:'2',r:'45 s / side',rest:'15 s',tag:'stretch'}},
    {n:'Slow Hip Rotation Stretch',eq:ALL_EQ,c:0,rx:{s:'3',r:'30–45 s',rest:'15 s',tag:'stretch'}},
    {n:'Frog Stretch',eq:ALL_EQ,c:0,rx:{s:'2',r:'45 s',rest:'15 s',tag:'stretch'}},
    {n:'Seated Active Internal Rotation',eq:ALL_EQ,c:0,rx:{s:'2',r:'10 (5 s hold)',rest:'20 s',tag:'control'}},
    {n:'90/90 Lift-Off',eq:ALL_EQ,c:0,rx:{s:'2',r:'8',rest:'20 s',tag:'control'}},
  ],
  cardio:[
    {n:'Rowing Intervals',eq:G,c:0},{n:'Assault Bike Sprints',eq:G,c:0},{n:'Incline Treadmill Walk',eq:G,c:0},
    {n:'Kettlebell Swings',eq:DB_EQ,c:0},{n:'Dumbbell Thrusters',eq:DB_EQ,c:1},{n:'Burpees',eq:ALL_EQ,c:1},
    {n:'Jump Rope',eq:ALL_EQ,c:0},{n:'High Knees',eq:ALL_EQ,c:0},{n:'Shuttle Runs',eq:ALL_EQ,c:0},
    {n:'Ski Erg Intervals',eq:G,c:0},
    {n:'Stair Climber',eq:G,c:0},
    {n:'Battle Ropes',eq:G,c:0},
    {n:'Kettlebell Snatch',eq:DB_EQ,c:1},
    {n:'Dumbbell Clean and Press',eq:DB_EQ,c:1},
    {n:'Sprint Intervals',eq:ALL_EQ,c:0},
    {n:'Bear Crawl',eq:ALL_EQ,c:0},
    {n:'Jumping Jacks',eq:ALL_EQ,c:0},
    {n:'Zone 2 Bike',eq:G,c:0},
    {n:'Steady Row',eq:G,c:0},
    {n:'Steady Run',eq:ALL_EQ,c:0},
    {n:'Ruck Walk',eq:ALL_EQ,c:0},
    {n:'Weighted Vest Walk',eq:DB_EQ,c:0},
    {n:'Swim Laps',eq:ALL_EQ,c:0},
  ],
};

/* ===================== SPLIT TEMPLATES =====================
   No template programs the `core` group. Abs work belongs to the abs finisher
   (and to any core block added by hand), so it never doubles up inside the
   day's main work. */
const TEMPLATES = {
  'Push':['chest','shoulders','triceps','chest','shoulders','triceps'],
  'Pull':['back','back','biceps','back','biceps','back'],
  'Legs':['quads','posterior','quads','calves','quads','posterior'],
  'Upper Body':['chest','back','shoulders','biceps','triceps','chest'],
  'Lower Body':['quads','posterior','quads','posterior','calves','quads'],
  'Full Body':['quads','chest','back','shoulders','posterior','biceps'],
  'Conditioning':['cardio','cardio','cardio','cardio'],
  'Chest':['chest','chest','chest','chest','triceps'],
  'Back':['back','back','back','back','biceps'],
  'Shoulders':['shoulders','shoulders','shoulders','shoulders','triceps'],
  'Arms':['biceps','triceps','biceps','triceps','biceps','triceps'],
  'Chest & Back':['chest','back','chest','back','chest','back'],
  'Legs & Shoulders':['quads','shoulders','posterior','shoulders','calves','quads'],
  'Chest & Triceps':['chest','chest','triceps','chest','triceps','chest'],
  'Back & Biceps':['back','back','biceps','back','biceps','back'],
  'Shoulders & Arms':['shoulders','shoulders','biceps','triceps','shoulders','triceps'],
  'Chest & Arms':['chest','chest','triceps','biceps','triceps','biceps'],
};
const WEEKDAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAY_SLOTS = {2:[0,3],3:[0,2,4],4:[0,1,3,4],5:[0,1,2,4,5],6:[0,1,2,3,4,5]};

/* ===================== SET / REP SCHEMES ===================== */
const SCHEME = {
  strength:  {comp:{s:'4',r:'4–6',rest:'3 min'},  iso:{s:'3',r:'6–8',rest:'2 min'}},
  muscle:    {comp:{s:'4',r:'6–8',rest:'2 min'},  iso:{s:'3',r:'10–12',rest:'75 s'}},
  fatloss:   {comp:{s:'3',r:'10–12',rest:'45 s'}, iso:{s:'3',r:'12–15',rest:'30 s'}},
  endurance: {comp:{s:'3',r:'15–20',rest:'45 s'}, iso:{s:'3',r:'15–20',rest:'30 s'}},
  general:   {comp:{s:'3',r:'8–10',rest:'90 s'},  iso:{s:'3',r:'10–12',rest:'60 s'}},
};
const CARDIO_RX = ['8 × 30s / 30s','20 min steady','6 × 40s / 20s','5 rounds','12 min AMRAP'];

/* ===================== CARDIO SCHEDULE =====================
   One week of cardio that covers all four things cardio is good for, rather
   than making you choose. Each goal names what it asks for; each session says
   which goals it serves. The two stack well: zone 2 on a bike, rower or in
   the pool is the longevity base *and* the joint-friendly volume, and a
   loaded climb is the hiking work *and* carried load for bone.
   `pool` is best-first and filtered by your equipment — every session keeps
   at least one option you can do with nothing.                            */
const CARDIO_GOALS = {
  longevity:{ label:'Longevity',        asks:'Zone 2 (incline walking or bike) 3–4× a week, plus 1 VO2 max interval session (assault bike or rowing).' },
  bone:     { label:'Bone & muscle',    asks:'Running, jump rope, or a weighted vest.' },
  hike:     { label:'Hunting & hiking', asks:'Stepmill plus weighted vest or ruck walking.' },
  joints:   { label:'Joint-friendly volume', asks:'Cycling, rowing, or swimming.' },
};
const CARDIO_AIMS = {
  none:{ label:'Off', sub:'lifting only', sessions:[] },
  all:{ label:'All four', sub:'longevity · bone · hiking · joints',
    note:'Five sessions that cover every goal between them. The easy ones take your off days; the two hard ones sit with a lifting day. Three of the five are zone 2 effort, the fourth is the VO2 max session, and the fifth is the impact that bone needs.',
    sessions:[
      {kind:'Zone 2', n:2, rx:'40 min easy', tag:'zone 2', covers:['longevity','joints'],
       cue:'Nose-breathing pace — you could hold a conversation the whole way. Bike, rower or pool keeps the volume off your joints.',
       pool:['Zone 2 Bike','Steady Row','Swim Laps','Incline Treadmill Walk']},
      {kind:'Loaded climb', n:1, long:1, rx:'45–60 min · vest or pack at 10–20% bodyweight', tag:'climb', covers:['hike','bone','longevity'],
       cue:'Still zone 2 — just uphill and carrying weight. Steady steps, no leaning on the rails; add weight before speed.',
       pool:['Stair Climber','Weighted Vest Walk','Ruck Walk','Incline Treadmill Walk']},
      {kind:'VO2 max', n:1, hard:1, rx:'5 × 3 min hard / 3 min easy', tag:'vo2 max', covers:['longevity'],
       cue:'Hard enough that talking is out. Take the full recovery between efforts.',
       pool:['Assault Bike Sprints','Rowing Intervals','Ski Erg Intervals','Sprint Intervals']},
      {kind:'Impact', n:1, hard:1, rx:'20–30 min', tag:'impact', covers:['bone'],
       cue:'Land light and quiet, under your hips. Build the minutes slowly — bone adapts more slowly than lungs.',
       pool:['Steady Run','Jump Rope','Sprint Intervals']},
    ]},
};

/* ===================== PROGRESSION ===================== */
const WEEK_INFO = {
  1:{tag:'Baseline',note:'Pick loads that leave 2–3 reps in the tank. Log each lift so the block learns your numbers.'},
  2:{tag:'Add reps',note:'Add a rep to each set, or a little load wherever last week felt easy. Log it.'},
  3:{tag:'Add load',note:'Heavier now — same reps, more weight, plus an extra set on the main lifts.'},
  4:{tag:'Peak',note:'Top-end effort, 0–1 reps in reserve. Then you have earned the deload.'},
  5:{tag:'Recover',note:'Half the sets at ~60% load. Move well, recover, then restart heavier than Week 1.'},
};
const WEEK_FACTOR = {1:.92,2:.98,3:1.06,4:1.13,5:.5};
const LOAD_FACTOR = {1:1.0,2:1.025,3:1.05,4:1.075,5:0.6};

/* ===================== HOW IT FELT =====================
   Rate a logged lift and the next suggestion for it moves: `f` scales the
   estimated max the loads are drawn from, `rep` shifts the target for lifts
   logged in reps or seconds instead of weight. */
const DIFF_LEVELS = [
  {k:'easy',  label:'Easy',       short:'easy',   f:1.05, rep: 1, note:'next time goes up ~5%'},
  {k:'right', label:'Just right', short:'right',  f:1.00, rep: 0, note:'keep the progression as planned'},
  {k:'hard',  label:'Hard',       short:'hard',   f:0.97, rep: 0, note:'hold this load a little longer'},
  {k:'fail',  label:'Missed reps',short:'missed', f:0.92, rep:-1, note:'next time backs off ~8%'},
];
const DIFF_BY = {}; DIFF_LEVELS.forEach(d=>{ DIFF_BY[d.k]=d; });

/* ===================== WEIGHTS + PERSONALISATION ===================== */
const BW_MULT={bench:1.0,squat:1.4,deadlift:1.7,press:0.6,row:0.9};
const EXP_F={beginner:0.7,intermediate:1.0,advanced:1.25};
const ANCHOR_LIFT={bench:'Barbell Bench Press',squat:'Back Squat',deadlift:'Deadlift',press:'Overhead Press',row:'Barbell Row'};

/* ===================== GOAL METADATA ===================== */
const GOAL_META = {
  muscle:{title:'Hypertrophy Block',sub:'Moderate reps, controlled tempo, enough volume to grow.'},
  strength:{title:'Strength Block',sub:'Heavy compounds, low reps, long rest. Quality over quantity.'},
  fatloss:{title:'Lean-Out Block',sub:'Shorter rest, higher density, conditioning built in.'},
  endurance:{title:'Engine Builder',sub:'High reps and intervals to grow work capacity.'},
  general:{title:'All-Round Block',sub:'A balanced week of strength, size and conditioning.'},
};

/* ===================== RENDER COPY ===================== */
const restNotes=['Rest — sleep & eat','Active recovery — walk','Full rest day','Mobility & easy cardio','Rest — let it grow'];

/* ===================== MUSCLE TARGETS =====================
   Specific regions you can bolt an extra block onto, each mapped to the
   library movements that hit it best. Pools are filtered by the user's
   equipment at render time, so a target only appears if it's trainable. */
const MUSCLE_TARGETS = {
  'Desk-work support':[
    {label:'Lower back (from sitting)', desk:1, names:['Glute Bridge','Hip Thrust','Superman Hold','Hyperextension','Dead Bug','Cable Pull-Through','Plank','Romanian Deadlift']},
    {label:'Posture & rounded shoulders', desk:1, names:['Face Pull','Rear Delt Fly','Prone Y-Raise','Chest-Supported Row','Inverted Row','Seated Cable Row']},
    {label:'Neck & upper back', desk:1, names:['Face Pull','Prone Y-Raise','Superman Hold','Chest-Supported Row','Upright Row']},
    {label:'Hips & hip flexors', desk:1, names:['Reverse Lunge','Bulgarian Split Squat','Walking Lunge','Step-Up','Glute Bridge','Frog Pump','Single-Leg Hip Thrust']},
    {label:'Knee support', desk:1, names:['Step-Up','Reverse Lunge','Leg Extension','Wall Sit','Sissy Squat','Single-Leg Calf Raise','Tibialis Raise','Glute Bridge']},
    {label:'Wrists & forearms', desk:1, names:['Hammer Curl','Zottman Curl','Towel Curl','Farmer Carry','Renegade Row']},
    {label:'Core & trunk stability', desk:1, names:['Plank','Side Plank','Dead Bug','Pallof Press','Hollow Body Hold','Farmer Carry']},
  ],
  /* Anterior pelvic tilt: the pelvis pulled forward by hip flexors and the
     lower back, with too little pull back from glutes, hamstrings and the deep
     core. Each lever is a slot. The full block takes one move from every slot,
     so you never get three glute moves; each lever is also on offer alone.
     A slot's cue is the posterior-tilt instruction that makes the move count. */
  'Anterior pelvic tilt':[
    {label:'Full APT block', apt:1, slots:['glutes','hams','core','split']},
    {label:'APT · Glutes (tuck the pelvis)', apt:1, slots:['glutes']},
    {label:'APT · Hamstrings', apt:1, slots:['hams']},
    {label:'APT · Deep core (posterior tilt)', apt:1, slots:['core']},
    {label:'APT · Hip-flexor length (split stance)', apt:1, slots:['split']},
  ],
  /* Toe walking: tight calves and Achilles hold the heel up, and habit lands
     the toes first. The stretches buy back ankle bend; the shin work and gait
     drills make heel-first the easy way to walk. */
  /* Hip pain: where it hurts points to what usually helps, so each option is
     one location. Front: hip-flexor length, glutes, groin, control. Outside:
     the side glute, built without stretches that press on the sore spot.
     Back: glute stretches and gradual hinge loading. Deep pinch: strength and
     control while staying out of the range that pinches. */
  'Hip pain':[
    /* A set daily routine for deep gluteal / piriformis tightness from sitting:
       exact moves and doses, every day, about 10 minutes. */
    {label:'Hip pain · Deep glute / piriformis — daily', hip:1, daily:1, slots:['piriFig4','piriBall','piriHipFlex']},
    /* Its strength half, for training days: the weak bridge (glute max), the
       side glute and deep rotators that sit around the piriformis, the back of
       the hip under load, and the deep core that pulls against the tilt. */
    {label:'Hip pain · Deep glute / piriformis — strengthen', hip:1, slots:['piriBridge','piriRotate','piriHinge','piriCore']},
    {label:'Hip pain · Front of hip / groin', hip:1, slots:['hipflex','hipglutes','adductor','hipcore']},
    {label:'Hip pain · Outside of hip', hip:1, slots:['abduct','singleleg','lateral']},
    {label:'Hip pain · Back of hip / buttock', hip:1, slots:['glutestretch','hipglutes','hinge']},
    {label:'Hip pain · Deep pinch in the joint', hip:1, slots:['painfree','hipglutes','hipcore']},
  ],
  /* Neck and back: the neck responds to deep-flexor endurance and a strong
     upper back that holds the head over the shoulders; back popping without
     pain is usually stiffness, so it gets daily range plus the trunk muscles
     that hold the spine steady. */
  'Neck & back':[
    {label:'Neck & back · Daily mobility', nb:1, daily:1, slots:['nbTuck','nbCatCow','nbThoracic','nbAngel']},
    {label:'Neck · Strengthen', nb:1, slots:['neckDeep','neckScap','neckRow','neckCarry']},
    {label:'Back · Popping & stiffness', nb:1, slots:['backMobility','backStability','backExt','backRow']},
  ],
  /* A set program for limited internal rotation in the right hip: A + B every
     day (the `routine` installs both), C on three days a week. `fixed` means
     every move is placed as written, whatever else the day holds. */
  'Right hip (IR restriction)':[
    {label:'Right Hip Mobility (IR Restriction)', irhip:1, routine:['Right hip IR · A+B Mobility & control','Right hip IR · C Strength']},
    {label:'Right hip IR · A+B Mobility & control', irhip:1, part:1, daily:1, fixed:1,
     slots:['irBall','irProne','irDrop','ir9090','irRot','irFrog','irSeated','irLift']},
    {label:'Right hip IR · C Strength', irhip:1, part:1, perWeek:3, prefer:/leg|lower|pull|back|posterior|glute|ham/i, fixed:1,
     slots:['irWalk','irAbd','irBridge','irBug']},
  ],
  'Toe walking':[
    {label:'Toe walking · Calf & Achilles stretches', toe:1, slots:['gastroc','soleus','ankle']},
    {label:'Toe walking · Full block', toe:1, slots:['gastroc','soleus','ankle','shin']},
    {label:'Toe walking · Shins & heel-first walking', toe:1, slots:['shin']},
  ],
  Chest:[
    {label:'Upper chest', names:['Incline Barbell Bench Press','Incline Dumbbell Press','Incline Dumbbell Fly','Decline Push-Up']},
    {label:'Lower chest', names:['Decline Barbell Bench Press','Dips','Incline Push-Up','Cable Crossover']},
    {label:'Inner chest', names:['Cable Crossover','Chest Fly Machine','Dumbbell Fly','Machine Chest Press','Diamond Push-Up']},
    {label:'Outer chest', names:['Wide-Grip Push-Up','Archer Push-Up','Dumbbell Fly','Barbell Bench Press']},
  ],
  Back:[
    {label:'Lats (width)', names:['Pull-Up','Lat Pulldown','Straight-Arm Pulldown','Chin-Up']},
    {label:'Inner back (thickness)', names:['Seated Cable Row','Chest-Supported Row','T-Bar Row','Barbell Row','Pendlay Row','Inverted Row']},
    {label:'Upper back & traps', names:['Face Pull','Prone Y-Raise','Upright Row','Rack Pull','Renegade Row']},
    {label:'Lower back', names:['Superman Hold','Hyperextension','Good Morning','Deadlift','Rack Pull']},
  ],
  Shoulders:[
    {label:'Front delts', names:['Front Raise','Overhead Press','Arnold Press','Machine Shoulder Press','Pike Push-Up']},
    {label:'Side delts', names:['Lateral Raise','Cable Lateral Raise','Upright Row','Dumbbell Shoulder Press']},
    {label:'Rear delts', names:['Rear Delt Fly','Face Pull','Prone Y-Raise','Chest-Supported Row']},
  ],
  Arms:[
    {label:'Biceps peak', names:['Incline Dumbbell Curl','Concentration Curl','Chin-Up','Hammer Curl']},
    {label:'Biceps overall', names:['Barbell Curl','EZ-Bar Curl','Preacher Curl','Cable Curl','Dumbbell Curl','Bodyweight Bicep Curl','Underhand Inverted Row']},
    {label:'Triceps long head', names:['Cable Overhead Extension','Single-Arm Overhead Extension','Overhead DB Extension','Skull Crusher','Bodyweight Skull Crusher']},
    {label:'Triceps lateral head', names:['Triceps Pushdown','Dumbbell Kickback','Diamond Push-Up','Close-Grip Bench Press','Bench Dip']},
    {label:'Forearms & grip', names:['Hammer Curl','Zottman Curl','Farmer Carry','Towel Curl','Renegade Row']},
  ],
  Legs:[
    {label:'Quads', names:['Leg Extension','Hack Squat','Front Squat','Pause Squat','Sissy Squat','Wall Sit']},
    {label:'Glutes', names:['Hip Thrust','Single-Leg Hip Thrust','Frog Pump','Cable Pull-Through','Glute Bridge','Reverse Lunge']},
    {label:'Hamstrings', names:['Romanian Deadlift','Lying Leg Curl','Seated Leg Curl','Nordic Curl','Single-Leg RDL','Good Morning']},
    {label:'Inner thigh', names:['Sumo Deadlift','Goblet Squat','Bulgarian Split Squat','Walking Lunge']},
    {label:'Calves', names:['Standing Calf Raise','Seated Calf Raise','Leg Press Calf Raise','Donkey Calf Raise','Single-Leg Calf Raise','Calf Jump']},
    {label:'Ankles & shins', names:['Tibialis Raise','Farmer Walk on Toes','Single-Leg Calf Raise']},
  ],
  Core:[
    {label:'Upper abs', names:['Weighted Sit-Up','Cable Crunch','V-Up','Bicycle Crunch']},
    {label:'Lower abs', names:['Hanging Leg Raise','Hanging Knee Raise','Toes-to-Bar','Dead Bug','Hollow Body Hold']},
    {label:'Obliques', names:['Russian Twist','Side Plank','Bicycle Crunch','Pallof Press','Mountain Climber']},
    {label:'Core stability', names:['Plank','Ab Wheel Rollout','Pallof Press','Hollow Body Hold','Farmer Carry','Bear Crawl']},
  ],
  Conditioning:[
    {label:'Conditioning finisher', names:['Burpees','Jump Rope','Battle Ropes','Kettlebell Swings','High Knees','Jumping Jacks','Mountain Climber']},
  ],
};

/* The levers a multi-part block is built from (see MUSCLE_TARGETS): each is a
   pool of moves plus the cue that makes them count. */
const BLOCK_SLOTS = {
  glutes:{ names:['Glute Bridge','Hip Thrust','Single-Leg Hip Thrust','Frog Pump','Cable Pull-Through'],
    cue:'Tuck your tailbone and pull your ribs down before you lift. Drive through the heels and finish with a glute squeeze — the low back should not arch at the top.' },
  hams:{ names:['Romanian Deadlift','Lying Leg Curl','Seated Leg Curl','Nordic Curl','Single-Leg RDL'],
    cue:'Keep your ribs stacked over your pelvis the whole rep. Hinge or curl without letting the low back arch — the stretch belongs in the hamstrings.' },
  core:{ names:['Dead Bug','Reverse Crunch','Hollow Body Hold','Plank','Hanging Knee Raise','Ab Wheel Rollout'],
    cue:'Flatten your low back into the floor (or tuck the pelvis in a plank) and keep it there for the whole set. If it starts to arch, shorten the lever.' },
  split:{ names:['Bulgarian Split Squat','Reverse Lunge','Walking Lunge'],
    cue:'Tuck the pelvis on the back leg until you feel a stretch across the front of that hip, and keep it tucked as you lower.' },
  gastroc:{ names:['Wall Calf Stretch','Towel Calf Stretch','Eccentric Heel Drop'],
    cue:'Back knee straight, heel pinned to the floor, toes pointing straight ahead. Ease in until you feel the upper calf, then hold and breathe — no bouncing.' },
  soleus:{ names:['Bent-Knee Calf Stretch','Deep Squat Hold'],
    cue:'Bend the knee and keep the heel down: the stretch moves low, toward the Achilles. That lower calf is what pulls you up onto your toes.' },
  ankle:{ names:['Knee-to-Wall Ankle Mobilization','Deep Squat Hold'],
    cue:'Drive the knee forward over the toes without the heel lifting. Every bit of ankle bend you gain is room to land heel-first.' },
  shin:{ names:['Tibialis Raise','Heel Walks','Heel-to-Toe Walk'],
    cue:'Your shins lift the front of the foot. Land on the heel and roll through to the toes — strong shins make that the easy way to walk.' },
  hipflex:{ names:['Half-Kneeling Hip Flexor Stretch'],
    cue:'Tuck the pelvis on the kneeling side first, then shift forward an inch. The stretch belongs at the front of the hip — if you feel it in the low back, tuck more and lean less.' },
  hipglutes:{ names:['Glute Bridge','Single-Leg Hip Thrust','Hip Thrust','Frog Pump'],
    cue:'Drive through the heels and finish with a glute squeeze, ribs down. Stop short of any position that pinches.' },
  adductor:{ names:['Copenhagen Plank','Side Plank'],
    cue:'Start short — knee on the bench — and build toward the foot. The inner thigh should feel worked, never sharp.' },
  hipcore:{ names:['Dead Bug','Pallof Press','Side Plank'],
    cue:'Keep the pelvis still while the arms and legs move. That control is what stops the hip taking strain it shouldn\'t.' },
  abduct:{ names:['Side-Lying Hip Abduction','Clamshell','Side Plank'],
    cue:'Lead with the heel, toes angled slightly down, and lift only as high as you can without rolling back. Slow up, slower down.' },
  singleleg:{ names:['Step-Up','Single-Leg RDL','Single-Leg Hip Thrust'],
    cue:'Keep the pelvis level over the standing leg — no dropping or hitching the other hip.' },
  lateral:{ names:['Banded Lateral Walk','Side Plank'],
    cue:'Stay a little low with toes forward and keep tension on the band the whole time. Short, controlled steps.' },
  glutestretch:{ names:['Figure-4 Stretch','90/90 Hip Switch'],
    cue:'Ease in and breathe. A stretch in the buttock is the goal — a sharp or burning pain running down the leg is not.' },
  hinge:{ names:['Romanian Deadlift','Single-Leg RDL','Cable Pull-Through'],
    cue:'Push the hips back with a long spine. Load the back of the hip gradually — light and slow before heavy.' },
  painfree:{ names:['90/90 Hip Switch','Half-Kneeling Hip Flexor Stretch'],
    cue:'Move only through range that doesn\'t pinch. While it\'s irritable, skip deep squats and knee-to-chest positions.' },
  /* A slot's `rx` overrides the move's own prescription — the daily routine
     doses these differently from the general blocks. */
  piriFig4:{ names:['Figure-4 Stretch'], rx:{s:'2',r:'45–60 s / side',rest:'15 s',tag:'stretch'},
    cue:'Pull the thigh toward your chest until the deep buttock stretches. This is the position that eases the ache — it lengthens exactly the muscles that sitting keeps compressed and short.' },
  piriBall:{ names:['Lacrosse Ball Glute Release'], rx:{s:'1',r:'60–90 s / side',rest:'—',tag:'release'},
    cue:'Sit on the ball just above and outside the sit bone and stay on the tender spots, 60–90 seconds. Then cross that leg over the other knee to deepen the pressure. Tender is fine; sharp, burning or tingling down the leg is not.' },
  piriHipFlex:{ names:['Half-Kneeling Hip Flexor Stretch'], rx:{s:'2',r:'45 s / side',rest:'15 s',tag:'stretch'},
    cue:'Squeeze the glute on the kneeling side before you shift forward. It deepens the stretch and works against the anterior tilt that feeds this.' },
  /* The strengthening half of the deep-glute plan. */
  piriBridge:{ names:['Glute Bridge','Single-Leg Hip Thrust','Hip Thrust','Frog Pump'],
    cue:'This is the weak bridge you noticed: rebuild it. Ribs down, tailbone tucked, drive through the heels and hold the squeeze for a second at the top. Graduate from both legs to one leg to a loaded thrust as the reps get easy.' },
  piriRotate:{ names:['Clamshell','Side-Lying Hip Abduction','Banded Lateral Walk'],
    cue:'These train the side glute and the deep rotators around the piriformis, so it stops doing their job and stops tightening up. Keep the pelvis stacked, move slowly, and feel it at the side and back of the hip, not the front.' },
  piriHinge:{ names:['Romanian Deadlift','Single-Leg RDL','Cable Pull-Through'],
    cue:'Load the back of the hip with a long spine and the ribs stacked. Normal training is fine as long as it doesn\'t raise the ache: start light, add weight only when the next day feels the same or better.' },
  piriCore:{ names:['Dead Bug','Reverse Crunch','Pallof Press'],
    cue:'Flatten the low back and keep it there. A stronger deep core holds the pelvis out of the forward tilt that keeps the deep glute under strain.' },
  /* Neck & back */
  nbTuck:{ names:['Chin Tuck'], rx:{s:'1',r:'10 (5 s hold)',rest:'—',tag:'control'},
    cue:'Glide the chin straight back, making a double chin, without tipping the head down. Hold 5 seconds. It undoes the head-forward posture that screens pull you into.' },
  nbCatCow:{ names:['Cat-Cow'], rx:{s:'1',r:'10 slow',rest:'—',tag:'mobility'},
    cue:'Move one segment at a time, tailbone first and head last. Slow is the point: take the whole spine through its range so it stops feeling locked up.' },
  nbThoracic:{ names:['Foam Roller Thoracic Extension'], rx:{s:'1',r:'10',rest:'—',tag:'mobility'},
    cue:'Roller under the mid-back, hands supporting the head, hips down. Arch back over it, then shift the roller an inch and repeat. Keep it off the lower back.' },
  nbAngel:{ names:['Wall Angel'], rx:{s:'1',r:'10',rest:'—',tag:'control'},
    cue:'Back of the head, upper back and backside on the wall, ribs down. Slide only as high as you can keep everything touching.' },
  neckDeep:{ names:['Chin Tuck','Neck Isometric Hold'],
    cue:'The deep neck muscles are built for endurance, not big loads: steady holds, no straining, no pain. Keep the chin slightly tucked throughout.' },
  neckScap:{ names:['Wall Angel','Band Pull-Apart','Prone Y-Raise','Face Pull'],
    cue:'Set the shoulders down and back before each rep, and keep them away from the ears. These muscles hold the head over the shoulders so the neck doesn\'t have to.' },
  neckRow:{ names:['Chest-Supported Row','Seated Cable Row','One-Arm Dumbbell Row','Inverted Row'],
    cue:'Lead with the elbows and squeeze the shoulder blades together at the end. Keep the neck long: don\'t jut the chin to finish the rep.' },
  neckCarry:{ names:['Farmer Carry'],
    cue:'Heavy in the hands, tall through the crown, shoulders down and back. The upper traps work to hold the load without shrugging.' },
  backMobility:{ names:['Cat-Cow','Foam Roller Thoracic Extension'],
    cue:'Popping without pain is usually just a stiff joint moving. Taking the spine through its range every day tends to make it feel looser and pop less.' },
  backStability:{ names:['Bird Dog','Side Plank','Dead Bug'],
    cue:'Keep the spine still while the arms and legs move: brace lightly and breathe. Steady trunk muscles take the strain off the joints that pop.' },
  backExt:{ names:['Superman Hold','Hyperextension','Prone Y-Raise'],
    cue:'Long spine, glutes squeezed, lift from the upper back without cranking the neck up. Stop the rep before the low back pinches.' },
  /* Right hip internal rotation. `sec` heads a run of moves within the block,
     `side` says which side to do. */
  irBall:{ names:['Lacrosse Ball Glute Release'], sec:'A · Mobility', side:'right', rx:{s:'1',r:'90 s',rest:'—',tag:'release'},
    cue:'Ball in the deep glute, between the sit bone and the bony point on the outside of the hip. Stay on tender spots and breathe; tender is fine, sharp or tingling down the leg is not.' },
  irProne:{ names:['Prone Hip Internal Rotation Stretch'], sec:'A · Mobility', side:'both', rx:{s:'3',r:'45 s',rest:'15 s',tag:'stretch'},
    cue:'Face down, knees together and bent to 90°. Let both feet fall outward under their own weight; that turns the hips inward. Relax into it rather than pushing.' },
  irDrop:{ names:['Supine Knee Drop-In'], sec:'A · Mobility', side:'right', rx:{s:'3',r:'30 s',rest:'15 s',tag:'stretch'},
    cue:'On your back, feet wider than the hips. Let the right knee fall inward toward the floor and hold; keep the pelvis flat rather than rolling with it.' },
  ir9090:{ names:['90/90 Hold'], sec:'A · Mobility', side:'right', rx:{s:'2',r:'45 s',rest:'15 s',tag:'stretch'},
    cue:'Right leg is the back leg: knee bent 90°, shin out to the side. Sit tall and lean gently toward the back knee until you feel the hip turn in.' },
  irRot:{ names:['Slow Hip Rotation Stretch'], sec:'A · Mobility', side:'right', rx:{s:'3',r:'30–45 s',rest:'15 s',tag:'stretch'},
    cue:'Bring the right knee in and across while slowly straightening the leg, then hold the end position. Ease into it; don\'t force a pop.' },
  irFrog:{ names:['Frog Stretch'], sec:'A · Mobility', side:'both', rx:{s:'2',r:'45 s',rest:'15 s',tag:'stretch'},
    cue:'Knees wide on a soft surface, shins parallel, then rock the hips back until the inner thighs stretch. Back off before the groin pinches.' },
  irSeated:{ names:['Seated Active Internal Rotation'], sec:'B · Active control', side:'right', rx:{s:'2',r:'10 (5 s hold)',rest:'20 s',tag:'control'},
    cue:'Sit tall, knee at 90° and thigh still. Swing the foot outward using only the hip muscles, with no hands, and hold 5 seconds at the end. This is how you own the new range.' },
  irLift:{ names:['90/90 Lift-Off'], sec:'B · Active control', side:'right', rx:{s:'2',r:'8',rest:'20 s',tag:'control'},
    cue:'In 90/90 with the right leg behind, sit tall and lift the back foot off the floor without leaning away. A small lift with control beats a big one with a lean.' },
  irWalk:{ names:['Banded Lateral Walk'], sec:'C · Strength', rx:{s:'3',r:'15 each way',rest:'45 s',tag:'strength'},
    cue:'Band above the knees, stay a little low, toes forward. 15 steps one way, 15 back, with tension on the band the whole time.' },
  irAbd:{ names:['Side-Lying Hip Abduction'], sec:'C · Strength', side:'right', rx:{s:'3',r:'15',rest:'45 s',tag:'strength'},
    cue:'Lie on your left side and lift the right leg, heel leading and toes angled slightly down. Don\'t let the hips roll back.' },
  irBridge:{ names:['Glute Bridge'], sec:'C · Strength', rx:{s:'3',r:'12 (2 s squeeze)',rest:'45 s',tag:'strength'},
    cue:'Ribs down, drive through the heels, and squeeze the glutes for 2 seconds at the top of every rep.' },
  irBug:{ names:['Dead Bug'], sec:'C · Strength', rx:{s:'3',r:'8 / side',rest:'45 s',tag:'strength'},
    cue:'Low back flat to the floor the whole set. Reach the opposite arm and leg slowly and stop before the back arches.' },
  backRow:{ names:['Chest-Supported Row','Seated Cable Row','One-Arm Dumbbell Row','Inverted Row'],
    cue:'Pull the shoulder blades back and down, chest tall. A strong mid-back holds the stiff stretch between the shoulder blades in better shape.' }
};
/* Resolve slot keys into the slot objects, and give every slotted target the
   full list of its movements as `names`, which the rest of the app reads. */
for(const cat in MUSCLE_TARGETS) MUSCLE_TARGETS[cat].forEach(t=>{
  if(!t.slots) return;
  t.slots = t.slots.map(k=>BLOCK_SLOTS[k]);
  t.names = [...new Set(t.slots.flatMap(x=>x.names))];
});
/* A routine is several blocks installed together; its movements are theirs. */
for(const cat in MUSCLE_TARGETS) MUSCLE_TARGETS[cat].forEach(t=>{
  if(!t.routine) return;
  const parts=t.routine.map(l=>MUSCLE_TARGETS[cat].filter(x=>x.label===l)[0]).filter(Boolean);
  t.names=[...new Set(parts.flatMap(x=>x.names))];
});
