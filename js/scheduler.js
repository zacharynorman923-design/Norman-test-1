// Workout schedule generator.
//
// Given a user's goal, experience, available equipment, days per week and
// preferred session length, this builds a structured weekly training plan:
// which split to run, which day trains what, and the exact exercises with
// sets, reps and rest prescriptions tuned to the goal.

// Goal-driven training parameters. reps/rest/sets differ because training for
// max strength, muscle size, fat loss and endurance are genuinely different.
const GOAL_PROFILES = {
  strength: {
    label: 'Build Strength',
    blurb: 'Heavy compound lifts, low reps, long rest. Move serious weight.',
    compound: { sets: '4-5', reps: '3-5', rest: '3 min' },
    isolation: { sets: '3', reps: '6-8', rest: '2 min' },
    cardioPerWeek: 1,
    cardioNote: '15-20 min easy zone-2 for recovery',
    exercisesPerDay: 5,
    compoundBias: 0.75,
  },
  muscle: {
    label: 'Build Muscle',
    blurb: 'Moderate weight, higher volume, controlled tempo. Grow.',
    compound: { sets: '3-4', reps: '8-12', rest: '90 sec' },
    isolation: { sets: '3', reps: '10-15', rest: '60 sec' },
    cardioPerWeek: 1,
    cardioNote: '20 min moderate cardio to stay lean',
    exercisesPerDay: 6,
    compoundBias: 0.55,
  },
  fatloss: {
    label: 'Lose Fat',
    blurb: 'Full-body circuits, short rest, cardio finishers. Burn.',
    compound: { sets: '3', reps: '12-15', rest: '45 sec' },
    isolation: { sets: '3', reps: '15-20', rest: '30 sec' },
    cardioPerWeek: 3,
    cardioNote: '20-30 min intervals or steady-state',
    exercisesPerDay: 6,
    compoundBias: 0.6,
  },
  endurance: {
    label: 'Improve Endurance',
    blurb: 'Higher reps, minimal rest, lots of conditioning. Last longer.',
    compound: { sets: '2-3', reps: '15-20', rest: '45 sec' },
    isolation: { sets: '2-3', reps: '15-20', rest: '30 sec' },
    cardioPerWeek: 3,
    cardioNote: '30-40 min steady-state cardio',
    exercisesPerDay: 5,
    compoundBias: 0.5,
  },
  general: {
    label: 'General Fitness',
    blurb: 'A balanced mix of strength, size and conditioning. Feel great.',
    compound: { sets: '3', reps: '8-12', rest: '90 sec' },
    isolation: { sets: '3', reps: '10-15', rest: '60 sec' },
    cardioPerWeek: 2,
    cardioNote: '20-25 min moderate cardio',
    exercisesPerDay: 5,
    compoundBias: 0.55,
  },
};

// A split maps each training day to the muscle groups it targets. The best
// split depends mostly on how many days a week you can train.
const SPLITS = {
  2: {
    name: 'Full-Body (2-day)',
    days: [
      { title: 'Full Body A', groups: ['legs', 'chest', 'back', 'core'] },
      { title: 'Full Body B', groups: ['legs', 'shoulders', 'back', 'arms'] },
    ],
  },
  3: {
    name: 'Full-Body (3-day)',
    days: [
      { title: 'Full Body A', groups: ['legs', 'chest', 'back', 'core'] },
      { title: 'Full Body B', groups: ['legs', 'shoulders', 'back', 'arms'] },
      { title: 'Full Body C', groups: ['legs', 'chest', 'back', 'core'] },
    ],
  },
  4: {
    name: 'Upper / Lower',
    days: [
      { title: 'Upper A', groups: ['chest', 'back', 'shoulders', 'arms'] },
      { title: 'Lower A', groups: ['legs', 'legs', 'core'] },
      { title: 'Upper B', groups: ['back', 'chest', 'arms', 'shoulders'] },
      { title: 'Lower B', groups: ['legs', 'legs', 'core'] },
    ],
  },
  5: {
    name: 'Push / Pull / Legs + Upper / Lower',
    days: [
      { title: 'Push', groups: ['chest', 'shoulders', 'arms'] },
      { title: 'Pull', groups: ['back', 'back', 'arms'] },
      { title: 'Legs', groups: ['legs', 'legs', 'core'] },
      { title: 'Upper', groups: ['chest', 'back', 'shoulders'] },
      { title: 'Lower', groups: ['legs', 'legs', 'core'] },
    ],
  },
  6: {
    name: 'Push / Pull / Legs (x2)',
    days: [
      { title: 'Push A', groups: ['chest', 'shoulders', 'arms'] },
      { title: 'Pull A', groups: ['back', 'back', 'arms'] },
      { title: 'Legs A', groups: ['legs', 'legs', 'core'] },
      { title: 'Push B', groups: ['chest', 'shoulders', 'arms'] },
      { title: 'Pull B', groups: ['back', 'back', 'arms'] },
      { title: 'Legs B', groups: ['legs', 'legs', 'core'] },
    ],
  },
};

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Spread N training days across the week so rest days fall between them where
// possible (e.g. 3 days -> Mon/Wed/Fri).
function assignWeekdays(numDays) {
  const patterns = {
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 4, 5],
    6: [0, 1, 2, 3, 4, 5],
  };
  return (patterns[numDays] || patterns[3]).map((i) => WEEKDAYS[i]);
}

