from typing import Literal, Optional
from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    APP_NAME: str = Field(default="CivicPulse")
    PROD: bool = Field(default=False)
    POSTGRES_USER: Optional[str] = Field(default=None)
    POSTGRES_PASS: Optional[str] = Field(default=None)
    POSTGRES_HOST: Optional[str] = Field(default=None)
    POSTGRES_PORT: Optional[int] = Field(default=5432)
    POSTGRES_NAME: Optional[str] = Field(default=None)
    
    # Groq LLM settings
    GROQ_API_KEY: Optional[str] = Field(default=None)
    GROQ_MODEL: str = Field(default="llama-3.1-70b-versatile")

    class Config:
        # Look for .env file in the server directory
        env_file = str(Path(__file__).parent.parent / ".env")
        case_sensitive = False

    @property
    def db_url(self) -> str:
        return f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASS}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_NAME}"


@lru_cache()
def get_settings():
    return Settings()