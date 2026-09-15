# Haohao Portfolio v9

This version adds an optional compact stills gallery below each screener.

## Add stills

Upload still images into the `assets/` folder, then add their paths to the matching project in `projects.js`.

Example:

```javascript
stills: [
  "assets/distant-and-known-01.jpg",
  "assets/distant-and-known-02.jpg",
  "assets/distant-and-known-03.jpg",
  "assets/distant-and-known-04.jpg",
  "assets/distant-and-known-05.jpg",
  "assets/distant-and-known-06.jpg"
],
```

The stills section stays hidden when the array is empty.

Layout: 3 columns on desktop, 2 on tablet, 1 on mobile.
