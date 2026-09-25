import uuid
from datetime import datetime, timedelta, timezone
from typing import Literal

import bcrypt
import jwt

from app.core.config import settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def _create_token(subject: int, expires_delta: timedelta, token_type: Literal["access", "refresh"], jti: str | None = None) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(subject),
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    if jti is not None:
        payload["jti"] = jti
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_access_token(user_id: int) -> str:
    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    return _create_token(user_id, expires_delta, "access")


def create_refresh_token(user_id: int) -> tuple[str, str, datetime]:
    jti = str(uuid.uuid4())
    expires_delta = timedelta(days=settings.refresh_token_expire_days)
    expires_at = datetime.now(timezone.utc) + expires_delta
    token = _create_token(user_id, expires_delta, "refresh", jti=jti)
    return token, jti, expires_at


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
