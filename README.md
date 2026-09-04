# Global Time Matrix

Every timezone you work across, at a glance. A free offline world-clock
and anchor-based time converter from **NavAse Technologies**.

- **Live grid** of the current time in every city you add, with a real
  day / night indicator computed from the sun's position.
- **Anchor-based converter** — pick a wall-clock moment in one zone
  ("9:00 AM on 15 Mar, India") and see it resolved into every other
  zone, with Daylight Saving handled per that date (EST vs EDT falls out
  automatically).
- **Fully offline.** Offsets and DST come from the IANA time-zone
  database bundled with your browser / the app. No accounts, no servers,
  no network calls, no tracking.
- Your dashboard (zones, order, home zone, format, theme) is remembered
  between sessions.

## Develop

```bash
npm install
npm run dev          # http://localhost:4319
```

## Build

```bash
npm run build        # -> dist/  (static; deploy anywhere)
npm run electron:dev # build + run the desktop shell locally
```

## Desktop installer

Pushing a tag like `v1.0.0` triggers
`.github/workflows/release.yml`, which builds the Windows installer on a
GitHub-hosted runner (`electron-builder`, NSIS target) and attaches
`GlobalTimeMatrix-Setup-<version>.exe` to a GitHub Release. The website's
"Download Desktop Version" links to that asset.

## Layout

```
src/
  engine/   clock loop, tz maths (Luxon), day/night (SunCalc), converter
  ui/       grid, search, converter panel, controls, disclosures
  data/     curated IANA zone catalogue (city + country + coords)
  store.ts  persistence hook (localStorage; swap for file writes natively)
electron/   desktop shell — loads dist/ from disk, blocks remote nav
```

## Disclaimer

A planning aid only. Every reading depends on this device's system
clock; there is no network time sync. Not for aviation, legal,
financial-settlement, safety-critical, or any use where a timing error
could cause harm. See the in-app "Accuracy, limitations & disclaimers"
panel.
