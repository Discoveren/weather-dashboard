/* GLOBAL VARIABLES */
// Fill city array with whats in local storage or give me an empty array
const cities = JSON.parse(localStorage.getItem('cities')) || [];
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

  
  // create a span element to hold temperature data
  const temperatureEl = document.createElement('span');
  // set the text content. NOTE: \u00B0 is the unicode character for the degree symbol
  temperatureEl.textContent = 'Temperature: ' + weather.main.temp + '\u00B0 F';
  // set class list
  temperatureEl.classList = 'list-group-item';
  // append to city search input
  citySearchInputEl.appendChild(temperatureEl);

  // create a span element for humidity
  const humidityEl = document.createElement('span');
  // set the text content
  humidityEl.textContent = 'Humidity: ' + weather.main.humidity + '%';
  // set the class
  humidityEl.classList = 'list-group-item';
  // append to city search input
  citySearchInputEl.appendChild(humidityEl);

  // create a span element for wind speed
  const windSpeedEl = document.createElement('span');
  // set text content
  windSpeedEl.textContent = 'Wind Speed: ' + weather.wind.speed + 'MPH';
  // set the class
  windSpeedEl.classList = 'list-group-item';
  // append to city search input
  citySearchInputEl.appendChild(windSpeedEl);

  const lat = weather.coord.lat;
  const lon = weather.coord.lon;
  // call the function to get the uv index
  getUvIndex(lat, lon);
  fiveDay(lat, lon);
};

// function to get the uv index
const getUvIndex = (lat, lon) => {
  // reference the api URL
  const curUvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  // fetch the API data
  fetch(curUvUrl).then(response => {
    // convert response to json
    response.json().then(data => {
      // displayUvIndex(data)
      displayUvIndex(data);
    });
  });
};

// Function to display the UV index
const displayUvIndex = index => {
  // define the uv index
  const uvi = index.current.uvi;

  // create a div to store the uv index value. Need this for spacing
  const uvContainer = document.createElement('div');
  // add text content
  uvContainer.textContent = 'UV Index: ';
  // add class list
  uvContainer.classList = 'list-group-item';

  // create a span element for the uv index value
  const uvIndexEl = document.createElement('span');
  uvIndexEl.textContent = uvi;

  // apply UV colors based on if uvi is favorable (1-2), moderate (2-7) or severe (>7)
  if (uvi < 2) {
    uvIndexEl.classList = 'favorable';
  } else if (uvi > 2 && uvi < 7) {
    uvIndexEl.classList = 'moderate';
  } else {
    uvIndexEl.classList = 'severe';
  }

  uvContainer.appendChild(uvIndexEl);
  // append to the citySearchInput container
  citySearchInputEl.appendChild(uvContainer);
};

// Grab the 5 day weather forecast
const fiveDay = (lat, lon) => {
  // reference the api URL
  const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  // fetch the API data
  fetch(forecastUrl).then(response => {
    // convert response to json
    response.json().then(data => {
      // displayUvIndex(data)
      displayFiveDay(data);
    });
  });
};

// Function to display 5 day weather forecast
const displayFiveDay = forecast => {
  // clear old content
  forecastContainerEl.textContent = '';
  forecastTitleEl.textContent = '5-Day Forecast:';

  // define the forecast list
  const forecastData = forecast.daily;

  // make a loop for the 5 day forecast.
  // since there are 8 arrays under daily forecast, set i < 5 to get 5 arrays
  for (let i = 0; i < 5; i++) {
    // variable to get daily forecasts by iterating through the weather conditions array
    const dailyForecast = forecastData[i];
    // make a container to hold the forcast values
    const forecastDataEl = document.createElement('div');
    // style the container
    forecastDataEl.classList = 'card col-md-2 m-1 py-3 bg-primary text-white';

    // create a date element. Use an `<h4> to make it larger.
    const forecastDate = document.createElement('h4');
    // create the date using moment.js. .unix describes a specific point in time. Without it, the date would be in 1970
    forecastDate.textContent = moment.unix(dailyForecast.dt).format('L');
    // style the date
    forecastDate.classList =
      'card-header border-style d-flex flex-nowrap justify-content-center';
    // append to the forecast data container
    forecastDataEl.appendChild(forecastDate);

    // create an image element to hold the icon
    const weatherIcon = document.createElement('img');
    // reference the icon
    weatherIcon.setAttribute(
      'src',
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );
    // style the icon
    weatherIcon.classList = 'card-body text-center';
    // append to the forecast data container
    forecastDataEl.appendChild(weatherIcon);

    // create a span element to hold the temperature
    const temperature = document.createElement('div');
    // set text content. NOTE \u00B0 is the unicode character for the degree symbol
    temperature.textContent = 'Temp: ' + dailyForecast.temp.day + '\u00B0 F';
    // style the temperature
    temperature.classList = 'card-body text-center';
    // apend to the forecast data container
    forecastDataEl.appendChild(temperature);

    // create a span element to hold wind
    const windSpeed = document.createElement('div');
    // set the text content
    windSpeed.textContent = 'Wind Speed: ' + dailyForecast.wind_speed + 'MPH';
    // style the wind speed
    windSpeed.classList = 'card-body text-center';
    // append to the forecast data container
    forecastDataEl.appendChild(windSpeed);

    // create a span element for humidity
    const humidity = document.createElement('div');
    // set the text content
    humidity.textContent = 'Humidity: ' + dailyForecast.humidity + '%';
    // style the humidity
    humidity.classList = 'card-body text-center';
    // append to the forecast data container
    forecastDataEl.appendChild(humidity);

    // append the data to its container
    forecastContainerEl.appendChild(forecastDataEl);
  }
};

// Function when user submits form
const formSubmitHandler = event => {
  // stop the page from refreshing
  event.preventDefault();

  currentWeatherEl.innerHTML = '';

  const city = userInputEl.value.trim();
  // If the user did input a city
  if (city) {
    // pass that value to the current weather and 5 day forecasts
    currentWeather(city);

    // clear the city the user input
    userInputEl.value = '';
  } else {
    errorEl.innerHTML = `<h3 class="card-title text-center text-danger">Please type in a valid city</h3>`;
  }
};

const buttonSubmitHandler = city => {
  // if the city isnt an index of the cities array (-1)
  if (cities.indexOf(city) === -1) {
    // putting the search city into the cities array
    cities.push(city);
    // save the cities array to session storage (reset on refresh)
    localStorage.setItem('cities', JSON.stringify(cities));
  }
  // on page load, run function with city
  localStorage.setItem('lastCity', city);
  buildMenu();
};

// Make buttons for past searches
const buildMenu = () => {
  // clear the last buttons saved
  pastSearchBtnEl.innerHTML = '';
  // for each city in local storage
  cities.forEach(city => {
    // create a button
    const cityButton = document.createElement('button');
    // set the text content to the user input
    cityButton.textContent = city;
    cityButton.onclick = () => {
      currentWeather(city);
      fiveDay(city);
    };
    // style the button
    cityButton.classList = 'btn btn-secondary w-100 my-2 text-capitalize';

    // insert the button as the first button in the pastSearchEl container
    pastSearchBtnEl.prepend(cityButton);
  });
};

/* CLICK EVENTS */
// Search button submit event to save city
userFormEl.addEventListener('submit', formSubmitHandler);

// on page load run city function
currentWeather(localStorage.getItem('lastCity'));