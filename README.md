# SPLIT — Build your training week

A lightweight web app that builds a personalized **weekly training program**
from a short brief. Tell it your goal, how often you train, your experience,
equipment and session length — SPLIT lays out a day-by-day week with the right
split, exercises, sets, reps, rest, **suggested loads** and a **4-week + deload
progression**. Log your real sets and the weights personalise to you.

![SPLIT](https://img.shields.io/badge/dependencies-none-brightgreen)

## Features

- **Goal-driven programming.** Strength, muscle, fat loss, endurance or general
  fitness each get their own rep ranges, rest periods, volume and conditioning
  dose — because those goals genuinely train differently.
- **Smart training splits.** Auto mode picks the split that fits your weekly
  frequency (full-body, upper/lower, PPL, and rotations), or switch to a
  muscle-group split for one body part per day.
- **Equipment aware.** Full gym, dumbbells + bands, or bodyweight only — every
  exercise in your plan is one you can actually do.
- **Suggested weights.** Enter a recent 1RM (or bodyweight) and SPLIT estimates
  loads per lift, per rep range, per week. No numbers? Log real sets and the
  suggestions build from your logged e1RM.
- **Weekly progression.** Toggle through Weeks 1–4 (baseline → add reps → add
  load → peak) plus a Week 5 deload, and the sets/loads adjust automatically.
- **Log, swap and regenerate.** Record what you actually hit (saved locally),
  swap any exercise for another in the same group, or regenerate the whole week.
- **Abs finisher.** Optionally append a 2-move core block to every training day.

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

The site is fully static, so it hosts for free on GitHub Pages. Two ways:

- **Deploy from a branch (simplest):** Settings → Pages → *Build and deployment*
  → Source: **Deploy from a branch** → pick the branch and `/ (root)`. Live in a
  minute at `https://<user>.github.io/<repo>/`.
- **GitHub Actions:** Settings → Pages → Source: **GitHub Actions**. The included
  [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) then publishes on
  every push to the configured branch.

Any static host works too — Netlify, Vercel or Cloudflare Pages: point it at the
repo (no build command, publish directory `/`).

## How it works

| File                | Responsibility                                                        |
| ------------------- | -------------------------------------------------------------------- |
| `index.html`        | Page structure and the training brief form                           |
| `css/styles.css`    | Styling (dark theme, responsive layout)                              |
| `js/exercises.js`   | Data: exercise library, split templates, rep schemes, progression    |
| `js/scheduler.js`   | The engine: split selection, load suggestion, and week generation    |
| `js/app.js`         | State, persistence, rendering and all UI interactions                |

The scheduler chooses a split from your goal and weekly frequency, fills each
training day by rotating through that day's target muscle groups (leading with
compound lifts), applies the sets/reps/rest scheme for your goal, and suggests
loads scaled to the selected progression week. Logged sets are stored in
`localStorage` and feed back into the weight suggestions.

## Disclaimer

SPLIT generates a general-purpose training template and is not medical or
professional fitness advice. Consult a qualified professional before starting
any new exercise program.
