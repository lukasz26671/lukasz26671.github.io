# Lukasz26671

Portfolio na GitHub Pages — Vite + React + Three.js.

## Dev

```bash
npm install
npm run dev
```

## Build / deploy

### GitHub Actions (zalecane)

Push na `master` uruchamia [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

W repo: **Settings → Pages → Source: GitHub Actions**.

To ważne — jeśli Source jest ustawione na `master`, serwowany jest Vite `index.html` z `/src/main.tsx` i przeglądarka rzuca błędem MIME.

### Ręcznie (gh-pages)

```bash
npm run build
npm run deploy
```

Wzór jak w [react-gh-pages](https://github.com/gitname/react-gh-pages), pod Vite (`dist`).

## Muzyka

Odtwarzacz i trasy `/music`, `/now-playing` włączają się tylko gdy health-check serwera streamingu się uda. W przeciwnym razie ścieżka music jest wyłączona.
