import React, { useState } from "react";

const Weather = () => {
    const [city, setCity] = useState("");
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState(null);
    const API_KEY = "c6802079b5d39e5c79aff926a1ba9d5e"; 

    const handleSearch = async () => {
        if (!city.trim()) {
            setError("Please enter a valid city name.");
            return;
        }

        try {
            setError(null); 

           
            const weatherResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            const weatherData = await weatherResponse.json();

            if (weatherData.cod !== 200) {
                setError(weatherData.message || "Error fetching current weather.");
                setCurrentWeather(null);
                setForecast(null);
                return;
            }

          
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
            );
            const forecastData = await forecastResponse.json();

            if (forecastData.cod !== "200") {
                setError(forecastData.message || "Error fetching forecast.");
                setForecast(null);
                return;
            }

            setCurrentWeather(weatherData);
            setForecast(forecastData);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Unable to fetch weather data. Please try again.");
        }
    };

    return (
        <div className="weather-app">
            <div className="search-section">
                <h1>Weather App</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Enter city name"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>

            {currentWeather && (
                <div className="weather-card">
                    <h2>{currentWeather.name}, {currentWeather.sys?.country || "Unknown"}</h2>
                    <div className="weather-info">
                        <div className="weather-item">
                            <p>Temperature:</p>
                            <h3>{currentWeather.main.temp}°C</h3>
                        </div>
                        <div className="weather-item">
                            <p>Feels Like:</p>
                            <h3>{currentWeather.main.feels_like}°C</h3>
                        </div>
                        <div className="weather-item">
                            <p>Humidity:</p>
                            <h3>{currentWeather.main.humidity}%</h3>
                        </div>
                        <div className="weather-item">
                            <p>Wind Speed:</p>
                            <h3>{currentWeather.wind.speed} m/s</h3>
                        </div>
                    </div>
                    <div className="weather-desc">
                        <p>{currentWeather.weather[0].description}</p>
                        <img
                            src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                            alt="weather-icon"
                        />
                    </div>
                </div>
            )}

            {forecast && (
                <div className="forecast-section">
                    <h2>5-Day Forecast</h2>
                    <div className="forecast-grid">
                        {forecast.list.slice(0, 5).map((item, index) => (
                            <div className="forecast-card" key={index}>
                                <h3>{item.dt_txt.split(" ")[0]}</h3>
                                <p>{item.dt_txt.split(" ")[1]}</p>
                                <p>Temp: {item.main.temp}°C</p>
                                <p>{item.weather[0].description}</p>
                                <img
                                    src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                    alt="forecast-icon"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Weather;