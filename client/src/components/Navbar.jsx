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
    <nav className="navbar">
  <div className="navbar-left">
    <img src="/weather-news.png" alt="WeatherRadar Logo" className="logo" />
    <p className="brand">WeatherRadar</p>
  </div>

  <div className="navbar-center">
    <TextField
      placeholder="Search city"
      variant="outlined"
      value={searchCity}
      onChange={(e) => setSearchCity(e.target.value)}
      className="search-input"
      InputProps={{ style: { backgroundColor: "white", borderRadius: "2rem" } }}
    />
    <Button
      variant="contained"
      onClick={handleSearchClick}
      className="search-button"
    >
      Search
    </Button>
  </div>

  <div className="navbar-right">
    <GpsFixedIcon style={{ fontSize: "24px" }} />
    <p className="current-location">Current Location</p>
  </div>
</nav>

  );
};

export default Navbar;
