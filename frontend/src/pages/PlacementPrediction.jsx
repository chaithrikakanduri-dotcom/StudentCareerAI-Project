import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PlacementPredictionPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    IQ: "",
    Prev_Sem_Result: "",
    CGPA: "",
    Academic_Performance: "",
    Internship_Experience: "",
    Extra_Curricular_Score: "",
    Communication_Skills: "",
    Projects_Completed: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        IQ: Number(formData.IQ),
        Prev_Sem_Result: Number(formData.Prev_Sem_Result),
        CGPA: Number(formData.CGPA),
        Academic_Performance: Number(
          formData.Academic_Performance
        ),
        Internship_Experience:
          formData.Internship_Experience,
        Extra_Curricular_Score: Number(
          formData.Extra_Curricular_Score
        ),
        Communication_Skills: Number(
          formData.Communication_Skills
        ),
        Projects_Completed: Number(
          formData.Projects_Completed
        ),
      };

      console.log(
        "===== FRONTEND VALUES SENT TO API ====="
      );
      console.log(payload);

      const response = await fetch(
        "https://studentcareerai-project-production.up.railway.app/api/predict-placement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log("===== API RESPONSE =====");
      console.log(data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Placement prediction failed."
        );
      }

      setResult(data.data);
    } catch (err) {
      console.error("Prediction error:", err);

      setError(
        err.message ||
          "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="placement-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .placement-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(22,139,255,0.12),
              transparent 30%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(124,92,255,0.10),
              transparent 30%
            ),
            #050B1C;
          color: white;
          padding: 35px 50px 60px;
          font-family: Arial, Helvetica, sans-serif;
        }

        .placement-container {
          max-width: 1050px;
          margin: 0 auto;
        }

        .back-button {
          background: rgba(10,27,51,0.8);
          border: 1px solid rgba(0,217,255,0.3);
          color: #55E6FF;
          padding: 10px 18px;
          border-radius: 9px;
          font-size: 13px;
          cursor: pointer;
          margin-bottom: 30px;
        }

        .placement-label {
          display: inline-block;
          padding: 7px 13px;
          border-radius: 20px;
          background: linear-gradient(
            90deg,
            rgba(124,92,255,0.18),
            rgba(0,217,255,0.15)
          );
          border: 1px solid rgba(0,217,255,0.25);
          color: #55E6FF;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.8px;
          margin-bottom: 12px;
        }

        .placement-title {
          margin: 0;
          font-size: 38px;
          color: #168BFF;
        }

        .placement-description {
          max-width: 750px;
          color: #AFC4D9;
          font-size: 14px;
          line-height: 1.7;
          margin: 12px 0 30px;
        }

        .placement-form-card {
          background: linear-gradient(
            145deg,
            rgba(16,40,68,0.96),
            rgba(10,27,51,0.96)
          );
          border: 1px solid rgba(0,174,255,0.28);
          border-radius: 20px;
          padding: 32px;
          box-shadow:
            0 20px 60px rgba(0,0,0,0.28),
            0 0 35px rgba(0,174,255,0.08);
        }

        .form-heading {
          margin: 0 0 5px;
          font-size: 20px;
          color: #FFFFFF;
        }

        .form-subheading {
          color: #71809D;
          font-size: 12px;
          margin: 0 0 25px;
        }

        .placement-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .input-group label {
          display: block;
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .input-group input,
        .input-group select {
          width: 100%;
          height: 46px;
          padding: 0 14px;
          border-radius: 9px;
          border: 1px solid rgba(0,174,255,0.25);
          background: #071426;
          color: #FFFFFF;
          outline: none;
          font-size: 13px;
        }

        .input-group input:focus,
        .input-group select:focus {
          border-color: #00D9FF;
          box-shadow: 0 0 12px rgba(0,217,255,0.12);
        }

        .input-group select option {
          background: #071426;
          color: white;
        }

        .predict-button {
          width: 100%;
          height: 50px;
          margin-top: 28px;
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          background: linear-gradient(
            90deg,
            #8B5CF6,
            #3B82F6,
            #06D6F7
          );
        }

        .predict-button:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .error-box {
          margin-top: 22px;
          padding: 15px;
          border-radius: 10px;
          background: rgba(239,68,68,0.10);
          border: 1px solid rgba(239,68,68,0.35);
          color: #FF8A8A;
          font-size: 13px;
        }

        .result-card {
          margin-top: 28px;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          background:
            radial-gradient(
              circle at top,
              rgba(0,217,255,0.12),
              transparent 45%
            ),
            linear-gradient(
              145deg,
              #102844,
              #071426
            );
          border: 1px solid rgba(0,217,255,0.35);
          box-shadow:
            0 15px 50px rgba(0,0,0,0.25),
            0 0 30px rgba(0,217,255,0.10);
        }

        .result-label {
          color: #55E6FF;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .result-title {
          margin: 10px 0 5px;
          color: #FFFFFF;
          font-size: 21px;
        }

        .result-percentage {
          margin: 5px 0;
          font-size: 55px;
          font-weight: 800;
          color: #55E6FF;
          text-shadow: 0 0 25px rgba(0,217,255,0.25);
        }

        .result-status {
          font-size: 18px;
          font-weight: 700;
          margin-top: 5px;
        }

        .result-message {
          max-width: 600px;
          margin: 15px auto 0;
          color: #AFC4D9;
          font-size: 12px;
          line-height: 1.6;
        }

        .new-prediction-button {
          margin-top: 25px;
          padding: 12px 25px;
          border: none;
          border-radius: 9px;
          color: white;
          font-weight: 700;
          cursor: pointer;
          background: linear-gradient(
            90deg,
            #8B5CF6,
            #3B82F6,
            #06D6F7
          );
        }

        @media (max-width: 700px) {
          .placement-page {
            padding: 25px 18px 40px;
          }

          .placement-title {
            font-size: 30px;
          }

          .placement-form-card {
            padding: 22px;
          }

          .placement-form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="placement-container">

        <button
          className="back-button"
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="placement-label">
          ✦ AI-POWERED ANALYSIS
        </div>

        <h1 className="placement-title">
          Placement Prediction
        </h1>

        <p className="placement-description">
          Enter your academic performance, skills and
          experience. Our AI model will analyze your
          details and predict your placement probability.
        </p>

        {!result && (
          <form
            className="placement-form-card"
            onSubmit={handleSubmit}
          >

            <h2 className="form-heading">
              Student Information
            </h2>

            <p className="form-subheading">
              Enter your details accurately for the prediction.
            </p>

            <div className="placement-form-grid">

              <InputField
                label="IQ Score"
                name="IQ"
                type="number"
                min="50"
                max="150"
                step="1"
                placeholder="Ex: 85"
                value={formData.IQ}
                onChange={handleChange}
              />

              <InputField
                label="Previous Semester Result"
                name="Prev_Sem_Result"
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="Ex: 7.5"
                value={formData.Prev_Sem_Result}
                onChange={handleChange}
              />

              <InputField
                label="CGPA"
                name="CGPA"
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="Ex: 8.0"
                value={formData.CGPA}
                onChange={handleChange}
              />

              <InputField
                label="Academic Performance (Out of 10)"
                name="Academic_Performance"
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="Ex: 8"
                value={formData.Academic_Performance}
                onChange={handleChange}
              />

              <div className="input-group">
                <label>Internship Experience</label>

                <select
                  name="Internship_Experience"
                  value={formData.Internship_Experience}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select internship experience
                  </option>

                  <option value="Yes">Yes</option>

                  <option value="No">No</option>
                </select>
              </div>

              <InputField
                label="Extra-Curricular Score (Out of 10)"
                name="Extra_Curricular_Score"
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="Ex: 8"
                value={formData.Extra_Curricular_Score}
                onChange={handleChange}
              />

              <InputField
                label="Communication Skills (Out of 10)"
                name="Communication_Skills"
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="Ex: 8"
                value={formData.Communication_Skills}
                onChange={handleChange}
              />

              <InputField
                label="Projects Completed (0-5)"
                name="Projects_Completed"
                type="number"
                min="0"
                max="5"
                step="1"
                placeholder="Ex: 3"
                value={formData.Projects_Completed}
                onChange={handleChange}
              />

            </div>

            <button
              className="predict-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Analyzing Your Profile..."
                : "Predict Placement"}
            </button>

          </form>
        )}

        {error && (
          <div className="error-box">
            ⚠ {error}
          </div>
        )}

        {result && (
          <div className="result-card">

            <div className="result-label">
              ✦ AI PREDICTION RESULT
            </div>

            <h2 className="result-title">
              Placement Probability
            </h2>

            <div className="result-percentage">
              {result.placement_probability}%
            </div>

            <div
              className="result-status"
              style={{
                color:
                  result.prediction ===
                  "Likely to be placed"
                    ? "#4ADE80"
                    : "#FF8A8A",
              }}
            >
              {result.prediction}
            </div>

            <p className="result-message">
              This result is generated by your trained
              placement ML model based on the details
              you entered.
            </p>

            <button
              className="new-prediction-button"
              type="button"
              onClick={() => {
                setResult(null);
                setError("");
              }}
            >
              Make New Prediction
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  type,
  min,
  max,
  step,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="input-group">

      <label>{label}</label>

      <input
        name={name}
        type={type}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />

    </div>
  );
}

export default PlacementPredictionPage;