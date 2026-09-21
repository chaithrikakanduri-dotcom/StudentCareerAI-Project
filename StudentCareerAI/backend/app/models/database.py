import pymysql


# MySQL database configuration
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "StudentCareer@123"
DB_NAME = "student_career_ai"
DB_PORT = 3306


def get_connection():
    """
    Creates and returns a connection to MySQL.
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