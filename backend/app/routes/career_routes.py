import os
import pandas as pd

from flask import Blueprint, request, jsonify

from app.services.career_service import analyze_resume
from app.services.analysis_service import save_career_analysis
from app.services.career_recommender import recommend_careers


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

        analysis_result = analyze_resume(resume_text)

        if "error" in analysis_result:
            return jsonify({
                "success": False,
                "message": analysis_result["error"]
            }), 400

        save_result = save_career_analysis(
            student_id=student_id,
            cleaned_resume=analysis_result["cleaned_resume"],
            student_skills=analysis_result["student_skills"],
            career_recommendations=analysis_result["career_recommendations"],
            skill_gap_analysis=analysis_result["skill_gap_analysis"]
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


# ============================================================
# CAREER RECOMMENDATION
# ============================================================

@career_bp.route("/career-recommendation", methods=["POST"])
def career_recommendation():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required."
            }), 400

        education = data.get("education", "")
        experience = data.get("experience", "")
        skills = data.get("skills", "")
        interests = data.get("interests", "")

        if not education or not experience or not skills or not interests:
            return jsonify({
                "success": False,
                "message": "Education, experience, skills and interests are required."
            }), 400

        student_text = f"""
        Education: {education}
        Experience: {experience}
        Skills: {skills}
        Interests: {interests}
        """

        recommendations = recommend_careers(
            student_text,
            top_n=5
        )

        return jsonify({
            "success": True,
            "career_recommendations": recommendations
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Failed to generate career recommendations.",
            "error": str(e)
        }), 500


# ============================================================
# SKILL GAP CAREER LIST
# ============================================================

@career_bp.route("/skill-gap-careers", methods=["GET"])
def skill_gap_careers():
    try:
        csv_path = os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "..",
            "datasets",
            "job_roles.csv"
        )

        job_roles = pd.read_csv(csv_path)

        careers = []

        for _, row in job_roles.iterrows():
            required_skills = [
                skill.strip()
                for skill in str(row["Required Skills"]).split("|")
                if skill.strip()
            ]

            careers.append({
                "job_title": str(row["Job Title"]),
                "category": str(row["Category"]),
                "required_skills": required_skills
            })

        return jsonify({
            "success": True,
            "careers": careers
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Failed to load career roles.",
            "error": str(e)
        }), 500


