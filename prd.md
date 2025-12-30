## Brief Hub (for GitHub Pages)

This folder is a **static web page** used to share briefs externally.

### Files

- `Branding/BFIndex/index.html`: the hub page (cards + search + filters)
- `Branding/BFIndex/briefs.json`: the single source of truth for all brief links
- `Branding/BFIndex/styles.css`: styling
- `Branding/BFIndex/app.js`: loads `briefs.json` and renders cards

### How to add a new brief

1. Put the brief file(s) in the repo (HTML/MD/CSV + images if needed).
2. Add a new item to `Branding/BFIndex/briefs.json`:
   - `title`, `category`, `format` (`html`/`md`/`csv`)
   - `path`: **relative link from `Branding/BFIndex/index.html`**
   - `date` (optional, `YYYY-MM-DD`)
   - `description`, `tags`
3. Commit & push to GitHub.

### GitHub Pages note

If you enable GitHub Pages from the repository root, you can share:

- `.../Branding/BFIndex/index.html`

(Or set up a Pages workflow to publish just this folder.)