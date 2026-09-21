import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import "./SkillGap.css";

const careerData = {
  "AI/ML Engineer": {
    icon: "🤖",
    category: "AI & Machine Learning",
    requiredSkills: [
      "Python",
      "Machine Learning",
      "SQL",
      "Statistics",
      "TensorFlow",
      "Deep Learning",
      "Data Analysis",
    ],
    defaultSkills: ["Python", "SQL", "Machine Learning", "Flask"],
    jobReadiness: 72,
  },

  "Data Scientist": {
    icon: "📊",
    category: "Data & Analytics",
    requiredSkills: [
      "Python",
      "SQL",
      "Statistics",
      "Pandas",
      "Data Visualization",
      "Machine Learning",
      "Power BI",
    ],
    defaultSkills: ["Python", "SQL", "Machine Learning", "Pandas"],
    jobReadiness: 75,
  },

  "Software Developer": {
    icon: "💻",
    category: "Software Development",
    requiredSkills: [
      "Java",
      "Python",
      "Data Structures",
      "Algorithms",
      "OOP",
      "Git",
      "Problem Solving",
    ],
    defaultSkills: ["Java", "Python", "OOP", "Git"],
    jobReadiness: 70,
  },

  "Full Stack Developer": {
    icon: "🌐",
    category: "Web Development",
    requiredSkills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "SQL",
      "Git",
    ],
    defaultSkills: ["HTML", "CSS", "JavaScript", "React"],
    jobReadiness: 68,
  },

  "Cloud Engineer": {
    icon: "☁️",
    category: "Cloud & Infrastructure",
    requiredSkills: [
      "Linux",
      "Networking",
      "AWS",
      "Docker",
      "Kubernetes",
      "Python",
      "Git",
    ],
    defaultSkills: ["Linux", "Python", "Git"],
    jobReadiness: 60,
  },
};

