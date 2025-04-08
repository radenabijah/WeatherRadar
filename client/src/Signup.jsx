import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/LoginSignup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("⚠️ All fields are required!");
      return;
    }
    if (password.length < 6) {
      setError("⚠️ Password must be at least 6 characters!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/register", {
        name,
        email,
        password,
      });

      console.log(response.data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "⚠️ Registration failed!");
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
    <div className="auth-container">
      {error && (
        <div className={`error-message ${error === "HIDE" ? "fade-out" : ""}`}>
          {error !== "HIDE" ? error : ""}
        </div>
      )}

      <div className="auth-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter Name"
              autoComplete="off"
              name="name"
              className="form-control rounded-0"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Register
          </button>
        </form>
        <p>Already have an Account?</p>
        <Link to="/login" className="btn-signup">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
