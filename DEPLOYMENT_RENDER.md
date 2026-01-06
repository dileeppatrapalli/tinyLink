# Deploying TinyLink to Render

This file contains focused, copy-paste steps to deploy `TinyLink` to Render using a managed Postgres database.

1. Push your repo to GitHub (or another provider) and ensure your default branch is `main` (or note the branch name).

2. On Render:
   - Create a new **Postgres** instance (Managed Database) and copy the `DATABASE_URL` connection string.
   - Create a new **Web Service** and connect your repository.
     - Branch: `main`
     - Environment: `Node`
     - Build Command: `npm ci`
     - Start Command: `npm start`
     - Release Command: `npm run migrate:node`

3. In the Web Service's Environment variables, add:
   - `DATABASE_URL` = (value from the managed Postgres)
   - `NODE_ENV` = `production`

4. Deploy. The Release Command will run migrations, then the web service will start.

Local testing (PowerShell):
```powershell
$env:DATABASE_URL = 'postgres://user:pass@host:5432/dbname'
npm run migrate:node
npm start
```

Files included to help deploy:
- `render.yaml` — optional Render descriptor for Git-based deploys.
- `Procfile` — Heroku/Procfile-compatible start and release entries.
- `.env.example` — example local env vars.

If you'd like, I can generate a `render.yaml` with more advanced settings (health checks, region, plan), or produce a `render.json` for Render's CLI. Tell me which you'd prefer.
