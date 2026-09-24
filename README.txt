v84 — mobile smoothness, focus-driven project info, desktop type consistency

Replace these three files:
1. index.html
2. script.js
3. styles.css

projects.js is unchanged.

Changes:
- Mobile HAOHAO QIAOSHI LIU collapse is rebuilt around one clipped container instead of animating each line's height, reducing scroll reflow.
- Opening the mobile work menu no longer forces the collapsed name to expand at the same time.
- Mobile menu now uses a short fade/translate transition rather than moving a full viewport from -100%, and the old filter cascade animation is disabled on mobile.
- Mobile homepage automatically shows number/title/type/year only on the project nearest the visual center of the viewport. The info moves to the next project as scrolling changes focus and is removed from all other cards.
- Mobile hover/focus side effects are neutralized so touched cards do not keep stale overlays.
- Desktop project titles stay at one constant regular weight instead of becoming bold on hover/focus.
- Desktop nav/filter weights are also fixed to one weight, font synthesis is disabled, and Google Inter uses display=optional to reduce late font-weight-looking swaps.
