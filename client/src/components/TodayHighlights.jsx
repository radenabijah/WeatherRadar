import React from "react";

const TodayHighlights = ({ weatherData, airQualityData }) => {
  const { main, wind, visibility, sys } = weatherData || {};
  const airQualityIndex = airQualityData?.main?.aqi;
  const { co, no, no2, o3 } = airQualityData?.components || {};

  return (
    <div
      style={{
        backgroundColor: "#4B5563",
        color: "white",
        width: "840px",
        borderRadius: "0.5rem",
        padding: "30px",
      }}
    >
      <div style={{ fontSize: "20px" }}>Today's Highlights</div>
    </div>
  );
};

export default TodayHighlights;
