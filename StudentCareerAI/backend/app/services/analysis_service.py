import json

from app.models.database import get_connection


def save_career_analysis(
    student_id,
    cleaned_resume,
    student_skills,
    career_recommendations,
    skill_gap_analysis
):
    """
    Saves the NLP career analysis result
    into the career_analysis table.
    """

    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:

            sql = """
                INSERT INTO career_analysis
                (
                    student_id,
                    cleaned_resume,
                    student_skills,
                    recommended_careers,
                    skill_gap_analysis
                )
                VALUES (%s, %s, %s, %s, %s)
            """

            cursor.execute(
                sql,
                (
                    student_id,
                    cleaned_resume,
                    json.dumps(student_skills),
                    json.dumps(career_recommendations),
                    json.dumps(skill_gap_analysis)
                )
            )

            connection.commit()

            analysis_id = cursor.lastrowid

        return {
            "success": True,
            "analysis_id": analysis_id,
            "message": "Career analysis saved successfully."
        }

    except Exception as e:

        if connection:
            connection.rollback()

        return {
            "success": False,
            "message": "Failed to save career analysis.",
            "error": str(e)
        }

    finally:

        if connection:
            connection.close()


if __name__ == "__main__":

    # Test data
    result = save_career_analysis(
        student_id=2,
        cleaned_resume=(
            "education bachelor computer science "
            "experience year skill python java sql "
            "react machine learning docker"
        ),
        student_skills=[
            "Docker",
            "Java",
            "Machine Learning",
            "Python",
            "React",
            "SQL"
        ],
        career_recommendations=[
            {
                "job_title": "Machine Learning Engineer",
                "category": "Technology",
                "similarity_score": 33.88
            },
            {
                "job_title": "Data Scientist",
                "category": "Technology",
                "similarity_score": 31.39
            }
        ],
        skill_gap_analysis=[
            {
                "job_title": "Data Scientist",
                "skill_match_percentage": 50.0,
                "matched_skills": [
                    "Python",
                    "Machine Learning",
                    "SQL"
                ],
                "missing_skills": [
                    "Statistics",
                    "TensorFlow",
                    "Data Analysis"
                ]
            }
        ]
    )

    print(result)