import { Link } from "react-router-dom";
import "./Features.css";

function Features() {
  return (
    <div className="features-page">

      {/* NAVBAR */}
      <header className="features-navbar">
        <Link to="/" className="features-logo">
          <span>✦</span>
          Student Career AI
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/features" className="active">Features</Link>
          <Link to="/about">About</Link>
          <Link to="/login" className="login-button">
            Login
          </Link>
        </nav>
      </header>


      {/* HERO */}
      <main className="features-main">

        <section className="features-heading">

          <div className="features-label">
            ✦ POWERFUL AI FEATURES
          </div>

          <h1>
            Everything You Need
            <span>For Your Career Journey</span>
          </h1>

          <p>
            Explore intelligent tools designed to help you understand
            your placement opportunities, discover suitable careers,
            and improve your skills.
          </p>

        </section>


        {/* AI DIAGRAM */}
        <section className="features-diagram">

          <div className="diagram-line line-left"></div>
          <div className="diagram-line line-right"></div>

          <div className="diagram-center">
            <span>✦</span>
            <strong>AI</strong>
            <small>CAREER ANALYSIS</small>
          </div>

          <div className="diagram-node node-one">
            <span>🎯</span>
            <strong>Placement</strong>
            <small>Prediction</small>
          </div>

          <div className="diagram-node node-two">
            <span>💼</span>
            <strong>Career</strong>
            <small>Recommendation</small>
          </div>

          <div className="diagram-node node-three">
            <span>📊</span>
            <strong>Skill Gap</strong>
            <small>Analysis</small>
          </div>

        </section>


        {/* FEATURE CARDS */}
        <section className="feature-grid">

          <div className="feature-card blue-card">

            <div className="feature-top">
              <span className="feature-icon">🎯</span>
              <span className="feature-number">01</span>
            </div>

            <h2>Placement Prediction</h2>

            <p>
              Analyze academic performance, projects, internships
              and other student information to generate an
              AI-based placement prediction.
            </p>

            <div className="feature-tag">
              AI Prediction
            </div>

          </div>


          <div className="feature-card cyan-card">

            <div className="feature-top">
              <span className="feature-icon">💼</span>
              <span className="feature-number">02</span>
            </div>

            <h2>Career Recommendation</h2>

            <p>
              Discover career paths based on your skills,
              interests, academic profile and career preferences.
            </p>

            <div className="feature-tag">
              Smart Matching
            </div>

          </div>


          <div className="feature-card purple-card">

            <div className="feature-top">
              <span className="feature-icon">📊</span>
              <span className="feature-number">03</span>
            </div>

            <h2>Skill Gap Analysis</h2>

            <p>
              Compare your current skills with the skills required
              for your target career and identify areas to improve.
            </p>

            <div className="feature-tag">
              Skill Analysis
            </div>

          </div>

        </section>


        {/* BOTTOM MESSAGE */}
        <section className="features-message">

          <div className="message-icon">✦</div>

          <div>
            <h2>
              One Platform. Three Intelligent Tools.
            </h2>

            <p>
              Understand where you are, discover where you can go,
              and identify what you need to improve.
            </p>
          </div>

        </section>


        <Link to="/" className="features-back">
          ← Back to Home
        </Link>

      </main>

    </div>
  );
}

export default Features;