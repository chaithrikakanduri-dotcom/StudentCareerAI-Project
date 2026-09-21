import requests

url = "http://127.0.0.1:5000/api/predict-placement"

data = {
    "IQ": 120,
    "Prev_Sem_Result": 8.2,
    "CGPA": 8.5,
    "Academic_Performance": 85,
    "Internship_Experience": "Yes",
    "Extra_Curricular_Score": 80,
    "Communication_Skills": 82,
    "Projects_Completed": 3
}

response = requests.post(
    url,
    json=data
)

print("Status Code:")
print(response.status_code)

print("\nAPI Response:")
print(response.text)