import React from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import CloudIcon from "@mui/icons-material/Cloud";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const MainWeather = ({ weatherData }) => {
  const temperatureCelsius = weatherData?.main?.temp || "N/A";
  const weatherDDescription = weatherData?.weather?.[0]?.description || "N/A";
  const cityName = weatherData?.name || "city not available";
  const countryName = weatherData?.sys?.country || "country not available";
  const timestamp = weatherData?.dt || null;

  const currentDate = timestamp
    ? new Date(timestamp * 1000).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
      })
    : "Date not available";

  const renderTemperatureIcon = () => {
    if (temperatureCelsius > 23) {
      return (
        <WbSunnyIcon
          style={{ marginLeft: "10px", fontSize: "3rem", color: "orange" }}
        />
      );
    } else if (temperatureCelsius < 10) {
      return (
        <AcUnitIcon
          style={{ marginLeft: "10px", fontSize: "3rem", color: "blue" }}
        />
      );
    } else {
      return (
        <CloudIcon
          style={{ marginLeft: "10px", fontSize: "3rem", color: "white" }}
        />
      );
    }
  };

  return (
    <div className="main-weather-card">
      <div className="weather-title">Now</div>
      <div className="weather-temp">
        {temperatureCelsius}°C
        {renderTemperatureIcon()}
      </div>
      <div className="weather-desc">{weatherDDescription}</div>
      <div className="weather-meta">
        <div className="weather-meta-item">
          <CalendarMonthIcon />
          {currentDate}
        </div>
        <div className="weather-meta-item">
          <LocationOnIcon />
          {cityName}, {countryName}
        </div>
      </div>
    </div>
  );
};

export default MainWeather;
