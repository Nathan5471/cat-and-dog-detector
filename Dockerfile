FROM node:22 AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.13 AS backend
WORKDIR /
COPY --from=frontend /frontend/dist ./frontend/dist
COPY backend/ ./backend
COPY backend/requirements.txt ./backend/requirements.txt
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0
RUN pip install -r backend/requirements.txt

EXPOSE 8000
CMD ["fastapi", "run", "backend/app/main.py", "--port", "8000"]
