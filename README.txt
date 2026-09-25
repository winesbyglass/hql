v86 — mobile header smoothness, stronger project preview info, thin Contact/Bio

Replace these three files:
1. index.html
2. script.js
3. styles.css

projects.js is unchanged.

Changes:
- Mobile header is now fixed instead of sticky, so collapsing QIAOSHI / LIU cannot reflow the page or kick the scroll position. This removes the jerky tension effect.
- Collapse timing is shortened to about 135ms with stable 72px / 20px thresholds.
- Mobile project preview title is increased to 600 weight; project number/meta are increased to 500 weight.
- Contact/Bio paragraphs now explicitly use Inter Light (300) rather than depending on an installed Neue Haas weight. This applies on desktop and mobile.
- Google Inter uses display=swap again so the actual 300-weight font is loaded rather than falling back to a heavier system face.
- CONTACT / BIO now uses a 13px CSS-drawn solid black circle, so the symbol is substantially more visible and does not depend on glyph rendering.
