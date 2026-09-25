from sqlalchemy.orm import Session

from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate


def get_account(db: Session, account_id: int, user_id: int) -> Account | None:
    return db.query(Account).filter(Account.id == account_id, Account.user_id == user_id).first()


def get_accounts(db: Session, user_id: int) -> list[Account]:
    return list(
        db.query(Account).filter(Account.user_id == user_id).order_by(Account.id).all()
    )


def create_account(db: Session, data: AccountCreate, user_id: int) -> Account:
    account = Account(**data.model_dump(), user_id=user_id)
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def update_account(db: Session, account: Account, data: AccountUpdate) -> Account:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(account, field, value)
    db.commit()
    db.refresh(account)
    return account


def delete_account(db: Session, account: Account) -> None:
    db.delete(account)
    db.commit()
