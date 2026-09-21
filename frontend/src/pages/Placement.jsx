import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Placement.css";

function Placement() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    iq: "",
    prevSemResult: "",
    cgpa: "",
    academicPerformance: "",
    internshipExperience: "",
    extraCurricularScore: "",
    communicationSkills: "",
    projectsCompleted: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emptyField = Object.values(formData).some(
      (value) => value === ""
    );

    if (emptyField) {
      alert("Please fill all the details.");
      return;
    }

    navigate("/placement-result", {
      state: formData,
    });
  };

  return (
    <div className="placement-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="placement-sidebar">

        <Link to="/dashboard" className="placement-logo">
          <span className="logo-icon">✦</span>

          <div>
            <strong>Student Career</strong>
            <b>AI</b>
          </div>
        </Link>

        <nav className="placement-nav">

          <Link to="/dashboard">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/placement"
            className="placement-active"
          >
            <span>🎯</span>
            Placement Prediction
          </Link>

          <Link to="/career-recommendation">
            <span>💼</span>
            Career Recommendation
          </Link>

          <Link to="/skill-gap">
            <span>📊</span>
            Skill Gap Analysis
          </Link>

          <Link to="/profile">
            <span>👤</span>
            Profile
          </Link>

        </nav>

        <div className="placement-support">

          <div className="support-icon">
            🚀
          </div>

          <strong>Your Goals</strong>
          <strong>Our AI Support</strong>

          <p>
            Smart guidance for a brighter future.
          </p>

        </div>

        <button
          className="placement-logout"
          onClick={() => navigate("/")}
        >
          <span>↪</span>
          Logout
        </button>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="placement-main">

        {/* TOP BAR */}

        <header className="placement-topbar">

          <div className="placement-breadcrumb">
            ← Dashboard /{" "}
            <span>Placement Prediction</span>
          </div>

          <Link
            to="/profile"
            className="placement-user"
          >
            <span>👤</span>

            <div>
              <strong>Student</strong>
              <small>Profile</small>
            </div>

            <b>⌄</b>
          </Link>

        </header>

        {/* ================= HERO ================= */}

        <section className="placement-hero">

          <div className="placement-hero-icon">
            🎯
          </div>

          <div className="placement-hero-content">

            <span>
              ✦ PLACEMENT PREDICTION
            </span>

            <h1>
              Predict Your
              <strong>Placement Chances</strong>
            </h1>

            <p>
              Enter your academic and personal details to
              get an AI-powered prediction of your placement
              chances.
            </p>

          </div>

          <div className="placement-hero-visual">

            <div className="visual-ring ring-one"></div>
            <div className="visual-ring ring-two"></div>

            <div className="visual-ai">
              <span>✦</span>
              <strong>AI</strong>
            </div>

          </div>

        </section>

        {/* ================= CONTENT ================= */}

        <div className="placement-content">

          <div className="placement-left">

            <form onSubmit={handleSubmit}>

              {/* ACADEMIC */}

              <section className="placement-card">

                <div className="card-heading">

                  <div className="card-icon">
                    🎓
                  </div>

                  <div>
                    <span>ACADEMIC PROFILE</span>
                    <h2>Academic Information</h2>
                    <p>
                      Enter your academic details
                    </p>
                  </div>

                </div>

                <div className="placement-grid">

                  <div className="placement-field">
                    <label>IQ Score</label>

                    <input
                      type="number"
                      name="iq"
                      placeholder="Enter your IQ score"
                      value={formData.iq}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="placement-field">
                    <label>CGPA</label>

                    <input
                      type="number"
                      step="0.01"
                      name="cgpa"
                      placeholder="Enter your CGPA"
                      value={formData.cgpa}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="placement-field">
                    <label>
                      Previous Semester Result
                    </label>

                    <input
                      type="number"
                      name="prevSemResult"
                      placeholder="Enter percentage"
                      value={formData.prevSemResult}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="placement-field">
                    <label>
                      Academic Performance
                    </label>

                    <select
                      name="academicPerformance"
                      value={formData.academicPerformance}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select performance
                      </option>

                      <option value="Excellent">
                        Excellent
                      </option>

                      <option value="Good">
                        Good
                      </option>

                      <option value="Average">
                        Average
                      </option>

                      <option value="Below Average">
                        Below Average
                      </option>
                    </select>

                  </div>

                </div>

              </section>

              {/* EXPERIENCE */}

              <section className="placement-card">

                <div className="card-heading">

                  <div className="card-icon">
                    💼
                  </div>

                  <div>
                    <span>EXPERIENCE & SKILLS</span>
                    <h2>Experience & Skills</h2>
                    <p>
                      Add your professional and personal skills
                    </p>
                  </div>

                </div>

                <div className="placement-grid">

                  <div className="placement-field">
                    <label>
                      Internship Experience
                    </label>

                    <select
                      name="internshipExperience"
                      value={formData.internshipExperience}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select option
                      </option>

                      <option value="Yes">
                        Yes
                      </option>

                      <option value="No">
                        No
                      </option>

                    </select>

                  </div>

                  <div className="placement-field">
                    <label>
                      Projects Completed
                    </label>

                    <input
                      type="number"
                      name="projectsCompleted"
                      placeholder="Number of projects"
                      value={formData.projectsCompleted}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="placement-field">
                    <label>
                      Communication Skills
                    </label>

                    <select
                      name="communicationSkills"
                      value={formData.communicationSkills}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select level
                      </option>

                      <option value="Excellent">
                        Excellent
                      </option>

                      <option value="Good">
                        Good
                      </option>

                      <option value="Average">
                        Average
                      </option>

                      <option value="Poor">
                        Poor
                      </option>

                    </select>

                  </div>

                  <div className="placement-field">
                    <label>
                      Extra Curricular Score
                    </label>

                    <input
                      type="number"
                      name="extraCurricularScore"
                      placeholder="Enter score"
                      value={formData.extraCurricularScore}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <button
                  type="submit"
                  className="placement-predict-button"
                >
                  Predict Placement
                  <span>→</span>
                </button>

              </section>

            </form>

          </div>

          {/* ================= WHY CARD ================= */}

          <aside className="placement-why">

            <h2>
              Why Placement
              <span>Prediction?</span>
            </h2>

            <div className="why-item">

              <div className="why-icon">
                🎯
              </div>

              <div>
                <strong>Data Driven</strong>

                <p>
                  Uses your academic and personal
                  information for prediction.
                </p>
              </div>

            </div>

            <div className="why-item">

              <div className="why-icon">
                🧠
              </div>

              <div>
                <strong>AI Powered</strong>

                <p>
                  Machine learning helps analyze
                  your placement possibilities.
                </p>
              </div>

            </div>

            <div className="why-item">

              <div className="why-icon">
                🛡
              </div>

              <div>
                <strong>Personalized</strong>

                <p>
                  Receive insights based on your
                  individual student profile.
                </p>
              </div>

            </div>

            <div className="why-quote">

              <span>✦</span>

              <p>
                Your potential
                <br />
                is greater than you think.
              </p>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default Placement;