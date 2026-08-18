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
    {n:'Pallof Press',eq:G,c:0,w:['bench',0.25,'machine']},
    {n:'Weighted Sit-Up',eq:DB_EQ,c:0,w:['bench',0.25,'single']},
    {n:'Farmer Carry',eq:DB_EQ,c:0},
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
