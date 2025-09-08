from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from tools.setupDb import setupDatabase
from routers import images, users
import os

try:
    load_dotenv(dotenv_path="backend/.env")
except Exception as e:
    print("Error loading .env file:", e)
    print("This is fine if you are using docker")

setupDatabase()

app = FastAPI()

app.include_router(users.router, prefix="/api/auth", tags=["auth"])
app.include_router(images.router, prefix="/api/images", tags=["images"])

# Handle serving the frontend
app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")


@app.get("/{fullPath:path}")
async def serveFrontend(fullPath: str):
    indexPath = "frontend/dist/index.html"
    if os.path.exists(indexPath):
        return FileResponse(indexPath, media_type="text/html")
