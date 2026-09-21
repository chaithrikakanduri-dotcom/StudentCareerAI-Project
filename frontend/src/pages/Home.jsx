import { Link } from "react-router-dom";
import "./Home.css";
import homeImage from "../assets/login_reference1.png";

function Home() {
  return (
    <div className="home-page">

      {/* NAVBAR */}
      <header className="home-navbar">

        <Link to="/" className="home-logo">
          <span className="logo-icon">🎓</span>
          <span>Student Career AI</span>
        </Link>

        <nav className="home-nav">

          <Link to="/" className="active">
            Home
          </Link>

          <Link to="/features">
            Features
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/login" className="home-login">
            Login
          </Link>

        </nav>

      </header>


      {/* HERO SECTION */}
      <main className="home-main">

        <section className="home-hero">

          {/* LEFT SIDE */}
          <div className="home-content">

            <div className="home-label">
              ✦ AI-POWERED CAREER GUIDANCE
            </div>

            <h1>
              Shape Your
              <span>Career Future</span>
              With AI
            </h1>

            <p className="home-description">
              Discover your career possibilities with smart AI insights.
              Get personalized guidance for placements, career growth
              and skill development.
            </p>


            {/* FEATURE PILLS */}
            <div className="home-feature-row">

              <div className="home-feature-pill">
                <span>✓</span>
                Placement Prediction
              </div>

              <div className="home-feature-pill">
                <span>✓</span>
                Career Recommendation
              </div>

              <div className="home-feature-pill">
                <span>✓</span>
                Skill Gap Analysis
              </div>

            </div>

          </div>


          {/* RIGHT IMAGE */}
          <div className="home-image-area">

            <div className="home-image-glow"></div>

            <img
              src={homeImage}
              alt="Student Career AI"
              className="home-hero-image"
            />

          </div>

        </section>


        {/* FUTURE SECTION */}
        <section className="future-section">

          <h2>
            Your Future Starts With Better Decisions
          </h2>

          <p>
            Let AI guide you towards the right career path.
          </p>


          {/* BENEFITS */}
          <div className="benefits-row">

            <div className="benefit-item">

              <div className="benefit-icon">
                🎓
              </div>

              <div>
                <h3>Smarter Insights</h3>

                <p>
                  Get data-driven career recommendations.
                </p>
              </div>

            </div>


            <div className="benefit-item">

              <div className="benefit-icon">
                🎯
              </div>

              <div>
                <h3>Better Placements</h3>

                <p>
                  Predict your placement chances with AI.
                </p>
              </div>

            </div>


            <div className="benefit-item">

              <div className="benefit-icon">
                📊
              </div>

              <div>
                <h3>Skill Growth</h3>

                <p>
                  Identify your skill gaps and improve.
                </p>
              </div>

            </div>


            <div className="benefit-item">

              <div className="benefit-icon">
                🚀
              </div>

              <div>
                <h3>Bright Future</h3>

                <p>
                  Build your career with confidence.
                </p>
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Home;