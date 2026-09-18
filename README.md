# Haohao Qiaoshi Liu Portfolio — v24

Changes in this version:

- Contact now has its own browser history state. Opening Contact pushes `#contact`, so the browser Back button returns to the homepage. Browser Forward reopens Contact.
- Contact close button, backdrop click, and Escape all use the same history-aware close behavior.
- Contact page includes a designed headshot slot.

## Add your headshot

1. Add your portrait to the `assets` folder.
2. Name it exactly: `headshot.jpg`
3. Recommended source: vertical portrait, ideally 4:5 or slightly taller, at least 1600 px on the long edge.

The site applies a subtle editorial treatment automatically: restrained saturation, controlled contrast, a soft white shading veil, edge light, and a very fine frame so the image blends into the white contact page rather than looking pasted on.

If `assets/headshot.jpg` is missing, the contact page shows a quiet placeholder telling you where to put the file.
