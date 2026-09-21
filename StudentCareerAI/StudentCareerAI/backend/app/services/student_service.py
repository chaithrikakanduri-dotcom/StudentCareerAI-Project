from app.models.database import get_connection


def create_student(
    name,
    email,
    education=None,
    experience_years=0,
    resume_text=None
):
    """
    Saves a new student into the students table.
    """

    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:

            sql = """
                INSERT INTO students
                (name, email, education, experience_years, resume_text)
                VALUES (%s, %s, %s, %s, %s)
            """

            cursor.execute(
                sql,
                (
                    name,
                    email,
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

        return {
            "success": False,
            "message": "Student registration failed.",
            "error": str(e)
        }

    finally:

        if connection:
            connection.close()


if __name__ == "__main__":

    result = create_student(
        name="Test Student",
        email="test.student@example.com",
        education="Bachelor's in Computer Science",
        experience_years=2,
        resume_text="Python, Java, SQL, React, Machine Learning, Docker"
    )

    print(result)