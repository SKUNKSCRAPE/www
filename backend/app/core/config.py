from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://skunkscrape:skunkscrape@db:5432/skunkscrape"
    redis_url: str = "redis://:changeme@redis:6379/0"
    secret_key: str = "change-this-in-production"
    access_token_expire_minutes: int = 1440
    backend_cors_origins: List[str] | str = ["http://localhost:3000"]

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def parse_cors(cls, v):
        if isinstance(v, str):
            return [item.strip() for item in v.split(",") if item.strip()]
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
