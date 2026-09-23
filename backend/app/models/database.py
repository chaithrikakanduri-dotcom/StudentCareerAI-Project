import os
import pymysql


# ============================================================
# RAILWAY / LOCAL MYSQL DATABASE CONFIGURATION
# ============================================================

DB_HOST = os.getenv("MYSQLHOST", "localhost")
DB_USER = os.getenv("MYSQLUSER", "root")
DB_PASSWORD = os.getenv("MYSQLPASSWORD", "StudentCareer@123")
DB_NAME = os.getenv("MYSQLDATABASE", "student_career_ai")
DB_PORT = int(os.getenv("MYSQLPORT", "3306"))


def get_connection():
    """
    Creates and returns a MySQL database connection.
    Works with Railway MySQL and local MySQL.
    """

    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT,
        cursorclass=pymysql.cursors.DictCursor
    )

    return connection


if __name__ == "__main__":

    try:
        connection = get_connection()

        print("MySQL connection successful!")
        print("Database:", DB_NAME)

        connection.close()

        print("MySQL connection closed.")

    except Exception as e:

        print("MySQL connection failed!")
        print("Error:", e)