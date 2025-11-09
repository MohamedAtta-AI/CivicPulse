from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import get_settings
from db import init_db
from api.dashboard import router as dashboard_router
from api.v1 import chat, retrieval
from api.auth import router as auth_router

settings = get_settings()
app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in dev; tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(chat.router)
app.include_router(retrieval.router)


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
