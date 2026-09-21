import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CareerRecommendation() {
  const navigate = useNavigate();

  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      education,
      experience,
      skills,
      interests,
    };

    localStorage.setItem(
      "careerRecommendationData",
      JSON.stringify(data)
    );

    navigate("/career-recommendation-result", {
      state: data,
    });
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#071426",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ================= SIDEBAR ================= */}

      <aside
        style={{
          width: "245px",
          minHeight: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          background: "#0A1B33",
          borderRight: "1px solid rgba(0,174,255,0.25)",
          padding: "25px 14px",
        }}
      >
        {/* LOGO */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "5px 10px 25px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "11px",
              background:
                "linear-gradient(135deg,#168BFF,#00D9FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            ✦
          </div>

          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              lineHeight: "1.2",
            }}
          >
            <div>Student Career</div>

            <div style={{ color: "#168BFF" }}>AI</div>
          </div>
        </div>

        {/* MENU */}

        <div
          style={{
            marginTop: "25px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            style={menuStyle(false)}
          >
            <span>🏠</span>
            Dashboard
          </button>

          <button
            onClick={() => navigate("/placement-prediction")}
            style={menuStyle(false)}
          >
            <span>📊</span>
            Placement Prediction
          </button>

          <button
            style={menuStyle(true)}
          >
            <span>🎯</span>
            Career Recommendation
          </button>

          <button
            onClick={() => navigate("/skill-gap")}
            style={menuStyle(false)}
          >
            <span>🧩</span>
            Skill Gap Analysis
          </button>

          <button
            onClick={() => navigate("/profile")}
            style={menuStyle(false)}
          >
            <span>👤</span>
            Profile
          </button>
        </div>

        {/* BOTTOM */}

        <div
          style={{
            position: "absolute",
            bottom: "25px",
            left: "14px",
            right: "14px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "18px",
          }}
        >
          <div
            style={{
              color: "#8FA8BF",
              fontSize: "12px",
              marginBottom: "8px",
            }}
          >
            Your Goals
          </div>

          <div
            style={{
              color: "#55E6FF",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            Our AI Support
          </div>

          <p
            style={{
              color: "#7E96AD",
              fontSize: "12px",
              lineHeight: "1.5",
            }}
          >
            Smart guidance for a better future.
          </p>

          <button
            onClick={logout}
            style={{
              width: "100%",
              height: "42px",
              marginTop: "10px",
              borderRadius: "9px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
              color: "#AFC4D9",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      {/* ================= RIGHT SIDE ================= */}

      <main
        style={{
          marginLeft: "245px",
          width: "calc(100% - 245px)",
          minHeight: "100vh",
          padding: "45px",
          background:
            "radial-gradient(circle at 85% 10%,rgba(0,217,255,0.10),transparent 30%),#071426",
        }}
      >
        {/* HEADER */}

        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "7px 14px",
              borderRadius: "20px",
              background: "rgba(22,139,255,0.10)",
              border: "1px solid rgba(0,217,255,0.25)",
              color: "#55E6FF",
              fontSize: "11px",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            ✦ AI CAREER RECOMMENDATION
          </div>

          <h1
            style={{
              margin: "14px 0 8px",
              fontSize: "38px",
              color: "#168BFF",
            }}
          >
            Discover Your Career Path
          </h1>

          <p
            style={{
              margin: 0,
              color: "#AFC4D9",
              fontSize: "15px",
            }}
          >
            Tell us about your skills, interests and education
            to get personalized career recommendations.
          </p>
        </div>

        {/* FORM CARD */}

        <div
          style={{
            maxWidth: "950px",
            background: "#102844",
            border: "1px solid rgba(0,174,255,0.25)",
            borderRadius: "18px",
            padding: "30px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          }}
        >
          {/* CARD HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "13px",
                background:
                  "linear-gradient(135deg,#7C5CFF,#168BFF,#00D9FF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              🎯
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "21px",
                }}
              >
                Build Your Career Profile
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#819AB2",
                  fontSize: "13px",
                }}
              >
                Enter your details to receive personalized recommendations.
              </p>
            </div>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* EDUCATION */}

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                Education
              </label>

              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                required
                style={inputStyle}
              >
                <option value="">Select your education</option>
                <option value="B.Tech">B.Tech</option>
                <option value="B.E">B.E</option>
                <option value="B.Sc">B.Sc</option>
                <option value="BCA">BCA</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MCA">MCA</option>
              </select>
            </div>

            {/* EXPERIENCE */}

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                Experience
              </label>

              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                style={inputStyle}
              >
                <option value="">Select experience</option>
                <option value="Fresher">Fresher</option>
                <option value="Less than 1 year">
                  Less than 1 year
                </option>
                <option value="1-2 years">1-2 years</option>
                <option value="2+ years">2+ years</option>
              </select>
            </div>

            {/* SKILLS */}

            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                Your Skills
              </label>

              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
                placeholder="Example: Python, Java, SQL, Machine Learning, React..."
                style={{
                  ...inputStyle,
                  minHeight: "120px",
                  resize: "vertical",
                }}
              />
            </div>

            {/* INTERESTS */}

            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                Your Interests
              </label>

              <textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                required
                placeholder="Example: Artificial Intelligence, Data Science, Web Development..."
                style={{
                  ...inputStyle,
                  minHeight: "120px",
                  resize: "vertical",
                }}
              />
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              style={{
                gridColumn: "1 / -1",
                height: "52px",
                border: "none",
                borderRadius: "10px",
                background:
                  "linear-gradient(90deg,#8B5CF6,#3B82F6,#06D6F7)",
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "5px",
              }}
            >
              ✦ Get AI Career Recommendation
            </button>
          </form>
        </div>

        {/* BOTTOM CARDS */}

        <div
          style={{
            maxWidth: "950px",
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <InfoCard icon="🤖" text="AI Analysis" />
          <InfoCard icon="🎯" text="Personalized Match" />
          <InfoCard icon="🚀" text="Career Growth" />
        </div>
      </main>
    </div>
  );
}

/* ================= HELPERS ================= */

const inputStyle = {
  width: "100%",
  height: "48px",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(0,174,255,0.25)",
  background: "#0A1B33",
  color: "white",
  outline: "none",
  fontSize: "14px",
};

function menuStyle(active) {
  return {
    width: "100%",
    minHeight: "48px",
    borderRadius: "10px",
    border: active
      ? "1px solid rgba(22,139,255,0.25)"
      : "1px solid transparent",
    background: active
      ? "rgba(22,139,255,0.14)"
      : "transparent",
    color: active ? "white" : "#A9BDD1",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "0 13px",
    fontSize: "14px",
    textAlign: "left",
    cursor: "pointer",
    boxShadow: active
      ? "inset 3px 0 0 #168BFF"
      : "none",
  };
}

function InfoCard({ icon, text }) {
  return (
    <div
      style={{
        background: "#0A1B33",
        border: "1px solid rgba(0,174,255,0.16)",
        borderRadius: "12px",
        padding: "18px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "22px", marginBottom: "7px" }}>
        {icon}
      </div>

      <strong
        style={{
          color: "#55E6FF",
          fontSize: "12px",
        }}
      >
        {text}
      </strong>
    </div>
  );
}

export default CareerRecommendation;