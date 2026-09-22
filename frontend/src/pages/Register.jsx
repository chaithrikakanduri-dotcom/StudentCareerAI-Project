import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://studentcareerai-project-production.up.railway.app/api/register-student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log("REGISTER RESPONSE:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      alert("Account created successfully! Please login.");

      navigate("/login");

    } catch (error) {
      console.error("REGISTRATION ERROR:", error);

      alert(
        error.message ||
          "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* LEFT SIDE */}

      <section className="register-showcase">

        <Link to="/" className="register-logo">
          <span>✦</span>
          Student Career AI
        </Link>

        <div className="register-showcase-content">

          <div className="register-showcase-label">
            ✦ START YOUR CAREER JOURNEY
          </div>

          <h1>
            Build Your Career.
            <span>Shape Your Future.</span>
          </h1>

          <p>
            Create your Student Career AI account and discover
            your placement possibilities, career opportunities
            and skills you need to develop.
          </p>

          <div className="register-showcase-items">

            <div>
              <span>🎯</span>

              <div>
                <strong>
                  Placement Prediction
                </strong>

                <small>
                  Understand your placement opportunities
                </small>
              </div>
            </div>

            <div>
              <span>💼</span>

              <div>
                <strong>
                  Career Recommendation
                </strong>

                <small>
                  Find career paths matching your profile
                </small>
              </div>
            </div>

            <div>
              <span>📊</span>

              <div>
                <strong>
                  Skill Gap Analysis
                </strong>

                <small>
                  Identify skills you need to improve
                </small>
              </div>
            </div>

          </div>

        </div>

        <div className="register-showcase-glow"></div>

      </section>

      {/* RIGHT SIDE */}

      <section className="register-section">

        <div className="register-card">

          <div className="register-mobile-logo">
            <span>✦</span>
            Student Career AI
          </div>

          <div className="register-heading">

            <div className="register-welcome-icon">
              ✦
            </div>

            <div>

              <div className="register-label">
                CREATE ACCOUNT
              </div>

              <h2>
                Start your journey
              </h2>

              <p>
                Create your account to access Student Career AI.
              </p>

            </div>

          </div>

          <form onSubmit={handleRegister}>

            {/* NAME */}

            <div className="register-input-group">

              <label>
                Full Name
              </label>

              <div className="register-input-box">

                <span>👤</span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="register-input-group">

              <label>
                Email Address
              </label>

              <div className="register-input-box">

                <span>✉</span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="register-input-group">

              <label>
                Password
              </label>

              <div className="register-input-box">

                <span>🔒</span>

                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="register-input-group">

              <label>
                Confirm Password
              </label>

              <div className="register-input-box">

                <span>🔐</span>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && <span>→</span>}

            </button>

          </form>

          <div className="register-divider">
            <span>OR</span>
          </div>

          <button
            className="register-google"
            type="button"
            onClick={() =>
              alert(
                "Google registration can be connected later."
              )
            }
          >

            <span>G</span>

            Continue with Google

          </button>

          <p className="register-login-text">

            Already have an account?

            <Link to="/login">
              {" "}Login
            </Link>

          </p>

          <Link
            to="/"
            className="register-back-home"
          >
            ← Back to Home
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Register;