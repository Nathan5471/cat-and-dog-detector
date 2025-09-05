from ultralytics import YOLO
import os


def runModel(model: YOLO, imagePath: str, userId: str):
    fileName = imagePath.split("/")[-1]
    if os.path.exists(
        f"backend/app/output/{userId}/{fileName}"
    ):  # Prevents it from making a new folder with a 2 at the end of the userid
        return "Output already exists for image"
    results = model.predict(
        source=imagePath,
        conf=0.4,
        save=True,
        project="backend/app/output",
        name=userId,
        exist_ok=True,
    )
    return results
