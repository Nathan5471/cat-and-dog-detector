from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from bcrypt import hashpw, gensalt, checkpw
from datetime import datetime, timedelta
from dependencies.authenticate import authenticate
import sqlite3
import jwt
import os

dbPath = "backend/app/database.db"

router = APIRouter()


@router.post("/register")
async def registerUser(username: str, password: str):
    connection = sqlite3.connect(dbPath)
    cursor = connection.cursor()
    userExists = cursor.execute(
        "SELECT * FROM users WHERE username = ?", (username,)
    ).fetchone()
    if userExists:
        connection.close()
        return JSONResponse(
            status_code=400, content={"error": "Username already exists"}
        )
    hashedPassword = hashpw(password.encode("utf-8"), gensalt())
    cursor.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (username, hashedPassword),
    )
    connection.commit()
    connection.close()
    return JSONResponse(
        status_code=201, content={"message": "User registered successfully"}
    )


@router.post("/login")
async def loginUser(username: str, password: str):
    connection = sqlite3.connect(dbPath)
    cursor = connection.cursor()
    user = cursor.execute(
        "SELECT * FROM users WHERE username = ?", (username,)
    ).fetchone()
    connection.close()
    if not user or not checkpw(password.encode("utf-8"), user[2]):
        return JSONResponse(
            status_code=401, content={"error": "Invalid username or password"}
        )
    response = JSONResponse(
        status_code=200, content={"message": "Login successful", "userId": user[0]}
    )
    JWT_SECRET = os.getenv("JWT_SECRET")
    tokenPayload = {
        "id": user[0],
        "iat": datetime.now(),
        "exp": datetime.now() + timedelta(days=30),
    }
    token = jwt.encode(tokenPayload, JWT_SECRET, algorithm="HS256")
    response.set_cookie(
        key="token",
        value=token,
        max_age=60 * 60 * 24 * 30,  # 30 days (I think)
        httponly=True,
        secure=True,
        samesite="Strict",
    )
    return response


@router.get("/self")
async def getCurrentUser(user: object = Depends(authenticate)):
    return JSONResponse(status_code=200, content={"id": user[0], "username": user[1]})
