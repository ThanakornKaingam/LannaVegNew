import os
from dotenv import load_dotenv
from typing import List
from pathlib import Path


# ========================
# Load Environment File
# ========================

# ชี้ไปที่โฟลเดอร์ backend โดยตรง
BASE_DIR = Path(__file__).resolve().parent.parent

ENV_PATH = BASE_DIR / ".env.dev"

if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
    print(f"Loaded ENV from: {ENV_PATH}")
else:


class Settings:

    # ========================
    # 🌍 Environment
    # ========================
    ENV: str = os.getenv("ENV", "dev")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # ========================
    # 🗄 Database
    # ========================
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./app.db"
    )

    # ========================
    # 🔐 JWT
    # ========================
    SECRET_KEY: str = os.getenv("SECRET_KEY", "devsecretkey")
    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)
    )

    REFRESH_TOKEN_EXPIRE_DAYS: int = int(
        os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7)
    )

    # ========================
    # 🔑 Google OAuth
    # ========================
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "")

    # ========================
    # 🌐 Frontend URL
    # ========================
    FRONTEND_URL: str = os.getenv(
        "FRONTEND_URL",
        "http://localhost:3000"
    )

    # ========================
    # 🌐 CORS
    # ========================
    ALLOWED_ORIGINS: List[str] = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000"
    ).split(",")

    # ========================
    # 🗺 Google Maps
    # ========================
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")

    # ========================
    # 🤖 Model Path
    # ========================
    MODEL_PATH: str = os.getenv(
        "MODEL_PATH",
        "app/ml/MobileNetV3-Large.pt"
    )

    # ========================
    # Validate Critical Config
    # ========================
    def validate(self):
        if self.ENV == "prod" and not self.SECRET_KEY:
            raise ValueError("SECRET_KEY is required in production.")

        if not self.GOOGLE_CLIENT_ID:
            raise ValueError("GOOGLE_CLIENT_ID is empty. Check .env.dev")

        if not self.GOOGLE_CLIENT_SECRET:
            raise ValueError("GOOGLE_CLIENT_SECRET is empty. Check .env.dev")


settings = Settings()
settings.validate()
