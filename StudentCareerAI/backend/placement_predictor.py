import joblib
import pandas as pd


MODEL_PATH = "placement_model.pkl"


# Load trained model
model = joblib.load(MODEL_PATH)


def predict_placement(
    iq,
    prev_sem_result,
    cgpa,
    academic_performance,
    internship_experience,
    extra_curricular_score,
    communication_skills,
    projects_completed
):
    data = pd.DataFrame([{
        "IQ": iq,
        "Prev_Sem_Result": prev_sem_result,
        "CGPA": cgpa,
        "Academic_Performance": academic_performance,
        "Internship_Experience": internship_experience,
        "Extra_Curricular_Score": extra_curricular_score,
        "Communication_Skills": communication_skills,
        "Projects_Completed": projects_completed
    }])

    prediction = model.predict(data)[0]
    probabilities = model.predict_proba(data)[0]

    placement_probability = probabilities[1] * 100

    if prediction == 1:
        result = "Likely to be placed"
    else:
        result = "Less likely to be placed"

    return {
        "placement_probability": round(
            placement_probability, 2
        ),
        "prediction": result
    }


if __name__ == "__main__":

    result = predict_placement(
        iq=120,
        prev_sem_result=8.2,
        cgpa=8.5,
        academic_performance=85,
        internship_experience="Yes",
        extra_curricular_score=80,
        communication_skills=82,
        projects_completed=3
    )

    print("Placement Prediction")
    print("--------------------")
    print("Probability:", result["placement_probability"], "%")
    print("Prediction:", result["prediction"])