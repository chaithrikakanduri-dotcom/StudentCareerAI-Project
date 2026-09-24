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
        r"(\d+(?:\.\d+)?)\s*\+?\s*years?",
        r"(\d+(?:\.\d+)?)\s*\+?\s*yrs?"
    ]

    for pattern in patterns:

        match = re.search(pattern, text)

        if match:

            try:
                return float(match.group(1))
            except ValueError:
                return 0.0

    if "fresher" in text:
        return 0.0

    if "less than 1 year" in text:
        return 0.5

    if "1-2 years" in text:
        return 1.5

    if "2+ years" in text:
        return 2.0

    return 0.0


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

    for education in student_education:

        keywords = education_groups[education]

        for keyword in keywords:

            if keyword in education_requirement:
                return 1.0

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
            "fullstack",
            "react",
            "javascript"
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
                keyword in job_title
                or keyword in category
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
def get_workplace(job_title):
    title = str(job_title).lower()

    if "ai/ml" in title or "ai / ml" in title:
        return "AI Models / Automation / Research"

    if "artificial intelligence" in title:
        return "AI Models / Automation / Research"

    if "machine learning" in title or "ml engineer" in title:
        return "Machine Learning / AI Applications / Research"

    if "data scientist" in title:
        return "Data Analysis / Prediction / Research"

    if "data analyst" in title:
        return "Data Analysis / Visualization / Reporting"

    if "data engineer" in title:
        return "Data Pipelines / ETL / Data Platforms"

    if "full stack" in title or "fullstack" in title:
        return "Web Applications / Frontend / Backend"

    if "frontend" in title:
        return "Web UI / Frontend Development"

    if "backend" in title:
        return "APIs / Backend Systems / Databases"

    if "cloud" in title:
        return "Cloud Infrastructure / Deployment"

    if "devops" in title:
        return "CI/CD / Cloud / Infrastructure"

    if "cybersecurity" in title or "cyber security" in title:
        return "Cybersecurity / Security Operations"

    if "security" in title:
        return "Security Operations / IT Security"

    if "database" in title or "dba" in title:
        return "Database Systems / Administration"

    if "mobile" in title or "android" in title or "ios" in title:
        return "Mobile Application Development"

    if "testing" in title or "tester" in title or "quality assurance" in title:
        return "Software Testing / Quality Assurance"

    if "software" in title or "developer" in title:
        return "Software Development / Applications"

    return "IT / Technology"
 # ============================================================
# ROLE-SPECIFIC WORK AREA
# ============================================================
# ============================================================
# ROLE-SPECIFIC CATEGORY
# ============================================================

def get_role_category(job_title, original_category):
    title = str(job_title).lower()

    if "ai/ml" in title or "ai / ml" in title:
        return "AI & Machine Learning"

    if "artificial intelligence" in title:
        return "AI & Machine Learning"

    if "machine learning" in title or "ml engineer" in title:
        return "AI & Machine Learning"

    if "data scientist" in title:
        return "Data & Analytics"

    if "data analyst" in title:
        return "Data & Analytics"

    if "data engineer" in title:
        return "Data Engineering"

    if "full stack" in title or "fullstack" in title:
        return "Web Development"

    if "frontend" in title:
        return "Frontend Development"

    if "backend" in title:
        return "Backend Development"

    if "cloud" in title:
        return "Cloud & Infrastructure"

    if "devops" in title:
        return "DevOps & Infrastructure"

    if "cybersecurity" in title or "cyber security" in title:
        return "Cybersecurity"

    if "security" in title:
        return "Cybersecurity"

    if "database" in title or "dba" in title:
        return "Database & Systems"

    if "mobile" in title or "android" in title or "ios" in title:
        return "Mobile Development"

    if "testing" in title or "tester" in title or "quality assurance" in title:
        return "Software Testing"

    if "software" in title or "developer" in title:
        return "Software Development"

    return original_category


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

    # Load dataset
    job_roles = load_job_roles()

    # Prepare job text
    job_roles["combined_text"] = job_roles.apply(
        prepare_job_text,
        axis=1
    )

    # Student input
    student_text = str(resume_text)

    print("\n===== CAREER INPUT RECEIVED =====")
    print(student_text)
    print("=================================\n")

    # ========================================================
    # TF-IDF SIMILARITY
    # ========================================================

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

    job_roles["Text Similarity"] = similarity_scores

    # ========================================================
    # EXPERIENCE
    # ========================================================

    student_experience = extract_experience(
        student_text
    )

    # ========================================================
    # FINAL SCORE
    # ========================================================

    final_scores = []

    for _, row in job_roles.iterrows():

        text_score = float(
            row["Text Similarity"]
        )

        education_score = calculate_education_score(
            student_text,
            row["Education Requirement"]
        )

        skill_score = calculate_skill_score(
            student_text,
            row["Required Skills"]
        )

        interest_score = calculate_interest_score(
            student_text,
            row["Job Title"],
            row["Category"]
        )

        experience_score = calculate_experience_score(
            student_experience,
            row["Experience Years"]
        )

        # ====================================================
        # WEIGHTED SCORE
        # ====================================================

        final_score = (
            (skill_score * 0.40)
            + (interest_score * 0.25)
            + (text_score * 0.20)
            + (education_score * 0.10)
            + (experience_score * 0.05)
        )

        final_scores.append(final_score)

    # Store scores
    job_roles["Final Score"] = final_scores

    # ========================================================
    # DYNAMIC SORTING
    # ========================================================

    recommendations = (
        job_roles
        .sort_values(
            by="Final Score",
            ascending=False
        )
        .head(top_n)
    )

    # ========================================================
    # CREATE RESULT
    # ========================================================

    results = []

    for _, row in recommendations.iterrows():

        score = float(
            row["Final Score"]
        ) * 100

        score = max(
            0,
            min(100, score)
        )

        required_skills = [
            skill.strip()
            for skill in str(
                row["Required Skills"]
            ).split("|")
            if skill.strip()
        ]

        workplace = get_workplace(
            row["Job Title"]
        )

        results.append({

            "job_title":
                row["Job Title"],

            "category":
    get_role_category(
        row["Job Title"],
        row["Category"]
    ),

            "similarity_score":
                round(score, 2),

            "required_skills":
                required_skills,

            "workplace":
                workplace,

            "salary_range":
                row["Salary Range"]
        })

    print("===== CAREER RECOMMENDATIONS =====")

    for index, result in enumerate(results, start=1):

        print(
            f"{index}. "
            f"{result['job_title']} - "
            f"{result['similarity_score']}%"
        )

    print("==================================\n")

    return results