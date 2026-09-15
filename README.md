# Cinematic Portfolio

A lightweight static portfolio for a director, editor and colourist. It uses plain HTML, CSS and JavaScript, so there is no build step and no paid hosting requirement.

## Files

- `index.html` — page structure and your About / Contact copy
- `styles.css` — design, layout and responsive styling
- `projects.js` — your projects, credits, roles and media
- `script.js` — filtering and project viewer behavior
- `assets/` — project images, posters and optional local videos
- `.nojekyll` — tells GitHub Pages to serve the site as a normal static site

## 1. Personalise the site

Open `index.html` and replace:

- `YOUR NAME`
- `YOUR CITY`
- `hello@yourname.com`
- Instagram link
- Vimeo link
- the About text if you want different wording

Also change the `<title>` and description near the top of `index.html`.

## 2. Add your projects

Open `projects.js`.

Each project looks like this:

```js
{
  title: "Project Name",
  client: "Brand / Artist",
  year: "2026",
  roles: ["direction", "edit", "colour"],
  thumbnail: "assets/project-poster.jpg",
  media: { type: "vimeo", id: "123456789" },
  description: "Short project description.",
  credits: [
    ["Director", "Your Name"],
    ["Editor", "Your Name"],
    ["Colourist", "Your Name"],
    ["DOP", "Name"]
  ]
}
```

### Supported media

Image:

```js
media: {
  type: "image",
  src: "assets/project-image.jpg",
  alt: "Project still"
}
```

Local MP4:

```js
media: {
  type: "video",
  src: "assets/film.mp4",
  poster: "assets/poster.jpg"
}
```

Vimeo:

```js
media: {
  type: "vimeo",
  id: "123456789"
}
```

For a film portfolio, Vimeo is usually the easiest option because large video files do not need to live inside the GitHub repository.

## 3. Replace the placeholder images

Put your JPG, PNG, WebP or SVG files inside the `assets` folder.

Then update the `thumbnail` paths in `projects.js`.

Recommended thumbnail sizes:

- Landscape: about 1800 × 1100 px
- Portrait: about 1400 × 1750 px
- Use WebP when possible to keep the site fast

## 4. Preview it on your computer

You can double-click `index.html` and open it in a browser.

For a more accurate local preview, use VS Code with the free Live Server extension.

## 5. Publish free with GitHub Pages

1. Create a GitHub account if needed.
2. Create a new public repository.
3. Upload all files from this folder to the repository root.
4. In the repository, open `Settings`.
5. Open `Pages`.
6. Under `Build and deployment`, choose `Deploy from a branch`.
7. Choose `main` and `/ (root)`.
8. Save.
9. GitHub will provide your public site URL in the Pages section.

A personal GitHub Pages site can also use a repository named `yourusername.github.io`.

## 6. Custom domain later

You can start with the free GitHub Pages URL and add a paid custom domain later. You do not need to rebuild the site.

## Design notes

The site intentionally keeps navigation, copy and interface elements restrained so your imagery remains dominant. The design is original, but it follows the same broad visual principles as high-end filmmaker portfolios: large imagery, minimal type, generous spacing, project filtering and simple full-screen project presentation.
