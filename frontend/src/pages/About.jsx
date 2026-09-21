import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <header className="about-navbar">
        <Link to="/" className="about-logo">
          <span>✦</span>
          Student Career AI
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/about" className="active">About</Link>
          <Link to="/login" className="login-button">
            Login
          </Link>
        </nav>
      </header>

      <main className="about-main">

        <section className="about-hero">
          <div className="about-label">
            ✦ ABOUT STUDENT CAREER AI
          </div>

          <h1>
            Helping Students
            <span>Build Their Career Future</span>
          </h1>

          <p>
            Student Career AI is an intelligent career guidance platform
            designed to help students understand their placement
            possibilities, explore career opportunities and identify
            the skills they need to develop.
          </p>
        </section>

        <section className="about-journey">
          <div className="journey-title">
            <span>HOW IT WORKS</span>
            <h2>Your Career Journey</h2>
          </div>

          <div className="journey-flow">

            <div className="journey-card">
              <div className="journey-icon">🎓</div>
              <span>01</span>
              <h3>Student Profile</h3>
              <p>
                Enter your academic and skill information.
              </p>
            </div>

            <div className="journey-arrow">→</div>

            <div className="journey-card">
              <div className="journey-icon">✦</div>
              <span>02</span>
              <h3>AI Analysis</h3>
              <p>
                The system analyzes your profile using intelligent tools.
              </p>
            </div>

            <div className="journey-arrow">→</div>

            <div className="journey-card">
              <div className="journey-icon">💼</div>
              <span>03</span>
              <h3>Career Direction</h3>
              <p>
                Explore suitable careers and understand your skill gaps.
              </p>
            </div>

          </div>
        </section>

        <section className="purpose-section">
          <div className="purpose-card">

            <div className="purpose-icon">✦</div>

            <div>
              <div className="small-label">
                OUR PURPOSE
              </div>

              <h2>
                From Student Profile
                <span>to Career Direction</span>
              </h2>

              <p>
                Our platform brings placement prediction, career
                recommendation and skill gap analysis together in
                one application. Students can use these insights
                to understand their current position and plan their
                next career steps.
              </p>
            </div>

          </div>
        </section>

        <section className="about-values">

          <div className="value-card">
            <div className="value-number">01</div>
            <div className="value-icon">🔍</div>

            <h3>Understand</h3>

            <p>
              Understand your academic performance, skills and
              current career profile.
            </p>
          </div>

          <div className="value-card">
            <div className="value-number">02</div>
            <div className="value-icon">💡</div>

            <h3>Discover</h3>

            <p>
              Discover career paths that connect with your
              interests and skills.
            </p>
          </div>

          <div className="value-card">
            <div className="value-number">03</div>
            <div className="value-icon">🚀</div>

            <h3>Improve</h3>

            <p>
              Identify missing skills and follow a structured
              career roadmap.
            </p>
          </div>

        </section>

        <section className="about-bottom">

          <div className="bottom-glow">✦</div>

          <h2>
            Your Career Journey.
            <span>One Intelligent Platform.</span>
          </h2>

          <p>
            Explore your possibilities, understand your skills
            and plan your future with Student Career AI.
          </p>

        </section>

        <Link to="/" className="about-back">
          ← Back to Home
        </Link>

      </main>

      <footer className="about-footer">

        <div>
          <strong>✦ Student Career AI</strong>

          <p>
            AI-powered career guidance for students.
          </p>
        </div>

        <p>
          © 2026 Student Career AI
        </p>

      </footer>
    </div>
  );
}

export default About;