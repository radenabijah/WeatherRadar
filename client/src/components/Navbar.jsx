import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";

const Navbar = ({ onSearch }) => {
  const [searchCity, setSearchCity] = useState("");

  const handleSearchClick = () => {
    if (searchCity.trim()) {
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


      {/* Search input and button */}
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

      {/* Current Location Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "700",
          backgroundColor: "#4B5550",
          height: "45px",
          width: "180px",
          color: "white",
          gap: "6px",
          borderRadius: "6px",
        }}
      >
        <GpsFixedIcon style={{ fontSize: "24px", verticalAlign: "middle" }} />
        <p style={{ fontSize: "16px", margin: 0, lineHeight: 1 }}>
          Current Location
        </p>
      </div>
    </nav>
  );
};

export default Navbar;