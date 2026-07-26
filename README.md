# Lukasz26671

Portfolio na GitHub Pages — Vite + React + Three.js.

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Deploy: workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) publikuje `dist` przez GitHub Pages (Actions).

W ustawieniach repozytorium: **Settings → Pages → Source: GitHub Actions**.

## Muzyka

Odtwarzacz i trasy `/music`, `/now-playing` włączają się tylko gdy health-check serwera streamingu się uda. W przeciwnym razie ścieżka music jest wyłączona.
