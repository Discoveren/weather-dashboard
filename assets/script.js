/* GLOBAL VARIABLES */
// Fill city array with whats in local storage or give me an empty array
const cities = JSON.parse(localStorage.getItem(cities)) || [];
const lastCity = localStorage.getItem('lastCity');
// Reference your API key. The API  is your unique id associated with your OpenWeatherMap account
const apiKey = `be1c4197e685d2ef51ea797c1a5447f4`;

// HTML references
// Reference the form
const userFormEl = document.getElementById('city-form');
// Reference the input box
const userInputEl = document.getElementById('city-input');
// Reference to the <h2> that will store the city the user inputted
const citySearchInputEl = document.getElementById('searched-city');
// Reference error messages
const errorEl = document.getElementById('error-message');
// Reference the container where the weather info will be stored
const currentWeatherEl = document.getElementById('current-weather-container');
// Reference to the five day forecast container
const forecastContainerEl = document.getElementById('forecast-container');
// Reference to the title of the five day forecast
const forecastTitleEl = document.getElementById('forecast-title');
// Reference the submit button
const pastSearchBtnEl = document.getElementById('past-search-buttons');

/* FUNCTIONS */
// Grab the current weather data
const currentWeather = city => {
  // define the OpenWeatherMap API URL. Query string starts at `?`. Units=imperial displays the temperature in F
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  // pass the API's URL to the fetch method to return a promise containing a response object
  fetch(apiUrl)
    .then(response => {
      errorEl.innerHTML = '';
      // request was successful
      if (response.ok) {
        // put the desired data (data) into json format(json()) to get a response we can use.
        // this returns another promise which, when fulfilled, will let the data be available for manipulation
        response.json().then(weather => {
          displayCurrentWeather(weather, city);
        });

        buttonSubmitHandler(city);
        // request fails
      }
      if (!response.ok) {
        errorEl.innerHTML = `<h3 class="card-title text-center text-danger">OpenWeather was unable to find ${city}, please try again</h3>`;
      }
    })

    // alert user if there is no response from OpenWeather
    .catch(() => {
      errorEl.innerHTML = `<h3>Unable to connect to OpenWeather</h3>`;
    });
};

// Function to display current weather
const displayCurrentWeather = (weather, city) => {
  // clear old content
  currentWeatherEl.innerHTML = '';
  citySearchInputEl.textContent = city;
  // Make sure the first letter of the city is capitalized
  citySearchInputEl.classList = 'text-capitalize';

  // create date element using moments.js. Use span to make it inline
  const currentDate = document.createElement('span');
  // set text content using moments.js
  currentDate.textContent = ' (' + moment(weather.dt.value).format('L') + ') ';
  citySearchInputEl.appendChild(currentDate);

  // create an image element
  const weatherIcon = document.createElement('img');
  // set the source
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  // append to city search input
  citySearchInputEl.appendChild(weatherIcon);