from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.job import JobStatus, ScrapeJob
from app.schemas.job import JobCreate


def list_jobs(db: Session) -> list[ScrapeJob]:
    return list(db.scalars(select(ScrapeJob).order_by(ScrapeJob.created_at.desc())))


def create_job(db: Session, payload: JobCreate) -> ScrapeJob:
    job = ScrapeJob(
        name=payload.name,
        plugin=payload.plugin,
        target=payload.target,
        depth=payload.depth,
        status=JobStatus.queued,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def get_job(db: Session, job_id: int) -> ScrapeJob | None:
    return db.get(ScrapeJob, job_id)
