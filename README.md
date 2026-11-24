# svelte-auth0-spa

A Svelte 5 single-page app where you log in with Auth0 and call a protected API.

When you log in, the app sends you to Auth0 and receives an access token when you come back. The token goes into a secure cookie, and every request the app makes to `/api` carries it to the backend. When you log out, the token is revoked and the session is cleared.

The API is a small FastAPI server, included so you can try all of it on your machine. Its OpenAPI contract lives in `api/openapi.json`, and the app's API client is generated from that contract instead of being written by hand.

## Run it

1. In your Auth0 dashboard, create a **Single Page Application** and an **API** (identifier `api`). In the application settings, add `http://localhost:5173/auth/callback` as a callback URL, and `http://localhost:5173` as a logout URL and web origin.
2. Copy `.env.example` to `.env` and fill in your Auth0 domain and client ID.
3. Start everything:

   ```sh
   mise install   # node, pnpm, python, uv
   pnpm install   # also generates the API client
   pnpm api       # API on http://localhost:3001
   pnpm dev       # app on http://localhost:5173
   ```

4. Open http://localhost:5173, log in, and click **Call GET /api/me** to see what the backend knows about you.

## Changing the API

After changing `api/main.py`, run:

```sh
pnpm generate
```

This writes a new `api/openapi.json` from the FastAPI app and regenerates the client in `client/lib/api`.

## Read more

The full walkthrough is in the article: [Single Page Application Authentication in Svelte 5 Using Auth0](TODO-article-link).

---

This code is provided free, courtesy of [MB Jepanana](https://www.jepanana.lt/), a software agency. For client work, contact us at [hello@jepanana.com](mailto:hello@jepanana.com).
