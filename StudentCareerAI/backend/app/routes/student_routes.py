from flask import Blueprint, request, jsonify

from app.services.student_service import (
    create_student,
    authenticate_student,
    get_student_by_email
)


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
        password = data.get("password")

        education = data.get("education")
        experience_years = data.get(
            "experience_years",
            0
        )
        resume_text = data.get("resume_text")

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

        if not password:
            return jsonify({
                "success": False,
                "message": "Password is required."
            }), 400

        if len(password) < 6:
            return jsonify({
                "success": False,
                "message": "Password must contain at least 6 characters."
            }), 400

        result = create_student(
            name=name,
            email=email,
            password=password,
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


@student_bp.route("/login-student", methods=["POST"])
def login_student():
    """
    Login a registered student.
    """

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required."
            }), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Email and password are required."
            }), 400

        result = authenticate_student(
            email=email,
            password=password
        )

        if not result["success"]:
            return jsonify(result), 401

        return jsonify({
            "success": True,
            "message": "Login successful.",
            "student": result["student"]
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "An error occurred during login.",
            "error": str(e)
        }), 500


@student_bp.route("/student-profile", methods=["GET"])
def student_profile():
    """
    Get registered student profile using email.
    """

    try:
        email = request.args.get("email")

        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required."
            }), 400

        result = get_student_by_email(email)

        if not result["success"]:
            return jsonify(result), 404

        return jsonify(result), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Unable to fetch profile.",
            "error": str(e)
        }), 500