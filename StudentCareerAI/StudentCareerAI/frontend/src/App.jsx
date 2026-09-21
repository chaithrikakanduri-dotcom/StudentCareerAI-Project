import { useState } from "react";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);

  // Career analysis form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // What-if simulator
  const [selectedCareer, setSelectedCareer] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [simulatedSkills, setSimulatedSkills] = useState([]);

  // Placement prediction
  const [placementData, setPlacementData] = useState({
    IQ: "",
    Prev_Sem_Result: "",
    CGPA: "",
    Academic_Performance: "",
    Internship_Experience: "Yes",
    Extra_Curricular_Score: "",
    Communication_Skills: "",
    Projects_Completed: "",
  });

  const [placementLoading, setPlacementLoading] = useState(false);
  const [placementResult, setPlacementResult] = useState(null);
  const [placementError, setPlacementError] = useState("");

  // =========================
  // GET STARTED
  // =========================

  const handleGetStarted = () => {
    setShowLoginPage(false);
    setShowForm(true);

    setTimeout(() => {
      document.getElementById("career-form")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  const handleLogin = () => {
    setShowForm(false);
    setShowLoginPage(true);
    setError("");
  };

  const handleLogout = () => {
    setShowLoginPage(false);
    setShowForm(false);
    setResult(null);
    setError("");
    setPlacementResult(null);
    setPlacementError("");
    setSimulatedSkills([]);
    setSelectedCareer("");
    setSelectedSkill("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================
  // CAREER ANALYSIS
  // =========================

  const handleAnalyzeCareer = async () => {
    setError("");
    setResult(null);

    if (!name || !email || !education || !skills) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      // Register student
      const registerResponse = await fetch(
        "http://127.0.0.1:5000/api/register-student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            education,
            experience_years: 0,
            resume_text: skills,
          }),
        }
      );

      const registerData = await registerResponse.json();

      if (!registerResponse.ok || !registerData.success) {
        throw new Error(
          registerData.message || "Student registration failed."
        );
      }

      const studentId = registerData.student_id;

      // Career analysis
      const analyzeResponse = await fetch(
        "http://127.0.0.1:5000/api/analyze-resume",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: studentId,
            resume_text: skills,
          }),
        }
      );

      const analyzeData = await analyzeResponse.json();

      if (!analyzeResponse.ok || !analyzeData.success) {
        throw new Error(
          analyzeData.message || "Career analysis failed."
        );
      }

      setResult({
        ...analyzeData,
        studentName: name,
        education,
      });

      if (analyzeData.data.career_recommendations.length > 0) {
        setSelectedCareer(
          analyzeData.data.career_recommendations[0].job_title
        );
      }

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the Student Career AI backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CAREER DATA HELPERS
  // =========================

  const careerIcons = ["🤖", "🧠", "💻", "📊", "🚀"];

  const getSelectedCareerData = () => {
    if (!result || !selectedCareer) {
      return null;
    }

    const recommendation =
      result.data.career_recommendations.find(
        (career) => career.job_title === selectedCareer
      );

    const gap =
      result.data.skill_gap_analysis.find(
        (item) => item.job_title === selectedCareer
      );

    return {
      recommendation,
      gap,
    };
  };

  const selectedCareerData = getSelectedCareerData();

  // =========================
  // WHAT-IF SIMULATOR
  // =========================

  const getSimulationSkills = () => {
    const currentSkills = result?.data?.student_skills || [];

    return [...new Set([...currentSkills, ...simulatedSkills])];
  };

  const calculateReadiness = () => {
    if (!selectedCareerData?.recommendation) {
      return 0;
    }

    const requiredSkills =
      selectedCareerData.recommendation.required_skills || [];

    if (requiredSkills.length === 0) {
      return 0;
    }

    const currentSkillsLower = getSimulationSkills().map((skill) =>
      skill.toLowerCase()
    );

    const matched = requiredSkills.filter((skill) =>
      currentSkillsLower.includes(skill.toLowerCase())
    );

    return Math.round(
      (matched.length / requiredSkills.length) * 100
    );
  };

  const handleAddWhatIfSkill = () => {
    if (!selectedSkill) {
      return;
    }

    if (!simulatedSkills.includes(selectedSkill)) {
      setSimulatedSkills([
        ...simulatedSkills,
        selectedSkill,
      ]);
    }

    setSelectedSkill("");
  };

  const handleResetSimulator = () => {
    setSimulatedSkills([]);
  };

  const getAvailableSkills = () => {
    if (!selectedCareerData?.recommendation) {
      return [];
    }

    const requiredSkills =
      selectedCareerData.recommendation.required_skills || [];

    const currentSkills = getSimulationSkills().map((skill) =>
      skill.toLowerCase()
    );

    return requiredSkills.filter(
      (skill) =>
        !currentSkills.includes(skill.toLowerCase())
    );
  };

  // =========================
  // PLACEMENT PREDICTION
  // =========================

  const handlePlacementPrediction = async () => {
    setPlacementError("");
    setPlacementResult(null);

    const requiredFields = [
      "IQ",
      "Prev_Sem_Result",
      "CGPA",
      "Academic_Performance",
      "Internship_Experience",
      "Extra_Curricular_Score",
      "Communication_Skills",
      "Projects_Completed",
    ];

    const missingField = requiredFields.some(
      (field) => placementData[field] === ""
    );

    if (missingField) {
      setPlacementError(
        "Please fill in all placement details."
      );
      return;
    }

    setPlacementLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/predict-placement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            IQ: Number(placementData.IQ),
            Prev_Sem_Result: Number(
              placementData.Prev_Sem_Result
            ),
            CGPA: Number(placementData.CGPA),
            Academic_Performance: Number(
              placementData.Academic_Performance
            ),
            Internship_Experience:
              placementData.Internship_Experience,
            Extra_Curricular_Score: Number(
              placementData.Extra_Curricular_Score
            ),
            Communication_Skills: Number(
              placementData.Communication_Skills
            ),
            Projects_Completed: Number(
              placementData.Projects_Completed
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Placement prediction failed."
        );
      }

      setPlacementResult(data.data);

      setTimeout(() => {
        document
          .getElementById("placement-result")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 150);
    } catch (err) {
      setPlacementError(
        err.message ||
          "Unable to connect to placement prediction API."
      );
    } finally {
      setPlacementLoading(false);
    }
  };

  // =========================
  // SEPARATE LOGIN / STUDENT DETAILS PAGE
  // =========================

  if (showLoginPage) {
    return (
      <div className="student-login-page">
        <div className="student-login-topbar">
          <div className="student-login-logo">
            <div className="student-login-logo-mark">🎓</div>
            <span>Student Career AI</span>
          </div>

          <button
            className="student-logout-btn"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <main className="student-login-main">
          <div className="student-login-badge">🔐 STUDENT PORTAL</div>

          <h1>Welcome to Your Career Space</h1>

          <p className="student-login-subtitle">
            Enter your details to continue with career recommendations,
            skill gap analysis, and placement prediction.
          </p>

          <div className="student-details-card">
            <div className="student-details-header">
              <div className="student-details-icon">👨‍🎓</div>
              <div>
                <span>STUDENT DETAILS</span>
                <h2>Build Your Career Profile</h2>
              </div>
            </div>

            <p className="student-details-description">
              Provide your academic and skill information to get
              personalized career guidance.
            </p>

            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Education</label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              >
                <option value="" disabled>Select your education</option>
                <option>B.Tech</option>
                <option>B.Sc</option>
                <option>BCA</option>
                <option>M.Tech</option>
                <option>MCA</option>
                <option>Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>Skills</label>
              <textarea
                rows="5"
                placeholder="Example: Python, Java, SQL, C++, NLP, Deep Learning"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              ></textarea>
            </div>

            {error && (
              <div className="error-message">
                ⚠ {error}
              </div>
            )}

            <button
              className="login-analysis-btn"
              type="button"
              onClick={handleAnalyzeCareer}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing Your Career...
                </>
              ) : (
                <>🚀 Continue to Career Analysis</>
              )}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-mark">🎓</div>
          <span>Student Career AI</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <button
  className="login-btn"
  type="button"
  onClick={handleGetStarted}
