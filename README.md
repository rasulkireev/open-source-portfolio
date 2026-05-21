# Open Source Portfolio

Presentation-style portfolio for Rasul Kireev's open-source work.

## Stack

- Static HTML, CSS, and JavaScript
- No build step
- GitHub Pages deployment through GitHub Actions

## Local Preview

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Editing

- Main page structure: `index.html`
- Visual design: `styles.css`
- Project data: `data.js`
- Rendering and interactions: `main.js`

## Deployment

Push to `main`. The workflow in `.github/workflows/pages.yml` publishes the repo root to GitHub Pages.

GitHub Pages from a private repository requires a GitHub plan that supports private-repo Pages. If Pages activation fails, either make this repository public when ready or enable a plan with private Pages support, then re-run the workflow.
