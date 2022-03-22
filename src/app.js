// current date & time
function formatDate() {
  let now = new Date();

  let date = now.getDate();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let year = now.getFullYear();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursady",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];

  let today = `${day}, ${month} ${date}, ${year} ${hours}:${minutes}`;
  return today;
}

let today = document.querySelector("#current-date-time");

today.innerHTML = formatDate();

// display forecasted weather
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forcast-day"> ${formatDayForecast(
          forecastDay.dt
        )} </div>
        <img class="weather-forecast-img" src="https://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" />
        <div class="weather-forecast-temp">
          <span class="weather-forecast-temp-max">${Math.round(
            forecastDay.temp.max
          )}°C</span>
          <span class="weather-forecast-temp-min">${Math.round(
            forecastDay.temp.min
          )}°C</span>
        </div>
      </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

// city into coordinates
function getForecast(coordinates) {
  let apiKey = "f8cd1cfec67de5e9948c7667222d56ff";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// display user submitted city and current weather

function displayWeatherCondition(response) {
  document.querySelector("#selectedCity").innerHTML = response.data.name;
  document.querySelector("#currentTemp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#maxTemp").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#minTemp").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.main.humidity
  );
  document.querySelector("#weatherDescription").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#windSpeed").innerHTML = response.data.wind.speed;
  document
    .querySelector("#weatherMainImage")
    .setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#weatherMainImage")
    .setAttribute(
      "alt",
      `https://openweathermap.org/img/wn/${response.data.weather[0].description}@2x.png`
    );

  celsiusTemperature = response.data.main.temp;

  getForecast(response.data.coord);
}

// add data for default city when opening the page
function search(city) {
  let apiKey = "f8cd1cfec67de5e9948c7667222d56ff";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function submitCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-query").value;
  //call function for city
  search(city);
}

// click on submit button
let searchSubmittedCity = document.querySelector("#city-search-submit-form");
searchSubmittedCity.addEventListener("submit", submitCity);

//fahrenheit - celsius temperature conversion
function displayFahrenheitTemp(event) {
  event.preventDefault();
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let currentTemp = document.querySelector("#currentTemp");
  currentTempinnerHTML = Math.round(fahrenheitTemp);
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#currentTemp");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  currentTemp.innerHTML = Math.round(celsiusTemp);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);

//get current location button
function searchCurrentLocation(position) {
  let apiKey = "f8cd1cfec67de5e9948c7667222d56ff";
  let apiUrlCurrentLoc = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coordinates.lat}&lon=${position.coordinates.long}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherCondition);
  console.log(apiUrlCurrentLoc);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

let current = document.querySelector("#current-location");
current.addEventListener("click", getCurrentLocation);

//choose default city
search("Washington D.C.");