function allowedEquipment(equipment) {
  return EQUIPMENT_TIERS[equipment] || EQUIPMENT_TIERS.gym;
}

// Beginners get fewer exercises so sessions stay manageable; advanced lifters
// can handle more volume.
function experienceModifier(experience) {
  if (experience === 'beginner') return -1;
  if (experience === 'advanced') return 1;
  return 0;
}

// Rough time estimate: exercises * avg sets * (work + rest) + cardio.
function estimateMinutes(exerciseCount, hasCardio) {
  const perExercise = 7; // minutes incl. rest, averaged
  return Math.round(exerciseCount * perExercise + (hasCardio ? 22 : 0));
}

function pick(pool, count, used) {
  const chosen = [];
  const available = pool.filter((e) => !used.has(e.name));
  // Prefer compound movements first — they belong at the start of a session.
  available.sort((a, b) => Number(b.compound) - Number(a.compound));
  for (const ex of available) {
    if (chosen.length >= count) break;
    chosen.push(ex);
    used.add(ex.name);
  }
  return chosen;
}

// Build the full plan object consumed by the UI.
function generatePlan(config) {
  const { goal, experience, equipment, daysPerWeek } = config;
  const profile = GOAL_PROFILES[goal] || GOAL_PROFILES.general;
  const split = SPLITS[daysPerWeek] || SPLITS[3];
  const equip = allowedEquipment(equipment);

  const perDayTarget = Math.max(
    3,
    profile.exercisesPerDay + experienceModifier(experience)
  );

  const weekdays = assignWeekdays(daysPerWeek);

  // Decide which training days include a dedicated cardio finisher.
  const cardioDayCount = Math.min(profile.cardioPerWeek, daysPerWeek);
  const cardioDayIndexes = new Set();
  if (cardioDayCount > 0) {
    const stride = daysPerWeek / cardioDayCount;
    for (let i = 0; i < cardioDayCount; i++) {
      cardioDayIndexes.add(Math.min(daysPerWeek - 1, Math.round(i * stride)));
    }
  }

  const cardioPool = EXERCISES.filter(
    (e) => e.group === 'cardio' && equip.includes(e.equipment)
  );

  const days = split.days.map((dayTemplate, idx) => {
    const used = new Set();
    const exercises = [];

    // Fill the day by rotating through its target muscle groups. The pointer
    // always advances so an exhausted group can't stall the rotation; we stop
    // once we hit the target or a full pass adds nothing (all pools drained).
    const groups = dayTemplate.groups;
    let ptr = 0;
    let missesThisPass = 0;
    while (exercises.length < perDayTarget && missesThisPass < groups.length) {
      const group = groups[ptr % groups.length];
      ptr++;
      const pool = EXERCISES.filter(
        (e) => e.group === group && equip.includes(e.equipment)
      );
      const [chosen] = pick(pool, 1, used);
      if (!chosen) {
        missesThisPass++;
        continue;
      }
      missesThisPass = 0;

      const scheme = chosen.compound ? profile.compound : profile.isolation;
      exercises.push({
        name: chosen.name,
        group: chosen.group,
        sets: scheme.sets,
        reps: scheme.reps,
        rest: scheme.rest,
      });
    }

    const hasCardio = cardioDayIndexes.has(idx) && cardioPool.length > 0;
    let cardio = null;
    if (hasCardio) {
      const c = cardioPool[idx % cardioPool.length];
      cardio = { name: c.name, note: profile.cardioNote };
    }

    return {
      weekday: weekdays[idx],
      title: dayTemplate.title,
      exercises,
      cardio,
      estMinutes: estimateMinutes(exercises.length, hasCardio),
    };
  });

  // Rest days = weekdays not used for training.
  const trainingDays = new Set(weekdays);
  const restDays = WEEKDAYS.filter((d) => !trainingDays.has(d));

  return {
    goal,
    goalLabel: profile.label,
    goalBlurb: profile.blurb,
    splitName: split.name,
    experience,
    equipment,
    daysPerWeek,
    days,
    restDays,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generatePlan, GOAL_PROFILES, SPLITS };
}
