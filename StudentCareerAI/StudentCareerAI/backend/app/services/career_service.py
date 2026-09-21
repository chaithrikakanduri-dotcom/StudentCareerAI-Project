from app.utils.preprocessing import clean_text
from app.services.skill_extractor import extract_skills
from app.services.career_recommender import recommend_careers
from app.services.skill_gap_analyzer import analyze_skill_gap


def analyze_resume(resume_text):
    """
    Runs the complete NLP career analysis pipeline.

    Flow:
    Resume
      ↓
    Text preprocessing
      ↓
    Skill extraction
      ↓
    Career recommendation
      ↓
    Skill gap analysis
    """

    if not resume_text or not str(resume_text).strip():
        return {
            "error": "Resume text cannot be empty."
        }

    # Step 1: Clean the resume text
    cleaned_resume = clean_text(resume_text)

    # Step 2: Extract skills from original resume
    student_skills = extract_skills(resume_text)

    # Step 3: Recommend careers
    career_recommendations = recommend_careers(
        resume_text,
        top_n=5
    )

    # Step 4: Perform skill-gap analysis
    skill_gap_results = []

    for recommendation in career_recommendations:

        job_title = recommendation["job_title"]

        gap_result = analyze_skill_gap(
            student_skills,
            job_title
        )

        if "error" not in gap_result:
            skill_gap_results.append(gap_result)

    return {
        "cleaned_resume": cleaned_resume,
        "student_skills": student_skills,
        "career_recommendations": career_recommendations,
        "skill_gap_analysis": skill_gap_results
    }


if __name__ == "__main__":

    sample_resume = """
    Education: Bachelor's in Computer Science
    Experience: 2 years
    Skills: Python, Java, SQL, React, Machine Learning, Docker
    """

    print("=" * 70)
    print("STUDENT CAREER AI - COMPLETE NLP ANALYSIS")
    print("=" * 70)

    result = analyze_resume(sample_resume)

    if "error" in result:

        print("\nError:")
        print(result["error"])

    else:

        print("\n1. CLEANED RESUME")
        print("-" * 70)
        print(result["cleaned_resume"])

        print("\n2. EXTRACTED SKILLS")
        print("-" * 70)

        if result["student_skills"]:
            for skill in result["student_skills"]:
                print("-", skill)
        else:
            print("No known skills found.")

        print("\n3. CAREER RECOMMENDATIONS")
        print("-" * 70)

        for index, recommendation in enumerate(
            result["career_recommendations"],
            start=1
        ):

            print(
                f"{index}. "
                f"{recommendation['job_title']} "
                f"({recommendation['similarity_score']}%)"
            )

        print("\n4. SKILL GAP ANALYSIS")
        print("-" * 70)

        for gap in result["skill_gap_analysis"]:

            print(
                f"\nCareer: {gap['job_title']}"
            )

            print(
                f"Skill Match: "
                f"{gap['skill_match_percentage']}%"
            )

            print(
                "Matched Skills: "
                + (
                    ", ".join(gap["matched_skills"])
                    if gap["matched_skills"]
                    else "None"
                )
            )

            print(
                "Missing Skills: "
                + (
                    ", ".join(gap["missing_skills"])
                    if gap["missing_skills"]
                    else "None"
                )
            )