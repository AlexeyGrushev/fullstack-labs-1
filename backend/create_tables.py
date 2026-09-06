from app.db.base import Base
from app.db.session import engine
from app.models import Account, Category, Transaction  # noqa: F401

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Таблицы созданы")
