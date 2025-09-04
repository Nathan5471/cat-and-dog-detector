import sqlite3
import os


def setupDatabase():
    dbPath = "backend/app/database.db"
    if not os.path.exists(dbPath):
        connection = sqlite3.connect(dbPath)
        cursor = connection.cursor()
        cursor.execute(
            """
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );            
        """
        )
        cursor.execute(
            """
            CREATE TABLE images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL REFERENCES users(id),
                imagePath TEXT NOT NULL,
                resultPath TEXT
            );
        """
        )
        connection.commit()
        connection.close()
        print("Database and tables created")
