from sqlmodel import SQLModel, Session, create_engine
from core.config import get_settings
from models import User  # Import models to register them with SQLModel

settings = get_settings()
# Only create engine if DB settings are provided
if all([settings.DB_USER, settings.DB_PASS, settings.DB_HOST, settings.DB_NAME]):
    engine = create_engine(settings.db_url, echo=(not settings.PROD))
else:
    engine = None

def init_db():
    if engine is None:
        # Skip DB initialization if no DB settings provided
        return
    # SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)


def get_session():
    if engine is None:
        raise RuntimeError("Database not configured")
    with Session(engine) as session:
        yield session