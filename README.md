# SkunkScrape Web Console

Production-lean scaffold for a non-Firebase SkunkScrape web platform:

- **Frontend:** Next.js App Router + TypeScript + Tailwind
- **Backend:** FastAPI + SQLAlchemy + Alembic-ready layout
- **Queue/Cache:** Redis
- **Async jobs:** Celery
- **Database:** PostgreSQL
- **Edge:** Nginx
- **Runtime:** Docker Compose

## What is included

- Marketing landing page
- Auth-ready login placeholder flow
- Dashboard
- Create scrape job form
- Job list + job detail
- FastAPI health endpoint
- Job CRUD API
- Celery worker skeleton
- Dockerised local stack
- Nginx reverse proxy template
- Structured repo layout for production extension

## Run locally

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```

2. Start the stack:
   ```bash
   docker compose up --build
   ```

3. Open:
   - Frontend: `http://localhost:3000`
   - API docs: `http://localhost:8000/docs`

## Suggested next steps

- Replace placeholder auth with Auth.js, Keycloak, or your preferred IdP
- Add Alembic migrations
- Add RBAC tables and middleware
- Wire Celery tasks to your existing SkunkScrape plugins
- Add object storage for exports
- Add WebSocket or SSE updates for live job status

## Mapping to your current codebase

This scaffold is designed to wrap your existing Python execution flow:
- CLI orchestration in `main.py`
- desktop launcher concepts in `main_gui.py`
- collector/export patterns in `skunkscrape_final.py`

