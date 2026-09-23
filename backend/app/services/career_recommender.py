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
# EXPERIENCE SCORE
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
# EDUCATION SCORE
# ============================================================

def calculate_education_score(
    student_text,
    education_requirement
):

    student_text = str(student_text).lower()
    education_requirement = str(
        education_requirement
    ).lower()

    # More specific education matching
    education_groups = {

        "btech": [
            "b.tech",
            "btech",
            "bachelor of technology"
        ],

        "be": [
            "b.e",
            "b.e.",
            "be",
            "bachelor of engineering"
        ],

        "bca": [
            "bca",
            "bachelor of computer applications"
        ],

        "bsc": [
            "b.sc",
            "bsc",
            "bachelor of science"
        ],

        "mtech": [
            "m.tech",
            "mtech",
            "master of technology"
        ],

        "mca": [
            "mca",
            "master of computer applications"
        ],

        "msc": [
            "m.sc",
            "msc",
            "master of science"
        ],

        "diploma": [
            "diploma"
        ]
    }

    student_education = []

    for education_name, keywords in education_groups.items():

        for keyword in keywords:

            if keyword in student_text:

                student_education.append(
                    education_name
                )

                break

    if not student_education:
        return 0.5

    # Direct education match
    for education in student_education:

        keywords = education_groups[education]

        for keyword in keywords:

            if keyword in education_requirement:

                return 1.0

    # Bachelor level compatibility
    bachelor_education = [
        "btech",
        "be",
        "bca",
        "bsc"
    ]

    if (
        "bachelor" in education_requirement
        and any(
            education in student_education
            for education in bachelor_education
        )
    ):
        return 1.0

    # Master level compatibility
    master_education = [
        "mtech",
        "mca",
        "msc"
    ]

    if (
        "master" in education_requirement
        and any(
            education in student_education
            for education in master_education
        )
    ):
        return 1.0

    if (
        "diploma" in education_requirement
        and "diploma" in student_education
    ):
        return 1.0

    return 0.0


# ============================================================
# SKILL SCORE
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
# INTEREST SCORE
# ============================================================

def calculate_interest_score(
    student_text,
    job_title,
    category
):

    student_text = str(student_text).lower()

    job_title = str(job_title).lower()

    category = str(category).lower()

    # Interest / career keywords
    interest_groups = {

        "artificial intelligence": [
            "ai",
            "artificial intelligence",
            "machine learning",
            "ml",
            "deep learning"
        ],

        "data": [
            "data",
            "data science",
            "data analysis",
            "analytics",
            "statistics"
        ],

        "software development": [
            "software",
            "development",
            "developer",
            "programming",
            "coding"
        ],

        "web development": [
            "web",
            "website",
            "frontend",
            "backend",
            "full stack",
            "fullstack"
        ],

        "cloud": [
            "cloud",
            "aws",
            "azure",
            "gcp",
            "devops"
        ],

        "cybersecurity": [
            "cybersecurity",
            "cyber security",
            "security",
            "ethical hacking",
            "hacking"
        ],

        "database": [
            "database",
            "sql",
            "mysql",
            "mongodb",
            "database management"
        ]
    }

    matched_interest_groups = 0
    total_interest_groups = 0

    for group, keywords in interest_groups.items():

        student_has_interest = any(
            keyword in student_text
            for keyword in keywords
        )

        if student_has_interest:

            total_interest_groups += 1

            job_has_interest = any(
                keyword in job_title or
                keyword in category
                for keyword in keywords
            )

            if job_has_interest:
                matched_interest_groups += 1

    if total_interest_groups == 0:
        return 0.0

    return (
        matched_interest_groups /
        total_interest_groups
    )


# ============================================================
# WORKPLACE
# ============================================================

def get_workplace(
    job_title,
    category
):

    job_title = str(job_title).lower()
    category = str(category).lower()

    if (
        "cloud" in job_title
        or "devops" in job_title
        or "cloud" in category
        or "devops" in category
    ):

        return "Cloud / IT Companies / Remote"

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

    if (
        "frontend" in job_title
        or "backend" in job_title
        or "full stack" in job_title
        or "web" in job_title
        or "web" in category
    ):

        return "Software / Web Companies / Remote"

    if (
        "software" in job_title
        or "developer" in job_title
        or "programmer" in job_title
        or "software" in category
    ):

        return "IT / Software Companies / Hybrid"

    if (
        "security" in job_title
        or "cyber" in job_title
        or "cyber" in category
    ):

        return "Cybersecurity / IT Companies / Security Operations"

    if (
        "database" in job_title
        or "database" in category
    ):

        return "IT / Database Systems / Cloud"

    return "IT / Corporate / Hybrid"


# ============================================================
# MAIN CAREER RECOMMENDER
# ============================================================

def recommend_careers(
    resume_text,
    top_n=5
):

    if (
        not resume_text
        or not str(resume_text).strip()
    ):
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

    # --------------------------------------------------------
    # STUDENT INPUT
    # --------------------------------------------------------

    student_text = str(resume_text)
    print("===== CAREER INPUT RECEIVED =====")
    print(student_text)
    print("=================================")

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

    similarity_scores = cosine_similarity(
        student_vector,
        job_vectors
    ).flatten()

    job_roles["Text Similarity"] = (
        similarity_scores
    )

    # --------------------------------------------------------
    # EXPERIENCE
    # --------------------------------------------------------

    student_experience = extract_experience(
        student_text
    )

    # --------------------------------------------------------
    # FINAL SCORE
    # --------------------------------------------------------

    final_scores = []

    for _, row in job_roles.iterrows():

        text_score = float(
            row["Text Similarity"]
        )

        education_score = (
            calculate_education_score(
                student_text,
                row["Education Requirement"]
            )
        )

        skill_score = (
            calculate_skill_score(
                student_text,
                row["Required Skills"]
            )
        )

        interest_score = (
            calculate_interest_score(
                student_text,
                row["Job Title"],
                row["Category"]
            )
        )

        experience_score = (
            calculate_experience_score(
                student_experience,
                row["Experience Years"]
            )
        )

        # ----------------------------------------------------
        # WEIGHTED SCORE
        # ----------------------------------------------------

        final_score = (

            (skill_score * 0.40)

            + (interest_score * 0.25)

            + (text_score * 0.20)

            + (education_score * 0.10)

            + (experience_score * 0.05)
        )

        final_scores.append(
            final_score
        )

    # --------------------------------------------------------
    # STORE FINAL SCORE
    # --------------------------------------------------------

    job_roles["Final Score"] = final_scores

    # --------------------------------------------------------
    # SORT DYNAMICALLY
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
    # CREATE RESULT
    # --------------------------------------------------------

    results = []

    for _, row in recommendations.iterrows():

        score = (
            float(row["Final Score"])
            * 100
        )

        score = max(
            0,
            min(100, score)
        )

        # IMPORTANT:
        # Required Skills are kept in backend
        # for Skill Gap Analysis.
        # They are NOT intended as Career
        # Recommendation display fields.

        required_skills = [
            skill.strip()
            for skill in str(
                row["Required Skills"]
            ).split("|")
            if skill.strip()
        ]

        workplace = get_workplace(
            row["Job Title"],
            row["Category"]
        )

        results.append({

            "job_title":
                row["Job Title"],

            "category":
                row["Category"],

            "similarity_score":
                round(score, 2),

            "required_skills":
                required_skills,

            "workplace":
                workplace,

            "salary_range":
                row["Salary Range"]
        })

    return results