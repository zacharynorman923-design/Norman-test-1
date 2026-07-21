// Exercise database for the workout routine scheduler.
//
// Each exercise is tagged with the muscle group it primarily trains and the
// equipment it requires. Equipment tiers are additive: "bodyweight" moves need
// nothing, "dumbbell" moves need dumbbells, and "gym" moves need a full gym.
// When a user selects a tier we include that tier and every simpler one.

const EQUIPMENT_TIERS = {
  bodyweight: ['bodyweight'],
  dumbbell: ['bodyweight', 'dumbbell'],
  gym: ['bodyweight', 'dumbbell', 'gym'],
};

// group: chest | back | legs | shoulders | arms | core | cardio
const EXERCISES = [
  // ---- Chest ----
  { name: 'Barbell Bench Press', group: 'chest', equipment: 'gym', compound: true },
  { name: 'Incline Barbell Press', group: 'chest', equipment: 'gym', compound: true },
  { name: 'Dumbbell Bench Press', group: 'chest', equipment: 'dumbbell', compound: true },
  { name: 'Incline Dumbbell Press', group: 'chest', equipment: 'dumbbell', compound: true },
  { name: 'Dumbbell Chest Fly', group: 'chest', equipment: 'dumbbell', compound: false },
  { name: 'Push-Up', group: 'chest', equipment: 'bodyweight', compound: true },
  { name: 'Incline Push-Up', group: 'chest', equipment: 'bodyweight', compound: true },

  // ---- Back ----
  { name: 'Deadlift', group: 'back', equipment: 'gym', compound: true },
  { name: 'Barbell Row', group: 'back', equipment: 'gym', compound: true },
  { name: 'Lat Pulldown', group: 'back', equipment: 'gym', compound: true },
  { name: 'Seated Cable Row', group: 'back', equipment: 'gym', compound: true },
  { name: 'One-Arm Dumbbell Row', group: 'back', equipment: 'dumbbell', compound: true },
  { name: 'Dumbbell Romanian Deadlift', group: 'back', equipment: 'dumbbell', compound: true },
  { name: 'Pull-Up', group: 'back', equipment: 'bodyweight', compound: true },
  { name: 'Inverted Row', group: 'back', equipment: 'bodyweight', compound: true },
  { name: 'Superman Hold', group: 'back', equipment: 'bodyweight', compound: false },

  // ---- Legs ----
  { name: 'Barbell Back Squat', group: 'legs', equipment: 'gym', compound: true },
  { name: 'Leg Press', group: 'legs', equipment: 'gym', compound: true },
  { name: 'Romanian Deadlift', group: 'legs', equipment: 'gym', compound: true },
  { name: 'Leg Curl', group: 'legs', equipment: 'gym', compound: false },
  { name: 'Leg Extension', group: 'legs', equipment: 'gym', compound: false },
  { name: 'Goblet Squat', group: 'legs', equipment: 'dumbbell', compound: true },
  { name: 'Dumbbell Lunge', group: 'legs', equipment: 'dumbbell', compound: true },
  { name: 'Dumbbell Bulgarian Split Squat', group: 'legs', equipment: 'dumbbell', compound: true },
  { name: 'Dumbbell Calf Raise', group: 'legs', equipment: 'dumbbell', compound: false },
  { name: 'Bodyweight Squat', group: 'legs', equipment: 'bodyweight', compound: true },
  { name: 'Walking Lunge', group: 'legs', equipment: 'bodyweight', compound: true },
  { name: 'Glute Bridge', group: 'legs', equipment: 'bodyweight', compound: false },

  // ---- Shoulders ----
  { name: 'Overhead Barbell Press', group: 'shoulders', equipment: 'gym', compound: true },
  { name: 'Cable Lateral Raise', group: 'shoulders', equipment: 'gym', compound: false },
  { name: 'Seated Dumbbell Press', group: 'shoulders', equipment: 'dumbbell', compound: true },
  { name: 'Dumbbell Lateral Raise', group: 'shoulders', equipment: 'dumbbell', compound: false },
  { name: 'Dumbbell Rear Delt Fly', group: 'shoulders', equipment: 'dumbbell', compound: false },
  { name: 'Pike Push-Up', group: 'shoulders', equipment: 'bodyweight', compound: true },

  // ---- Arms ----
  { name: 'Barbell Curl', group: 'arms', equipment: 'gym', compound: false },
  { name: 'Tricep Rope Pushdown', group: 'arms', equipment: 'gym', compound: false },
  { name: 'Dumbbell Bicep Curl', group: 'arms', equipment: 'dumbbell', compound: false },
  { name: 'Hammer Curl', group: 'arms', equipment: 'dumbbell', compound: false },
  { name: 'Dumbbell Overhead Tricep Extension', group: 'arms', equipment: 'dumbbell', compound: false },
  { name: 'Dumbbell Skull Crusher', group: 'arms', equipment: 'dumbbell', compound: false },
  { name: 'Diamond Push-Up', group: 'arms', equipment: 'bodyweight', compound: false },
  { name: 'Chair Dip', group: 'arms', equipment: 'bodyweight', compound: false },

  // ---- Core ----
  { name: 'Cable Crunch', group: 'core', equipment: 'gym', compound: false },
  { name: 'Hanging Leg Raise', group: 'core', equipment: 'bodyweight', compound: false },
  { name: 'Plank', group: 'core', equipment: 'bodyweight', compound: false },
  { name: 'Bicycle Crunch', group: 'core', equipment: 'bodyweight', compound: false },
  { name: 'Russian Twist', group: 'core', equipment: 'bodyweight', compound: false },
  { name: 'Mountain Climber', group: 'core', equipment: 'bodyweight', compound: false },

  // ---- Cardio / Conditioning ----
  { name: 'Treadmill Intervals', group: 'cardio', equipment: 'gym', compound: true },
  { name: 'Rowing Machine', group: 'cardio', equipment: 'gym', compound: true },
  { name: 'Stationary Bike', group: 'cardio', equipment: 'gym', compound: true },
  { name: 'Kettlebell Swing', group: 'cardio', equipment: 'dumbbell', compound: true },
  { name: 'Burpees', group: 'cardio', equipment: 'bodyweight', compound: true },
  { name: 'Jumping Jacks', group: 'cardio', equipment: 'bodyweight', compound: true },
  { name: 'High Knees', group: 'cardio', equipment: 'bodyweight', compound: true },
  { name: 'Jump Rope', group: 'cardio', equipment: 'bodyweight', compound: true },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EXERCISES, EQUIPMENT_TIERS };
}
