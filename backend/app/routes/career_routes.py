from flask import Blueprint, request, jsonify

from app.services.career_service import analyze_resume
from app.services.analysis_service import save_career_analysis


career_bp = Blueprint(
    "career",
    __name__,
    url_prefix="/api"
)


@career_bp.route("/analyze-resume", methods=["POST"])
def analyze_resume_route():
    """
    Analyze a student's resume and save the analysis to MySQL.
    """

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required."
            }), 400

        resume_text = data.get("resume_text")
        student_id = data.get("student_id")

        if not resume_text:
            return jsonify({
                "success": False,
                "message": "resume_text is required."
            }), 400

        if not student_id:
            return jsonify({
                "success": False,
                "message": "student_id is required."
            }), 400

        # Run complete NLP analysis
        analysis_result = analyze_resume(resume_text)

        if "error" in analysis_result:
            return jsonify({
                "success": False,
                "message": analysis_result["error"]
            }), 400

        # Save analysis in MySQL
        save_result = save_career_analysis(
            student_id=student_id,
            cleaned_resume=analysis_result["cleaned_resume"],
            student_skills=analysis_result["student_skills"],
            career_recommendations=analysis_result[
                "career_recommendations"
            ],
            skill_gap_analysis=analysis_result[
                "skill_gap_analysis"
            ]
        )

        if not save_result["success"]:
            return jsonify({
                "success": False,
                "message": save_result["message"],
                "error": save_result.get("error")
            }), 500

        return jsonify({
            "success": True,
            "message": "Resume analyzed and saved successfully.",
            "student_id": student_id,
            "analysis_id": save_result["analysis_id"],
            "data": analysis_result
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "An error occurred while analyzing the resume.",
            "error": str(e)
        }), 500