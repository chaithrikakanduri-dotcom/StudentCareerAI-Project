import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


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
    Loads the job roles dataset.
    """

    return pd.read_csv(JOB_ROLES_PATH)


def prepare_job_text(row):
    """
    Combines the important job-role information
    into one text field for NLP comparison.
    """

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


def recommend_careers(resume_text, top_n=5):
    """
    Recommends careers by comparing the student's
    resume with job roles using TF-IDF and
    cosine similarity.
    """

    if not resume_text or not str(resume_text).strip():
        return []

    # Load job roles
    job_roles = load_job_roles()

    # Create combined text for every job role
    job_roles["combined_text"] = job_roles.apply(
        prepare_job_text,
        axis=1
    )

    # Student resume
    resume_text = str(resume_text)

    # Create TF-IDF vectors
    vectorizer = TfidfVectorizer(
        lowercase=True,
        stop_words="english"
    )

    all_text = [resume_text] + job_roles["combined_text"].tolist()

    tfidf_matrix = vectorizer.fit_transform(all_text)

    # First vector is the student's resume
    resume_vector = tfidf_matrix[0]

    # Remaining vectors are job roles
    job_vectors = tfidf_matrix[1:]

    # Calculate cosine similarity
    similarity_scores = cosine_similarity(
        resume_vector,
        job_vectors
    ).flatten()

    # Add scores to dataframe
    job_roles["Similarity Score"] = similarity_scores

    # Sort from highest to lowest
    recommendations = job_roles.sort_values(
        by="Similarity Score",
        ascending=False
    ).head(top_n)

    results = []

    for _, row in recommendations.iterrows():

        results.append({
            "job_title": row["Job Title"],
            "category": row["Category"],
            "similarity_score": round(
                float(row["Similarity Score"]) * 100,
                2
            ),
            "required_skills": str(
                row["Required Skills"]
            ).split("|")
        })

    return results


if __name__ == "__main__":

    sample_resume = """
    Education: Bachelor's in Computer Science
    Experience: 2 years
    Skills: Python, Java, SQL, React, Machine Learning, Docker
    """

    print("Student Resume:")
    print(sample_resume)

    print("\nCareer Recommendations:")

    recommendations = recommend_careers(
        sample_resume,
        top_n=5
    )

    for index, recommendation in enumerate(
        recommendations,
        start=1
    ):

        print(f"\n{index}. {recommendation['job_title']}")
        print(f"Category: {recommendation['category']}")
        print(
            f"Similarity Score: "
            f"{recommendation['similarity_score']}%"
        )
        print(
            "Required Skills: "
            + ", ".join(
                recommendation["required_skills"]
            )
        )