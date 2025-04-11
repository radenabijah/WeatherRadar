import AirIcon from "@mui/icons-material/Air";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import HighlightBox from "./Highlightbox";
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
    <div className="today-highlights">
      <div className="section-title">Today's Highlights</div>

      {/* Air Quality Box */}
      <div className="highlight-cards-container">
        <div className="highlight-card air-quality">
          <div className="highlight-card-header">
            <p>Air Quality Index</p>
            <div
              className="aqi-badge"
              style={{ backgroundColor: getAQIColor(airQualityIndex) }}
            >
              {renderAirQualityDescription(airQualityIndex)}
            </div>
          </div>
          <AirIcon className="highlight-icon" />
          <div className="air-quality-grid">
            <div><p className="label">CO</p><p>{co} µg/m³</p></div>
            <div><p className="label">NO</p><p>{no} µg/m³</p></div>
            <div><p className="label">NO₂</p><p>{no2} µg/m³</p></div>
            <div><p className="label">O₃</p><p>{o3} µg/m³</p></div>
          </div>
        </div>

        {/* Sunrise & Sunset Box */}
        <div className="highlight-card">
          <p className="highlight-subtitle">Sunrise and Sunset</p>
          <div className="flex space-between p-2">
            <div>
              <WbSunnyIcon className="highlight-icon" />
              <p className="highlight-value">{formatTime(sys.sunrise)}</p>
            </div>
            <div>
              <NightsStayIcon className="highlight-icon" />
              <p className="highlight-value">{formatTime(sys.sunset)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Other Highlights */}
      <div className="highlight-box-grid">
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
