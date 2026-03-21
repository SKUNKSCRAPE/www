from datetime import datetime
from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    plugin: str = Field(min_length=2, max_length=120)
    target: str = Field(min_length=3)
    depth: int = Field(default=2, ge=1, le=10)


class JobRead(BaseModel):
    id: int
    name: str
    plugin: str
    target: str
    depth: int
    status: str
    result_path: str | None = None
    error_message: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
