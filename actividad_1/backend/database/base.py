from sqlalchemy.orm import declarative_base

from database.connection import SessionLocal

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
