
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./PlacementResult.css";

function PlacementResult() {
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [inputData, setInputData] = useState(null);

  useEffect(() => {
    const savedResult = localStorage.getItem("placementPredictionResult");
    const savedInput = localStorage.getItem("placementPredictionInput");

    if (!savedResult) {
      navigate("/placement");
      return;
    }

    try {
      const parsedResult = JSON.parse(savedResult);
      setResult(parsedResult);

      if (savedInput) {
        setInputData(JSON.parse(savedInput));
      }
    } catch (error) {
      console.error("Could not read placement result:", error);
      navigate("/placement");
    }
  }, [navigate]);

  if (!result) {
    return (
      <div className="placement-result-loading">
        Loading prediction...
      </div>
    );
  }

  const probability = Number(result.placement_probability);

  const prediction = result.prediction || "No prediction available";

  const isPositive = prediction === "Likely to be placed";

  return (
    <div className="placement-result-page">

      {/* SIDEBAR */}

      <aside className="placement-result-sidebar">

        <Link to="/dashboard" className="placement-result-brand">
          <span className="placement-result-brand-icon">
            ✦
          </span>

          <div>
            <strong>Student Career</strong>
            <b>AI</b>
          </div>
        </Link>

        <nav className="placement-result-menu">

          <Link to="/dashboard">
            <span>🏠</span>
            Dashboard
          </Link>

          <Link
            to="/placement"
            className="placement-result-menu-active"
          >
            <span>📊</span>
            Placement Prediction
          </Link>

          <Link to="/career-recommendation">
            <span>🎯</span>
            Career Recommendation
          </Link>

          <Link to="/skill-gap">
            <span>🧩</span>
            Skill Gap Analysis
          </Link>

          <Link to="/profile">
            <span>👤</span>
            Profile
          </Link>

        </nav>

        <div className="placement-result-sidebar-bottom">

          <div className="placement-result-goal-title">
            Your Goals
          </div>

          <div className="placement-result-ai-support">
            Our AI Support
          </div>

          <p>
            Smart guidance for a better future.
          </p>

          <button
            className="placement-result-logout"
            onClick={() => navigate("/")}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="placement-result-main">

        <header className="placement-result-header">

          <div>

            <div className="placement-result-label">
              ✦ PLACEMENT RESULT
            </div>

            <h1>
              Your Placement Prediction
            </h1>

            <p>
              Your result is generated using the Student
              Career AI placement prediction model.
            </p>

          </div>

          <div className="placement-result-ai-icon">
            ✦
          </div>

        </header>

        {/* RESULT */}

        <section className="placement-result-card">

          <div className="placement-result-card-title">
            AI PREDICTION
          </div>

          <div className="placement-result-content">

            <div className="placement-probability">

              <div className="placement-probability-number">
                {probability.toFixed(2)}%
              </div>

              <div className="placement-probability-label">
                Placement Probability
              </div>

            </div>

            <div
              className={
                isPositive
                  ? "placement-status placement-status-positive"
                  : "placement-status placement-status-negative"
              }
            >

              <div className="placement-status-icon">
                {isPositive ? "✓" : "!"}
              </div>

              <div>

                <h2>
                  {prediction}
                </h2>

                <p>
                  {isPositive
                    ? "Your current profile shows a positive placement prediction."
                    : "Your current profile indicates that some areas may need improvement for better placement opportunities."}
                </p>

              </div>

            </div>

          </div>

          <div className="placement-result-note">
            <span>✦</span>{" "}
            This prediction is generated from the details
            you entered and the trained placement model.
          </div>

        </section>

        {/* INPUT DETAILS */}

        {inputData && (

          <section className="placement-input-summary">

            <div className="placement-result-card-title">
              YOUR SUBMITTED DETAILS
            </div>

            <div className="placement-summary-grid">

              <div>
                <span>IQ Score</span>
                <strong>{inputData.IQ}</strong>
              </div>

              <div>
                <span>CGPA</span>
                <strong>{inputData.CGPA}</strong>
              </div>

              <div>
                <span>Previous Semester</span>
                <strong>{inputData.Prev_Sem_Result}</strong>
              </div>

              <div>
                <span>Academic Performance</span>
                <strong>
                  {inputData.Academic_Performance}
                </strong>
              </div>

              <div>
                <span>Internship</span>
                <strong>
                  {inputData.Internship_Experience}
                </strong>
              </div>

              <div>
                <span>Projects Completed</span>
                <strong>
                  {inputData.Projects_Completed}
                </strong>
              </div>

              <div>
                <span>Communication Skills</span>
                <strong>
                  {inputData.Communication_Skills}
                </strong>
              </div>

              <div>
                <span>Extra Curricular</span>
                <strong>
                  {inputData.Extra_Curricular_Score}
                </strong>
              </div>

            </div>

          </section>

        )}

        {/* BUTTONS */}

        <div className="placement-result-actions">

          <button
            className="placement-result-primary-button"
            onClick={() =>
              navigate("/career-recommendation")
            }
          >
            Continue to Career Recommendation →
          </button>

          <button
            className="placement-result-secondary-button"
            onClick={() =>
              navigate("/placement")
            }
          >
            ← Predict Again
          </button>

        </div>

      </main>

    </div>
  );
}

export default PlacementResult;
