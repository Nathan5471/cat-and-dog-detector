from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import JSONResponse, FileResponse
from ultralytics import YOLO
from dependencies.authenticate import authenticate
from tools.runModel import runModel
import os
import sqlite3

dbPath = "backend/app/database.db"

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
async def uploadImage(
    file: UploadFile = File(...), user: tuple = Depends(authenticate)
):
    connection = sqlite3.connect(dbPath)
    cursor = connection.cursor()
    cursor.execute("INSERT INTO images (userId) VALUES (?)", (user[0],))
    imageId = cursor.lastrowid
    imageExtension = file.filename.split(".")[-1]
    imagePath = f"backend/app/upload/{user[0]}/{imageId}.{imageExtension}"
    if not os.path.exists(f"backend/app/upload/{user[0]}"):
        os.makedirs(f"backend/app/upload/{user[0]}")
    with open(imagePath, "wb") as image:
        image.write(await file.read())
    cursor.execute("UPDATE images SET imagePath = ? WHERE id = ?", (imagePath, imageId))
    connection.commit()
    connection.close()
    return JSONResponse(
        status_code=201,
        content={"message": "Image uploaded successfully", "imagePath": imagePath},
    )


@router.post("/detect")
async def detectImage(imageId: str, user: tuple = Depends(authenticate)):
    connection = sqlite3.connect(dbPath)
    cursor = connection.cursor()
    image = cursor.execute("SELECT * FROM images WHERE id = ?", (imageId)).fetchone()
    if not image:
        connection.close()
        return JSONResponse(status_code=404, content={"error": "Image not found"})
    if image[1] != user[0]:
        connection.close()
        return JSONResponse(
            status_code=403, content={"error": "Not authorized to access this image"}
        )
    if image[3]:
        connection.close()
        return JSONResponse(
            status_code=200, content={"message": "Image already processed"}
        )
    imagePath = image[2]
    runModel(model, imagePath, str(image[1]))
    outputPath = f"backend/app/output/{user[0]}/{imageId}.jpg"
    cursor.execute(
        "UPDATE images SET resultPath = ? WHERE id = ?", (outputPath, imageId)
    )
    connection.commit()
    connection.close()
    return JSONResponse(status_code=200, content={"message": "Success"})


@router.get("/image/{imageId}")
async def getImage(imageId: str, user: tuple = Depends(authenticate)):
    connection = sqlite3.connect(dbPath)
    cursor = connection.cursor()
    image = cursor.execute("SELECT * FROM images WHERE id = ?", (imageId,)).fetchone()
    connection.close()
    if not image:
        return JSONResponse(status_code=404, content={"error": "Image not found"})
    if image[1] != user[0]:
        return JSONResponse(
            status_code=403, content={"error": "Not authorized to access this image"}
        )
    if not image[2]:
        return JSONResponse(
            status_code=404, content={"error": "Image doesn't have path set"}
        )
    return FileResponse(image[2])


@router.get("/result/{imageId}")
async def getResult(imageId: str, user: tuple = Depends(authenticate)):
    connection = sqlite3.connect(dbPath)
    cursor = connection.cursor()
    image = cursor.execute("SELECT * FROM images WHERE id = ?", (imageId,)).fetchone()
    connection.close()
    if not image:
        return JSONResponse(status_code=404, content={"error": "Image not found"})
    if image[1] != user[0]:
        return JSONResponse(
            status_code=403, content={"error": "Not authorized to access this image"}
        )
    if not image[3]:
        return JSONResponse(
            status_code=404, content={"error": "Image hasn't been processed yet"}
        )
    return FileResponse(image[3])


@router.get("/images")
async def userImages(user: tuple = Depends(authenticate)):
    connection = sqlite3.connect(dbPath)
    cursor = connection.cursor()
    images = cursor.execute(
        "SELECT id FROM images WHERE userId = ?", (user[0],)
    ).fetchall()
    connection.close()
    imageIds = [image[0] for image in images]
    return JSONResponse(status_code=200, content={"imageIds": imageIds})
