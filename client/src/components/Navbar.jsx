import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = ({ onSearch }) => {
  const [searchCity, setSearchCity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle

  const handleSearchClick = async () => {
    if (!searchCity.trim()) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=f7b40973400151ea978b452ce85efaea`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setErrorMessage("⚠️ City not found. Please enter a valid city.");
        setTimeout(() => setErrorMessage(""), 2000);
      } else {
        setErrorMessage("");
        onSearch(searchCity);
      }
    } catch (err) {
      setErrorMessage("❌ Failed to fetch data. Please try again.");
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  const handleCurrentLocationClick = () => {
    if (!navigator.geolocation) {
      setErrorMessage("❌ Geolocation not supported by your browser.");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          );
          const data = await res.json();

          if (data.cod === 200) {
            setSearchCity(data.name);
            onSearch(data.name);
            setErrorMessage("");
          } else {
            setErrorMessage("⚠️ Unable to retrieve city from location.");
            setTimeout(() => setErrorMessage(""), 2000);
          }
        } catch (error) {
          setErrorMessage("❌ Failed to fetch your location.");
          setTimeout(() => setErrorMessage(""), 2000);
        }
      },
      () => {
        setErrorMessage("⚠️ Location permission denied.");
        setTimeout(() => setErrorMessage(""), 2000);
      }
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "10px",
          padding: "10px 30px",
          flexWrap: "wrap",
        }}
      >
        {/* WeatherRadar logo and text */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <img
            src="/weather-news.png"
            alt="WeatherRadar Logo"
            style={{ height: "70px", verticalAlign: "middle" }}
          />
          <p
            style={{
              fontWeight: "bold",
              fontSize: "24px",
              margin: 0,
              lineHeight: 1,
            }}
          >
            WeatherRadar
          </p>
        </div>

        {/* Search input and error */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <TextField
              style={{
                backgroundColor: "white",
                borderRadius: "2rem",
                width: "28rem",
              }}
              placeholder="Search city"
              variant="outlined"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleSearchClick}
              style={{ borderRadius: "6px", backgroundColor: "#4B5550" }}
            >
              Search
            </Button>
          </div>
          {errorMessage && (
            <span
              style={{
                color: "red",
                fontSize: "14px",
                transition: "opacity 0.5s ease-in-out",
                opacity: errorMessage ? 1 : 0,
              }}
            >
              {errorMessage}
            </span>
          )}
        </div>

        {/* Current Location Button */}
        <Button
          variant="contained"
          onClick={handleCurrentLocationClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "600",
            backgroundColor: "#4B5550",
            height: "45px",
            color: "white",
            gap: "6px",
            borderRadius: "6px",
          }}
        >
          <GpsFixedIcon style={{ fontSize: "24px" }} />
          Current Location
        </Button>

        {/* Profile Icon */}
        <AccountCircleIcon
          onClick={toggleSidebar}
          style={{
            fontSize: "60px",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        />
      </nav>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: sidebarOpen ? 0 : "-300px",
          height: "100vh",
          width: "300px",
          backgroundColor: "#f7f7f7",
          boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.1)",
          transition: "right 0.3s ease-in-out",
          padding: "20px",
          zIndex: 999,
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <CloseIcon
            onClick={toggleSidebar}
            style={{ cursor: "pointer", fontSize: "28px" }}
          />
        </div>
        <h3 style={{ marginTop: "20px" }}>👤 Profile</h3>
        <p style={{ marginTop: "10px" }}>Username: johndoe</p>
        <p>Email: johndoe@example.com</p>
        <Button
          variant="contained"
          color="error"
          style={{ marginTop: "20px" }}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default Navbar;
