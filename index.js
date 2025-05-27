const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;
const API_KEY = process.env.WEATHER_API_KEY; // Replace with your OpenWeatherMap API key

app.use(bodyParser.urlencoded({ extended: true }));

// HTML form template
const htmlForm = `
<!DOCTYPE html>
<html>
<head>
  <title>Simple Weather App</title>
</head>
<body>
  <h1>Weather App</h1>
  <form action="/" method="post">
    <label for="city">Enter City:</label>
    <input type="text" id="city" name="city" required>
    <button type="submit">Get Temperature</button>
  </form>
  {{weatherInfo}}
</body>
</html>
`;

app.get('/', (req, res) => {
  res.send(htmlForm.replace('{{weatherInfo}}', ''));
});

app.post('/', async (req, res) => {
  const city = req.body.city;
  try {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(apiURL);
    const data = response.data;

    const temp = data.main.temp;
    const weatherInfo = `<p>Temperature in <strong>${data.name}</strong>: ${temp}°C</p>`;
    res.send(htmlForm.replace('{{weatherInfo}}', weatherInfo));
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    res.send(htmlForm.replace('{{weatherInfo}}', `<p style="color:red;">Error: ${message}</p>`));
  }
});

app.listen(PORT, () => {
  console.log(`🌦 Weather app running at http://localhost:${PORT}`);
});
