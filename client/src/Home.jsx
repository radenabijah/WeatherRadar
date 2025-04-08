import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import MainWeather from "./components/MainWeather";
import TodayHighlights from "./components/TodayHighlights";
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
    const API_KEY = "f7b40973400151ea978b452ce85efaea";
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
    const API_KEY = "f7b40973400151ea978b452ce85efaea";
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
        console.log(JSON.stringify(data));
        fetchAirQualityData(data.coord.lat, data.coord.lon);
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        )
      });
  };

  const handleSearch = (searchedCity) => {
    setCity(searchedCity);
  };

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      {weatherData && airQualityData &&(
        <div style={{ display: "flex", padding: "30px", gap: "20px" }}>
          <div style={{ flex: "1", marginRight: "10px" }}>
            <MainWeather weatherData={weatherData} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: "0.5", gap: "20px" }}>
          <TodayHighlights weatherData={weatherData} airQualityData={airQualityData}  />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
