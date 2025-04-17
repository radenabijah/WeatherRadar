import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { id, token } = useParams();

  axios.defaults.withCredentials = true; // if your backend requires cookies

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/reset-password/${id}/${token}`, { password })
      .then((res) => {
        if (res.data.Status === "Success") {
          setMessage("✅ Password updated successfully! Please return to the previous page to continue.");
          setTimeout(() => navigate("/login"), 10000);
        } else {
          setMessage(res.data.Status || "❌ Password reset failed.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("❌ Error resetting password. Please try again.");
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 style={{ color: "black", fontWeight: "normal" }}>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 password-container">
            <label htmlFor="password">
              <strong>New Password</strong>
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter password"
                autoComplete="off"
                name="password"
                className="form-control rounded-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          <button type="submit" className="btn btn-primary w-100 rounded-0">
            Update
          </button>
        </form>

        {message && <p className="alert-message mt-3">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
