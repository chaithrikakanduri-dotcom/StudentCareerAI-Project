import json
import os
import re


# Path to skills database
SKILLS_DATABASE_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "..",
    "..",
    "datasets",
    "skills_database.json"
)

def load_skills_database():
    """
    Loads all skills from skills_database.json
    """

    with open(SKILLS_DATABASE_PATH, "r", encoding="utf-8") as file:
        skills_database = json.load(file)

    all_skills = []

    for category, skills in skills_database.items():
        for skill in skills:
            all_skills.append(skill)

    return all_skills
    

def extract_skills(resume_text):
    """
    Extracts known skills from resume text.
    """

    if not resume_text:
        return []

    skills_database = load_skills_database()

    found_skills = []

    # Convert resume text to lowercase
    resume_lower = resume_text.lower()

    for skill in skills_database:

        # Escape special characters such as +, #, .
        skill_pattern = re.escape(skill.lower())

        # Search skill in resume
        if re.search(r"(?<!\w)" + skill_pattern + r"(?!\w)", resume_lower):
            found_skills.append(skill)

    return sorted(set(found_skills))


if __name__ == "__main__":

    sample_resume = """
    Education: Bachelor's in Computer Science
    Experience: 2 years
    Skills: Python, Java, SQL, React, Machine Learning, Docker
    """

    skills = extract_skills(sample_resume)

    print("Resume:")
    print(sample_resume)

    print("\nExtracted Skills:")

    for skill in skills:
        print("-", skill)