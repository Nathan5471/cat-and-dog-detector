from fastapi import FastAPI
from dotenv import load_dotenv
from tools.setupDb import setupDatabase
from routers import images, users

load_dotenv(dotenv_path="backend/.env")

setupDatabase()

app = FastAPI()

app.include_router(users.router, prefix="/api/auth", tags=["auth"])
app.include_router(images.router, prefix="/api/images", tags=["images"])
