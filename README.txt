REEL UPDATE: Native Vimeo player with early loading.

Replace the site root script.js with this file. Commit and push it.
For cache refresh, change the index.html script tag version from script.js?v=109 to script.js?v=110 (or a newer number).

Vimeo loads as soon as this script runs, showing Vimeo's own thumbnail and play controls. Clicking Reel shows the same already-loaded player. Video stream start still depends on Vimeo and the viewer's network; truly zero latency cannot be guaranteed.

No CSS changes or separate thumbnail uploads are needed.
