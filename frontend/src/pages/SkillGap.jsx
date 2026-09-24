import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./SkillGap.css";

const getCareerIcon = (jobTitle) => {
  const title = String(jobTitle).toLowerCase();

  if (
    title.includes("ai") ||
    title.includes("machine")
  ) {
    return "🤖";
  }

  if (title.includes("data")) {
    return "📊";
  }

  if (title.includes("cloud")) {
    return "☁️";
  }

  if (
    title.includes("web") ||
    title.includes("frontend") ||
    title.includes("backend")
  ) {
    return "🌐";
  }

  if (title.includes("security")) {
    return "🛡️";
  }

  if (
    title.includes("mobile") ||
    title.includes("android") ||
    title.includes("ios")
  ) {
    return "📱";
  }

  return "💻";
};

// ============================================================
// NORMALIZE SKILL
// ============================================================

const normalizeSkill = (skill) => {
  let value = String(skill)
    .toLowerCase()
    .trim();

  const replacements = {
    "c plus plus": "c++",
    cpp: "c++",
    "problem-solving": "problem solving",
    "problem solving skills": "problem solving",
    "software design skills": "software design",
    javascript: "javascript",
    js: "javascript",
    reactjs: "react",
    "react.js": "react",
    nodejs: "node.js",
    node: "node.js",
  };

  return replacements[value] || value;
};

// ============================================================
// CHECK WHETHER STUDENT HAS REQUIRED SKILL
// ============================================================

const studentHasSkill = (studentSkills, requiredSkill) => {
  const required = normalizeSkill(requiredSkill);

  if (!required) {
    return false;
  }

  return studentSkills.some((studentSkill) => {
    const student = normalizeSkill(studentSkill);

    if (!student) {
      return false;
    }

    // Exact match
    if (student === required) {
      return true;
    }

    // If student's skills are stored as one long text,
    // check whether the required skill exists in that text.
    const studentText = ` ${student} `;

    const requiredText = ` ${required} `;

    return studentText.includes(requiredText);
  });
};

