# Family Office Dashboard

Local React dashboard with an Express API and Postgres-ready data layer.

## Run locally

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:4174/api/dashboard`

## Postgres

Copy `.env.example` to `.env` and set `DATABASE_URL`. The API creates and seeds the dashboard tables on first boot if they are empty. Without `DATABASE_URL`, the app uses local seed data so the dashboard still works.
