import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
    brier_score_loss
)

# ============================================================
# 1. LOAD DATASET
# ============================================================

DATASET_PATH = "college_student_placement_dataset.csv"
MODEL_PATH = "placement_model.pkl"

df = pd.read_csv(DATASET_PATH)

print("Dataset loaded successfully.")
print("Shape:", df.shape)

# ============================================================
# 2. FEATURES
# ============================================================

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

X = df[features].copy()

y = df["Placement"].map({
    "Yes": 1,
    "No": 0
})

# ============================================================
# 3. FEATURE TYPES
# ============================================================

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

# ============================================================
# 4. PREPROCESSING
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        ),
        (
            "num",
            StandardScaler(),
            numeric_features
        )
    ]
)

# ============================================================
# 5. LOGISTIC REGRESSION
# ============================================================

base_model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "model",
            LogisticRegression(
                C=1.0,
                max_iter=3000,
                random_state=42
            )
        )
    ]
)

# ============================================================
# 6. TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining data:", X_train.shape)
print("Testing data:", X_test.shape)

# ============================================================
# 7. CALIBRATED MODEL
# ============================================================

print("\nTraining calibrated Logistic Regression...")

model = CalibratedClassifierCV(
    estimator=base_model,
    method="sigmoid",
    cv=5
)

model.fit(X_train, y_train)

print("Training completed.")

# ============================================================
# 8. EVALUATION
# ============================================================

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

accuracy = accuracy_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_prob)
brier = brier_score_loss(y_test, y_prob)

print("\n==============================")
print("CALIBRATED LOGISTIC MODEL")
print("==============================")

print(f"Accuracy: {accuracy * 100:.2f}%")
print(f"ROC-AUC: {roc_auc:.4f}")
print(f"Brier Score: {brier:.4f}")

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

# ============================================================
# 9. SAVE MODEL
# ============================================================

joblib.dump(model, MODEL_PATH)

print("\nModel saved successfully:")
print(MODEL_PATH)

# ============================================================
# 10. TEST YOUR PROFILE
# ============================================================

student = pd.DataFrame([{
    "IQ": 62,
    "Prev_Sem_Result": 7.56,
    "CGPA": 7.5,
    "Academic_Performance": 8,
    "Internship_Experience": "Yes",
    "Extra_Curricular_Score": 8,
    "Communication_Skills": 8,
    "Projects_Completed": 5
}])

prediction = model.predict(student)[0]
probability = model.predict_proba(student)[0]

print("\n===== YOUR TEST PROFILE =====")

print(
    "Prediction:",
    "Placed" if prediction == 1 else "Not Placed"
)

print(
    "Probability of Not Placed:",
    round(probability[0] * 100, 2),
    "%"
)

print(
    "Probability of Placed:",
    round(probability[1] * 100, 2),
    "%"
)