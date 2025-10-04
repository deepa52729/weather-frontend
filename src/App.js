import React, { useState, useEffect } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);

  // fetch weather for entered city
  const fetchWeather = async () => {
    if (!city) return;
    try {
      const res = await fetch(`http://localhost:3000/api/v1/weather?city=${city}`);
      const data = await res.json();
      setWeather(data);
      fetchHistory(); // refresh history after new search
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  };

  // fetch last 5 searches
  const fetchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/history?limit=5`);
      const data = await res.json();
      if (data.history) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  // load history on page load
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial" }}>
      <h1>🌦 Weather Dashboard</h1>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button onClick={fetchWeather} style={{ padding: "8px 16px" }}>
        Search
      </button>

      {weather && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "20px", borderRadius: "10px", display: "inline-block" }}>
          <h2>{weather.city}</h2>
          <p>🌡 Temperature: {weather.temperature} °C</p>
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>☁ Condition: {weather.condition}</p>
          <p>💨 Wind Speed: {weather.windSpeed} m/s</p>
        </div>
      )}

      <h2 style={{ marginTop: "30px" }}>📜 Recent Searches</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {history.map((item) => (
          <li key={item._id} style={{ marginBottom: "10px" }}>
            <b>{item.city}</b> — {item.temperature}°C, {item.condition} ({new Date(item.timestamp).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
