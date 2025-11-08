from sqlmodel import SQLModel, Session, create_engine
from server.core import get_settings

settings = get_settings()
engine = create_engine(settings.db_url, echo=(not settings.PROD))

def init_db():
    # SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session