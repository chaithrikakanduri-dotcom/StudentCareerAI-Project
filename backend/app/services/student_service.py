from app.models.database import get_connection
from werkzeug.security import generate_password_hash, check_password_hash


# ============================================================
# CREATE STUDENT
# ============================================================

def create_student(
    name,
    email,
    password,
    education=None,
    experience_years=0,
    resume_text=None
):
    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:

            # Check whether email already exists
            cursor.execute(
                "SELECT email FROM students WHERE email = %s",
                (email,)
            )

            existing_student = cursor.fetchone()

            if existing_student:
                return {
                    "success": False,
                    "message": "An account with this email already exists."
                }

            # Hash password before storing
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


# ============================================================
# AUTHENTICATE STUDENT
# ============================================================

def authenticate_student(email, password):
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

            # Support both dictionary and tuple cursor results
            if isinstance(student, dict):
                password_hash = student.get("password_hash")
                name = student.get("name")
                student_email = student.get("email")
                education = student.get("education")
                experience_years = student.get("experience_years")
                resume_text = student.get("resume_text")

            else:
                name = student[0]
                student_email = student[1]
                password_hash = student[2]
                education = student[3]
                experience_years = student[4]
                resume_text = student[5]

            if not password_hash:
                return {
                    "success": False,
                    "message": "This account does not have a password set. Please register again."
                }

            if not check_password_hash(password_hash, password):
                return {
                    "success": False,
                    "message": "Invalid email or password."
                }

            return {
                "success": True,
                "message": "Login successful.",
                "student": {
                    "name": name,
                    "email": student_email,
                    "education": education,
                    "experience_years": experience_years,
                    "resume_text": resume_text
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


# ============================================================
# GET STUDENT BY EMAIL
# ============================================================

def get_student_by_email(email):
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

            # Support both dictionary and tuple cursor results
            if isinstance(student, dict):

                name = student.get("name")
                student_email = student.get("email")
                education = student.get("education")
                experience_years = student.get("experience_years")
                resume_text = student.get("resume_text")

            else:

                name = student[0]
                student_email = student[1]
                education = student[2]
                experience_years = student[3]
                resume_text = student[4]

            return {
                "success": True,
                "student": {
                    "name": name,
                    "email": student_email,
                    "education": education,
                    "experience_years": experience_years,
                    "resume_text": resume_text
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