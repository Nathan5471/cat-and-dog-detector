from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import os
from tools.runModel import runModel

app = FastAPI()

model = YOLO("backend/my_model.pt")
print("Model loaded")

if not os.path.exists("backend/app/upload"):
    os.makedirs("backend/app/upload")
    print("Upload directory created")

if not os.path.exists("backend/app/output"):
    os.makedirs("backend/app/output")
    print("Output directory created")


@app.post("/upload")
async def uploadImage(file: UploadFile = File(...)):
    imagePath = f"backend/app/upload/{file.filename}"
    with open(imagePath, "wb") as image:
        image.write(await file.read())
    return {"imagePath": imagePath}


@app.post("/detect")
async def detectImage(imagePath: str):
    print("Running model")
    results = runModel(model, imagePath)
    print("Model results:")
    print(results)
    return {"results": "Testing"}
