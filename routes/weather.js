// routes/weather.js
const express = require("express");
const router = express.Router();
const request = require("request");

// Show weather search form (Task 4)
router.get("/", (req, res) => {
  res.render("weather_form.ejs");
});

// Handle form submission (Tasks 2–7)
router.post("/", (req, res, next) => {
  const apiKey = process.env.WEATHER_KEY;  // stored in .env
  const city = req.body.city || "London";

  // Build API URL
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function (err, response, body) {
    if (err) {
      console.error("API error:", err);
      return res.send("Error contacting weather service.");
    }

    let weather;
    try {
      weather = JSON.parse(body);
    } catch (parseErr) {
      return res.send("Error reading weather data.");
    }

    // Validate weather output
    if (!weather || !weather.main) {
      return res.send("No weather data found. Try another city.");
    }

    // Human-friendly output (Task 3 + Task 5)
    const msg = `
      <h2>Weather for ${weather.name}</h2>
      <strong>Temperature:</strong> ${weather.main.temp}°C<br>
      <strong>Feels Like:</strong> ${weather.main.feels_like}°C<br>
      <strong>Condition:</strong> ${weather.weather[0].description}<br>
      <strong>Humidity:</strong> ${weather.main.humidity}%<br>
      <strong>Wind:</strong> ${weather.wind.speed} m/s<br>
      <br>
      <a href="/weather">Search again</a><br>
      <a href="/">Return home</a>
    `;

    res.send(msg);
  });
});

module.exports = router;
