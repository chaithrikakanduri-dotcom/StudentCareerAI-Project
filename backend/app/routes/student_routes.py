from flask import Blueprint, request, jsonify
from app.services.student_service import (
    create_student,
    authenticate_student,
    get_student_by_email
)

student_bp = Blueprint("student", __name__, url_prefix="/api")


# ============================================================
# REGISTER STUDENT
# ============================================================

@student_bp.route("/register-student", methods=["POST"])
def register_student():
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
            name=name.strip(),
            email=email.strip(),
            password=password
        )

        if not result["success"]:
            return jsonify(result), 400

        return jsonify(result), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Student registration failed.",
            "error": str(e)
        }), 500


# ============================================================
# LOGIN STUDENT
# ============================================================

@student_bp.route("/login-student", methods=["POST"])
def login_student():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required."
            }), 400

        email = data.get("email")
        password = data.get("password")

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

        result = authenticate_student(
            email=email.strip(),
            password=password
        )

        if not result["success"]:
            return jsonify(result), 401

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Login failed.",
            "error": str(e)
        }), 500


# ============================================================
# GET STUDENT PROFILE
# ============================================================

@student_bp.route("/student-profile", methods=["GET"])
def student_profile():
    try:
        email = request.args.get("email")

        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required."
            }), 400

        result = get_student_by_email(email.strip())

        if not result["success"]:
            return jsonify(result), 404

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Unable to fetch student profile.",
            "error": str(e)
        }), 500