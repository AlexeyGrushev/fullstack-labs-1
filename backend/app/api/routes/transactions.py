from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.crud import account as crud_account
from app.crud import category as crud_category
from app.crud import transaction as crud_transaction
from app.db.session import get_db
from app.models.user import User
from app.schemas.transaction import TransactionCreate, TransactionRead, TransactionUpdate

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=list[TransactionRead])
def list_transactions(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return crud_transaction.get_transactions(db, current_user.id)


@router.post("", response_model=TransactionRead, status_code=status.HTTP_201_CREATED)
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if crud_account.get_account(db, data.account_id, current_user.id) is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Указанный счёт не найден")
    category = crud_category.get_category(db, data.category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Указанная категория не найдена")
    return crud_transaction.create_transaction(db, data, category, current_user.id)


@router.get("/{transaction_id}", response_model=TransactionRead)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transaction = crud_transaction.get_transaction(db, transaction_id, current_user.id)
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Операция не найдена")
    return transaction


@router.patch("/{transaction_id}", response_model=TransactionRead)
def update_transaction(
    transaction_id: int,
    data: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transaction = crud_transaction.get_transaction(db, transaction_id, current_user.id)
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Операция не найдена")

    if data.account_id is not None and crud_account.get_account(db, data.account_id, current_user.id) is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Указанный счёт не найден")

    category = None
    if data.category_id is not None:
        category = crud_category.get_category(db, data.category_id)
        if category is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Указанная категория не найдена")

    return crud_transaction.update_transaction(db, transaction, data, category)


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transaction = crud_transaction.get_transaction(db, transaction_id, current_user.id)
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Операция не найдена")
    crud_transaction.delete_transaction(db, transaction)
