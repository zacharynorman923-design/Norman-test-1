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
  ],
  shoulders:[
    {n:'Overhead Press',eq:G,c:1,w:['press',1.0,'barbell']},
    {n:'Dumbbell Shoulder Press',eq:DB_EQ,c:1,w:['press',0.72,'dumbbell']},
    {n:'Pike Push-Up',eq:ALL_EQ,c:1},
    {n:'Lateral Raise',eq:DB_EQ,c:0,w:['press',0.28,'dumbbell']},
    {n:'Face Pull',eq:DB_EQ,c:0,w:['press',0.55,'machine']},
    {n:'Handstand Hold',eq:ALL_EQ,c:0},
  ],
  biceps:[
    {n:'Barbell Curl',eq:G,c:0,w:['bench',0.30,'barbell']},
    {n:'Dumbbell Curl',eq:DB_EQ,c:0,w:['bench',0.34,'dumbbell']},
    {n:'Hammer Curl',eq:DB_EQ,c:0,w:['bench',0.36,'dumbbell']},
    {n:'Chin-Up',eq:ALL_EQ,c:1},{n:'Underhand Inverted Row',eq:ALL_EQ,c:1},
  ],
  triceps:[
    {n:'Close-Grip Bench Press',eq:G,c:1,w:['bench',0.85,'barbell']},
    {n:'Triceps Pushdown',eq:G,c:0,w:['bench',0.45,'machine']},
    {n:'Overhead DB Extension',eq:DB_EQ,c:0,w:['bench',0.30,'dumbbell']},
    {n:'Bench Dip',eq:ALL_EQ,c:0},{n:'Diamond Push-Up',eq:ALL_EQ,c:1},
  ],
  quads:[
    {n:'Back Squat',eq:G,c:1,w:['squat',1.0,'barbell']},
    {n:'Goblet Squat',eq:DB_EQ,c:1,w:['squat',0.40,'single']},
    {n:'Leg Press',eq:G,c:1,w:['squat',2.0,'machine']},
    {n:'Walking Lunge',eq:ALL_EQ,c:1,w:['squat',0.50,'dumbbell']},
    {n:'Bulgarian Split Squat',eq:ALL_EQ,c:1,w:['squat',0.40,'dumbbell']},
    {n:'Bodyweight Squat',eq:ALL_EQ,c:0},{n:'Jump Squat',eq:ALL_EQ,c:0},
  ],
  posterior:[
    {n:'Romanian Deadlift',eq:DB_EQ,c:1,w:['deadlift',0.75,'barbell']},
    {n:'Hip Thrust',eq:DB_EQ,c:1,w:['deadlift',1.05,'barbell']},
    {n:'Lying Leg Curl',eq:G,c:0,w:['deadlift',0.35,'machine']},
    {n:'Single-Leg RDL',eq:ALL_EQ,c:1,w:['deadlift',0.28,'dumbbell']},
    {n:'Glute Bridge',eq:ALL_EQ,c:0},{n:'Nordic Curl',eq:ALL_EQ,c:1},
  ],
  calves:[
    {n:'Standing Calf Raise',eq:DB_EQ,c:0,w:['squat',0.55,'machine']},
    {n:'Single-Leg Calf Raise',eq:ALL_EQ,c:0},
  ],
  core:[
    {n:'Plank',eq:ALL_EQ,c:0},{n:'Hanging Leg Raise',eq:ALL_EQ,c:0},
    {n:'Cable Crunch',eq:G,c:0,w:['bench',0.45,'machine']},
    {n:'Dead Bug',eq:ALL_EQ,c:0},{n:'Russian Twist',eq:ALL_EQ,c:0},{n:'Ab Wheel Rollout',eq:ALL_EQ,c:0},
  ],
  cardio:[
    {n:'Rowing Intervals',eq:G,c:0},{n:'Assault Bike Sprints',eq:G,c:0},{n:'Incline Treadmill Walk',eq:G,c:0},
    {n:'Kettlebell Swings',eq:DB_EQ,c:0},{n:'Dumbbell Thrusters',eq:DB_EQ,c:1},{n:'Burpees',eq:ALL_EQ,c:1},
    {n:'Jump Rope',eq:ALL_EQ,c:0},{n:'High Knees',eq:ALL_EQ,c:0},{n:'Shuttle Runs',eq:ALL_EQ,c:0},
  ],
};

/* ===================== SPLIT TEMPLATES ===================== */
const TEMPLATES = {
  'Push':['chest','shoulders','triceps','chest','shoulders','triceps'],
  'Pull':['back','back','biceps','back','biceps','core'],
  'Legs':['quads','posterior','quads','calves','core','posterior'],
  'Upper Body':['chest','back','shoulders','biceps','triceps','chest'],
  'Lower Body':['quads','posterior','quads','posterior','calves','core'],
  'Full Body':['quads','chest','back','shoulders','posterior','core'],
  'Conditioning':['cardio','cardio','core','cardio'],
  'Chest':['chest','chest','chest','chest','core'],
  'Back':['back','back','back','back','core'],
  'Shoulders':['shoulders','shoulders','shoulders','shoulders','core'],
  'Arms':['biceps','triceps','biceps','triceps','biceps','triceps'],
  'Chest & Back':['chest','back','chest','back','chest','back'],
  'Legs & Shoulders':['quads','shoulders','posterior','shoulders','calves','core'],
  'Chest & Triceps':['chest','chest','triceps','chest','triceps','core'],
  'Back & Biceps':['back','back','biceps','back','biceps','core'],
  'Shoulders & Arms':['shoulders','shoulders','biceps','triceps','shoulders','core'],
  'Chest & Arms':['chest','chest','triceps','biceps','triceps','core'],
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
