```jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CareerRecommendation.css";

function CareerRecommendation() {
  const navigate = useNavigate();

  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");

  const handleRecommendation = () => {
    if (!interests || !skills || !education || !experience) {
      alert("Please fill all the details.");
      return;
    }

    const studentData = {
      interests,
      skills,
      education,
      experience,
    };

    // Save student input temporarily
    localStorage.setItem(
      "careerRecommendationData",
      JSON.stringify(studentData)
    );

    // Go to result page
    navigate("/career-recommendation-result");
  };

  return (
    <div className="career-page">

      {/* SIDEBAR */}
      <aside className="career-sidebar">

        <Link to="/dashboard" className="career-brand">
          <span className="career-brand-icon">✦</span>

          <div>
            <strong>Student Career</strong>
            <b>AI</b>
          </div>
        </Link>

        <nav className="career-menu">

          <Link to="/dashboard">
            <span>🏠</span>
            Dashboard
          </Link>

          <Link to="/placement">
            <span>📊</span>
            Placement Prediction
          </Link>

          <Link
            to="/career-recommendation"
            className="career-menu-active"
          >
            <span>🎯</span>
            Career Recommendation
          </Link>

          <Link to="/skill-gap">
            <span>🧩</span>
            Skill Gap Analysis
          </Link>

          <Link to="/profile">
            <span>👤</span>
            Profile
          </Link>

        </nav>

        <div className="career-sidebar-bottom">

          <div className="career-goal-title">
            Your Goals
          </div>

          <div className="career-ai-support">
            Our AI Support
          </div>

          <p>
            Smart guidance for a better future.
          </p>

          <button
            className="career-logout"
            onClick={() => navigate("/")}
          >
            <span>↪</span>
            Logout
          </button>

        </div>
      </aside>


      {/* MAIN CONTENT */}
      <main className="career-main">

        <header className="career-header">

          <div className="career-header-text">

            <div className="career-label">
              ✦ CAREER RECOMMENDATION
            </div>

            <h1>
              Discover Your Ideal Career
            </h1>

            <p>
              Tell us about your interests, skills, education
              and experience. Our system will identify career
              roles that match your profile.
            </p>

          </div>

          <div className="career-ai-visual">
            <div className="career-orbit orbit-one"></div>
            <div className="career-orbit orbit-two"></div>

            <div className="career-ai-center">
              ✦
            </div>

            <div className="career-node node-one">
              💻
            </div>

            <div className="career-node node-two">
              📊
            </div>

            <div className="career-node node-three">
              🎨
            </div>

            <div className="career-node node-four">
              ☁️
            </div>
          </div>

        </header>


        <section className="career-content">

          {/* FORM */}
          <div className="career-form-box">

            <div className="career-section-label">
              YOUR CAREER PROFILE
            </div>

            <h2>
              Tell Us About Yourself
            </h2>


            <div className="career-input-group">

              <label>
                Career Interests
              </label>

              <textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Example: Web development, cybersecurity, data analysis, AI..."
              />

            </div>


            <div className="career-input-group">

              <label>
                Technical Skills
              </label>

              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Example: Python, Java, React, SQL, AWS..."
              />

            </div>


            <div className="career-form-grid">

              <div className="career-input-group">

                <label>
                  Education
                </label>

                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                >

                  <option value="">
                    Select education
                  </option>

                  <option value="B.Tech">
                    B.Tech
                  </option>

                  <option value="B.Sc">
                    B.Sc
                  </option>

                  <option value="BCA">
                    BCA
                  </option>

                  <option value="M.Tech">
                    M.Tech
                  </option>

                  <option value="MCA">
                    MCA
                  </option>

                </select>

              </div>


              <div className="career-input-group">

                <label>
                  Experience
                </label>

                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >

                  <option value="">
                    Select experience
                  </option>

                  <option value="Fresher">
                    Fresher
                  </option>

                  <option value="0-1 Years">
                    0-1 Years
                  </option>

                  <option value="1-2 Years">
                    1-2 Years
                  </option>

                  <option value="2+ Years">
                    2+ Years
                  </option>

                </select>

              </div>

            </div>


            <button
              className="career-recommend-button"
              onClick={handleRecommendation}
            >
              ✦ Get Career Recommendation
            </button>

          </div>


          {/* RIGHT INFORMATION BOX */}
          <div className="career-info-box">

            <div className="career-section-label">
              AI CAREER GUIDANCE
            </div>

            <h2>
              How It Works
            </h2>


            <div className="career-info-item">

              <div className="career-info-icon">
                🎯
              </div>

              <div>
                <strong>
                  Interest Analysis
                </strong>

                <p>
                  We analyze the career areas that
                  interest you.
                </p>
              </div>

            </div>


            <div className="career-info-item">

              <div className="career-info-icon">
                🧠
              </div>

              <div>
                <strong>
                  Skill Matching
                </strong>

                <p>
                  Your skills are compared with
                  skills required for different roles.
                </p>
              </div>

            </div>


            <div className="career-info-item">

              <div className="career-info-icon">
                🎓
              </div>

              <div>
                <strong>
                  Education & Experience
                </strong>

                <p>
                  Your academic background and
                  experience are considered.
                </p>
              </div>

            </div>


            <div className="career-info-item">

              <div className="career-info-icon">
                🚀
              </div>

              <div>
                <strong>
                  Career Roles
                </strong>

                <p>
                  Suitable job roles are ranked
                  according to your profile.
                </p>
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default CareerRecommendation;
```
