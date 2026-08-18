# SPLIT — Build your training week

A lightweight web app that builds a personalized **weekly training program**
from a short brief. Tell it your goal, how often you train, your experience,
equipment and session length — SPLIT lays out a day-by-day week with the right
split, exercises, sets, reps, rest, **suggested loads** and a **4-week + deload
progression**. Log your real sets and the weights personalise to you.

![SPLIT](https://img.shields.io/badge/dependencies-none-brightgreen)
![offline](https://img.shields.io/badge/works-offline-blue)

No build step, no dependencies, no accounts or API keys — everything runs in
your browser and your data stays on your device.

## Features

- **Add a targeted block.** Keep your core weekly plan and bolt on extra work for
  a specific region — upper chest, inner back, rear delts, lower abs, forearms —
  picked from a dropdown of 34 targets, added to the day you choose, every week
  or just this one, and removable in one click.
- **Desk-work support blocks.** The same dropdown leads with seven targets for
  the muscles that commonly go weak from sitting all day — lower back, posture
  and rounded shoulders, neck and upper back, hips and hip flexors, knee support,
  wrists and forearms, core and trunk stability.
- **Goal-driven programming.** Strength, muscle, fat loss, endurance or general
  fitness each get their own rep ranges, rest periods, volume and conditioning
  dose — because those goals genuinely train differently.
- **Smart training splits.** Auto mode picks the split that fits your weekly
  frequency (full-body, upper/lower, PPL, and rotations), or switch to a
  muscle-group split for one body part per day.
- **Equipment aware.** Full gym, dumbbells + bands, or bodyweight only — every
  exercise in your plan is one you can actually do. The library holds ~140
  movements across ten muscle groups, so a five-week block rarely repeats itself.
- **Suggested weights.** Enter a recent 1RM (or bodyweight) and SPLIT estimates
  loads per lift, per rep range, per week. No numbers? Log real sets and the
  suggestions build from your logged e1RM.
- **Weekly progression.** Toggle through Weeks 1–4 (baseline → add reps → add
  load → peak) plus a Week 5 deload, and the sets/loads adjust automatically.
- **Fresh exercises each week.** Your split and weekly structure stay fixed, but
  every week draws a different selection of exercises for each day — cycling
  through the library instead of repeating the same lifts.
- **Exercise guidance.** Tap any lift to see step-by-step form cues, the
  muscles it targets, and a looping animated figure demonstrating the movement
  — all drawn inline, so it works offline with no images to load.
- **Per-set logging, set by set.** The same expanded panel records the weight and
  completed reps for *every* set. Hit **✓** on a row (or press Enter) to bank
  that set mid-workout and the panel stays open on the next one — or fill the
  whole thing in afterwards and **Save all**. Partly-logged lifts show their
  progress (`2/4 sets`) on the collapsed row. Your best estimated 1RM across
  those sets is saved locally and feeds straight back into the suggested loads.
- **How did it feel?** Rate a lift *Easy · Just right · Hard · Missed reps* and
  the next suggestion for it moves with you: the estimated max behind the load
  is scaled (+5% / 0 / −3% / −8%), and lifts logged in reps or seconds get their
  target shifted instead. The rating shows on the collapsed row, so you can see
  why a weight went up.
- **Swap and regenerate.** Swap any exercise for another in the same group, or
  regenerate the whole week.
- **Abs finisher.** Optionally append a 2-move core block to every training day.
  This is the only place ab work is programmed — no training day mixes it into
  its main list — so core volume is a single deliberate switch.

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

## Install it (PWA)

SPLIT is a Progressive Web App: it can be installed to a phone or desktop and
runs **offline**. A [web manifest](manifest.webmanifest) and a
[service worker](sw.js) cache the app shell and the web fonts on first visit.

- **Desktop (Chrome/Edge):** open the site and click the install icon in the
  address bar.
- **iOS Safari:** Share → *Add to Home Screen*.
- **Android Chrome:** menu → *Install app* / *Add to Home Screen*.

Installed, it launches full-screen with its own icon and works without a
connection. (The service worker needs `https://` or `http://localhost` — it is
inactive on `file://`.)

## Deploy it (GitHub Pages)

The site is fully static, so it hosts for free on GitHub Pages:

- Settings → Pages → *Build and deployment* → Source: **Deploy from a branch** →
  pick the branch and `/ (root)`, then **Save**. Live in a minute at
  `https://<user>.github.io/<repo>/`.

Any static host works too — Netlify, Vercel or Cloudflare Pages: point it at the
repo (no build command, publish directory `/`).

## How it works

| File                | Responsibility                                                        |
| ------------------- | -------------------------------------------------------------------- |
| `index.html`        | Page structure and the training brief form                           |
| `css/styles.css`    | Styling (dark theme, responsive layout)                              |
| `js/exercises.js`   | Data: exercise library, split templates, rep schemes, progression    |
| `js/exercise-info.js` | Per-exercise how-to cues + the inline animated movement demos      |
| `js/scheduler.js`   | The engine: split selection, load suggestion, and week generation    |
| `js/app.js`         | State, persistence, rendering and all UI interactions                |

The scheduler chooses a split from your goal and weekly frequency, fills each
training day by rotating through that day's target muscle groups (leading with
compound lifts), applies the sets/reps/rest scheme for your goal, and suggests
loads scaled to the selected progression week. Logged sets are stored in
`localStorage` and feed back into the weight suggestions.

## Adding a block

Once a week is built, the **＋ Add a block** panel appends extra targeted work to
one day without changing the rest of the plan — the same idea as the abs
finisher, but aimed wherever you want.

- Pick a target from the dropdown (34 of them, grouped by body part: upper /
  lower / inner / outer chest, lats, inner back, upper back & traps, front /
  side / rear delts, biceps peak, triceps long head, forearms & grip, quads,
  glutes, hamstrings, inner thigh, calves, upper / lower abs, obliques …).
- The list opens with a **Desk-work support** group aimed at the weaknesses a
  day at a desk builds up: lower back from sitting, posture & rounded shoulders,
  neck & upper back, hips & hip flexors, knee support, wrists & forearms, and
  core & trunk stability. These are supportive strengthening blocks, not
  treatment — the panel says so, and pain that is severe, persistent or
  post-injury belongs with a clinician.
- Choose the day, and whether it applies **every week** or only the one you're
  viewing.
- SPLIT draws up to three movements for that target from the exercise library,
  skipping anything the day already programs, so the added work comes with its
  how-to cues, animated demo, suggested loads and per-set logging.
- Targets with no movement your equipment can do are hidden — pick bodyweight
  and side delts drops out of the list rather than offering something you can't
  train.
- The block appears under its own labelled divider; the **✕** there removes it
  from every week.

## Disclaimer

SPLIT generates a general-purpose training template and is not medical or
professional fitness advice. Consult a qualified professional before starting
any new exercise program.
