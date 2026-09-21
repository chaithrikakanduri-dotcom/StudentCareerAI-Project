from flask import Blueprint, request, jsonify

from app.services.student_service import create_student


student_bp = Blueprint(
    "student",
    __name__,
    url_prefix="/api"
)


@student_bp.route("/register-student", methods=["POST"])
def register_student():
    """
    Register a student and save the details in MySQL.
    """

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required."
            }), 400

        name = data.get("name")
        email = data.get("email")
        education = data.get("education")
        experience_years = data.get("experience_years", 0)
        resume_text = data.get("resume_text")

        # Required fields
        if not name:
            return jsonify({
                "success": False,
                "message": "Name is required."
            }), 400

        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required."
            }), 400

        # Create student in MySQL
        result = create_student(
            name=name,
            email=email,
            education=education,
            experience_years=experience_years,
            resume_text=resume_text
        )

        if not result["success"]:
            return jsonify(result), 400

        return jsonify(result), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "An error occurred during student registration.",
            "error": str(e)
        }), 500