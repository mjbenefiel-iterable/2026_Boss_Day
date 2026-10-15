# Boss's Day E-Card

A tongue-in-cheek Boss's Day card built around the "Overly Attached Girlfriend" meme. It thanks your manager for being a great leader in a completely normal, not-at-all-obsessive way.

The card opens from a cover page to a letter with a "totally normal things I definitely don't do" list, a live counter, a yes-or-yes question, and falling hearts.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:4317.

## Personalize it

Names come from the URL, so you can share one link per person:

- `?to=Amanda` sets the boss's name (defaults to Amanda)
- `?from=Sam` sets the signature (defaults to "Your Totally Normal Employee")

Example: `http://localhost:4317/?to=Amanda&from=Sam`

The "Copy link" button inside the card copies a link with these values filled in.

## Build

```bash
npm run build
```

The static site is written to `dist/` and can be hosted anywhere.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.

1. Push this repo to GitHub.
2. In the repo, go to **Settings > Pages** and set **Source** to **GitHub Actions**.
3. Re-run the "Deploy to GitHub Pages" workflow from the **Actions** tab (or push any commit).

The card will be live at `https://<your-username>.github.io/<repo-name>/`. Add `?from=YourName` to sign it.
