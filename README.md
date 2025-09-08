# Cat and Dog Detector

## About

Cat and Dog Detector is a website that allows you to upload images and run them against a model trained to detect cats and dogs within images. It has features like uplaoding, downloading, detecting cats and dogs, and deleteing images.

## Technologies

The frontend is made using a Vite React app with TypeScript and TailwindCSS. The backend is made using FastAPI and it is accessed by the frontend using Axios. For the Database, SQlite was used and images are just stored as files. The model is a YOLO model using Ultralytics, for more information see <https://github.com/Nathan5471/Python-Class-Project>.

## Self-host

You can self host this with Docker! Just use the docker-compose.yaml and fill in the environment variable, then run docker-compose up -d and it will be available at {yourIP}:8000