>
  Login
</button>
      </nav>

      {/* HERO */}
      <section className="hero-section" id="home">
        <div className="hero-content">

          <div className="hero-badge">
            ✨ AI-POWERED CAREER GUIDANCE
          </div>

          <h1>
            Build Your
            <span>Future With Confidence</span>
          </h1>

          <p className="hero-text">
            Discover careers that match your skills, understand why they
            fit you, find out what you should learn next, and explore your
            placement prediction.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              type="button"
              onClick={handleGetStarted}
            >
              Start Career Analysis →
            </button>

            <a
              href="#features"
              className="secondary-btn"
            >
              Explore Features
            </a>

          </div>
        </div>

        <div className="hero-visual">

          <div className="floating-card card-top">
            🎯
            <span>Career Match</span>
            <strong>AI Powered</strong>
          </div>

          <div className="main-illustration">

            <div className="illustration-glow"></div>

            <div className="person-icon">
              🧑‍💻
            </div>

            <div className="orbit orbit-one">
              🤖
            </div>

            <div className="orbit orbit-two">
              📊
            </div>

            <div className="orbit orbit-three">
              💼
            </div>

          </div>

          <div className="floating-card card-bottom">
            🧠
            <span>Smart Guidance</span>
            <strong>Career + Placement</strong>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            From Student Profile to Career Direction
          </h2>

          <p>
            Get career recommendations, understand skill gaps, and explore
            your placement prediction from one platform.
          </p>

        </div>

        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-number">
              01
            </div>

            <div className="feature-icon">
              🎯
            </div>

            <h3>
              Career Recommendation
            </h3>

            <p>
              Discover career options that align with your current skills.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-number">
              02
            </div>

            <div className="feature-icon">
              📚
            </div>

            <h3>
              Skill Gap Analysis
            </h3>

            <p>
              Understand the skills you already have and the skills you
              can strengthen.
            </p>

          </div>

          <div className="feature-card">

            <div className="feature-number">
              03
            </div>

            <div className="feature-icon">
              💼
            </div>

            <h3>
              Placement Prediction
            </h3>

            <p>
              Estimate placement likelihood using academic and profile
              information.
            </p>

          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section
        className="about-section"
        id="about"
      >

        <div className="about-image">

          <div className="about-circle large">
            🎓
          </div>

          <div className="about-circle small one">
            💡
          </div>

          <div className="about-circle small two">
            🚀
          </div>

          <div className="about-circle small three">
            📈
          </div>

        </div>

        <div className="about-content">

          <span>
            ABOUT STUDENT CAREER AI
          </span>

          <h2>
            Career guidance made
            <strong> simple.</strong>
          </h2>

          <p>
            Student Career AI helps students understand their career
            possibilities, identify skills to strengthen, and estimate
            their placement likelihood.
          </p>

          <div className="about-points">

            <div>
              <span>✓</span>
              Understand your strongest career options
            </div>

            <div>
              <span>✓</span>
              Identify the skills you can improve
            </div>

            <div>
              <span>✓</span>
              Get an AI-based placement prediction
            </div>

          </div>

        </div>
      </section>

      {/* CAREER FORM */}
      {showForm && (
        <section
          className="form-section"
          id="career-form"
        >

          <div className="form-card">

            <div className="form-header">

              <div className="form-icon">
                🚀
              </div>

              <div>
                <span>LET'S BEGIN</span>

                <h2>
                  Build Your Career Profile
                </h2>
              </div>

            </div>

            <p className="form-description">
              Tell us about yourself and discover suitable career paths.
            </p>

            <div className="form-grid">

              <div className="input-group">
                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

            </div>

            <div className="input-group">

              <label>
                Education
              </label>

              <select
                value={education}
                onChange={(e) =>
                  setEducation(e.target.value)
                }
              >
                <option value="" disabled>
                  Select your education
                </option>

                <option>B.Tech</option>
                <option>B.Sc</option>
                <option>BCA</option>
                <option>M.Tech</option>
                <option>MCA</option>
                <option>Other</option>

              </select>

            </div>

            <div className="input-group">

              <label>
                Skills
              </label>

              <textarea
                rows="5"
                placeholder="Example: Python, Java, SQL, C++, NLP, Deep Learning"
                value={skills}
                onChange={(e) =>
                  setSkills(e.target.value)
                }
              ></textarea>

            </div>

            {error && (
              <div className="error-message">
                ⚠ {error}
              </div>
            )}

            <button
              className="analyze-btn"
              type="button"
              onClick={handleAnalyzeCareer}
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing Your Career...
                </>
              ) : (
                <>
                  ✨ Analyze My Career
                </>
              )}

            </button>

          </div>

        </section>
      )}

      {/* CAREER RESULTS */}
      {result && (
        <section
          className="results-section"
          id="results"
        >

          <div className="results-container">

            {/* WELCOME */}
            <div className="result-welcome">

              <div className="welcome-left">

                <div className="welcome-avatar">
                  🎓
                </div>

                <div>

                  <span>
                    YOUR PERSONALIZED REPORT
                  </span>

                  <h2>
                    Hi, {result.studentName}! 👋
                  </h2>

                  <p>
                    {result.education} · Your AI career analysis is ready
                  </p>

                </div>

              </div>

              <div className="completed-badge">
                ✓ Analysis Complete
              </div>

            </div>

            {/* SUMMARY */}
            <div className="summary-cards">

              <div className="summary-card">

                <div className="summary-card-icon green">
                  🧠
                </div>

                <div>
                  <span>
                    Skills Identified
                  </span>

                  <strong>
                    {result.data.student_skills.length}
                  </strong>
                </div>

              </div>

              <div className="summary-card">

                <div className="summary-card-icon blue">
                  🎯
                </div>

                <div>
                  <span>
                    Career Options
                  </span>

                  <strong>
                    {result.data.career_recommendations.length}
                  </strong>
                </div>

              </div>

              <div className="summary-card">

                <div className="summary-card-icon yellow">
                  ⭐
                </div>

                <div>
                  <span>
                    Top Match
                  </span>

                  <strong>
                    {
                      result.data.career_recommendations[0]
                        ?.similarity_score
                    }%
                  </strong>

                </div>

              </div>

            </div>

            {/* BEST CAREER */}
            {result.data.career_recommendations[0] && (
              <div className="best-career">

                <div className="best-label">
                  🏆 YOUR BEST CAREER
                </div>

                <div className="best-career-content">

                  <div className="best-picture">
                    🤖
                  </div>

                  <div className="best-info">

                    <span className="category-label">
                      {
                        result.data.career_recommendations[0]
                          .category
                      }
                    </span>

                    <h2>
                      {
                        result.data.career_recommendations[0]
                          .job_title
                      }
                    </h2>

                    <div className="best-match-text">

                      {
                        result.data.career_recommendations[0]
                          .similarity_score
                      }%

                      <span>
                        career match
                      </span>

                    </div>

                    <p>
                      This is your highest-ranked career according to
                      your current profile.
                    </p>

                  </div>

                </div>

                {/* WHY CAREER */}
                <div className="why-career-box">

                  <div className="why-icon">
                    💡
                  </div>

                  <div>

                    <h3>
                      Why This Career?
                    </h3>

                    <div className="why-columns">

                      <div>

                        <span className="why-title">
                          ✓ You already have
                        </span>

                        <div className="why-skills green-skills">

                          {result.data.skill_gap_analysis[0]
                            ?.matched_skills?.length > 0 ? (
                            result.data.skill_gap_analysis[0]
                              .matched_skills.map(
                                (skill, index) => (
                                  <span key={index}>
                                    {skill}
                                  </span>
                                )
                              )
                          ) : (
                            <span>
                              None detected
                            </span>
                          )}

                        </div>

                      </div>

                      <div>

                        <span className="why-title">
                          📚 Strengthen these skills
                        </span>

                        <div className="why-skills orange-skills">

                          {result.data.skill_gap_analysis[0]
                            ?.missing_skills?.length > 0 ? (
                            result.data.skill_gap_analysis[0]
                              .missing_skills.map(
                                (skill, index) => (
                                  <span key={index}>
                                    {skill}
                                  </span>
                                )
                              )
                          ) : (
                            <span>
                              None identified
                            </span>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* OTHER CAREERS */}
            <div className="result-section-heading">

              <div>

                <span>
                  EXPLORE OPTIONS
                </span>

                <h3>
                  Other Career Paths
                </h3>

              </div>

              <p>
                Alternative careers based on your current profile
              </p>

            </div>

            <div className="career-cards">

              {result.data.career_recommendations
                .slice(1)
                .map((career, index) => (

                  <div
                    className="career-option-card"
                    key={index}
                  >

                    <div className="career-option-top">

                      <div className="career-icon-box">
                        {careerIcons[index + 1]}
                      </div>

                      <span className="option-rank">
                        #{index + 2}
                      </span>

                    </div>

                    <span className="category-small">
                      {career.category}
                    </span>

                    <h4>
                      {career.job_title}
                    </h4>

                    <div className="option-score">

                      <div>

                        <span>
                          Career Match
                        </span>

                        <strong>
                          {career.similarity_score}%
                        </strong>

                      </div>

                      <div className="option-bar">

                        <span
                          style={{
                            width: `${Math.min(
                              career.similarity_score,
                              100
                            )}%`,
                          }}
                        ></span>

                      </div>

                    </div>

                  </div>

                ))}

            </div>

            {/* YOUR SKILLS */}
            <div className="result-section-heading">

              <div>

                <span>
                  YOUR STRENGTHS
                </span>

                <h3>
                  Skills You Already Have
                </h3>

              </div>

              <p>
                Skills identified from your profile
              </p>

            </div>

            <div className="skills-panel">

              <div className="skills-illustration">
                🧠
              </div>

              <div className="skills-content">

                <p>
                  These skills were identified from your submitted profile.
                </p>

                <div className="skill-cloud">

                  {result.data.student_skills.map(
                    (skill, index) => (
                      <span key={index}>
                        ✓ {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

            </div>

            {/* WHAT IF */}
            <div className="what-if-section">

              <div className="what-if-header">

                <div className="what-if-title">

                  <div className="what-if-icon">
                    🔮
                  </div>

                  <div>

                    <span>
                      EXPLORE YOUR FUTURE
                    </span>

                    <h3>
                      What-If Career Simulator
                    </h3>

                    <p>
                      What happens if you learn a new skill?
                    </p>

                  </div>

                </div>

                <div className="beta-badge">
                  ✨ Interactive
                </div>

              </div>

              <div className="simulator-content">

                <div className="simulator-controls">

                  <div className="input-group">

                    <label>
                      Choose a career
                    </label>

                    <select
                      value={selectedCareer}
                      onChange={(e) => {
                        setSelectedCareer(e.target.value);
                        setSimulatedSkills([]);
                      }}
                    >

                      {result.data.career_recommendations.map(
                        (career, index) => (
                          <option
                            key={index}
                            value={career.job_title}
                          >
                            {career.job_title}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div className="input-group">

                    <label>
                      Add a skill you want to learn
                    </label>

                    <div className="skill-add-row">

                      <select
                        value={selectedSkill}
                        onChange={(e) =>
                          setSelectedSkill(e.target.value)
                        }
                      >

                        <option value="">
                          Select a skill
                        </option>

                        {getAvailableSkills().map(
                          (skill, index) => (
                            <option
                              key={index}
                              value={skill}
                            >
                              {skill}
                            </option>
                          )
                        )}

                      </select>

                      <button
                        className="add-skill-btn"
                        type="button"
                        onClick={handleAddWhatIfSkill}
                      >
                        + Add
                      </button>

                    </div>

                  </div>

                </div>

                <div className="simulation-result">

                  <div className="before-after">

                    <div className="sim-card">

                      <span>
                        CURRENT READINESS
                      </span>

                      <strong>
                        {selectedCareerData?.gap
                          ?.skill_match_percentage || 0}%
                      </strong>

                      <small>
                        Based on your current skills
                      </small>

                    </div>

                    <div className="arrow-box">
                      →
                    </div>

                    <div className="sim-card improved">

                      <span>
                        WITH YOUR NEW SKILL
                      </span>

                      <strong>
                        {calculateReadiness()}%
                      </strong>

                      <small>
                        Skill coverage for this career
                      </small>

                    </div>

                  </div>

                  {simulatedSkills.length > 0 && (

                    <div className="added-skills">

                      <span>
                        Skills you're exploring:
                      </span>

                      <div>

                        {simulatedSkills.map(
                          (skill, index) => (
                            <span key={index}>
                              + {skill}
                            </span>
                          )
                        )}

                      </div>

                    </div>

                  )}

                  <div className="simulation-message">

                    <span>
                      💡
                    </span>

                    <p>

                      {simulatedSkills.length === 0
                        ? "Add a missing skill above to see how your skill coverage could improve."
                        : `Adding ${simulatedSkills.join(
                            ", "
                          )} improves your skill coverage toward ${selectedCareer}.`}

                    </p>

                  </div>

                  {simulatedSkills.length > 0 && (

                    <button
                      className="reset-btn"
                      type="button"
                      onClick={handleResetSimulator}
                    >
                      Reset Simulation
                    </button>

                  )}

                </div>

              </div>

            </div>

            {/* SKILL ROADMAP */}
            <div className="result-section-heading">

              <div>

                <span>
                  YOUR NEXT STEPS
                </span>

                <h3>
                  Skills to Strengthen
                </h3>

              </div>

              <p>
                Focus on these skills for your selected career
              </p>

            </div>

            <div className="roadmap-list">

              {result.data.skill_gap_analysis.map(
                (item, index) => (

                  <div
                    className="roadmap-card"
                    key={index}
                  >

                    <div className="roadmap-top">

                      <div className="roadmap-career">

                        <span>
                          {index + 1}
                        </span>

                        <strong>
                          {item.job_title}
                        </strong>

                      </div>

                      <div className="roadmap-match">
                        {item.skill_match_percentage}%
                      </div>

                    </div>

                    <div className="roadmap-progress">

                      <span
                        style={{
                          width: `${Math.min(
                            item.skill_match_percentage,
                            100
                          )}%`,
                        }}
                      ></span>

                    </div>

                    <div className="roadmap-bottom">

                      <div>

                        <small>
                          ✓ YOU HAVE
                        </small>

                        <p className="roadmap-green">
                          {item.matched_skills.length > 0
                            ? item.matched_skills.join(", ")
                            : "No matching skills yet"}
                        </p>

                      </div>

                      <div>

                        <small>
                          📚 LEARN NEXT
                        </small>

                        <p className="roadmap-orange">
                          {item.missing_skills.length > 0
                            ? item.missing_skills.join(", ")
                            : "No additional skills identified"}
                        </p>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

            {/* =========================
                PLACEMENT PREDICTION
            ========================= */}

            <div className="placement-section">

              <div className="placement-header">

                <div className="placement-title">

                  <div className="placement-icon">
                    💼
                  </div>

                  <div>

                    <span>
                      YOUR PLACEMENT INSIGHT
                    </span>

                    <h3>
                      Student Placement Prediction
                    </h3>

                    <p>
                      Estimate your placement likelihood using your academic
                      and profile information.
                    </p>

                  </div>

                </div>

                <div className="placement-badge">
                  🤖 AI Prediction
                </div>

              </div>

              <div className="placement-content">

                <div className="placement-form">

                  <div className="placement-field">
                    <label>IQ</label>

                    <input
                      type="number"
                      placeholder="Example: 120"
                      value={placementData.IQ}
                      onChange={(e) =>
                        setPlacementData({
                          ...placementData,
                          IQ: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="placement-field">
                    <label>
                      Previous Semester Result
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      placeholder="Example: 8.2"
                      value={placementData.Prev_Sem_Result}
                      onChange={(e) =>
                        setPlacementData({
                          ...placementData,
                          Prev_Sem_Result: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="placement-field">
                    <label>CGPA</label>

                    <input
                      type="number"
                      step="0.1"
                      placeholder="Example: 8.5"
                      value={placementData.CGPA}
                      onChange={(e) =>
                        setPlacementData({
                          ...placementData,
                          CGPA: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="placement-field">
                    <label>
                      Academic Performance
                    </label>

                    <input
                      type="number"
                      placeholder="Example: 85"
                      value={
                        placementData.Academic_Performance
                      }
                      onChange={(e) =>
                        setPlacementData({
                          ...placementData,
                          Academic_Performance:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="placement-field">
                    <label>
                      Internship Experience
                    </label>

                    <select
                      value={
                        placementData.Internship_Experience
                      }
                      onChange={(e) =>
                        setPlacementData({
                          ...placementData,
                          Internship_Experience:
                            e.target.value,
                        })
                      }
                    >
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
                      Extra-Curricular Score
                    </label>

                    <input
                      type="number"
                      placeholder="Example: 80"
                      value={
                        placementData.Extra_Curricular_Score
                      }
                      onChange={(e) =>
                        setPlacementData({
                          ...placementData,
                          Extra_Curricular_Score:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="placement-field">
                    <label>
                      Communication Skills
                    </label>

                    <input
                      type="number"
                      placeholder="Example: 82"
                      value={
                        placementData.Communication_Skills
                      }
                      onChange={(e) =>
                        setPlacementData({
                          ...placementData,
                          Communication_Skills:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="placement-field">
                    <label>
                      Projects Completed
                    </label>

                    <input
                      type="number"
                      placeholder="Example: 3"
                      value={
                        placementData.Projects_Completed
                      }
                      onChange={(e) =>
                        setPlacementData({
                          ...placementData,
                          Projects_Completed:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                </div>

                {placementError && (
                  <div className="placement-error">
                    ⚠ {placementError}
                  </div>
                )}

                <button
                  className="placement-predict-btn"
                  type="button"
                  onClick={handlePlacementPrediction}
                  disabled={placementLoading}
                >

                  {placementLoading ? (
                    <>
                      <span className="placement-spinner"></span>
                      Predicting Placement...
                    </>
                  ) : (
                    <>
                      🔮 Predict My Placement
                    </>
                  )}

                </button>

              </div>
            </div>

            {/* PLACEMENT RESULT */}

            {placementResult && (

              <div
                className="placement-result-card"
                id="placement-result"
              >

                <div className="placement-result-top">

                  <div className="placement-result-icon">
                    💼
                  </div>

                  <div>

                    <span>
                      PLACEMENT PREDICTION
                    </span>

                    <h3>
                      Your Placement Insight
                    </h3>

                  </div>

                  <div className="prediction-status">
                    ✓ Prediction Complete
                  </div>

                </div>

                <div className="placement-result-main">

                  <div className="placement-score-circle">

                    <strong>
                      {placementResult.placement_probability}%
                    </strong>

                    <span>
                      Probability
                    </span>

                  </div>

                  <div className="placement-result-info">

                    <span className="placement-result-label">
                      MODEL PREDICTION
                    </span>

                    <h2>
                      {placementResult.prediction}
                    </h2>

                    <p>
                      This prediction is based on the academic,
                      communication, internship, project, and other
                      information provided.
                    </p>

                  </div>

                </div>

                <div className="placement-note">
                  💡 This is an AI-based prediction, not a guarantee of
                  placement. Use it as decision-support information.
                </div>

              </div>

            )}

            {/* FINAL */}
            <div className="final-message">

              <div className="final-icon">
                💡
              </div>

              <div>

                <span>
                  YOUR CAREER JOURNEY
                </span>

                <h3>
                  Know where you are. Know where to go.
                </h3>

                <p>
                  Use your career recommendations, skill insights, and
                  placement prediction as decision-support information
                  while planning your career development.
                </p>

              </div>

            </div>

          </div>

        </section>
      )}

      {/* FOOTER */}
      <footer className="footer">

        <div>

          <h3>
            🎓 Student Career AI
          </h3>

          <p>
            Helping students discover clearer career paths.
          </p>

        </div>

        <p>
          © 2026 Student Career AI
        </p>

      </footer>

    </div>
  );
}

export default App;