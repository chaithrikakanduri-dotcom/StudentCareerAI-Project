import requests

url = "http://127.0.0.1:5000/api/register-student"

data = {
    "name": "Alice",
    "email": "alice@example.com",
    "education": "Bachelor's in Computer Science",
    "experience_years": 2,
    "resume_text": "Python, Java, SQL, React, Machine Learning, Docker"
}

response = requests.post(
    url,
    json=data
)

print("Status Code:")
print(response.status_code)

print("\nAPI Response:")
print(response.text)