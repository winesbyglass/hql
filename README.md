# Haohao Qiaoshi Liu — Editorial Portfolio

This version uses a warm light colour scheme, oversized editorial typography and an asymmetric film grid. It is designed to feel like a filmmaker portfolio rather than a corporate template.

## Upload to GitHub

Replace the existing files in your `hql` repository with the files in this folder:

- `index.html`
- `styles.css`
- `script.js`
- `projects.js`
- `assets/`

Commit the changes. GitHub Pages should rebuild automatically.

If the old design is still visible after the Pages deployment finishes, open the site with a cache-busting query such as:

`https://winesbyglass.github.io/hql/?v=4`

## Replace the placeholder project artwork

Put your own stills inside `assets/` and update each project's `thumbnail` value in `projects.js`.

Example:

```javascript
thumbnail: "assets/distant-and-known.jpg"
```

Good homepage stills should ideally be at least 1800 pixels wide for landscape images.

## Project filters

The work menu filters by project type:

- Narrative
- Documentary
- Commercial
- Music

Edit `category` in `projects.js` if you change a project's type.

## Fonts

The site currently loads Bodoni Moda and DM Sans from Google Fonts. If they fail to load, it falls back to Georgia and Arial.
