from typing import Literal
from functools import lru_cache
from pydantic import BaseSettings, Field, AnyUrl


class Settings(BaseSettings):
    APP_NAME: str = Field(default="CivicPulse", env="APP_NAME")
    PROD: bool = Field(default=False, env="PROD")
    DB_USER: str = Field(..., env="DB_USER")
    DB_PASS: str = Field(..., env="DB_PASS")
    DB_HOST: str = Field(..., env="DB_HOST")
    DB_PORT: int = Field(..., env="DB_PORT")
    DB_NAME: str = Field(default=5432, env="DB_NAME")


    class Config:
        env_file = ".env"

    @property
    def db_url(self) -> str:
        return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


@lru_cache()
def get_settings():
    return Settings()