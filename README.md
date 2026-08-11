# SPLIT — Build your training week

A lightweight web app that builds a personalized **weekly training program**
from a short brief. Tell it your goal, how often you train, your experience,
equipment and session length — SPLIT lays out a day-by-day week with the right
split, exercises, sets, reps, rest, **suggested loads** and a **4-week + deload
progression**. Log your real sets and the weights personalise to you.

![SPLIT](https://img.shields.io/badge/dependencies-none-brightgreen)

## Features

- **AI coach (bring your own key).** Describe your training in plain language and
  Claude fills in the brief, then SPLIT builds the week. Optional — paste an
  Anthropic API key (stored only in your browser, sent straight to Anthropic);
  everything else works without it. See [Using the AI coach](#using-the-ai-coach).
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
- **Fresh exercises each week.** Your split and weekly structure stay fixed, but
  every week draws a different selection of exercises for each day — cycling
  through the library instead of repeating the same lifts.
- **Exercise guidance.** Tap any lift to see step-by-step form cues, the
  muscles it targets, and a looping animated figure demonstrating the movement
  — all drawn inline, so it works offline with no images to load.
- **Per-set logging.** The same expanded panel lets you record the weight and
  completed reps for *every* set. Your best estimated 1RM across those sets is
  saved locally and feeds straight back into the suggested loads.
- **Swap and regenerate.** Swap any exercise for another in the same group, or
  regenerate the whole week.
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
| `js/ai.js`          | Optional AI coach: maps a plain-language description onto the brief   |

The scheduler chooses a split from your goal and weekly frequency, fills each
training day by rotating through that day's target muscle groups (leading with
compound lifts), applies the sets/reps/rest scheme for your goal, and suggests
loads scaled to the selected progression week. Logged sets are stored in
`localStorage` and feed back into the weight suggestions.

## Using the AI coach

The **✨ Describe it** card lets you skip the chips: write your goal, schedule,
equipment and experience in a sentence, and Claude maps it onto the brief before
building the week.

- **Bring your own key.** Create an API key at
  [console.anthropic.com](https://console.anthropic.com), paste it into the card,
  and pick a model (Opus 5 / Sonnet 5 / Haiku 4.5 — Haiku is cheapest for this).
- **Where the key lives.** It's saved in your browser's `localStorage` on that
  device only and sent directly to `api.anthropic.com` — there is no SPLIT
  backend to send it to. Each build is a single request (a few cents at most).
- **How it works.** SPLIT calls Anthropic's Messages API with a `set_brief`
  tool; Claude returns the structured fields, which are validated and applied to
  the chips, then the normal generator runs. The AI feature needs a connection;
  the rest of the app (building, logging, progression) works offline.

The AI coach is entirely optional — SPLIT is fully usable without a key.

## Disclaimer

SPLIT generates a general-purpose training template and is not medical or
professional fitness advice. Consult a qualified professional before starting
any new exercise program.
