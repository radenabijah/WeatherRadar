import AirIcon from "@mui/icons-material/Air";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import HighlightBox from "./Highlightbox"; // Ensure this import is correct
import VisibilityIcon from "@mui/icons-material/Visibility";
import CompressIcon from "@mui/icons-material/Compress";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";

const TodayHighlights = ({ weatherData, airQualityData }) => {
  if (!weatherData || !airQualityData) {
    return <div>Loading highlights...</div>;
  }

  const { main, wind, visibility, sys } = weatherData;
  const airQualityIndex = airQualityData?.main?.aqi;
  const { co, no, no2, o3 } = airQualityData?.components || {};

  const renderAirQualityDescription = (aqi) => {
    switch (aqi) {
      case 1:
        return "Good";
      case 2:
        return "Fair";
      case 3:
        return "Moderate";
      case 4:
        return "Poor";
      case 5:
        return "Very Poor";
      default:
        return "Unknown";
    }
  };

  const getAQIColor = (aqi) => {
    switch (aqi) {
      case 1:
        return "green";
      case 2:
        return "yellowgreen";
      case 3:
        return "orange";
      case 4:
        return "red";
      case 5:
        return "purple";
      default:
        return "gray";
    }
  };

  const formatTime = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const highlights = [
    { title: "Humidity", value: `${main.humidity}%`, Icon: InvertColorsIcon },
    {
      title: "Pressure",
      value: `${main.pressure} hPa`,
      Icon: CompressIcon,
    },
    {
      title: "Visibility",
      value: `${visibility / 1000} km`,
      Icon: VisibilityIcon,
    },
    {
      title: "Feels Like",
      value: `${main.feels_like}°C`,
      Icon: DeviceThermostatIcon,
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#4B5563",
        color: "white",
        width: "100%", // instead of 840px
        borderRadius: "0.5rem",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: "20px" }}>Today's Highlights</div>
      <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
        {/* Air Quality Box */}
        <div
          style={{
            backgroundColor: "#374151",
            color: "white",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginTop: "11px",
            width: "370px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "22px",
            }}
          >
            <p>Air Quality Index</p>
            <div
              style={{
                marginTop: "1rem",
                fontSize: "16px",
                fontWeight: "700",
                backgroundColor: getAQIColor(airQualityIndex),
                height: "20px",
                width: "70px",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {renderAirQualityDescription(airQualityIndex)}
            </div>
          </div>
          <AirIcon style={{ fontSize: "35px", marginTop: "10px" }} />
          <div
            style={{
              marginTop: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
            }}
          >
            <div>
              <p style={{ fontWeight: "bold" }}>CO</p>
              <p>{co} µg/m³</p>
            </div>
            <div>
              <p style={{ fontWeight: "bold" }}>NO</p>
              <p>{no} µg/m³</p>
            </div>
            <div>
              <p style={{ fontWeight: "bold" }}>NO₂</p>
              <p>{no2} µg/m³</p>
            </div>
            <div>
              <p style={{ fontWeight: "bold" }}>O₃</p>
              <p>{o3} µg/m³</p>
            </div>
          </div>
        </div>

        {/* Sunrise & Sunset Box */}
        <div
          style={{
            backgroundColor: "#374151",
            color: "white",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginTop: "11px",
            width: "385px",
          }}
        >
          <div style={{ fontSize: "22px" }}>
            <p>Sunrise And Sunset</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
              }}
            >
              <div>
                <WbSunnyIcon style={{ fontSize: "40px", marginLeft: "30px" }} />
                <p style={{ fontSize: "25px", marginLeft: "20px" }}>
                  {formatTime(sys.sunrise)}
                </p>
              </div>
              <div>
                <NightsStayIcon
                  style={{ fontSize: "40px", marginRight: "35px" }}
                />
                <p style={{ fontSize: "25px", marginRight: "50px" }}>
                  {formatTime(sys.sunset)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Highlights */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginTop: "10px",
          flexWrap: "wrap",
        }}
      >
        {highlights.map((highlight, index) => (
          <HighlightBox
            key={index}
            title={highlight.title}
            value={highlight.value}
            Icon={highlight.Icon}
          />
        ))}
      </div>
    </div>
  );
};

export default TodayHighlights;
