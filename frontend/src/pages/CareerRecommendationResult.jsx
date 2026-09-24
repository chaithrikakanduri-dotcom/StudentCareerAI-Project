import { useNavigate, Link } from "react-router-dom";
import "./CareerRecommendationResult.css";

function CareerRecommendationResult() {
  const navigate = useNavigate();

  const data = JSON.parse(
    localStorage.getItem("careerRecommendationData") || "{}"
  );
const roles = (data.careerRecommendations || []).map((item, index) => ({
  rank: String(index + 1).padStart(2, "0"),
  icon:
    item.job_title?.toLowerCase().includes("ai") ||
    item.job_title?.toLowerCase().includes("machine")
      ? "🤖"
      : item.job_title?.toLowerCase().includes("data")
      ? "📊"
      : item.job_title?.toLowerCase().includes("cloud")
      ? "☁️"
      : item.job_title?.toLowerCase().includes("web")
      ? "🌐"
      : "💻",
  role: item.job_title,
  match: item.similarity_score,
  category: item.category,
  workArea: item.workplace,
  salary: item.salary_range,
}));

  return (
    <div className="career-result-page">

      {/* ================= LEFT SIDEBAR ================= */}

      <aside className="career-result-sidebar">

        <Link to="/dashboard" className="career-result-brand">
          <div className="career-result-brand-icon">✦</div>

          <div>
            <strong>Student Career</strong>
            <b>AI</b>
          </div>
        </Link>

        <nav className="career-result-menu">

          <Link
            to="/dashboard"
            className="career-result-menu-item"
          >
            <span>🏠</span>
            Dashboard
          </Link>

          <Link
            to="/placement-prediction"
            className="career-result-menu-item"
          >
            <span>📊</span>
            Placement Prediction
          </Link>

          <Link
            to="/career-recommendation"
            className="career-result-menu-item active"
          >
            <span>🎯</span>
            Career Recommendation
          </Link>

          <Link
            to="/skill-gap"
            className="career-result-menu-item"
          >
            <span>🧩</span>
            Skill Gap Analysis
          </Link>

          <Link
            to="/profile"
            className="career-result-menu-item"
          >
            <span>👤</span>
            Profile
          </Link>

        </nav>

        <div className="career-result-sidebar-bottom">

          <div className="career-result-goal-title">
            Your Goals
          </div>

          <div className="career-result-support">
            Our AI Support
          </div>

          <p>
            Smart guidance for a better future.
          </p>

          <button
            className="career-result-logout"
            onClick={() => navigate("/")}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* ================= RIGHT MAIN CONTENT ================= */}

      <main className="career-result-main">

        {/* HEADER */}

        <header className="career-result-header">

          <div className="career-result-header-content">

            <div>
              <div className="career-result-label">
                ✦ STUDENT CAREER AI
              </div>

              <h1>Your Career Recommendations</h1>

              <p>
                AI-powered career roles matched with your
                education, skills, experience and interests.
              </p>
            </div>

            

          </div>

        </header>


        {/* ================= PROFILE LEFT + TABLE RIGHT ================= */}

        <section className="career-result-content-grid">

          {/* PROFILE SUMMARY - LEFT */}

          <div className="career-profile-card">

            <div className="career-card-heading">

              <div className="career-card-heading-icon">
                👤
              </div>

              <div>
                <h2>Profile Summary</h2>
                <p>Your career profile</p>
              </div>

            </div>


            <div className="career-profile-details">

              <div className="career-profile-item">
                <span>Education</span>

                <strong>
                  {data.education || "Not provided"}
                </strong>
              </div>


              <div className="career-profile-item">
                <span>Experience</span>

                <strong>
                  {data.experience || "Not provided"}
                </strong>
              </div>


              <div className="career-profile-item">
                <span>Skills</span>

                <strong>
                  {data.skills || "Not provided"}
                </strong>
              </div>


              <div className="career-profile-item">
                <span>Interests</span>

                <strong>
                  {data.interests || "Not provided"}
                </strong>
              </div>

            </div>


            <button
              className="career-edit-profile-button"
              onClick={() => navigate("/career-recommendation")}
            >
              ← Edit Profile
            </button>

          </div>


          {/* CAREER TABLE - RIGHT */}

          <div className="career-paths-card">

            <div className="career-paths-heading">

              <div>
                <h2>Recommended Career Paths</h2>

                <p>
                  Career options based on your profile analysis.
                </p>
              </div>

              <span className="career-role-count">
                5 Roles
              </span>

            </div>


            <div className="career-table-wrapper">

              <table className="career-role-table">

                <thead>

                  <tr>
                    <th>#</th>
                    <th>Career Role</th>
                    <th>Match</th>
                    <th>Category</th>
                    <th>Work Area</th>
                    <th>Salary</th>
                  </tr>

                </thead>


                <tbody>

                  {roles.map((item) => (

                    <tr key={item.rank}>

                      <td className="career-rank">
                        {item.rank}
                      </td>


                      <td>

                        <div className="career-role-name">

                          <span className="career-role-icon">
                            {item.icon}
                          </span>

                          <strong>
                            {item.role}
                          </strong>

                        </div>

                      </td>


                      <td>

                        <div className="match-container">

                          <strong className="match-number">
                            {item.match}%
                          </strong>

                          <div className="match-bar">

                            <div
                              className="match-fill"
                              style={{
                                width: `${item.match}%`,
                              }}
                            ></div>

                          </div>

                        </div>

                      </td>


                      <td>

                        <span className="career-category">
                          {item.category}
                        </span>

                      </td>


                      <td>

                        <span className="career-work-area">
                          {item.workArea}
                        </span>

                      </td>


                      <td>

                        <span className="career-salary">
                          {item.salary}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </section>


        {/* ================= AI INSIGHT ================= */}

        <section className="career-ai-insight">

          <div className="career-ai-icon">
            ✦
          </div>

          <div>

            <div className="career-ai-title">
              AI CAREER INSIGHT
            </div>

            <h2>
              Your profile shows strong potential for technology careers.
            </h2>

            <p>
              Focus on strengthening your technical skills,
              completing practical projects and gaining
              industry experience to improve your career opportunities.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default CareerRecommendationResult;