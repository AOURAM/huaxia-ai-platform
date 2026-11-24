# Huaxia backend on Light Cloud

Use the **Container / Dockerfile** deployment type, with the root directory blank so Light Cloud finds the root `Dockerfile`. Set the routed port to `8000`. Leave the build command empty. The Dockerfile installs `requirements-render.txt` with Python 3.12 and starts a single Uvicorn worker using `app.main:app`, `0.0.0.0`, and Light Cloud's `PORT`. Select **Micro (512 MB)** and set minimum instances to `0` for scale to zero. [Light Cloud Dockerfile settings](https://docs.light-cloud.com/platform/frameworks/docker)

Set these runtime variables in the environment settings.

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Existing **pooled** Neon connection string, entered as a secret |
| `SECRET_KEY` | A strong, stable JWT signing key, entered as a secret |
| `FRONTEND_ORIGIN` | Exact browser origin of the hosted frontend, for example `https://frontend.example.com` |
| `HUAXIA_AI_ENABLED` | `false`, also the Docker image default |

Local frontend origins on `http://localhost` and `http://127.0.0.1` with a port remain allowed. The frontend build should set `VITE_API_BASE_URL` to the Light Cloud API URL. After a deployment is approved, use `GET /health` to check startup and `GET /cities/` to check the existing database connection. Schema changes are run separately through Alembic.

Post images are stored under `uploads/posts` on one instance. Restarting, redeploying, or scaling to zero can lose the files, and another instance cannot serve them. Neon retains the post and its image URL, so an old image URL can return HTTP 404. On the serverless runtime these files also count toward instance memory. Treat uploads as temporary on this setup. [Container filesystem behavior](https://docs.cloud.google.com/run/docs/container-contract#file_system_access)

Git automation can build and release previews when a review branch changes. Turn off **Deploy on push** and **Deploy every branch** if releases must be started manually. [Light Cloud Git automation](https://docs.light-cloud.com/create/git-automation)
