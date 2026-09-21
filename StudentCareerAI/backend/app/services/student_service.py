from app.models.database import get_connection

from werkzeug.security import generate_password_hash, check_password_hash


def create_student(
    name,
    email,
    password,
    education=None,
    experience_years=0,
    resume_text=None
):
    """
    Saves a new student into the students table.
    Password is stored as a secure hash.
    """

    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:

            # Check whether email already exists
            cursor.execute(
                """
                SELECT email
                FROM students
                WHERE email = %s
                """,
                (email,)
            )

            existing_student = cursor.fetchone()

            if existing_student:
                return {
                    "success": False,
                    "message": "An account with this email already exists."
                }

            password_hash = generate_password_hash(password)

            sql = """
                INSERT INTO students
                (
                    name,
                    email,
                    password_hash,
                    education,
                    experience_years,
                    resume_text
                )
                VALUES (%s, %s, %s, %s, %s, %s)
            """

            cursor.execute(
                sql,
                (
                    name,
                    email,
                    password_hash,
                    education,
                    experience_years,
                    resume_text
                )
            )

            connection.commit()

            student_id = cursor.lastrowid

        return {
            "success": True,
            "student_id": student_id,
            "message": "Student registered successfully."
        }

    except Exception as e:

        if connection:
            connection.rollback()

        return {
            "success": False,
            "message": "Student registration failed.",
            "error": str(e)
        }

    finally:

        if connection:
            connection.close()


def authenticate_student(email, password):
    """
    Checks email and password and returns student details.
    """

    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    name,
                    email,
                    password_hash,
                    education,
                    experience_years,
                    resume_text
                FROM students
                WHERE email = %s
                """,
                (email,)
            )

            student = cursor.fetchone()

            if not student:
                return {
                    "success": False,
                    "message": "Invalid email or password."
                }

            password_hash = student["password_hash"]

            if not password_hash:
                return {
                    "success": False,
                    "message": "This account does not have a password set. Please register again."
                }

            if not check_password_hash(
                password_hash,
                password
            ):
                return {
                    "success": False,
                    "message": "Invalid email or password."
                }

            return {
                "success": True,
                "student": {
                    "name": student["name"],
                    "email": student["email"],
                    "education": student["education"],
                    "experience_years": student["experience_years"],
                    "resume_text": student["resume_text"]
                }
            }

    except Exception as e:

        return {
            "success": False,
            "message": "Login failed.",
            "error": str(e)
        }

    finally:

        if connection:
            connection.close()


def get_student_by_email(email):
    """
    Gets a registered student's details using email.
    """

    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    name,
                    email,
                    education,
                    experience_years,
                    resume_text
                FROM students
                WHERE email = %s
                """,
                (email,)
            )

            student = cursor.fetchone()

            if not student:
                return {
                    "success": False,
                    "message": "Student not found."
                }

            return {
                "success": True,
                "student": {
                    "name": student["name"],
                    "email": student["email"],
                    "education": student["education"],
                    "experience_years": student["experience_years"],
                    "resume_text": student["resume_text"]
                }
            }

    except Exception as e:

        return {
            "success": False,
            "message": "Unable to fetch student profile.",
            "error": str(e)
        }

    finally:

        if connection:
            connection.close()