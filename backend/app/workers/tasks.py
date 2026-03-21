from app.db.session import SessionLocal
from app.models.job import JobStatus, ScrapeJob
from app.workers.celery_app import celery_app


@celery_app.task(name="queue_job")
def queue_job(job_id: int):
    db = SessionLocal()
    try:
        job = db.get(ScrapeJob, job_id)
        if not job:
            return
        job.status = JobStatus.running
        db.commit()

        # TODO: replace this placeholder with your existing SkunkScrape plugin execution.
        # Example:
        # subprocess.run(["python", "-m", f"skunkscrape.plugins.{job.plugin}", "--url", job.target], check=True)

        job.status = JobStatus.completed
        job.result_path = f"/exports/job-{job.id}.csv"
        db.commit()
    except Exception as exc:
        job = db.get(ScrapeJob, job_id)
        if job:
            job.status = JobStatus.failed
            job.error_message = str(exc)
            db.commit()
        raise
    finally:
        db.close()
