from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import Base, engine, get_db
from app.schemas.job import JobCreate, JobRead
from app.services.jobs import create_job, get_job, list_jobs
from app.workers.tasks import queue_job

Base.metadata.create_all(bind=engine)

router = APIRouter()


@router.get("", response_model=list[JobRead])
def read_jobs(db: Session = Depends(get_db)):
    return list_jobs(db)


@router.post("", response_model=JobRead, status_code=201)
def create_new_job(payload: JobCreate, db: Session = Depends(get_db)):
    job = create_job(db, payload)
    queue_job.delay(job.id)
    return job


@router.get("/{job_id}", response_model=JobRead)
def read_job(job_id: int, db: Session = Depends(get_db)):
    job = get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
