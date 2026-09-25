from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate


def get_transaction(db: Session, transaction_id: int, user_id: int) -> Transaction | None:
    return (
        db.query(Transaction)
        .filter(Transaction.id == transaction_id, Transaction.user_id == user_id)
        .first()
    )


def get_transactions(db: Session, user_id: int) -> list[Transaction]:
    return list(
        db.query(Transaction)
        .filter(Transaction.user_id == user_id)
        .order_by(Transaction.occurred_on.desc())
        .all()
    )


def create_transaction(
    db: Session, data: TransactionCreate, category: Category, user_id: int
) -> Transaction:
    transaction = Transaction(**data.model_dump(), type=category.type, user_id=user_id)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def update_transaction(
    db: Session,
    transaction: Transaction,
    data: TransactionUpdate,
    category: Category | None = None,
) -> Transaction:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(transaction, field, value)
    if category is not None:
        transaction.type = category.type
    db.commit()
    db.refresh(transaction)
    return transaction


def delete_transaction(db: Session, transaction: Transaction) -> None:
    db.delete(transaction)
    db.commit()
