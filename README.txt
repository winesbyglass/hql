v82 — full photo collections + mobile touch reliability

Replace all four files together:
1. index.html
2. projects.js
3. script.js
4. styles.css

Changes:
- Restores access to extra JPG stills in Return to Helsinki, Sciences Po Year 2, and Double Exposure Series.
- Keeps the v81 performance improvement: extra stills are NOT probed or loaded on the homepage or normal project opening.
- Only when VIEW ALL is tapped does the site check project-XX-06.jpg through project-XX-30.jpg and add every existing JPG to the collection.
- The discovered collection is cached for the rest of the visit.
- The collection itself is still demand-loaded; opening a project does not preload the entire series.
- Mobile CONTACT / BIO is raised while remaining aligned to the same 22px page/menu edges.
- Mobile image interaction is hardened so image pixels/decorative layers cannot intercept taps from their parent buttons.
- This applies to homepage project images, still-led project images, photo-series main images, previews, full collection items, regular still grids, and video-series preview thumbnails.
- Small photo navigation/fullscreen/view-all/lightbox controls get larger touch hit areas on mobile without changing the desktop layout.
