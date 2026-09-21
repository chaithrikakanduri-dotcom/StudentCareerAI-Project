import os
import pandas as pd


# Path to job roles dataset
JOB_ROLES_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "..",
    "..",
    "datasets",
    "job_roles.csv"
)


def load_job_roles():
    """
    Loads job role information from job_roles.csv.
    """
    return pd.read_csv(JOB_ROLES_PATH)


def normalize_skill(skill):
    """
    Normalizes a skill for comparison.
    """
    return str(skill).strip().lower()


def analyze_skill_gap(student_skills, job_title):
    """
    Compares student's skills with the required skills
    for a selected job role.
    """

    job_roles = load_job_roles()

    # Find the requested job role
    matching_roles = job_roles[
        job_roles["Job Title"].str.lower() == job_title.lower()
    ]

    if matching_roles.empty:
        return {
            "error": f"Job role '{job_title}' was not found."
        }

    # Take the first matching job role
    job = matching_roles.iloc[0]

    # Get required skills
    required_skills = [
        skill.strip()
        for skill in str(job["Required Skills"]).split("|")
        if skill.strip()
    ]

    # Normalize student skills
    student_skill_map = {
        normalize_skill(skill): skill
        for skill in student_skills
    }

    # Compare skills
    matched_skills = []
    missing_skills = []

    for skill in required_skills:

        if normalize_skill(skill) in student_skill_map:
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    # Calculate skill match percentage
    total_required = len(required_skills)

    if total_required > 0:
        match_percentage = (
            len(matched_skills) / total_required
        ) * 100
    else:
        match_percentage = 0

    return {
        "job_title": job["Job Title"],
        "category": job["Category"],
        "student_skills": student_skills,
        "required_skills": required_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "skill_match_percentage": round(
            match_percentage,
            2
        )
    }


if __name__ == "__main__":

    # Example student skills
    student_skills = [
        "Python",
        "Java",
        "SQL",
        "React",
        "Machine Learning",
        "Docker"
    ]

    # Career selected for skill-gap analysis
    selected_job = "Data Scientist"

    print("Student Skills:")
    print(", ".join(student_skills))

    print("\nSelected Career:")
    print(selected_job)

    result = analyze_skill_gap(
        student_skills,
        selected_job
    )

    if "error" in result:

        print("\nError:")
        print(result["error"])

    else:

        print("\nRequired Skills:")
        print(", ".join(result["required_skills"]))

        print("\nMatched Skills:")
        print(", ".join(result["matched_skills"]))

        print("\nMissing Skills:")
        print(", ".join(result["missing_skills"]))

        print(
            "\nSkill Match Percentage:",
            str(result["skill_match_percentage"]) + "%"
        )