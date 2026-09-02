# Cowboys, Cocktails & Cosmic Virgos

Static GitHub Pages starter for the Nashville girls trip, Sept 19 - 23, 2026.

## What is already built

- Responsive dark-teal, copper, neon Nashville / Practical Magic design based on the supplied mockup
- Display typography using Bodoni Moda as a web-safe stand-in for a Mythical Romance style display serif
- Montserrat for body copy and UI text
- Foundational cards for flights, Enterprise rental, and Airbnb stay
- Illustrated pink cowgirl Activity Hat using the supplied artwork
- Random "pull from the hat" activity picker
- Activity list with expandable detail panel
- Add and edit activity details in the browser
- Save / planned activity states
- High-contrast Notes + Ideas section with editable auto-saving note cards and draft recovery
- Editable Packing + Reminders checklist (add, check off, or remove items)
- Export and import trip updates as JSON
- Live Nashville weather via Open-Meteo when the trip enters the forecast window
- Mobile layout
- Optimized local WebP hero, Airbnb, fire-pit, butterfly, stars, boots, tarot, and other sticker artwork

## Files

- `index.html` - page structure
- `styles.css` - branding, layout, animations, responsive styles
- `trip-data.js` - core trip content and activity starter data
- `script.js` - activity picker, local edits, notes, weather, share tools
- `assets/images/*.webp` - compact, locally hosted artwork used by the page
- `assets/favicon.svg` - simple moon and star favicon
- `.nojekyll` - keeps GitHub Pages from applying Jekyll processing

## Put it live with GitHub Pages

1. Create a new GitHub repository, for example `nashville-girls-trip`.
2. Upload every file and folder from this package to the repository root.
3. Commit the files to the `main` branch.
4. Open the repository in GitHub.
5. Go to `Settings` > `Pages`.
6. Under `Build and deployment`, choose `Deploy from a branch`.
7. Choose branch `main`, folder `/ (root)`, then save.
8. GitHub will provide a public URL similar to `https://yourusername.github.io/nashville-girls-trip/`.

No build step is required.

## Image setup

The image paths are controlled in `trip-data.js`:

```js
images: {
  hero: "assets/images/nashville.webp",
  stay: "assets/images/stay.webp"
}
```

To replace either image later, add a compact WebP file to `assets/images/`, then update those two paths.

```js
images: {
  hero: "assets/images/nashville-night.jpg",
  stay: "assets/images/airbnb-living-room.jpg"
}
```

The current hero is prioritized for fast loading; all below-the-fold artwork uses native lazy loading.

## Update trip details

Edit `trip-data.js` for information that should be the same for everyone:

- flights
- car reservation
- Airbnb details
- activity starter list
- addresses
- phone numbers
- reservation links
- best times
- notes

This file is the shared source of truth that every visitor sees after GitHub Pages redeploys.

## About editing from the website

GitHub Pages is a static website. It cannot save edits to a shared database on its own.

This starter therefore uses browser `localStorage` for on-page edits. Each person can add activities, edit details, save ideas, mark items planned, and add notes on their own device. Those changes remain on that browser.

The site also includes:

- `Export` to download a `nashville-trip-updates.json` file
- `Import updates` to load that file on another device

For true shared live editing, the next version should connect the same interface to Supabase or Firebase. The current data model is already separated so that upgrade can be added without rebuilding the visual design.

## Weather

Weather uses the free Open-Meteo API with Nashville coordinates. No API key is required. The highlighted “Nashville right now” card loads current conditions every time the page opens.

The API does not provide reliable forecasts months in advance. Until the trip enters the available forecast window, the site displays the five trip dates as pending. When all five dates become available, that row automatically switches to the Sept. 19–23 live forecast—no manual update is needed.

## Typography

Current fonts:

- Display: Bodoni Moda
- Body: Montserrat

If you own a licensed webfont for Mythical Romance, place the licensed `.woff2` file in an `assets/fonts/` folder and update `--font-display` in `styles.css` with an `@font-face` declaration. Do not upload a font file unless your license permits web embedding.

## Quick brand colors

- Oxblood: `#9B3531`
- Warm clay: `#C8795B`
- Rose brown: `#9A5749`
- Olive taupe: `#715C46`
- Dusty seafoam: `#98BDB6`
- Deep teal: `#031F24`
- Cream: `#FFE1BA`

## Best next upgrade

Once the visual direction is locked, connect Supabase for shared activities, notes, reservation statuses, and group voting. That turns this from a beautiful static trip hub into a genuinely collaborative trip app without changing the front-end design.
