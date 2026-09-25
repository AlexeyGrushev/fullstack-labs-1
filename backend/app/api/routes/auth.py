import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from app.crud import refresh_token as crud_refresh_token
from app.crud import user as crud_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.token import AccessTokenResponse, RefreshRequest, TokenPair
from app.schemas.user import UserCreate, UserLogin, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


def _issue_token_pair(db: Session, user_id: int) -> TokenPair:
    access_token = create_access_token(user_id)
    refresh_token, jti, expires_at = create_refresh_token(user_id)
    crud_refresh_token.create_refresh_token(db, user_id, jti, expires_at)
    return TokenPair(access_token=access_token, refresh_token=refresh_token)


@router.post("/register", response_model=TokenPair, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if crud_user.get_user_by_email(db, data.email) is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пользователь с таким email уже существует")
    user = crud_user.create_user(db, data)
    return _issue_token_pair(db, user.id)


@router.post("/login", response_model=TokenPair)
def login(data: UserLogin, db: Session = Depends(get_db)):
    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный email или пароль"
    )
    user = crud_user.get_user_by_email(db, data.email)
    if user is None or not verify_password(data.password, user.hashed_password):
        raise invalid_credentials
    return _issue_token_pair(db, user.id)


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh(data: RefreshRequest, db: Session = Depends(get_db)):
    invalid_refresh = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Недействительный refresh token"
    )
    try:
        payload = decode_token(data.refresh_token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Срок действия refresh token истёк")
    except jwt.InvalidTokenError:
        raise invalid_refresh

    if payload.get("type") != "refresh" or "jti" not in payload:
        raise invalid_refresh

    stored = crud_refresh_token.get_by_jti(db, payload["jti"])
    if stored is None or not crud_refresh_token.is_active(stored):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token отозван или недействителен")

    access_token = create_access_token(int(payload["sub"]))
    return AccessTokenResponse(access_token=access_token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(data: RefreshRequest, db: Session = Depends(get_db)):
    try:
        payload = decode_token(data.refresh_token)
    except jwt.InvalidTokenError:
        return
    jti = payload.get("jti")
    if not jti:
        return
    stored = crud_refresh_token.get_by_jti(db, jti)
    if stored is not None:
        crud_refresh_token.revoke(db, stored)


@router.get("/me", response_model=UserRead)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user
