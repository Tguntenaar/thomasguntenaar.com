# thomasguntenaar.com

Static site served from the repo root on **Cloudflare Workers** (static assets only — no `main` script).

## Contents

- **`index.html`** — site entry (served at `/`)
- **`assets/`** — static files (e.g. favicon); paths in HTML are relative to the root
- **`wrangler.jsonc`** — Worker name and `assets.directory` for deploy (not served; see `.assetsignore`)

## Deploy (Git + Cloudflare)

1. Connect this repo in **Workers & Pages** (Worker name matches `wrangler.jsonc` → `thomasguntenaar-com`).
2. **Build command:** leave empty.
3. **Deploy command:** `npx wrangler deploy`

Cloudflare will run `npm clean-install` only if a `package.json` exists; this repo has none, so deploy uses `npx`’s Wrangler directly.

## Local preview

Requires [Wrangler](https://developers.cloudflare.com/workers/wrangler/) and Cloudflare auth (e.g. `wrangler login` or `CLOUDFLARE_API_TOKEN`):

```bash
npx wrangler dev
```

## Secrets

Do not commit **`.env`**. For local `wrangler` against the API, use a token with **Workers Scripts → Edit** (and any other scopes your account needs). CI tokens are configured in the Cloudflare dashboard, not in this repo.
