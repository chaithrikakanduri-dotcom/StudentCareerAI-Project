# ============================================================
# STUDENT CAREER AI - DYNAMIC CAREER RECOMMENDER
# ============================================================

import os
import re
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# ============================================================
# DATASET PATH
# ============================================================

JOB_ROLES_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "..",
    "..",
    "datasets",
    "job_roles.csv"
)


# ============================================================
# LOAD JOB ROLES
# ============================================================

def load_job_roles():
    return pd.read_csv(JOB_ROLES_PATH)


# ============================================================
# PREPARE JOB TEXT
# ============================================================

def prepare_job_text(row):

    job_title = str(row["Job Title"])
    category = str(row["Category"])
    education = str(row["Education Requirement"])
    skills = str(row["Required Skills"])

    return (
        job_title + " " +
        category + " " +
        education + " " +
        skills.replace("|", " ")
    )


# ============================================================
# EXTRACT EXPERIENCE
# ============================================================

def extract_experience(text):

    text = str(text).lower()

    patterns = [
        r'(\d+(?:\.\d+)?)\s*\+?\s*years?',
        r'(\d+(?:\.\d+)?)\s*\+?\s*yrs?'
    ]

    for pattern in patterns:

        match = re.search(pattern, text)

        if match:

            try:
                return float(match.group(1))
            except ValueError:
                return 0

    return 0


# ============================================================
# EXPERIENCE MATCH
# ============================================================

def calculate_experience_score(
    student_experience,
    required_experience
):

    try:

        student_experience = float(student_experience)
        required_experience = float(required_experience)

    except (ValueError, TypeError):

        return 0.0

    if required_experience <= 0:

        return 1.0

    if student_experience >= required_experience:

        return 1.0

    return max(
        0.0,
        min(
            student_experience / required_experience,
            1.0
        )
    )


# ============================================================
# EDUCATION MATCH
# ============================================================

def calculate_education_score(
    student_text,
    education_requirement
):

    student_text = str(student_text).lower()

    education_requirement = str(
        education_requirement
    ).lower()

    education_keywords = [

        "b.tech",
        "btech",
        "b.e",
        "be",
        "bca",
        "b.sc",
        "bsc",
        "bachelor",

        "m.tech",
        "mtech",
        "mca",
        "m.sc",
        "msc",
        "master",

        "diploma",
        "phd",
        "doctorate"
    ]

    student_education = []

    for keyword in education_keywords:

        if keyword in student_text:

            student_education.append(keyword)

    if not student_education:

        return 0.5

    # Direct match
    for education in student_education:

        if education in education_requirement:

            return 1.0

    # Bachelor's match
    if (
        "bachelor" in education_requirement
        and any(
            x in student_text
            for x in [
                "b.tech",
                "btech",
                "b.e",
                "be",
                "bca",
                "b.sc",
                "bsc",
                "bachelor"
            ]
        )
    ):

        return 1.0

    # Master's match
    if (
        "master" in education_requirement
        and any(
            x in student_text
            for x in [
                "m.tech",
                "mtech",
                "mca",
                "m.sc",
                "msc",
                "master"
            ]
        )
    ):

        return 1.0

    # Diploma match
    if (
        "diploma" in education_requirement
        and "diploma" in student_text
    ):

        return 1.0

    return 0.0


# ============================================================
# SKILL MATCH
# ============================================================

def calculate_skill_score(
    student_text,
    required_skills
):

    student_text = str(student_text).lower()

    skills = [
        skill.strip().lower()
        for skill in str(required_skills).split("|")
        if skill.strip()
    ]

    if not skills:

        return 0.0

    matched_skills = 0

    for skill in skills:

        if skill in student_text:

            matched_skills += 1

    return matched_skills / len(skills)


# ============================================================
# WORKPLACE MAPPING
# ============================================================

def get_workplace(
    job_title,
    category
):

    job_title = str(job_title).lower()

    category = str(category).lower()

    # Cloud / DevOps
    if (
        "cloud" in job_title
        or "devops" in job_title
        or "cloud" in category
        or "devops" in category
    ):

        return "Cloud / IT Companies / Remote"

    # Data / AI
    if (
        "data scientist" in job_title
        or "data analyst" in job_title
        or "machine learning" in job_title
        or "ml engineer" in job_title
        or "artificial intelligence" in job_title
        or "data" in category
        or "ai" in category
    ):

        return "Data / AI Companies / Research / Remote"

    # Web development
    if (
        "frontend" in job_title
        or "backend" in job_title
        or "full stack" in job_title
        or "web" in job_title
        or "web" in category
    ):

        return "Software / Web Companies / Remote"

    # Software
    if (
        "software" in job_title
        or "developer" in job_title
        or "programmer" in job_title
        or "software" in category
    ):

        return "IT / Software Companies / Hybrid"

    # Cybersecurity
    if (
        "security" in job_title
        or "cyber" in job_title
        or "cyber" in category
    ):

        return "Cybersecurity / IT Companies / Security Operations"

    # Database
    if (
        "database" in job_title
        or "database" in category
    ):

        return "IT / Database Systems / Cloud"

    # Default
    return "IT / Corporate / Hybrid"


