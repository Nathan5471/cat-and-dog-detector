from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import os
from tools.runModel import runModel

router = APIRouter()

model = YOLO("backend/my_model.pt")
print("Model loaded")

if not os.path.exists("backend/app/upload"):
    os.makedirs("backend/app/upload")
    print("Upload directory created")

if not os.path.exists("backend/app/output"):
    os.makedirs("backend/app/output")
    print("Output directory created")


@router.post("/upload")
async def uploadImage(file: UploadFile = File(...)):
    imagePath = f"backend/app/upload/{file.filename}"
    with open(imagePath, "wb") as image:
        image.write(await file.read())
    return JSONResponse(
        status_code=201,
        content={"message": "Image uploaded successfully", "imagePath": imagePath},
    )


@router.post("/detect")
async def detectImage(imagePath: str):
    print("Running model")
    results = runModel(model, imagePath)
    print("Model results:")
    print(results)
    return JSONResponse(status_code=200, content={"results": results})