# ============================================================
# SKILL GAP ANALYSIS
# ============================================================
@career_bp.route("/skill-gap-analysis", methods=["POST"])
def skill_gap_analysis():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required."
            }), 400

        career_name = str(data.get("career", "")).strip()
        student_skills = data.get("student_skills", [])

        if not career_name:
            return jsonify({
                "success": False,
                "message": "Career is required."
            }), 400

        if not isinstance(student_skills, list):
            student_skills = [student_skills]

        # =====================================================
        # LOAD CAREER DATA
        # =====================================================

        csv_path = os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "..",
            "datasets",
            "job_roles.csv"
        )

        job_roles = pd.read_csv(csv_path)

        selected_rows = job_roles[
            job_roles["Job Title"]
            .astype(str)
            .str.strip()
            .str.lower()
            == career_name.lower()
        ]

        if selected_rows.empty:
            return jsonify({
                "success": False,
                "message": "Selected career was not found."
            }), 404

        row = selected_rows.iloc[0]

        # =====================================================
        # REQUIRED SKILLS FOR SELECTED ROLE
        # =====================================================

        required_skills = [
            skill.strip()
            for skill in str(row["Required Skills"]).split("|")
            if skill.strip()
        ]

        # =====================================================
        # CLEAN STUDENT SKILLS
        # =====================================================

        cleaned_student_skills = []

        for skill in student_skills:

            if skill is None:
                continue

            skill_text = str(skill).strip()

            if not skill_text:
                continue

            # If the frontend sends one long string,
            # split it into individual skills.
            if "," in skill_text:
                parts = skill_text.split(",")
            else:
                parts = [skill_text]

            for part in parts:
                part = part.strip()

                if part:
                    cleaned_student_skills.append(part)

        # Remove duplicates while preserving order
        unique_student_skills = []

        for skill in cleaned_student_skills:
            if skill.lower() not in [
                item.lower() for item in unique_student_skills
            ]:
                unique_student_skills.append(skill)

        # =====================================================
        # NORMALIZE SKILL NAMES
        # =====================================================

        def normalize_skill(skill):
            skill = str(skill).lower().strip()

            replacements = {
                "c plus plus": "c++",
                "cpp": "c++",
                "c#": "c sharp",
                "problem-solving": "problem solving",
                "problem solving skills": "problem solving",
                "software design skills": "software design",
                "sql database": "sql",
                "javascript": "javascript",
                "js": "javascript",
                "reactjs": "react",
                "react.js": "react",
                "nodejs": "node.js",
                "node": "node.js",
            }

            return replacements.get(skill, skill)

        student_skill_map = {}

        for skill in unique_student_skills:
            normalized = normalize_skill(skill)
            student_skill_map[normalized] = skill

        required_skill_map = {}

        for skill in required_skills:
            normalized = normalize_skill(skill)
            required_skill_map[normalized] = skill

        # =====================================================
        # MATCH REQUIRED SKILLS WITH STUDENT SKILLS
        # =====================================================

        matched_skills = []
        missing_skills = []

        for normalized_required, original_required in required_skill_map.items():

            if normalized_required in student_skill_map:
                matched_skills.append(original_required)
            else:
                missing_skills.append(original_required)

        # =====================================================
        # SKILL MATCH %
        # =====================================================

        if required_skills:
            skill_match = round(
                (len(matched_skills) / len(required_skills)) * 100
            )
        else:
            skill_match = 0

        # =====================================================
        # JOB READINESS
        #
        # Role-specific readiness based on how many
        # required skills the student already has.
        # =====================================================

        job_readiness = skill_match

        # =====================================================
        # LEARNING PRIORITY
        # =====================================================

        priority = {
            "python": 10,
            "java": 10,
            "javascript": 10,
            "html": 10,
            "css": 20,
            "sql": 20,
            "linux": 20,
            "networking": 20,
            "git": 20,
            "oop": 30,
            "data structures": 30,
            "algorithms": 40,
            "statistics": 30,
            "pandas": 40,
            "numpy": 40,
            "data analysis": 50,
            "data visualization": 50,
            "machine learning": 60,
            "react": 60,
            "node.js": 60,
            "docker": 70,
            "aws": 70,
            "azure": 70,
            "gcp": 70,
            "deep learning": 80,
            "tensorflow": 90,
            "pytorch": 90,
            "kubernetes": 100
        }

        learning_order = sorted(
            missing_skills,
            key=lambda skill: priority.get(
                normalize_skill(skill),
                55
            )
        )

        # =====================================================
        # DYNAMIC GAP REPORT
        # =====================================================

        if not missing_skills:

            gap_report = (
                f"You already have all required skills for "
                f"{career_name}. You are ready to apply these "
                f"skills toward this career role."
            )

        else:

            gap_report = (
                f"You currently match {skill_match}% of the "
                f"required skills for {career_name}. "
                f"You have {len(matched_skills)} matched skills "
                f"and {len(missing_skills)} skills to develop."
            )

        # =====================================================
        # RESPONSE
        # =====================================================

        return jsonify({
            "success": True,

            "career": career_name,

            "category": str(row["Category"]),

            "your_skills": unique_student_skills,

            "required_skills": required_skills,

            "matched_skills": matched_skills,

            "missing_skills": missing_skills,

            "skill_match": skill_match,

            "job_readiness": job_readiness,

            "gap_report": gap_report,

            "learning_order": learning_order

        }), 200

    except Exception as e:

        print("SKILL GAP ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Failed to generate skill gap analysis.",
            "error": str(e)
        }), 500