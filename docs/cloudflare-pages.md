# Huaxia frontend on Cloudflare Pages

Use a **Free Cloudflare Pages** project with **Direct Upload** for manual releases. The frontend is a static React app. The existing Light Cloud backend and Neon database stay separate.

| Setting | Value |
| --- | --- |
| Project name | `huaxia-frontend`, or another available name |
| Build root | `frontend` |
| Node.js | `22.12` or later |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Build variable | `VITE_API_BASE_URL=https://main-huaxia-api-maroua-workspace.light-cloud.io` |

Set `VITE_API_BASE_URL` in the shell running the build, or as a Pages build variable if using Git integration. Vite embeds it in the public bundle. Put only the public API URL there. For local development, `npm run dev` falls back to `http://127.0.0.1:8000` when the variable is unset.

For a manual release, build from `frontend/`, then upload `dist/` to the Pages project after approval. `frontend/wrangler.json` declares the build output for Wrangler. Cloudflare Pages serves `index.html` on client-side routes such as `/login`, `/feed`, and `/onboarding` through its default SPA fallback. Keep the output free of a top-level `404.html`.

Before testing the hosted frontend, set `FRONTEND_ORIGIN` on the Light Cloud backend to the exact Pages origin assigned to the project, for example `https://huaxia-frontend.pages.dev`. An origin has no path. Changing that backend environment setting may redeploy the API, so coordinate it with the approved release. Localhost development remains allowed by the API.

## API inventory

Every Huaxia API request goes through the shared HTTP client in `frontend/src/lib/http.ts`.

| Feature | Method and path |
| --- | --- |
| Login and registration | `POST /users/login`, `POST /users/` |
| Profile and session | `GET /users/me`, `PATCH /users/me` |
| Onboarding | `GET /users/me/onboarding/`, `PUT /users/me/onboarding/` |
| Feed and search | `GET /feed/`, `GET /posts/`, `GET /posts/top`, `POST /posts/search` |
| Posts | `POST /posts/`, `GET /posts/{id}`, `GET /posts/{id}/detail`, `PUT /posts/{id}`, `DELETE /posts/{id}`, `POST /posts/{id}/react` |
| Comments | `GET /posts/{id}/comments`, `POST /posts/{id}/comments`, `PUT /comments/{id}`, `DELETE /comments/{id}` |
| Cities | `GET /cities/`, `GET /cities/{slug}/posts` |
| Culture events | `GET /culture-events/`, `POST /culture-events/` |

Relative post and city images use the same API base. External avatar, map, font, and image URLs keep their own hosts.

[Cloudflare Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/) · [SPA routing](https://developers.cloudflare.com/pages/configuration/serving-pages/#single-page-application-spa-rendering)
