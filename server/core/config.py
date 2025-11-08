from typing import Literal, Optional
from functools import lru_cache
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    APP_NAME: str = Field(default="CivicPulse")
    PROD: bool = Field(default=False)
    DB_USER: Optional[str] = Field(default=None)
    DB_PASS: Optional[str] = Field(default=None)
    DB_HOST: Optional[str] = Field(default=None)
    DB_PORT: Optional[int] = Field(default=5432)
    DB_NAME: Optional[str] = Field(default=None)

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def db_url(self) -> str:
        return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


@lru_cache()
def get_settings():
    return Settings()