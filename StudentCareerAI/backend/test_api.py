import requests


url = "http://127.0.0.1:5000/api/analyze-resume"


data = {
    "student_id": 2,
    "resume_text": """
    Education: Bachelor's in Computer Science
    Experience: 2 years
    Skills: Python, Java, SQL, React, Machine Learning, Docker
    """
}


response = requests.post(
    url,
    json=data
)


print("Status Code:")
print(response.status_code)

print("\nAPI Response:")
print(response.text)