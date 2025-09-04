from ultralytics import YOLO


def runModel(model: YOLO, imagePath: str, userId: str):
    results = model.predict(
        source=imagePath, conf=0.4, save=True, project="backend/app/output", name=userId
    )
    return results
