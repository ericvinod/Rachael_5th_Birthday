# Rachael's 5th Birthday – GitHub Pages edition

Two parts: the **website** (GitHub Pages, static) and a tiny **API worker** (Cloudflare Workers, free) that holds the
database credentials so the browser code never contains them.

## 1. Database (once)
Run `schema.sql` in your database's SQL editor. It creates EMPTY tables.

## 2. Deploy the API worker
Easiest, no tools: Cloudflare dashboard > Workers & Pages > Create > "Hello World" worker > Edit code >
paste the contents of `worker/worker.js` > Deploy. Copy the address it gives you (https://xxx.workers.dev).
Do NOT upload files; use "Hello World" + paste code (an uploaded wrangler.toml makes Deploy greyed out).
The credentials are already inside worker.js; you may instead set Worker variables `DB_URL` and `DB_KEY`.

## 3. Point the site at the worker
Edit `config.js` and replace the address with your worker's address (no trailing slash).

## 4. Publish on GitHub Pages
Upload everything EXCEPT the `worker/` folder (optional to leave it) to a GitHub repo, then
Settings > Pages > Deploy from branch > main / root. Your site: https://<user>.github.io/<repo>/
The invite's gift-registry link is that address followed by `#registry`.
