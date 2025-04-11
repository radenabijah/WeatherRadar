import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = ({ onSearch }) => {
  const [searchCity, setSearchCity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearchClick = async () => {
    if (!searchCity.trim()) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=f7b40973400151ea978b452ce85efaea`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setErrorMessage("⚠️ City not found. Please enter a valid city.");
      } else {
        setErrorMessage(""); // Clear error
        onSearch(data); // Pass the data to parent
      }
    } catch (err) {
      setErrorMessage("❌ Failed to fetch data. Please try again.");
    }
  };

  return (
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
          <span style={{ color: "red", fontSize: "14px" }}>{errorMessage}</span>
        )}
      </div>

      {/* Current Location Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          fontSize: "20px",
          fontWeight: "700",
          backgroundColor: "#4B5550",
          height: "45px",
          width: "auto",
          color: "white",
          gap: "6px",
          borderRadius: "6px",
          marginRight: "10px",
        }}
      >
        <GpsFixedIcon style={{ fontSize: "24px" }} />
        <p style={{ fontSize: "16px", margin: 0 }}>Current Location</p>
      </div>

      {/* Profile Icon */}
      <AccountCircleIcon
        style={{ fontSize: "60px", marginLeft: "10px", cursor: "pointer" }}
      />
    </nav>
  );
};

export default Navbar;
