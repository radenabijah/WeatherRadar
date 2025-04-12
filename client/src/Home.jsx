import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import MainWeather from "./components/MainWeather";
import TodayHighlights from "./components/TodayHighlights";
import FiveDayForecast from "./components/Fiveday"; // Corrected import
import ThreeHourForecast from "./components/ThreeHourForecast";
import axios from "axios";

function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Cebu");
  const [airQualityData, setAirQualityData] = useState(null);
  const [fiveDayForecast, setfiveDayForecast] = useState(null);

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchAirQualityData = (lat, lon) => {
    const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      )
      .then((response) => {
        setAirQualityData(response.data.list[0]);
      })
      .catch((error) =>
        console.error("Error fetching the air quality data:", error)
      );
  };

  const fetchWeatherData = (city) => {
    console.log("weatherData:", weatherData);
    console.log("airQualityData:", airQualityData);
    console.log("fiveDayForecast:", fiveDayForecast);

    const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.cod !== 200) {
          // Handle error gracefully
          console.error("City not found or API error:", data.message);
          setWeatherData(null);
          setAirQualityData(null);
          setfiveDayForecast(null);
          return; // ❌ Exit early to prevent further errors
        }

        // ✅ Proceed only if data is valid
        setWeatherData(data);
        fetchAirQualityData(data.coord.lat, data.coord.lon);
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
          )
          .then((response) => {
            setfiveDayForecast(response.data);
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
    <div>
      <Navbar onSearch={handleSearch} />
      {weatherData && airQualityData && (
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
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
