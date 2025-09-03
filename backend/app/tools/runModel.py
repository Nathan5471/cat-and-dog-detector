from ultralytics import YOLO


def runModel(model: YOLO, imagePath: str):
    results = model.predict(
        source=imagePath, conf=0.4, save=True, project="backend/app/output"
    )
    return results
