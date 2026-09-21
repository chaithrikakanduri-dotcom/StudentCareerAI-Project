import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib


# =========================
# 1. Load dataset
# =========================

DATASET_PATH = "college_student_placement_dataset.csv"

df = pd.read_csv(DATASET_PATH)

print("Dataset loaded successfully.")
print("Shape:", df.shape)


# =========================
# 2. Select features
# =========================

features = [
    "IQ",
    "Prev_Sem_Result",
    "CGPA",
    "Academic_Performance",
    "Internship_Experience",
    "Extra_Curricular_Score",
    "Communication_Skills",
    "Projects_Completed"
]

target = "Placement"

X = df[features].copy()
y = df[target].map({
    "Yes": 1,
    "No": 0
})


# =========================
# 3. Check target
# =========================

print("\nTarget distribution:")
print(y.value_counts())

if y.isna().any():
    raise ValueError("Invalid values found in Placement column.")


# =========================
# 4. Define columns
# =========================

categorical_features = [
    "Internship_Experience"
]

numeric_features = [
    "IQ",
    "Prev_Sem_Result",
    "CGPA",
    "Academic_Performance",
    "Extra_Curricular_Score",
    "Communication_Skills",
    "Projects_Completed"
]


# =========================
# 5. Preprocessing
# =========================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        ),
        (
            "num",
            "passthrough",
            numeric_features
        )
    ]
)


# =========================
# 6. Random Forest model
# =========================

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    class_weight="balanced"
)


# =========================
# 7. Create pipeline
# =========================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# =========================
# 8. Split dataset
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("\nTraining data:", X_train.shape)
print("Testing data:", X_test.shape)


# =========================
# 9. Train
# =========================

print("\nTraining placement model...")

pipeline.fit(X_train, y_train)

print("Training completed.")


# =========================
# 10. Evaluate
# =========================

y_pred = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\n==============================")
print("PLACEMENT MODEL RESULTS")
print("==============================")

print(f"Accuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=["Not Placed", "Placed"]
    )
)

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))


# =========================
# 11. Save model
# =========================

MODEL_PATH = "placement_model.pkl"

joblib.dump(
    pipeline,
    MODEL_PATH
)

print("\nModel saved successfully:")
print(MODEL_PATH)