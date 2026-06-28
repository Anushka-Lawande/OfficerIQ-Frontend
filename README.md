# OfficerIQ

MPSC exam-prep app — Expo / React Native clone of the UI shown at
`progress-pulse-dome.lovable.app` (Home, Learn, Mains) and
`exam-craft-learn.lovable.app` (Subject Detail), built from the screenshots you shared.

## Run it

```bash
cd OfficerIQ
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (Android/iOS) — same network as your computer.

## What's inside

- **Home** — greeting, stat pills (Done % / Rank / Streak), Overall Progress card,
  Focus Timer with real countdown (1.5m / 5m / 15m / 25m / 45m presets, play/pause/reset, SVG ring),
  horizontal "Continue Learning" cards.
- **Learn** — search, filter tabs (All / In Progress / Not Started / Completed),
  blue gradient "Continue Learning" banner, all 8 subject cards (Computer & Tech, Economics,
  Environment, Geography, History, Panchayat Raj, Polity, Science) with the same icon-circle / progress
  bar / Continue-pill layout as the reference.
- **Subject Detail** — gradient hero, overall progress, expandable chapters with checkable topics,
  chapter test button, closing quote. **History** is filled with the real chapter/topic names
  (in Marathi) from the reference site; the other 7 subjects use the same structure with
  placeholder topic names ("Topic 1", "Topic 2"...) since their real content wasn't in the reference.
- **Mains** — free-evaluations quota row, gradient hero illustration (score badge, sticky note,
  mock answer card), "Evaluate Answer" button, info row.
- **Test** — Mock Tests / My Results tabs (this page wasn't in your screenshots, so it's built to
  match the same visual language as the rest of the app).

## Colors / theme

Pulled directly from your 4 screenshots: white cards on a very light blue-gray background,
indigo→blue gradient (`#5B6EF5 → #3B8AF6`) for primary buttons/progress/banners, soft pastel
circles for subject icons, and a floating white pill bottom-nav with a light-blue highlight
behind the active tab. All of this lives in `src/theme/colors.js` if you want to tweak any shade.

## Next steps you may want

- Real topic content (Marathi) for the other 7 subjects, same as History
- Hook the Focus Timer / progress / streak up to real backend data instead of the sample numbers
- Wire "Evaluate Answer" and "Start Test" to actual logic/API
