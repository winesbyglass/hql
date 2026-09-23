v81 — image loading performance pass (JPG-only assets)

Replace these three files in the repository:
1. index.html
2. projects.js
3. script.js

styles.css does NOT need replacing.

What changed:
- Removed all speculative HEAD requests for photo-series files.
- Removed automatic homepage preloading of every photo series.
- Removed automatic Vimeo/YouTube API downloads at initial page load; they now load only when a video hover preview is actually requested.
- Homepage preloads only the first critical image on mobile and first visible row on desktop.
- First homepage artwork gets high fetch priority; off-screen cards stay lazy.
- Hover/focus/touch intent warms only the first useful project still rather than the whole project.
- Photo-series collection previews are lazy except the first preview.
- Photo-series navigation preloads only immediate previous/next images.
- Removed background preload/decode of the entire photo collection.
- Still-led project montages prioritize only the first still; remaining images are lazy/async.
- BTS images are JPG-only, low priority, delayed until browser idle time, and no longer try JPG/JPEG/PNG/WebP extension fallbacks.
- Photo series now use only the explicit JPG stills listed in projects.js. If you add more photos later, add each filename to that project's stills array.
- La Rêverie uses assets/project-08-01.jpg as its only local thumbnail filename, then YouTube only as a remote fallback.

No image assets were resized or recompressed in this version. The next step is to test this code first, then audit JPEG dimensions/file sizes if loading is still slow.
