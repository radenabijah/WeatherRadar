import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/forgot-password", { email })
      .then((res) => {
        if (res.data.Status === "Success") {
          setMessage("✅ Reset link sent! Check your email.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setMessage(`⚠️ ${res.data.Status}`);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("❌ Error sending reset link. Please try again.");
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 style={{ color: "black", fontWeight: "normal" }}>
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email address</strong>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 rounded-0">
            Submit
          </button>
        </form>
        {message && <p className="alert-message mt-3">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
