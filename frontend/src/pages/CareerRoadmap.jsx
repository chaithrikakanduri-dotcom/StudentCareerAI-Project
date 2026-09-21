import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./CareerRoadmap.css";

function CareerRoadmap() {
  const location = useLocation();
  const navigate = useNavigate();

  const [roadmapData, setRoadmapData] = useState({
    targetCareer: "Your Target Career",
    currentSkills: [],
    matchedSkills: [],
    missingSkills: [],
    skillMatchPercentage: 0,
    studentName: "Student",
  });

  // Load saved student and skill-gap data
  useEffect(() => {
    const savedSkillGap = localStorage.getItem("skillGapAnalysis");
    const savedCareer = localStorage.getItem("selectedCareer");
    const savedProfile = localStorage.getItem("studentProfile");

    let skillGap = {};
    let profile = {};

    if (savedSkillGap) {
      try {
        skillGap = JSON.parse(savedSkillGap);
      } catch (error) {
        console.error("Unable to read skill gap data:", error);
      }
    }

    if (savedProfile) {
      try {
        profile = JSON.parse(savedProfile);
      } catch (error) {
        console.error("Unable to read profile:", error);
      }
    }

    const routeData = location.state || {};

    const targetCareer =
      skillGap.targetCareer ||
      savedCareer ||
      routeData.targetCareer ||
      "Your Target Career";

    const currentSkills =
      skillGap.studentSkills ||
      routeData.currentSkills ||
      routeData.skills ||
      [];

    const matchedSkills = skillGap.matchedSkills || [];

    const missingSkills = skillGap.missingSkills || [];

    const skillMatchPercentage =
      skillGap.skillMatchPercentage ??
      skillGap.skill_match_percentage ??
      0;

    const studentName =
      profile.name ||
      profile.fullName ||
      "Student";

    setRoadmapData({
      targetCareer,
      currentSkills,
      matchedSkills,
      missingSkills,
      skillMatchPercentage,
      studentName,
    });
  }, [location.state]);

  const {
    targetCareer,
    currentSkills,
    matchedSkills,
    missingSkills,
    skillMatchPercentage,
    studentName,
  } = roadmapData;

  // Career-specific roadmap data
  const careerRoadmaps = {
    "AI/ML Engineer": {
      foundation: [
        "Python Programming",
        "Mathematics",
        "Statistics",
      ],
      technical: [
        "Machine Learning",
        "TensorFlow",
        "SQL",
      ],
      projects: [
        "Machine Learning Project",
        "Deep Learning Project",
        "GitHub Portfolio",
      ],
      placement: [
        "DSA",
        "ML Interview Questions",
        "Communication",
      ],
    },

    "Data Scientist": {
      foundation: [
        "Python Programming",
        "Statistics",
        "Mathematics",
      ],
      technical: [
        "Data Analysis",
        "Machine Learning",
        "SQL",
      ],
      projects: [
        "Data Science Project",
        "Predictive Analytics Project",
        "GitHub Portfolio",
      ],
      placement: [
        "Statistics Questions",
        "SQL Practice",
        "Communication",
      ],
    },

    "Data Analyst": {
      foundation: [
        "Statistics",
        "Excel",
        "Data Fundamentals",
      ],
      technical: [
        "SQL",
        "Power BI",
        "Data Analysis",
      ],
      projects: [
        "Dashboard Project",
        "Data Analysis Project",
        "Portfolio",
      ],
      placement: [
        "SQL Practice",
        "Aptitude",
        "Communication",
      ],
    },

    "Software Developer": {
      foundation: [
        "Programming",
        "Data Structures",
        "Algorithms",
      ],
      technical: [
        "Java / Python",
        "Object-Oriented Programming",
        "SQL",
      ],
      projects: [
        "Software Project",
        "Web Application",
        "GitHub Portfolio",
      ],
      placement: [
        "DSA",
        "Coding Practice",
        "Technical Interviews",
      ],
    },

    "Backend Developer": {
      foundation: [
        "Programming",
        "Data Structures",
        "Database Fundamentals",
      ],
      technical: [
        "Python / Java",
        "REST APIs",
        "SQL",
      ],
      projects: [
        "Backend API",
        "Database Project",
        "Full Backend Application",
      ],
      placement: [
        "DSA",
        "API Concepts",
        "Technical Interviews",
      ],
    },

    "Frontend Developer": {
      foundation: [
        "HTML",
        "CSS",
        "JavaScript",
      ],
      technical: [
        "React",
        "Responsive Design",
        "Web Development",
      ],
      projects: [
        "Portfolio Website",
        "React Application",
        "UI Project",
      ],
      placement: [
        "JavaScript Practice",
        "Frontend Questions",
        "Communication",
      ],
    },

    "Full Stack Developer": {
      foundation: [
        "HTML",
        "CSS",
        "JavaScript",
      ],
      technical: [
        "React",
        "Node.js",
        "SQL / MongoDB",
      ],
      projects: [
        "Full Stack Application",
        "Database Project",
        "GitHub Portfolio",
      ],
      placement: [
        "DSA",
        "Web Development Questions",
        "Technical Interviews",
      ],
    },

    "Mobile App Developer": {
      foundation: [
        "Programming",
        "Mobile Fundamentals",
        "UI Design",
      ],
      technical: [
        "Flutter / React Native",
        "Android / iOS",
        "APIs",
      ],
      projects: [
        "Mobile Application",
        "API Integration Project",
        "App Portfolio",
      ],
      placement: [
        "Programming Practice",
        "Mobile Development Questions",
        "Communication",
      ],
    },

    "Cybersecurity Analyst": {
      foundation: [
        "Computer Networks",
        "Operating Systems",
        "Security Fundamentals",
      ],
      technical: [
        "Network Security",
        "Ethical Hacking",
        "Cybersecurity Tools",
      ],
      projects: [
        "Security Analysis Project",
        "Network Security Project",
        "Security Portfolio",
      ],
      placement: [
        "Security Concepts",
        "Networking Questions",
        "Technical Interviews",
      ],
    },

    "Cloud Engineer": {
      foundation: [
        "Linux",
        "Networking",
        "Cloud Fundamentals",
      ],
      technical: [
        "AWS / Azure",
        "Docker",
        "Kubernetes",
      ],
      projects: [
        "Cloud Deployment",
        "Docker Project",
        "Cloud Portfolio",
      ],
      placement: [
        "Cloud Questions",
        "Linux Practice",
        "Technical Interviews",
      ],
    },

    "DevOps Engineer": {
      foundation: [
        "Linux",
        "Networking",
        "Programming",
      ],
      technical: [
        "Docker",
        "Kubernetes",
        "Jenkins",
      ],
      projects: [
        "CI/CD Pipeline",
        "Cloud Deployment",
        "DevOps Project",
      ],
      placement: [
        "Linux Questions",
        "DevOps Concepts",
        "Technical Interviews",
      ],
    },

    "UI/UX Designer": {
      foundation: [
        "Design Fundamentals",
        "User Experience",
        "Visual Design",
      ],
      technical: [
        "Figma",
        "UI Design",
        "Prototyping",
      ],
      projects: [
        "Mobile UI Design",
        "Website Design",
        "Design Portfolio",
      ],
      placement: [
        "Design Portfolio",
        "Design Questions",
        "Communication",
      ],
    },

    "Database Developer": {
      foundation: [
        "Database Fundamentals",
        "SQL",
        "Data Modeling",
      ],
      technical: [
        "MySQL",
        "PostgreSQL",
        "MongoDB",
      ],
      projects: [
        "Database Application",
        "SQL Project",
        "Database Portfolio",
      ],
      placement: [
        "SQL Practice",
        "Database Questions",
        "Technical Interviews",
      ],
    },

    "Business Analyst": {
      foundation: [
        "Business Fundamentals",
        "Communication",
        "Statistics",
      ],
      technical: [
        "Excel",
        "Data Analysis",
        "Requirements Analysis",
      ],
      projects: [
        "Business Case Study",
        "Analytics Dashboard",
        "Business Analysis Portfolio",
      ],
      placement: [
        "Aptitude",
        "Case Studies",
        "Communication",
      ],
    },

    "QA / Automation Tester": {
      foundation: [
        "Programming",
        "Software Testing",
        "Testing Fundamentals",
      ],
      technical: [
        "Selenium",
        "Automation Testing",
        "Test Cases",
      ],
      projects: [
        "Automation Testing Project",
        "Test Automation Suite",
        "Testing Portfolio",
      ],
      placement: [
        "Testing Questions",
        "Automation Practice",
        "Communication",
      ],
    },

    "Network Engineer": {
      foundation: [
        "Computer Networks",
        "Networking Fundamentals",
        "Operating Systems",
      ],
      technical: [
        "CCNA",
        "Routing",
        "Switching",
      ],
      projects: [
        "Network Configuration",
        "Network Security Project",
        "Networking Portfolio",
      ],
      placement: [
        "Networking Questions",
        "CCNA Practice",
        "Technical Interviews",
      ],
    },

    "IoT Developer": {
      foundation: [
        "Programming",
        "Electronics",
        "Embedded Systems",
      ],
      technical: [
        "Arduino",
        "Raspberry Pi",
        "Sensors",
      ],
      projects: [
        "IoT Application",
        "Smart Device Project",
        "IoT Portfolio",
      ],
      placement: [
        "Embedded Questions",
        "Programming Practice",
        "Communication",
      ],
    },
  };

  // Default roadmap for an unknown career
  const selectedRoadmap =
    careerRoadmaps[targetCareer] || {
      foundation: [
        "Programming Basics",
        "Problem Solving",
        "Computer Fundamentals",
      ],
      technical: [
        "Core Technologies",
        "Projects",
        "Tools and Frameworks",
      ],
      projects: [
        "Mini Projects",
        "Major Project",
        "GitHub Portfolio",
      ],
      placement: [
        "DSA",
        "Aptitude",
        "Communication",
      ],
    };

  // Four roadmap steps
  const roadmap = [
    {
      number: "01",
      title: "Build Your Foundation",
      icon: "📚",
      duration: "1-2 Months",
      description:
        "Strengthen the fundamental concepts required for your selected career.",
      skills: selectedRoadmap.foundation,
    },

    {
      number: "02",
      title: "Develop Technical Skills",
      icon: "💻",
      duration: "2-4 Months",
      description:
        "Learn the important technical skills used in your target career.",
      skills: selectedRoadmap.technical,
    },

    {
      number: "03",
      title: "Build Real Projects",
      icon: "🚀",
      duration: "2-3 Months",
      description:
        "Apply your knowledge by creating practical projects for your portfolio.",
      skills: selectedRoadmap.projects,
    },

    {
      number: "04",
      title: "Prepare For Placement",
      icon: "🎯",
      duration: "1-2 Months",
      description:
        "Prepare for interviews, coding rounds and communication-based assessments.",
      skills: selectedRoadmap.placement,
    },
  ];

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("studentProfile");
    localStorage.removeItem("placementPredictionResult");
    localStorage.removeItem("placementPredictionInput");
    localStorage.removeItem("careerRecommendationData");
    localStorage.removeItem("selectedCareer");
    localStorage.removeItem("skillGapAnalysis");
    localStorage.removeItem("careerRoadmapData");

    navigate("/login");
  };

  return (
    <div className="career-roadmap-page">

      {/* SIDEBAR */}
      <aside className="career-roadmap-sidebar">

        <Link
          to="/dashboard"
          className="career-roadmap-logo"
        >
          <span>✦</span>

          <div>
            <strong>Student Career</strong>
            <b>AI</b>
          </div>
        </Link>

        <nav className="career-roadmap-nav">

          <Link to="/dashboard">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/placement">
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

        {/* SUPPORT CARD */}
        <div className="career-roadmap-support">

          <div className="roadmap-support-icon">
            🚀
          </div>

          <strong>Career Growth</strong>

          <p>
            Follow your personalized roadmap
            and keep improving your skills.
          </p>

        </div>

        {/* LOGOUT */}
        <button
          className="career-roadmap-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </aside>


      {/* MAIN CONTENT */}
      <main className="career-roadmap-main">

        {/* TOP BAR */}
        <header className="career-roadmap-topbar">

          <div className="career-roadmap-breadcrumb">
            ← Skill Gap Analysis / Career Roadmap
          </div>

          <Link
            to="/profile"
            className="career-roadmap-user"
          >
            <span>👤</span>

            <div>
              <strong>{studentName}</strong>
              <small>Profile</small>
            </div>

            <b>⌄</b>
          </Link>

        </header>


        {/* HERO */}
        <section className="career-roadmap-hero">

          <div className="career-roadmap-hero-content">

            <div className="career-roadmap-label">
              ✦ PERSONALIZED CAREER ROADMAP
            </div>

            <h1>
              Your Path To
              <span>Career Success</span>
            </h1>

            <p>
              Follow a structured learning journey designed
              to help you build the skills and experience
              required for your target career.
            </p>

          </div>


          {/* AI VISUAL */}
          <div className="career-roadmap-visual">

            <div className="roadmap-orbit roadmap-orbit-one"></div>

            <div className="roadmap-orbit roadmap-orbit-two"></div>

            <div className="roadmap-glow"></div>

            <div className="roadmap-ai-circle">

              <span>✦</span>

              <strong>AI</strong>

              <small>
                CAREER
                <br />
                ROADMAP
              </small>

            </div>


            <div className="roadmap-floating roadmap-floating-one">
              📚
              <strong>Learn</strong>
            </div>

            <div className="roadmap-floating roadmap-floating-two">
              💻
              <strong>Build</strong>
            </div>

            <div className="roadmap-floating roadmap-floating-three">
              🎯
              <strong>Achieve</strong>
            </div>

          </div>

        </section>


        {/* TARGET CAREER SUMMARY */}
        <section className="career-roadmap-summary">

          <div className="roadmap-summary-icon">
            🎯
          </div>

          <div className="roadmap-summary-content">

            <span>YOUR TARGET CAREER</span>

            <h2>{targetCareer}</h2>

            <p>
              Current skills:{" "}
              <strong>
                {currentSkills.length > 0
                  ? currentSkills.join(", ")
                  : "Not provided"}
              </strong>
            </p>

          </div>


          <div className="roadmap-match">

            <span>SKILL MATCH</span>

            <strong>
              {skillMatchPercentage}%
            </strong>

          </div>

        </section>


        {/* SKILL SUMMARY */}
        <section className="roadmap-skill-summary">

          <div className="roadmap-skill-summary-card">

            <span>✓</span>

            <div>
              <small>SKILLS YOU HAVE</small>
              <strong>{matchedSkills.length}</strong>
            </div>

          </div>


          <div className="roadmap-skill-summary-card">

            <span>📚</span>

            <div>
              <small>SKILLS TO LEARN</small>
              <strong>{missingSkills.length}</strong>
            </div>

          </div>

        </section>


        {/* ROADMAP */}
        <section className="roadmap-section">

          <div className="roadmap-section-heading">

            <div>

              <span>
                YOUR LEARNING JOURNEY
              </span>

              <h2>
                Step-by-Step Career Roadmap
              </h2>

            </div>

            <div className="roadmap-step-count">
              4 Steps
            </div>

          </div>


          <div className="roadmap-list">

            {roadmap.map((step) => (

              <article
                className="roadmap-step"
                key={step.number}
              >

                <div className="roadmap-step-number">
                  {step.number}
                </div>


                <div className="roadmap-step-icon">
                  {step.icon}
                </div>


                <div className="roadmap-step-content">

                  <div className="roadmap-step-top">

                    <div>

                      <span className="roadmap-duration">
                        {step.duration}
                      </span>

                      <h3>
                        {step.title}
                      </h3>

                    </div>

                  </div>


                  <p>
                    {step.description}
                  </p>


                  <div className="roadmap-skill-list">

                    {step.skills.map((skill) => (

                      <span key={skill}>
                        ✓ {skill}
                      </span>

                    ))}

                  </div>

                </div>

              </article>

            ))}

          </div>

        </section>


        {/* SKILL GAP SECTION */}
        {missingSkills.length > 0 && (

          <section className="roadmap-final">

            <div className="roadmap-final-icon">
              📚
            </div>

            <div>

              <span>
                FOCUS ON YOUR SKILL GAP
              </span>

              <h2>
                Skills you should learn next
              </h2>

              <p>
                Based on your Skill Gap Analysis,
                focus on:{" "}
                <strong>
                  {missingSkills.join(", ")}
                </strong>
              </p>

            </div>

          </section>

        )}


        {/* FINAL MESSAGE */}
        <section className="roadmap-final">

          <div className="roadmap-final-icon">
            ✦
          </div>

          <div>

            <span>
              KEEP MOVING FORWARD
            </span>

            <h2>
              Your career journey starts with one step.
            </h2>

            <p>
              Keep learning, build projects, improve your
              skills and prepare consistently for your goal.
            </p>

          </div>

        </section>


        {/* ACTION BUTTONS */}
        <div className="career-roadmap-actions">

          <button
            onClick={() => navigate("/skill-gap")}
            className="roadmap-back-button"
          >
            ← Back to Skill Gap
          </button>


          <button
            onClick={() => navigate("/dashboard")}
            className="roadmap-dashboard-button"
          >
            Go to Dashboard
            <span>→</span>
          </button>

        </div>

      </main>

    </div>
  );
}

export default CareerRoadmap;