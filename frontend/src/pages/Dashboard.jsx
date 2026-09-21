import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">

      {/* ================= LEFT SIDEBAR ================= */}

      <aside className="dashboard-sidebar">

        <Link to="/dashboard" className="dashboard-brand">

          <div className="dashboard-brand-icon">
            ✦
          </div>

          <div>
            <strong>Student Career</strong>
            <b>AI</b>
          </div>

        </Link>


        <nav className="dashboard-menu">

          <Link
            to="/dashboard"
            className="dashboard-menu-item active"
          >
            <span>🏠</span>
            Dashboard
          </Link>


          <Link
  to="/placement-prediction"
  className="dashboard-menu-item"
>
  <span>📊</span>
  Placement Prediction
</Link>

          <Link
            to="/career-recommendation"
            className="dashboard-menu-item"
          >
            <span>🎯</span>
            Career Recommendation
          </Link>


          <Link
            to="/skill-gap"
            className="dashboard-menu-item"
          >
            <span>🧩</span>
            Skill Gap Analysis
          </Link>


          <Link
            to="/profile"
            className="dashboard-menu-item"
          >
            <span>👤</span>
            Profile
          </Link>

        </nav>


        {/* ================= SIDEBAR BOTTOM ================= */}

        <div className="dashboard-sidebar-bottom">

          <div className="dashboard-goal-title">
            Your Goals
          </div>

          <div className="dashboard-ai-support">
            Our AI Support
          </div>

          <p>
            Smart guidance for a better future.
          </p>


          <button
            className="dashboard-logout"
            onClick={() => navigate("/")}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="dashboard-main">

        {/* ================= HEADER ================= */}

        <header className="dashboard-header">

          <div>

            <div className="dashboard-label">
              ✦ STUDENT CAREER AI
            </div>

            <h1>
              Welcome Back, Student!
            </h1>

            <p>
              Your personalized AI-powered career dashboard.
              Track your progress and plan your career journey.
            </p>

          </div>


          <div className="dashboard-header-ai">
            ✦
          </div>

        </header>


        {/* ================= STATS ================= */}

        <section className="dashboard-stats">


          <div className="dashboard-stat-card">

            <div className="stat-icon placement-stat">
              📊
            </div>

            <div>
              <span>Placement Chance</span>
              <strong>85%</strong>
            </div>

            <div className="stat-arrow">
              →
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon career-stat">
              🎯
            </div>

            <div>
              <span>Career Match</span>
              <strong>92%</strong>
            </div>

            <div className="stat-arrow">
              →
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon skill-stat">
              🧩
            </div>

            <div>
              <span>Skill Match</span>
              <strong>68%</strong>
            </div>

            <div className="stat-arrow">
              →
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon roadmap-stat">
              🚀
            </div>

            <div>
              <span>Roadmap Progress</span>
              <strong>35%</strong>
            </div>

            <div className="stat-arrow">
              →
            </div>

          </div>

        </section>


        {/* ================= FEATURE CARDS ================= */}

        <section className="dashboard-grid">


          {/* ================= PLACEMENT ================= */}

          <div className="dashboard-feature-card">

            <div className="feature-card-top">

              <div className="feature-icon placement-feature">
                📊
              </div>

              <span className="feature-status">
                AI Analysis
              </span>

            </div>

            <h2>
              Placement Prediction
            </h2>

            <p>
              Analyze your academic performance,
              experience and skills to predict your
              placement chances.
            </p>


            <div className="feature-progress">

              <div className="feature-progress-header">

                <span>
                  Current Chance
                </span>

                <strong>
                  85%
                </strong>

              </div>

              <div className="feature-progress-bar">

                <div className="feature-progress-fill placement-fill"></div>

              </div>

            </div>

          </div>


          {/* ================= CAREER RECOMMENDATION ================= */}

          <div className="dashboard-feature-card">

            <div className="feature-card-top">

              <div className="feature-icon career-feature">
                🎯
              </div>

              <span className="feature-status">
                AI Recommendation
              </span>

            </div>

            <h2>
              Career Recommendation
            </h2>

            <p>
              Discover careers that match your
              interests, education and technical
              skills.
            </p>


            <div className="career-match">

              <div className="career-match-main">

                <strong>
                  92%
                </strong>

                <span>
                  Career Match
                </span>

              </div>

              <div className="career-match-bar">

                <div></div>

              </div>

            </div>

          </div>


          {/* ================= SKILL GAP ================= */}

          <div className="dashboard-feature-card">

            <div className="feature-card-top">

              <div className="feature-icon skill-feature">
                🧩
              </div>

              <span className="feature-status">
                Skill Analysis
              </span>

            </div>

            <h2>
              Skill Gap Analysis
            </h2>

            <p>
              Identify missing skills and understand
              what you need to learn for your target career.
            </p>


            <div className="skill-summary">

              <div>

                <strong>
                  68%
                </strong>

                <span>
                  Skill Match
                </span>

              </div>


              <div>

                <strong>
                  4
                </strong>

                <span>
                  Skills To Learn
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* ================= AI INSIGHT ================= */}

        <section className="dashboard-bottom-grid">

          <div className="ai-insight-card">

            <div className="insight-icon">
              ✦
            </div>

            <div>

              <div className="insight-label">
                AI INSIGHT
              </div>

              <h2>
                Keep building your skills!
              </h2>

              <p>
                Your current career match is strong.
                Focus on improving your missing technical
                skills and building practical projects to
                increase your placement opportunities.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;