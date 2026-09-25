v85 — desktop WORK/bio type + faster mobile header/menu motion

Replace these three files:
1. index.html
2. script.js
3. styles.css

projects.js is unchanged.

Changes:
- Desktop WORK is restored as a stronger navigation heading (600 weight).
- Contact/Bio paragraph text is forced to the thin 300 weight on desktop and mobile.
- Mobile name collapse now uses separate collapse/expand scroll thresholds to prevent the header-height change from causing a bounce/tension effect.
- Mobile name collapse is faster (about 170ms) and no longer animates line heights.
- Mobile menu close is faster; menu text fades almost immediately so WORK does not leave an after-image.
- CONTACT / BIO is raised higher in the mobile menu, including when the compact HAOHAO header is active.
- The Contact/Bio marker is now a larger solid black dot.
