import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = ({ onSearch }) => {
  const [searchCity, setSearchCity] = useState("");
  const [error, setError] = useState("");

  const handleSearchClick = () => {
    const isValid = /^[a-zA-Z\s]+$/.test(searchCity.trim()); // letters and spaces only

    if (!searchCity.trim()) {
      setError("Please enter a city or country.");
    } else if (!isValid) {
      setError("Search must only contain letters and spaces.");
    } else {
      setError(""); // clear any previous errors
      onSearch(searchCity);
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
      {/* Logo */}
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

      {/* Search + Error Message */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
            error={!!error}
            helperText={error}
          />
          <Button
            variant="contained"
            onClick={handleSearchClick}
            style={{ borderRadius: "6px", backgroundColor: "#4B5550" }}
          >
            Search
          </Button>
        </div>
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
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <GpsFixedIcon style={{ fontSize: "24px", verticalAlign: "middle" }} />
          <p style={{ fontSize: "16px", margin: 0, lineHeight: 1 }}>
            Current Location
          </p>
        </div>
      </div>

      {/* Profile Icon */}
      <AccountCircleIcon
        style={{ fontSize: "60px", marginLeft: "10px", cursor: "pointer" }}
      />
    </nav>
  );
};

export default Navbar;
