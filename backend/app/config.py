"""Settings. One real .env lives at the repo root (git-ignored)."""
from functools import lru_cache
from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(ROOT / ".env"), extra="ignore")

    paypal_base_url: str = "https://api-m.sandbox.paypal.com"
    paypal_client_id: str = Field("", validation_alias=AliasChoices("PAYPAL_CLIENT_ID", "CLIENT_ID"))
    paypal_client_secret: str = Field("", validation_alias=AliasChoices("PAYPAL_CLIENT_SECRET", "SECRET_KEY"))
    paypal_webhook_id: str = ""
    buyer_email: str = Field("", validation_alias=AliasChoices("BUYER_EMAIL", "PAYPAL_BUYER_EMAIL"))
    merchant_email: str = ""
    allow_unverified_webhooks: bool = False  # local testing only, never in production

    public_base_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:3000"
    cors_origins: str = "http://localhost:3000"
    database_url: str = f"sqlite:///{ROOT / 'edflow.sqlite'}"
    demo_admin_key: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()
