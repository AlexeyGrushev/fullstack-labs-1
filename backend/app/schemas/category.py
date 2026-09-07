from pydantic import BaseModel, ConfigDict, Field

from app.models.transaction_type import TransactionType


class CategoryBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    type: TransactionType


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    type: TransactionType | None = None


class CategoryRead(CategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