# ============================================================
# MAIN CAREER RECOMMENDER
# ============================================================

def recommend_careers(
    resume_text,
    top_n=5
):

    if not resume_text or not str(resume_text).strip():

        return []

    # --------------------------------------------------------
    # LOAD DATASET
    # --------------------------------------------------------

    job_roles = load_job_roles()

    # --------------------------------------------------------
    # PREPARE JOB TEXT
    # --------------------------------------------------------

    job_roles["combined_text"] = job_roles.apply(
        prepare_job_text,
        axis=1
    )

    student_text = str(resume_text)

    # --------------------------------------------------------
    # TF-IDF
    # --------------------------------------------------------

    vectorizer = TfidfVectorizer(
        lowercase=True,
        stop_words="english"
    )

    all_text = (
        [student_text]
        + job_roles["combined_text"].tolist()
    )

    tfidf_matrix = vectorizer.fit_transform(
        all_text
    )

    student_vector = tfidf_matrix[0]

    job_vectors = tfidf_matrix[1:]

    # --------------------------------------------------------
    # COSINE SIMILARITY
    # --------------------------------------------------------

    similarity_scores = cosine_similarity(
        student_vector,
        job_vectors
    ).flatten()

    job_roles["Text Similarity"] = similarity_scores

    # --------------------------------------------------------
    # STUDENT EXPERIENCE
    # --------------------------------------------------------

    student_experience = extract_experience(
        student_text
    )

    # --------------------------------------------------------
    # CALCULATE FINAL SCORE
    # --------------------------------------------------------

    final_scores = []

    for _, row in job_roles.iterrows():

        text_score = float(
            row["Text Similarity"]
        )

        education_score = calculate_education_score(
            student_text,
            row["Education Requirement"]
        )

        experience_score = calculate_experience_score(
            student_experience,
            row["Experience Years"]
        )

        skill_score = calculate_skill_score(
            student_text,
            row["Required Skills"]
        )

        # ----------------------------------------------------
        # WEIGHTED SCORE
        # ----------------------------------------------------
        #
        # Skills       = 45%
        # TF-IDF       = 30%
        # Education    = 15%
        # Experience   = 10%
        #

        final_score = (
            (skill_score * 0.45) +
            (text_score * 0.30) +
            (education_score * 0.15) +
            (experience_score * 0.10)
        )

        final_scores.append(
            final_score
        )

    job_roles["Final Score"] = final_scores

    # --------------------------------------------------------
    # SORT TOP CAREERS
    # --------------------------------------------------------

    recommendations = (
        job_roles
        .sort_values(
            by="Final Score",
            ascending=False
        )
        .head(top_n)
    )

    # --------------------------------------------------------
    # CREATE RESULTS
    # --------------------------------------------------------

    results = []

    for _, row in recommendations.iterrows():

        score = float(
            row["Final Score"]
        ) * 100

        score = max(
            0,
            min(
                100,
                score
            )
        )

        # ----------------------------------------------------
        # REQUIRED SKILLS
        # ----------------------------------------------------
        # Keep this internally for Skill Gap Analysis.
        # It does NOT have to be displayed in Career
        # Recommendation UI.
        # ----------------------------------------------------

        required_skills = [
            skill.strip()
            for skill in str(
                row["Required Skills"]
            ).split("|")
            if skill.strip()
        ]

        # ----------------------------------------------------
        # WORKPLACE
        # ----------------------------------------------------

        workplace = get_workplace(
            row["Job Title"],
            row["Category"]
        )

        # ----------------------------------------------------
        # FINAL RESULT
        # ----------------------------------------------------

        results.append({

            "job_title": row["Job Title"],

            "category": row["Category"],

            "similarity_score": round(
                score,
                2
            ),

            "required_skills": required_skills,

            "workplace": workplace,

            "salary_range": row["Salary Range"]
        })

    return results


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    sample_resume = """

    Education: Bachelor's in Computer Science

    Experience: 2 years

    Skills:
    Python,
    Java,
    SQL,
    React,
    Machine Learning,
    Docker

    Interests:
    Artificial Intelligence,
    Software Development,
    Data Science

    """

    print("=" * 70)

    print(
        "STUDENT CAREER AI - DYNAMIC CAREER RECOMMENDER"
    )

    print("=" * 70)

    recommendations = recommend_careers(
        sample_resume,
        top_n=5
    )

    print(
        "\nTOP 5 CAREER RECOMMENDATIONS"
    )

    print("-" * 70)

    for index, recommendation in enumerate(
        recommendations,
        start=1
    ):

        print(
            f"\n{index}. "
            f"{recommendation['job_title']}"
        )

        print(
            f"Category: "
            f"{recommendation['category']}"
        )

        print(
            f"Match: "
            f"{recommendation['similarity_score']}%"
        )

        print(
            f"Workplace: "
            f"{recommendation['workplace']}"
        )

        print(
            f"Salary: "
            f"{recommendation['salary_range']}"
        )

        # Required skills are intentionally not printed
        # here because they are for Skill Gap Analysis.

        print("-" * 70)