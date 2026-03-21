from fastapi import APIRouter

from app.api.v1.routes import health, jobs

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
