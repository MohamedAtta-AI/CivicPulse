from pydantic import BaseSettings, AnyUrl


class Settings(BaseSettings):
    APP_NAME="CivicPulse"
    ENV: str = "dev"

    DATABASE_URL: AnyUrl = "postgresql://postgres:postgres@db:5432/mediapulse"

    class Config:
        env_file = ".env"

    @property
    def db_url(self):
        return f"postgresql+psycopg2://{self.db_user}:{self.db_pass}@{self.db_host}:{self.db_port}/{self.db_name}"


@lru_cache()
def get_settings():
    return Settings()