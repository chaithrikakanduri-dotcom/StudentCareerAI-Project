from flask import Blueprint, request, jsonify

from placement_predictor import predict_placement


placement_bp = Blueprint(
    "placement",
    __name__,
    url_prefix="/api"
)


@placement_bp.route("/predict-placement", methods=["POST"])
def predict_student_placement():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required."
            }), 400

        required_fields = [
            "IQ",
            "Prev_Sem_Result",
            "CGPA",
            "Academic_Performance",
            "Internship_Experience",
            "Extra_Curricular_Score",
            "Communication_Skills",
            "Projects_Completed"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "message": f"{field} is required."
                }), 400

        result = predict_placement(
            iq=data["IQ"],
            prev_sem_result=data["Prev_Sem_Result"],
            cgpa=data["CGPA"],
            academic_performance=data["Academic_Performance"],
            internship_experience=data["Internship_Experience"],
            extra_curricular_score=data["Extra_Curricular_Score"],
            communication_skills=data["Communication_Skills"],
            projects_completed=data["Projects_Completed"]
        )

        return jsonify({
            "success": True,
            "message": "Placement prediction completed successfully.",
            "data": result
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Placement prediction failed.",
            "error": str(e)
        }), 500