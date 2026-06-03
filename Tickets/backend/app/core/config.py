from functools import lru_cache
import os
from pathlib import Path

from dotenv import dotenv_values

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]
dotenv_data = dotenv_values(BASE_DIR / ".env")
for key, value in dotenv_data.items():
    if value is not None:
        os.environ[key] = value


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Tickets API"
    api_v1_prefix: str = "/api/v1"

    jwt_secret_key: str = "change-this-secret-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    db_host: str = "localhost"
    db_port: int = 3306
    db_name: str = "tickets"
    db_user: str = "root"
    db_password: str = ""

    cors_origins: str = "http://localhost:5173,http://localhost:5174,http://localhost:3000"

    @property
    def database_url(self) -> str:
        return (
            f"mysql+pymysql://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
