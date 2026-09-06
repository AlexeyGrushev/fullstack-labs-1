from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from app.models.transaction_type import TransactionType


class TransactionBase(BaseModel):
    account_id: int
    category_id: int
    amount: float = Field(gt=0)
    description: str = Field(min_length=1, max_length=255)
    occurred_on: date


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    account_id: int | None = None
    category_id: int | None = None
    amount: float | None = Field(default=None, gt=0)
    description: str | None = Field(default=None, min_length=1, max_length=255)
    occurred_on: date | None = None


class TransactionRead(TransactionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: TransactionType
