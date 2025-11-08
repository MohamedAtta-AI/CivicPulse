import datetime
from typing import Literal
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4


class Post(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime.datetime
    content: str
    source: str
    url: str
    score: int
    comments: list["Comment"] = Relationship(back_populates="post")


class Comment(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime.datetime
    content: str
    post_id: UUID = Field(foreign_key="post.id")
    post: Post = Relationship(back_populates="comments")