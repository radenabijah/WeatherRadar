import React from "react";

const FiveDayForecast = ({ forecastData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  // Filter: keep only the first forecast for each day
  const dailyForecast = [];
  const usedDates = new Set();

  for (let item of forecastData.list) {
    const date = item.dt_txt.split(" ")[0];
    if (!usedDates.has(date)) {
      usedDates.add(date);
      dailyForecast.push(item);
    }
    if (dailyForecast.length === 5) break;
  }

  return (
    <div
      style={{
        backgroundColor: "#4B5563",
        color: "white",
        borderRadius: "0.5rem",
        width: "300px",
        padding: "15px",
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "20px",
          borderBottom: "1px solid #9CA3AF",
          paddingBottom: "5px",
        }}
      >
        5 Days Forecast
      </h2>

      {dailyForecast.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: "25px", // increased space
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div style={{ flex: "1", fontSize: "18px", fontWeight: "bold" }}>
            {Math.round(item.main.temp)}°c
          </div>
          <div style={{ flex: "1", fontSize: "16px", fontWeight: "bold" }}>
            {formatDate(item.dt_txt)}
          </div>
          <div
            style={{
              flex: "1.5",
              fontSize: "15px",
              textTransform: "capitalize",
              textAlign: "right",
            }}
          >
            {item.weather[0].description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FiveDayForecast;
