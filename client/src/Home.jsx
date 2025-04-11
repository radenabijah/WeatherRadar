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
    const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
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
        );
      });
  };

  const handleSearch = (searchedCity) => {
    setCity(searchedCity);
  };

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      {weatherData && airQualityData && (
  <div className="weather-layout">
    <div className="weather-left">
      <MainWeather weatherData={weatherData} />
    </div>
    <div className="weather-right">
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
