import React from "react";

const ThreeHourForecast = ({ forecastData }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get only the next 6 forecasts (18 hours ahead, 3-hour intervals)
  const nextSixForecasts = forecastData.list.slice(0, 6);

  return (
    <div
      style={{
        backgroundColor: "#4B5563",
        color: "white",
        borderRadius: "0.5rem",
        padding: "15px",
        width: "830px",
        marginLeft: "-50px",
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
        3-Hour Forecast
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        {nextSixForecasts.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#374151",
              borderRadius: "8px",
              padding: "10px",
              width: "calc(33% - 10px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "6px",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "16px" }}>
              {formatTime(item.dt_txt)}
            </div>
            <div style={{ fontSize: "14px" }}>
              {Math.round(item.main.temp)}°C
            </div>
            <div
              style={{
                fontSize: "13px",
                textTransform: "capitalize",
                color: "#E5E7EB",
              }}
            >
              {item.weather[0].description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreeHourForecast;
