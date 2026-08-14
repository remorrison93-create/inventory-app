# Home Inventory

A phone-first Progressive Web App for tracking household items: photograph items, tag them with a room and quantity, tap a −1 button to record usage, and see bar charts of what you have by room and item with low-stock warnings.

All data is stored locally on your device (IndexedDB) — nothing is uploaded anywhere.

## Install it on your iPhone

1. Open **`https://<your-github-username>.github.io/inventory-app/`** in Safari.
2. Tap the **Share** button, then **Add to Home Screen**.
3. Open it from the home screen icon — it runs full-screen like a native app and works offline after the first load.

## Features

- **Add Item**: take a photo, set name, room, quantity, and a low-stock threshold.
- **Inventory**: search/filter by room, tap `−1` / `+1` to adjust quantity, edit or delete items. Items at or below their threshold are highlighted.
- **Dashboard**: bar chart of total quantity by room, bar chart of item quantities (lowest first, low-stock items in red), and a low-stock warning list.

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```

Pushing to `main` automatically builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.

### One-time GitHub Pages setup

In the repo settings: **Settings → Pages → Source → GitHub Actions**. After that, every push to `main` redeploys automatically.
