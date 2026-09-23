import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const savedStudent = sessionStorage.getItem("student");
  let loggedStudent = null;

  try {
    loggedStudent = savedStudent ? JSON.parse(savedStudent) : null;
  } catch (error) {
    console.error("Invalid student session:", error);
  }

  const [isEditing, setIsEditing] = useState(false);
  const [showSkills, setShowSkills] = useState(false);

  const [profile, setProfile] = useState({
    name: loggedStudent?.name || "",
    email: loggedStudent?.email || "",
    degree: loggedStudent?.education || "B.Tech",
    branch: "CSE - AIML",
    year: "3rd Year",
    cgpa: "8.5",
    careerGoal: "AI/ML Engineer",
  });

  const [skills, setSkills] = useState([
    "Python",
    "SQL",
    "Machine Learning",
    "Flask",
    "React",
    "Java",
  ]);

  const [newSkill, setNewSkill] = useState("");

  // ============================================================
  // LOAD PROFILE FROM BACKEND
  // ============================================================

  useEffect(() => {
    const loadProfile = async () => {
      const studentData = sessionStorage.getItem("student");

      if (!studentData) {
        navigate("/login");
        return;
      }

      let student;

      try {
        student = JSON.parse(studentData);
      } catch (error) {
        console.error("Session data error:", error);
        sessionStorage.removeItem("student");
        navigate("/login");
        return;
      }

      // Show session data immediately
      setProfile((prev) => ({
        ...prev,
        name: student.name || prev.name,
        email: student.email || prev.email,
        degree: student.education || prev.degree,
      }));

      // Refresh data from MySQL
      if (!student.email) {
        return;
      }

      try {
        const response = await fetch(
          `https://studentcareerai-project-production.up.railway.app/api/student-profile?email=${encodeURIComponent(
            student.email
          )}`
        );

        if (!response.ok) {
          throw new Error("Profile request failed.");
        }

        const data = await response.json();

        console.log("Profile API response:", data);

        if (data.success && data.student) {
          const latestStudent = data.student;

          setProfile((prev) => ({
            ...prev,
            name: latestStudent.name || prev.name,
            email: latestStudent.email || prev.email,
            degree: latestStudent.education || prev.degree,
          }));

          sessionStorage.setItem(
            "student",
            JSON.stringify(latestStudent)
          );
        }
      } catch (error) {
        console.error("Profile API error:", error);
        // Session data is already displayed, so don't block the page.
      }
    };

    loadProfile();
  }, [navigate]);

  // ============================================================
  // PROFILE INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================================
  // SAVE PROFILE
  // ============================================================

  const handleSaveProfile = () => {
    const studentData = sessionStorage.getItem("student");

    if (studentData) {
      try {
        const student = JSON.parse(studentData);

        const updatedStudent = {
          ...student,
          name: profile.name,
          email: profile.email,
          education: profile.degree,
        };

        sessionStorage.setItem(
          "student",
          JSON.stringify(updatedStudent)
        );
      } catch (error) {
        console.error("Session update error:", error);
      }
    }

    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  // ============================================================
  // ADD SKILL
  // ============================================================

  const handleAddSkill = () => {
    const skill = newSkill.trim();

    if (skill !== "" && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill("");
    }
  };

  // ============================================================
  // REMOVE SKILL
  // ============================================================

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(
      skills.filter((skill) => skill !== skillToRemove)
    );
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    sessionStorage.removeItem("student");
    navigate("/");
  };

  return (
    <div className="profile-page">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="profile-sidebar">

        <Link
          to="/dashboard"
          className="profile-brand"
        >
          <div className="profile-brand-icon">
            ✦
          </div>

          <div className="profile-brand-text">
            <strong>Student Career</strong>
            <b>AI</b>
          </div>
        </Link>

        <nav className="profile-menu">

          <Link
            to="/dashboard"
            className="profile-menu-item"
          >
            <span>🏠</span>
            Dashboard
          </Link>

          <Link
            to="/placement-prediction"
            className="profile-menu-item"
          >
            <span>📊</span>
            Placement Prediction
          </Link>

          <Link
            to="/career-recommendation"
            className="profile-menu-item"
          >
            <span>🎯</span>
            Career Recommendation
          </Link>

          <Link
            to="/skill-gap"
            className="profile-menu-item"
          >
            <span>🧩</span>
            Skill Gap Analysis
          </Link>

          <Link
            to="/profile"
            className="profile-menu-item active"
          >
            <span>👤</span>
            Profile
          </Link>

        </nav>

        <div className="profile-sidebar-bottom">

          <div className="profile-goal-title">
            Your Goals
          </div>

          <div className="profile-support">
            ✦ Our AI Support
          </div>

          <p>
            Smart guidance for a better future.
          </p>

          <button
            type="button"
            className="profile-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="profile-main">

        <header className="profile-header">

          <div className="profile-label">
            ✦ STUDENT CAREER AI
          </div>

          <h1>
            Profile
          </h1>

          <p>
            Manage your personal, academic and career
            information.
          </p>

        </header>

        {/* =====================================================
            PROFILE CARD
            ===================================================== */}

        <section className="profile-card">

          <div className="profile-card-left">

            <div className="profile-avatar">
              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "S"}
            </div>

            <div className="profile-user-info">

              <span className="profile-small-label">
                STUDENT PROFILE
              </span>

              <h2>
                {profile.name || "Student"}
              </h2>

              <p>
                {profile.branch} • {profile.year}
              </p>

              <p className="profile-email">
                📧 {profile.email || "No email available"}
              </p>

            </div>

          </div>

          <button
            className="edit-profile-button"
            onClick={() =>
              setIsEditing(!isEditing)
            }
          >
            ✏ {isEditing ? "Close" : "Edit Profile"}
          </button>

        </section>

        {/* =====================================================
            EDIT PROFILE
            ===================================================== */}

        {isEditing && (

          <section className="edit-profile-card">

            <div className="profile-section-title">

              <div className="profile-section-icon">
                ✏
              </div>

              <div>
                <h2>
                  Edit Your Profile
                </h2>

                <p>
                  Update your personal and academic details.
                </p>
              </div>

            </div>

            <div className="profile-form-grid">

              <div className="profile-input-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="profile-input-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="profile-input-group">
                <label>Degree</label>

                <input
                  type="text"
                  name="degree"
                  value={profile.degree}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-input-group">
                <label>Branch</label>

                <input
                  type="text"
                  name="branch"
                  value={profile.branch}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-input-group">
                <label>Year</label>

                <select
                  name="year"
                  value={profile.year}
                  onChange={handleChange}
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>

              <div className="profile-input-group">
                <label>CGPA</label>

                <input
                  type="text"
                  name="cgpa"
                  value={profile.cgpa}
                  onChange={handleChange}
                  placeholder="Enter CGPA"
                />
              </div>

            </div>

            <button
              className="save-profile-button"
              onClick={handleSaveProfile}
            >
              ✓ Save Changes
            </button>

          </section>

        )}

        {/* =====================================================
            ACADEMIC + CAREER
            ===================================================== */}

        <section className="profile-two-column">

          <div className="profile-info-card">

            <div className="profile-info-header">

              <div className="info-icon">
                🎓
              </div>

              <div>
                <h2>
                  Academic Details
                </h2>

                <p>
                  Your educational information
                </p>
              </div>

            </div>

            <div className="profile-details">

              <div className="profile-detail-row">
                <span>Degree</span>
                <strong>{profile.degree}</strong>
              </div>

              <div className="profile-detail-row">
                <span>Branch</span>
                <strong>{profile.branch}</strong>
              </div>

              <div className="profile-detail-row">
                <span>Year</span>
                <strong>{profile.year}</strong>
              </div>

              <div className="profile-detail-row">
                <span>CGPA</span>
                <strong>{profile.cgpa}</strong>
              </div>

            </div>

          </div>

          <div className="profile-info-card">

            <div className="profile-info-header">

              <div className="info-icon career-info-icon">
                🎯
              </div>

              <div>
                <h2>
                  Career Goal
                </h2>

                <p>
                  Your current career direction
                </p>
              </div>

            </div>

            <div className="career-goal-content">

              <span>
                TARGET CAREER
              </span>

              <h3>
                {profile.careerGoal}
              </h3>

              <div className="career-progress">

                <div>
                  <span>
                    Career Match
                  </span>

                  <strong>
                    92%
                  </strong>
                </div>

                <div className="career-progress-track">

                  <div
                    className="career-progress-fill"
                    style={{ width: "92%" }}
                  ></div>

                </div>

              </div>

              <div className="career-ready">
                🚀 Job Readiness
                <strong>
                  72%
                </strong>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            TECHNICAL SKILLS
            ===================================================== */}

        <section className="profile-skills-card">

          <div className="profile-info-header">

            <div className="info-icon">
              💻
            </div>

            <div>
              <h2>
                Technical Skills
              </h2>

              <p>
                Skills currently available in your profile.
              </p>
            </div>

            <button
              className="update-skills-button"
              onClick={() =>
                setShowSkills(!showSkills)
              }
            >
              🔄 {showSkills ? "Close" : "Update Skills"}
            </button>

          </div>

          <div className="profile-skills-list">

            {skills.map((skill, index) => (

              <div
                className="profile-skill-tag"
                key={index}
              >

                <span>
                  ✓
                </span>

                {skill}

                {showSkills && (
                  <button
                    className="remove-skill"
                    onClick={() =>
                      handleRemoveSkill(skill)
                    }
                  >
                    ×
                  </button>
                )}

              </div>

            ))}

          </div>

          {showSkills && (

            <div className="add-skill-area">

              <input
                type="text"
                value={newSkill}
                onChange={(e) =>
                  setNewSkill(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddSkill();
                  }
                }}
                placeholder="Enter a new skill"
              />

              <button onClick={handleAddSkill}>
                + Add Skill
              </button>

            </div>

          )}

        </section>

        {/* =====================================================
            STATISTICS
            ===================================================== */}

        <section className="profile-stats-grid">

          <div className="profile-stat-card">

            <div className="profile-stat-icon">
              📊
            </div>

            <div>
              <span>
                Placement Chance
              </span>

              <strong>
                85%
              </strong>
            </div>

          </div>

          <div className="profile-stat-card">

            <div className="profile-stat-icon">
              🎯
            </div>

            <div>
              <span>
                Career Match
              </span>

              <strong>
                92%
              </strong>
            </div>

          </div>

          <div className="profile-stat-card">

            <div className="profile-stat-icon">
              🧩
            </div>

            <div>
              <span>
                Skill Match
              </span>

              <strong>
                68%
              </strong>
            </div>

          </div>

        </section>

        {/* =====================================================
            AI INSIGHT
            ===================================================== */}

        <section className="profile-ai-card">

          <div className="profile-ai-icon">
            ✦
          </div>

          <div>

            <span>
              AI PROFILE INSIGHT
            </span>

            <h2>
              Keep improving your technical skills!
            </h2>

            <p>
              Your profile shows a strong foundation.
              Continue building projects and improving
              your missing skills to increase your career
              readiness.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;