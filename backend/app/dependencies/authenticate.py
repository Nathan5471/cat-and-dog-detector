from fastapi import Cookie, HTTPException, status
import jwt
import sqlite3
import os

dbPath = "backend/app/database.db"


def authenticate(token: str = Cookie(None)):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token"
        )
    try:
        JWT_SECRET = os.getenv("JWT_SECRET")
        id = jwt.decode(token, JWT_SECRET, algorithms=["HS256"]).get("id")
        if not id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
            )
        connection = sqlite3.connect(dbPath)
        cursor = connection.cursor()
        user = cursor.execute("SELECT * FROM users WHERE id = ?", (id,)).fetchone()
        connection.close()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return user
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token verification failed"
        )
    except Exception as e:
        print("Error:", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )
