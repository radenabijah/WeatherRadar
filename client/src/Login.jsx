import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/LoginSignup.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.message === "Login successful") {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        navigate("/home");
      } else {
        setError(data.error || "⚠️ Invalid credentials!");
      }
    } catch (err) {
      setError("⚠️ Network or server error. Please try again later.");
    }
  };

  // Auto-hide error after 3 seconds
  useEffect(() => {
    if (error && error !== "HIDE") {
      const timeout1 = setTimeout(() => {
        setError("HIDE"); // Trigger fade out
      }, 2500);

      const timeout2 = setTimeout(() => {
        setError(""); // Remove it from DOM
      }, 3000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [error]);

  return (
    <div>
      <div className="auth-container">
        {error && (
          <div
            className={`error-message ${error === "HIDE" ? "fade-out" : ""}`}
          >
            {error !== "HIDE" ? error : ""}
          </div>
        )}

        <div className="auth-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                autoComplete="off"
                className="form-control rounded-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3 password-container">
              <label htmlFor="password">
                <strong>Password</strong>
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter Password"
                  className="form-control rounded-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password.length > 0 && (
                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                )}
              </div>
            </div>

            <div className="forgot-password-only">
              <Link to="/forgot-password" className="forgot-password-text">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn btn-success w-100 rounded">
              Login
            </button>
          </form>

          <p>Don't have an account?</p>
          <Link to="/register" className="btn-signup">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