function SkillGap() {
  const [selectedCareer, setSelectedCareer] =
    useState("AI/ML Engineer");

  const [studentSkills, setStudentSkills] = useState(
    careerData["AI/ML Engineer"].defaultSkills
  );

  const [showCareerList, setShowCareerList] = useState(false);

  const career = careerData[selectedCareer];

  /*
   * Change career
   */
  const handleCareerChange = (careerName) => {
    setSelectedCareer(careerName);

    // Load suitable starting skills for the selected career.
    setStudentSkills(careerData[careerName].defaultSkills);

    setShowCareerList(false);
  };

  /*
   * Calculate matched and missing skills
   */
  const matchedSkills = career.requiredSkills.filter((skill) =>
    studentSkills.includes(skill)
  );

  const missingSkills = career.requiredSkills.filter(
    (skill) => !studentSkills.includes(skill)
  );

  const skillMatch =
    career.requiredSkills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length / career.requiredSkills.length) * 100
        );

  /*
   * Priority based on missing-skill position.
   */
  const getPriority = (index) => {
    if (index === 0) return "HIGH";
    if (index <= 2) return "MEDIUM";
    return "LOW";
  };

  const getPriorityClass = (index) => {
    if (index === 0) return "high";
    if (index <= 2) return "medium";
    return "low";
  };

  /*
   * Generate gap report dynamically
   */
  const gapReport = useMemo(() => {
    return missingSkills.map((skill, index) => ({
      name: skill,
      priority: getPriority(index),
      priorityClass: getPriorityClass(index),
      progress:
        getPriority(index) === "HIGH"
          ? 82
          : getPriority(index) === "MEDIUM"
          ? 62
          : 40,
    }));
  }, [missingSkills]);

  /*
   * Generate learning steps dynamically
   */
  const learningSteps = missingSkills.slice(0, 4);

  /*
   * Calculate job readiness
   */
  const calculatedReadiness = Math.min(
    100,
    Math.round((skillMatch + career.jobReadiness) / 2)
  );

  return (
    <div className="skill-gap-page">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="skill-gap-sidebar">

        <Link to="/dashboard" className="skill-gap-brand">
          <div className="skill-gap-brand-icon">
            ✦
          </div>

          <div className="skill-gap-brand-text">
            <strong>Student Career</strong>
            <b>AI</b>
          </div>
        </Link>

        <nav className="skill-gap-menu">

          <Link
            to="/dashboard"
            className="skill-gap-menu-item"
          >
            <span>🏠</span>
            Dashboard
          </Link>

          <Link
            to="/placement-prediction"
            className="skill-gap-menu-item"
          >
            <span>📊</span>
            Placement Prediction
          </Link>

          <Link
            to="/career-recommendation"
            className="skill-gap-menu-item"
          >
            <span>🎯</span>
            Career Recommendation
          </Link>

          <Link
            to="/skill-gap"
            className="skill-gap-menu-item active"
          >
            <span>🧩</span>
            Skill Gap Analysis
          </Link>

          <Link
            to="/profile"
            className="skill-gap-menu-item"
          >
            <span>👤</span>
            Profile
          </Link>

        </nav>

        <div className="skill-gap-sidebar-bottom">

          <div className="skill-gap-goal-title">
            Your Goals
          </div>

          <div className="skill-gap-support">
            ✦ Our AI Support
          </div>

          <p>
            Smart guidance for a better future.
          </p>

          <Link
            to="/"
            className="skill-gap-logout"
          >
            <span>↪</span>
            Logout
          </Link>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="skill-gap-main">

        {/* HEADER */}

        <header className="skill-gap-header">

          <div className="skill-gap-label">
            ✦ STUDENT CAREER AI
          </div>

          <h1>
            Skill Gap Analysis
          </h1>

          <p>
            Understand your current skills, identify what you
            are missing and discover what you need to learn
            for your target career.
          </p>

        </header>


        {/* =====================================================
            TARGET CAREER
            ===================================================== */}

        <section className="target-career-card">

          <div className="target-career-left">

            <div className="target-career-icon">
              {career.icon}
            </div>

            <div>

              <span className="section-small-title">
                TARGET CAREER
              </span>

              <h2>
                {selectedCareer}
              </h2>

              <p>
                {career.category} • AI-powered skill comparison
              </p>

            </div>

          </div>


          <div className="career-selector">

            <button
              className="change-career-button"
              onClick={() =>
                setShowCareerList(!showCareerList)
              }
            >
              Change Career ▾
            </button>

            {showCareerList && (
              <div className="career-dropdown">

                {Object.keys(careerData).map(
                  (careerName) => (
                    <button
                      key={careerName}
                      className={
                        selectedCareer === careerName
                          ? "career-option selected"
                          : "career-option"
                      }
                      onClick={() =>
                        handleCareerChange(careerName)
                      }
                    >
                      <span>
                        {careerData[careerName].icon}
                      </span>

                      {careerName}

                      {selectedCareer === careerName && (
                        <b>✓</b>
                      )}
                    </button>
                  )
                )}

              </div>
            )}

          </div>

        </section>


        {/* =====================================================
            SUMMARY CARDS
            ===================================================== */}

        <section className="skill-summary-grid">

          <div className="summary-card">

            <div className="summary-icon blue-icon">
              🎯
            </div>

            <div>
              <span>Skill Match</span>
              <strong>{skillMatch}%</strong>
            </div>

            <div className="summary-small">
              Current Match
            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon purple-icon">
              ⚠
            </div>

            <div>
              <span>Missing Skills</span>
              <strong>{missingSkills.length}</strong>
            </div>

            <div className="summary-small">
              Skills To Learn
            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon cyan-icon">
              🚀
            </div>

            <div>
              <span>Job Readiness</span>
              <strong>{calculatedReadiness}%</strong>
            </div>

            <div className="summary-small">
              Career Ready
            </div>

          </div>

        </section>


        {/* =====================================================
            SKILL COMPARISON
            ===================================================== */}

        <section className="comparison-grid">

          {/* YOUR SKILLS */}

          <div className="comparison-card">

            <div className="comparison-heading">

              <div className="comparison-heading-icon">
                ✓
              </div>

              <div>
                <h2>Your Skills</h2>
                <p>
                  Skills currently available
                </p>
              </div>

            </div>


            <div className="skill-list">

              {studentSkills.map(
                (skill, index) => (
                  <div
                    className="skill-list-item matched-item"
                    key={index}
                  >

                    <span className="skill-check">
                      ✓
                    </span>

                    <span>
                      {skill}
                    </span>

                  </div>
                )
              )}

            </div>

          </div>


          {/* REQUIRED SKILLS */}

          <div className="comparison-card">

            <div className="comparison-heading">

              <div className="comparison-heading-icon required-icon">
                ⚡
              </div>

              <div>
                <h2>
                  Required Skills
                </h2>

                <p>
                  Skills needed for {selectedCareer}
                </p>
              </div>

            </div>


            <div className="skill-list">

              {career.requiredSkills.map(
                (skill, index) => {

                  const isMatched =
                    studentSkills.includes(skill);

                  return (
                    <div
                      className={
                        isMatched
                          ? "skill-list-item matched-item"
                          : "skill-list-item missing-item"
                      }
                      key={index}
                    >

                      <span
                        className={
                          isMatched
                            ? "skill-check"
                            : "skill-warning"
                        }
                      >
                        {isMatched ? "✓" : "!"}
                      </span>

                      <span>
                        {skill}
                      </span>

                      <span
                        className={
                          isMatched
                            ? "skill-status"
                            : "skill-status missing-status"
                        }
                      >
                        {isMatched
                          ? "Matched"
                          : "Learn"}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </section>


        {/* =====================================================
            AI GAP REPORT
            ===================================================== */}

        <section className="gap-report-card">

          <div className="section-heading-row">

            <div className="section-heading-left">

              <div className="section-heading-icon">
                ✦
              </div>

              <div>
                <h2>
                  AI Skill Gap Report
                </h2>

                <p>
                  Priority analysis of the skills you need
                  to improve.
                </p>
              </div>

            </div>

            <span className="ai-analysis-badge">
              AI ANALYSIS
            </span>

          </div>


          <div className="gap-report-list">

            {gapReport.length === 0 ? (

              <div className="no-gap-message">
                🎉 You have all the required skills
                for this career!
              </div>

            ) : (

              gapReport.map(
                (skill, index) => (
                  <div
                    className="gap-report-row"
                    key={index}
                  >

                    <div className="gap-skill-name">
                      <span>
                        {skill.name}
                      </span>
                    </div>

                    <div className="gap-progress-container">

                      <div className="gap-progress-track">

                        <div
                          className={`gap-progress-fill ${skill.priorityClass}`}
                          style={{
                            width: `${skill.progress}%`,
                          }}
                        ></div>

                      </div>

                    </div>

                    <span
                      className={`priority-badge ${skill.priorityClass}`}
                    >
                      {skill.priority}
                    </span>

                  </div>
                )
              )

            )}

          </div>

        </section>


        {/* =====================================================
            LEARNING PLAN
            ===================================================== */}

        <section className="learning-grid">

          {/* WHAT TO LEARN */}

          <div className="learning-card">

            <div className="learning-card-header">

              <div className="learning-icon">
                🚀
              </div>

              <div>
                <h2>
                  What To Learn
                </h2>

                <p>
                  Focus on these skills to close your gap.
                </p>
              </div>

            </div>


            <div className="learning-list">

              {learningSteps.length === 0 ? (

                <div className="no-gap-message">
                  No additional skills required.
                </div>

              ) : (

                learningSteps.map(
                  (skill, index) => (
                    <div
                      className="learning-item"
                      key={index}
                    >

                      <span>
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <div>

                        <strong>
                          {skill}
                        </strong>

                        <small>
                          {getPriority(index)} priority
                        </small>

                      </div>

                    </div>
                  )
                )

              )}

            </div>

          </div>


          {/* NEXT STEPS */}

          <div className="learning-card">

            <div className="learning-card-header">

              <div className="learning-icon roadmap-icon">
                🗺️
              </div>

              <div>
                <h2>
                  Next Steps
                </h2>

                <p>
                  Your recommended career improvement path.
                </p>
              </div>

            </div>


            <div className="next-steps">

              {learningSteps.length === 0 ? (

                <div className="no-gap-message">
                  🎯 You are ready to focus on job preparation.
                </div>

              ) : (

                learningSteps.map(
                  (skill, index) => (
                    <div key={index}>

                      <div
                        className={
                          index === 0
                            ? "next-step active-step"
                            : "next-step"
                        }
                      >

                        <div className="step-number">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div>

                          <strong>
                            Learn {skill}
                          </strong>

                          <small>
                            Improve your {skill} skills.
                          </small>

                        </div>

                      </div>

                      {index <
                        learningSteps.length - 1 && (
                        <div className="step-line"></div>
                      )}

                    </div>
                  )
                )

              )}

            </div>

          </div>

        </section>


        {/* =====================================================
            JOB READINESS
            ===================================================== */}

        <section className="readiness-card">

          <div className="readiness-left">

            <div className="readiness-icon">
              💼
            </div>

            <div>

              <span className="section-small-title">
                JOB READINESS
              </span>

              <h2>
                You are {calculatedReadiness}% career ready
              </h2>

              <p>
                Your readiness is based on your current
                skill match and the requirements of the
                selected career.
              </p>

            </div>

          </div>


          <div className="readiness-score">

            <div className="readiness-circle">

              <strong>
                {calculatedReadiness}%
              </strong>

              <span>
                Ready
              </span>

            </div>

          </div>

        </section>


        {/* =====================================================
            ACTION
            ===================================================== */}

        <div className="skill-gap-action">

          <button
            className="reanalyze-button"
            onClick={() => {
              alert(
                `Skill analysis updated for ${selectedCareer}`
              );
            }}
          >
            🔄 Update My Skills & Re-analyze
          </button>

          <p>
            Change your target career above to generate
            a new skill analysis.
          </p>

        </div>

      </main>

    </div>
  );
}

export default SkillGap;