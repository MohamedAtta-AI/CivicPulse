import datetime
from typing import Literal
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4


class DataPoint(SQLModel, table=True):
    post_id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime.datetime
    content: str
    content_type: Literal["post", "comment"]
    source: str