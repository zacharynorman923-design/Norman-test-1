# FitPlan — Goal-Based Workout Scheduler

A lightweight web app that builds a personalized **weekly workout schedule**
from your training goal. Pick what you're after, how often you can train, your
experience level and the equipment you have — FitPlan lays out a day-by-day
plan with the right split, exercises, sets, reps and rest.

![FitPlan](https://img.shields.io/badge/dependencies-none-brightgreen)

## Features

- **Goal-driven programming.** Strength, muscle, fat loss, endurance or general
  fitness each get their own rep ranges, rest periods, volume and cardio dose —
  because those goals genuinely train differently.
- **Smart training splits.** The app picks the split that fits your weekly
  frequency: full-body (2–3 days), upper/lower (4), PPL + upper/lower (5), or a
  full push/pull/legs rotation (6).
- **Equipment aware.** Choose full gym, dumbbells only, or bodyweight only, and
  every exercise in your plan is one you can actually do.
- **Experience scaling.** Beginners get leaner sessions; advanced lifters get
  more volume.
- **Sensible rest days.** Training days are spread across the week so recovery
  falls between sessions, and cardio finishers are placed automatically.

## Running it

No build step, no dependencies. Just open the file:

```bash
# from the project root
open index.html          # macOS
xdg-open index.html      # Linux
```

Or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## How it works

| File                | Responsibility                                             |
| ------------------- | ---------------------------------------------------------- |
| `index.html`        | Page structure and the goal form                           |
| `css/styles.css`    | Styling (dark theme, responsive layout)                    |
| `js/exercises.js`   | The exercise database, tagged by muscle group and equipment|
| `js/scheduler.js`   | The engine: goal profiles, splits, and plan generation     |
| `js/app.js`         | Wires the form to the scheduler and renders the plan       |

The scheduler picks a split based on your weekly frequency, then fills each
training day by rotating through that day's target muscle groups — leading with
compound lifts and applying the sets/reps/rest scheme for your goal.

## Disclaimer

FitPlan generates a general-purpose training template and is not medical or
professional fitness advice. Consult a qualified professional before starting
any new exercise program.