function SkillGap() {
  // ============================================================
  // DYNAMIC DATA
  // ============================================================

  const [careerData, setCareerData] = useState({});
  const [selectedCareer, setSelectedCareer] = useState("");
  const [studentSkills, setStudentSkills] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [showCareerList, setShowCareerList] = useState(false);

  // ============================================================
  // LOAD CAREERS FROM BACKEND / CSV
  // ============================================================

  useEffect(() => {
    const loadCareers = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/skill-gap-careers"
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          console.error(
            result.message || "Failed to load careers."
          );
          return;
        }

        const data = {};

        result.careers.forEach((item) => {
          data[item.job_title] = {
            icon: getCareerIcon(item.job_title),
            category: item.category,
            requiredSkills: item.required_skills,
          };
        });

        setCareerData(data);

        const careerNames = Object.keys(data);

        // =====================================================
        // LOAD PREVIOUSLY SELECTED CAREER
        // =====================================================

        const savedCareer =
          localStorage.getItem("skillGapCareer");

        if (
          savedCareer &&
          data[savedCareer]
        ) {
          setSelectedCareer(savedCareer);
        } else if (careerNames.length > 0) {
          setSelectedCareer(careerNames[0]);
        }

      } catch (error) {
        console.error(
          "Failed to load skill gap careers:",
          error
        );
      }
    };

    loadCareers();
  }, []);

  // ============================================================
  // LOAD STUDENT SKILLS FROM CAREER RECOMMENDATION
  // ============================================================

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(
          "careerRecommendationData"
        ) || "{}"
      );

      const rawSkills = stored.skills || "";

      let skills = [];

      if (Array.isArray(rawSkills)) {
        skills = rawSkills;
      } else {
        skills = String(rawSkills)
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }

      // =====================================================
      // REMOVE DUPLICATE SKILLS
      // =====================================================

      const uniqueSkills = [];

      skills.forEach((skill) => {
        const cleanSkill = String(skill).trim();

        if (
          cleanSkill &&
          !uniqueSkills.some(
            (item) =>
              item.toLowerCase() ===
              cleanSkill.toLowerCase()
          )
        ) {
          uniqueSkills.push(cleanSkill);
        }
      });

      setStudentSkills(uniqueSkills);

    } catch (error) {
      console.error(
        "Failed to load student skills:",
        error
      );

      setStudentSkills([]);
    }
  }, []);

  // ============================================================
  // ANALYZE SELECTED CAREER
  // ============================================================

  useEffect(() => {
    if (!selectedCareer) {
      return;
    }

    const analyzeSkillGap = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/skill-gap-analysis",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              career: selectedCareer,
              student_skills: studentSkills,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          console.error(
            result.message ||
              "Skill gap analysis failed."
          );
          return;
        }

        // =====================================================
        // GET REQUIRED SKILLS FOR SELECTED ROLE
        // =====================================================

        const requiredSkills =
          result.required_skills ||
          careerData[selectedCareer]?.requiredSkills ||
          [];

        // =====================================================
        // DYNAMIC MATCHED / MISSING SKILLS
        // =====================================================

        const matchedSkills = requiredSkills.filter(
          (skill) =>
            studentHasSkill(
              studentSkills,
              skill
            )
        );

        const missingSkills = requiredSkills.filter(
          (skill) =>
            !studentHasSkill(
              studentSkills,
              skill
            )
        );

        // =====================================================
        // DYNAMIC SKILL MATCH
        // =====================================================

        const skillMatch =
          requiredSkills.length > 0
            ? Math.round(
                (matchedSkills.length /
                  requiredSkills.length) *
                  100
              )
            : 0;

        // =====================================================
        // JOB READINESS
        // Based on role-specific required skills
        // =====================================================

        const jobReadiness = skillMatch;

        // =====================================================
        // LEARNING PRIORITY
        // =====================================================

        const priority = {
          python: 10,
          java: 10,
          javascript: 10,
          html: 10,
          css: 20,
          sql: 20,
          linux: 20,
          networking: 20,
          git: 20,
          oop: 30,
          "data structures": 30,
          algorithms: 40,
          statistics: 30,
          pandas: 40,
          numpy: 40,
          "data analysis": 50,
          "data visualization": 50,
          "machine learning": 60,
          react: 60,
          "node.js": 60,
          docker: 70,
          aws: 70,
          azure: 70,
          gcp: 70,
          "deep learning": 80,
          tensorflow: 90,
          pytorch: 90,
          kubernetes: 100,
        };

        const learningOrder = [
          ...missingSkills,
        ].sort(
          (a, b) =>
            (priority[normalizeSkill(a)] || 55) -
            (priority[normalizeSkill(b)] || 55)
        );

        // =====================================================
        // DYNAMIC GAP REPORT
        // =====================================================

        const gapReportText =
          missingSkills.length === 0
            ? `You already have all required skills for ${selectedCareer}.`
            : `You currently match ${skillMatch}% of the required skills for ${selectedCareer}. You have ${matchedSkills.length} matched skills and ${missingSkills.length} skills to develop.`;

        // =====================================================
        // FINAL ANALYSIS OBJECT
        // =====================================================

        const finalAnalysis = {
          ...result,

          career: selectedCareer,

          required_skills: requiredSkills,

          matched_skills: matchedSkills,

          missing_skills: missingSkills,

          skill_match: skillMatch,

          job_readiness: jobReadiness,

          learning_order: learningOrder,

          gap_report: gapReportText,

          your_skills: studentSkills,
        };

        setAnalysis(finalAnalysis);

        // =====================================================
        // SAVE FOR PROFILE PAGE
        // =====================================================

        localStorage.setItem(
          "skillGapAnalysisData",
          JSON.stringify(finalAnalysis)
        );

        localStorage.setItem(
          "skillGapCareer",
          selectedCareer
        );

      } catch (error) {
        console.error(
          "Skill gap analysis error:",
          error
        );
      }
    };

    analyzeSkillGap();
  }, [
    selectedCareer,
    studentSkills,
    careerData,
  ]);

  // ============================================================
  // CURRENT CAREER
  // ============================================================

  const career =
    careerData[selectedCareer] || {
      icon: "💻",
      category:
        analysis?.category || "",
      requiredSkills:
        analysis?.required_skills || [],
    };

  // ============================================================
  // CHANGE CAREER
  // ============================================================

  const handleCareerChange = (careerName) => {
    setSelectedCareer(careerName);
    setAnalysis(null);
    setShowCareerList(false);

    localStorage.setItem(
      "skillGapCareer",
      careerName
    );
  };

  // ============================================================
  // DYNAMIC MATCHED / MISSING SKILLS
  // ============================================================

  const matchedSkills =
    analysis?.matched_skills || [];

  const missingSkills =
    analysis?.missing_skills || [];

  const skillMatch =
    analysis?.skill_match ?? 0;

  // ============================================================
  // PRIORITY
  // ============================================================

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

  // ============================================================
  // DYNAMIC AI GAP REPORT
  // ============================================================

  const gapReport = useMemo(() => {
    const learningOrder =
      analysis?.learning_order ||
      missingSkills;

    return learningOrder.map(
      (skill, index) => ({
        name: skill,
        priority: getPriority(index),
        priorityClass:
          getPriorityClass(index),
        progress:
          getPriority(index) === "HIGH"
            ? 82
            : getPriority(index) === "MEDIUM"
            ? 62
            : 40,
      })
    );
  }, [analysis, missingSkills]);

  // ============================================================
  // DYNAMIC LEARNING ORDER
  // ============================================================

  const learningSteps =
    analysis?.learning_order ||
    missingSkills;

  // ============================================================
  // DYNAMIC JOB READINESS
  // ============================================================

  const calculatedReadiness =
    analysis?.job_readiness ?? 0;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="skill-gap-page">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="skill-gap-sidebar">

        <Link
          to="/dashboard"
          className="skill-gap-brand"
        >
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
                {selectedCareer || "Loading..."}
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
              <strong>
                {calculatedReadiness}%
              </strong>
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

              {studentSkills.length === 0 ? (

                <div className="no-gap-message">
                  No student skills found. Please enter
                  skills in Career Recommendation.
                </div>

              ) : (

                studentSkills.map(
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

              {(
                analysis?.required_skills ||
                career.requiredSkills ||
                []
              ).map(
                (skill, index) => {

                  const isMatched =
                    matchedSkills.some(
                      (matched) =>
                        normalizeSkill(
                          matched
                        ) ===
                        normalizeSkill(
                          skill
                        )
                    );

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
                        {isMatched
                          ? "✓"
                          : "!"}
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
            onClick={async () => {

              if (!selectedCareer) {
                alert(
                  "Please select a target career."
                );
                return;
              }

              try {

                setAnalysis(null);

                const response = await fetch(
                  "http://127.0.0.1:5000/api/skill-gap-analysis",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify({
                      career: selectedCareer,
                      student_skills:
                        studentSkills,
                    }),
                  }
                );

                const result =
                  await response.json();

                if (
                  !response.ok ||
                  !result.success
                ) {
                  alert(
                    result.message ||
                      "Skill analysis failed."
                  );
                  return;
                }

                // =================================================
                // DYNAMIC REQUIRED SKILLS
                // =================================================

                const requiredSkills =
                  result.required_skills ||
                  careerData[
                    selectedCareer
                  ]?.requiredSkills ||
                  [];

                // =================================================
                // DYNAMIC MATCHING
                // =================================================

                const matchedSkills =
                  requiredSkills.filter(
                    (skill) =>
                      studentHasSkill(
                        studentSkills,
                        skill
                      )
                  );

                const missingSkills =
                  requiredSkills.filter(
                    (skill) =>
                      !studentHasSkill(
                        studentSkills,
                        skill
                      )
                  );

                // =================================================
                // DYNAMIC MATCH %
                // =================================================

                const skillMatch =
                  requiredSkills.length > 0
                    ? Math.round(
                        (matchedSkills.length /
                          requiredSkills.length) *
                          100
                      )
                    : 0;

                // =================================================
                // DYNAMIC JOB READINESS
                // =================================================

                const jobReadiness =
                  skillMatch;

                // =================================================
                // LEARNING PRIORITY
                // =================================================

                const priority = {
                  python: 10,
                  java: 10,
                  javascript: 10,
                  html: 10,
                  css: 20,
                  sql: 20,
                  linux: 20,
                  networking: 20,
                  git: 20,
                  oop: 30,
                  "data structures": 30,
                  algorithms: 40,
                  statistics: 30,
                  pandas: 40,
                  numpy: 40,
                  "data analysis": 50,
                  "data visualization": 50,
                  "machine learning": 60,
                  react: 60,
                  "node.js": 60,
                  docker: 70,
                  aws: 70,
                  azure: 70,
                  gcp: 70,
                  "deep learning": 80,
                  tensorflow: 90,
                  pytorch: 90,
                  kubernetes: 100,
                };

                const learningOrder =
                  [...missingSkills].sort(
                    (a, b) =>
                      (priority[
                        normalizeSkill(a)
                      ] || 55) -
                      (priority[
                        normalizeSkill(b)
                      ] || 55)
                  );

                const finalAnalysis = {
                  ...result,

                  career: selectedCareer,

                  required_skills:
                    requiredSkills,

                  matched_skills:
                    matchedSkills,

                  missing_skills:
                    missingSkills,

                  skill_match:
                    skillMatch,

                  job_readiness:
                    jobReadiness,

                  learning_order:
                    learningOrder,

                  your_skills:
                    studentSkills,
                };

                setAnalysis(
                  finalAnalysis
                );

                // =================================================
                // SAVE RESULT FOR PROFILE
                // =================================================

                localStorage.setItem(
                  "skillGapAnalysisData",
                  JSON.stringify(
                    finalAnalysis
                  )
                );

                localStorage.setItem(
                  "skillGapCareer",
                  selectedCareer
                );

              } catch (error) {

                console.error(
                  "Skill analysis error:",
                  error
                );

                alert(
                  "Unable to connect to the backend."
                );

              }

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