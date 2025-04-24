import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import MainWeather from "./components/MainWeather";
import TodayHighlights from "./components/TodayHighlights";
import FiveDayForecast from "./components/Fiveday";
import ThreeHourForecast from "./components/ThreeHourForecast";
import axios from "axios";

function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Liloan");
  const [airQualityData, setAirQualityData] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchAirQualityData = (lat, lon) => {
    const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
        { withCredentials: false }
      )
      .then((response) => {
        setAirQualityData(response.data.list[0]);
      })
      .catch((error) =>
        console.error("Error fetching the air quality data:", error)
      );
  };

  const fetchWeatherData = (city) => {
    const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`,
      { withCredentials: false }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.cod !== 200) {
          console.error("City not found or API error:", data.message);
          setWeatherData(null);
          setAirQualityData(null);
          setFiveDayForecast(null);
          return;
        }

        setWeatherData(data);
        fetchAirQualityData(data.coord.lat, data.coord.lon);

        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
          )
          .then((response) => {
            setFiveDayForecast(response.data);
          })
          .catch((error) =>
            console.error("Error fetching the 5-day forecast data:", error)
          );
      })
      .catch((error) =>
        console.error("Error fetching the weather data:", error)
      );
  };

  const handleSearch = (searchedCity) => {
    setCity(searchedCity);
  };

  return (
    <div style={{ position: "relative" }}>
      <Navbar onSearch={handleSearch} />
  
      {/* Always render main layout, but blur it if loading */}
      <div
        style={{
          filter:
            weatherData && airQualityData && fiveDayForecast
              ? "none"
              : "blur(10px)",
          pointerEvents:
            weatherData && airQualityData && fiveDayForecast
              ? "auto"
              : "none",
          transition: "filter 0.3s ease",
        }}
      >
        <div style={{ display: "flex", padding: "30px", gap: "20px" }}>
          <div style={{ flex: "1", marginRight: "10px" }}>
            <MainWeather weatherData={weatherData} />
            {fiveDayForecast && (
              <div style={{ marginTop: "20px" }}>
                <FiveDayForecast forecastData={fiveDayForecast} />
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "0.5",
              gap: "20px",
            }}
          >
            <TodayHighlights
              weatherData={weatherData}
              airQualityData={airQualityData}
            />
            <ThreeHourForecast forecastData={fiveDayForecast} />
          </div>
        </div>
      </div>
  
      {/* Loading Overlay */}
      {!weatherData || !airQualityData || !fiveDayForecast ? (
        <div
          className="loading-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 999,
          }}
        >
          <div className="spinner" />
          <p style={{ marginTop: "15px", color: "white", fontWeight: "bold" }}>
            Warming up WeatherRadar backend...
          </p>
        </div>
      ) : null}
    </div>
  );
  
}

export default Home;
