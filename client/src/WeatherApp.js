import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
  const [currentCity, setCurrentCity] = useState('Delhi');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [tempUnit, setTempUnit] = useState('C');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [avgTemp, setAvgTemp] = useState(null);
  const [minTemp, setMinTemp] = useState(null);
  const [maxTemp, setMaxTemp] = useState(null);

  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'];
  const apiKey = '48ed01bb564f5b6a1bebbc4c43c23e08';

  const fetchWeatherData = async (city) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
      if (!response.ok) throw new Error('Failed to fetch weather data');

      const data = await response.json();
      const temperature = data.main.temp - 273.15;

      setWeatherData(data);
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString());

      const payload = {
        city,
        temperature,
        day: new Date().toISOString().split('T')[0],
        hourlyTime: new Date().toISOString(),
      };

      try {
        console.log("called!");
        
        const backendResponse = await fetch('http://localhost:5557/climate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!backendResponse.ok) throw new Error('Failed to post weather data to backend');

        const backendData = await backendResponse.json();
        const { avgTemp, minTemp, maxTemp } = backendData;

        setAvgTemp(avgTemp);
        setMinTemp(minTemp);
        setMaxTemp(maxTemp);

        console.log('Weather data successfully posted to backend');
      } catch (backendError) {
        console.error('Error posting weather data to backend:', backendError);
      }

    } catch (fetchError) {
      setError(fetchError.message);
      setWeatherData(null);
    }
  };

  useEffect(() => {
    fetchWeatherData(currentCity);
    const intervalId = setInterval(() => fetchWeatherData(currentCity), 300000);
    return () => clearInterval(intervalId);
  }, [currentCity]);

  const handleTempUnitChange = (unit) => setTempUnit(unit);

  const convertTemperature = (tempK) =>
    tempUnit === 'F' ? ((tempK - 273.15) * 9 / 5 + 32).toFixed(2) : (tempK - 273.15).toFixed(2);

  const formatTimestamp = (timestamp) => new Date(timestamp * 1000).toLocaleTimeString();

  return (
    <section>
      <div className="container">
        <div className="row mt-5 text-center">
          <div className="col-lg-12 fs-1 fw-bold text-dark">Weather Data</div>
        </div>

        <div className="row">
          <div className="col-lg-12 p-5 text-center">
            <div className="btn-group">
              {cities.map((city) => (
                <button
                  key={city}
                  className={`btn btn-outline-dark fw-bold ${currentCity === city ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentCity(city);
                    fetchWeatherData(city);
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="row mb-5">
          <div className="container p-5 feedback-box">
            <h3 className="text-center">{currentCity} Weather Data</h3>

            <div className="row mb-3 text-center">
              <div className="col-lg-12">
                <div className="btn-group">
                  <button
                    className={`btn btn-outline-dark fw-bold ${tempUnit === 'C' ? 'active' : ''}`}
                    onClick={() => handleTempUnitChange('C')}
                  >
                    Celsius
                  </button>
                  <button
                    className={`btn btn-outline-dark fw-bold ${tempUnit === 'F' ? 'active' : ''}`}
                    onClick={() => handleTempUnitChange('F')}
                  >
                    Fahrenheit
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}

            {weatherData && (
              <div className="row text-center align-items-center">
                <div className="col-lg-4 border p-3">
                  <div className="display-6">
                    <i className="fa-solid fa-temperature-full me-2"></i>
                    Temperature: {convertTemperature(weatherData.main.temp)}°{tempUnit}
                  </div>
                  <div className="display-6 mt-3">
                    <i className="fa-solid fa-thermometer-half me-2"></i>
                    Feels Like: {convertTemperature(weatherData.main.feels_like)}°{tempUnit}
                  </div>
                </div>

                <div className="col-lg-4">
                  <h2 className="display-5">
                    <i className="fa-solid fa-cloud me-2"></i>
                    {weatherData.weather[0].main}
                  </h2>
                </div>

                <div className="col-lg-4 border p-3">
                  <div className="display-6">
                    <i className="fa-regular fa-clock me-2"></i>
                    Last Updated: {lastUpdated}
                  </div>
                  <div className="display-6 mt-3">
                    <i className="fa-regular fa-calendar me-2"></i>
                    Data Time: {formatTimestamp(weatherData.dt)}
                  </div>
                </div>
              </div>
            )}

            {weatherData && (
              <div className="row mt-4">
                <div className="col-lg-12 border p-3 d-flex justify-content-between" style={{ fontSize: '1.2rem' }}>
                  <div>Average Temperature: {avgTemp && avgTemp.toFixed(2)}</div>
                  <div>Min Temperature: {minTemp && minTemp.toFixed(2)}</div>
                  <div>Max Temperature: {maxTemp && maxTemp.toFixed(2)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherApp;
