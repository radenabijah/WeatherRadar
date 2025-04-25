import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import CircularProgress from '@mui/material/CircularProgress'; // Spinner from MUI

function App() {
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ping`);
        if (res.ok) {
          setBackendReady(true);
        } else {
          throw new Error("Server not ready");
        }
      } catch (err) {
        console.log("⏳ Warming up backend...");
        setTimeout(checkBackend, 3000); // Retry every 3 seconds
      }
    };

    checkBackend();
  }, []);

  if (!backendReady) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5"
      }}>
        <CircularProgress size={60} style={{ marginBottom: "20px" }} />
        <p>Connecting to WeatherRadar services... 🔌</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
