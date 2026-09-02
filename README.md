# Cowboys, Cocktails & Cosmic Virgos

Static GitHub Pages starter for the Nashville girls trip, Sept 19 - 23, 2026.

## What is already built

- Responsive light scrapbook / Practical Magic / Nashville / Dolly sparkle design
- Display typography using Bodoni Moda as a web-safe stand-in for a Mythical Romance style display serif
- Montserrat for body copy and UI text
- Foundational cards for flights, Enterprise rental, and Airbnb stay
- Animated pink cowgirl Activity Hat
- Random "pull from the hat" activity picker
- Activity list with expandable detail panel
- Add and edit activity details in the browser
- Save / planned activity states
- Notes section
- Export and import trip updates as JSON
- Live Nashville weather via Open-Meteo when the trip enters the forecast window
- Mobile layout
- Replaceable hero and Airbnb image placeholders

## Files

- `index.html` - page structure
- `styles.css` - branding, layout, animations, responsive styles
- `trip-data.js` - core trip content and activity starter data
- `script.js` - activity picker, local edits, notes, weather, share tools
- `assets/images/hero-placeholder.svg` - replace with your own hero image later
- `assets/images/stay-placeholder.svg` - replace with your own Airbnb image later
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

## Replace the images later

The image paths are controlled in `trip-data.js`:

```js
images: {
  hero: "assets/images/hero-placeholder.svg",
  stay: "assets/images/stay-placeholder.svg"
}
```

Add your JPG, PNG, or WebP files to `assets/images/`, then update those two paths. Example:

```js
images: {
  hero: "assets/images/nashville-night.jpg",
  stay: "assets/images/airbnb-living-room.jpg"
}
```

You do not need to replace the weather visuals, Lucide UI icons, stars, moon details, or the animated Activity Hat.

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

Weather uses the free Open-Meteo API with Nashville coordinates. No API key is required.

The API does not provide reliable forecasts months in advance. Until the trip enters the available forecast window, the site displays the five trip dates as pending plus the seasonal Nashville note. When all five dates become available, the panel automatically switches to live forecast data.

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
- Deep teal: `#0D546B`
- Cream: `#FEE3D1`

## Best next upgrade

Once the visual direction is locked, connect Supabase for shared activities, notes, reservation statuses, and group voting. That turns this from a beautiful static trip hub into a genuinely collaborative trip app without changing the front-end design.
