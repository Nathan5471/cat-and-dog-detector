from fastapi import APIRouter
from fastapi.responses import JSONResponse
from bcrypt import hashpw, gensalt, checkpw
import sqlite3

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
    return JSONResponse(
        status_code=200, content={"message": "Login successful", "userId": user[0]}
    )
