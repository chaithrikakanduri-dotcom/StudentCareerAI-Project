import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import loginImage from "../assets/login.png";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = event.target.email.value.trim();
    const password = event.target.password.value;

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch(
        "http://studentcareerai-project-production.up.railway/api/login-student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok || !data.success) {
        alert(data.message || "Invalid email or password.");
        return;
      }

      if (!data.student) {
        alert("Login successful, but student details were not returned.");
        return;
      }

      sessionStorage.removeItem("student");

      sessionStorage.setItem(
        "student",
        JSON.stringify(data.student)
      );

      console.log(
        "CURRENT STUDENT:",
        sessionStorage.getItem("student")
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Unable to connect to backend.");
    }
  };

  return (
    <div className="login-page">

      {/* ================= LEFT SIDE ================= */}
      <div className="login-left">

        <div className="login-left-content">

          <div className="login-image-area">
            <div className="login-image-glow"></div>

            <img
              src={loginImage}
              alt="Student Career AI"
              className="login-student-image"
            />
          </div>

          <div className="login-left-text">

            <h1>
              Your Career Journey
              <span>Starts Here</span>
            </h1>

            <p>
              Make smarter career decisions with AI-powered insights
              designed specially for students.
            </p>

            <div className="login-benefits">

              <div className="login-benefit">
                <div className="benefit-icon">🎯</div>

                <div>
                  <h3>Personalized Guidance</h3>
                  <p>
                    Get career recommendations based on your skills,
                    interests and goals.
                  </p>
                </div>
              </div>

              <div className="login-benefit">
                <div className="benefit-icon">📊</div>

                <div>
                  <h3>Smart Placement Insights</h3>
                  <p>
                    Understand your placement possibilities with
                    AI-powered prediction.
                  </p>
                </div>
              </div>

              <div className="login-benefit">
                <div className="benefit-icon">🚀</div>

                <div>
                  <h3>Build Your Future</h3>
                  <p>
                    Identify skill gaps and follow the right career
                    roadmap.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="login-right">

        <div className="login-card">

          {/* Logo */}
          <Link to="/" className="login-logo">

            <span className="login-logo-icon">
              🎓
            </span>

            <span>
              <strong>Student Career AI</strong>
              <small>AI-Powered Career Guidance</small>
            </span>

          </Link>

          {/* Heading */}
          <div className="login-heading">

            <span className="login-small-label">
              ✦ WELCOME BACK
            </span>

            <h1>Welcome Back!</h1>

            <p>
              Login to continue your personalized career journey.
            </p>

          </div>

          {/* Login Form */}
          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* Email */}
            <div className="login-field">

              <label htmlFor="email">
                Email or Username
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Enter your email or username"
                  required
                />

              </div>

            </div>

            {/* Password */}
            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />

              </div>

            </div>

            {/* Remember / Forgot */}
            <div className="login-options">

              <label className="remember-me">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot Password?
              </button>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="login-button"
            >
              <span>Login</span>
              <span className="login-arrow">→</span>
            </button>

          </form>

          {/* OR */}
          <div className="login-divider">

            <span></span>

            <p>OR</p>

            <span></span>

          </div>

          {/* Google */}
          <button
            type="button"
            className="google-login"
          >

            <span className="google-icon">
              G
            </span>

            <span>
              Continue with Google
            </span>

          </button>

          {/* Register */}
          <div className="register-prompt">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>

          {/* Back */}
          <Link
            to="/"
            className="back-home"
          >
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;