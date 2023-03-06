// Open Weather API Setup
var apiKey = "4850edb1e38f4b73aa1af8123fd6fe1c";
var previousSearches = [];

// Function to make a list of previous searches
const previousSearchList = function(cityName) {
	$('.past-search:contains("' + cityName + '")').remove();

	// Creates a entry variable with city name
	let searchEntry = $("<p>");
	searchEntry.addClass('past-search');
	searchEntry.text(cityName);

	// Creates a container for the entry
	let searchEntryContainer = $("<div>");
	searchEntryContainer.addClass('past-search-container');

	// Appends the entry to the container
	searchEntryContainer.append(searchEntry);

	// Appends the entry container to the search history container
	let searchEntryContainerEl = $("#search-history-container");
	searchEntryContainerEl.append(searchEntryContainer);

	if (previousSearches.length > 0) {
		var savedSearches = localStorage.getItem("savedSearches");
		savedSearches = JSON.parse(previousSearches);
	}

	// Adds city name to the array of saved searches
	savedSearches.push(cityName);
	localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

	// Resets the search input
	$("#search-input").val("");

};

// Loads the previous search history entries into the search history container
const renderSearchHistory = function() {
	var savedSearchHistory = localStorage.getItem("savedSearches");

	if (!savedSearchHistory) {
		return false;
	}

	savedSearchHistory =  JSON.parse(savedSearchHistory);

	for (let i = 0; i < savedSearchHistory.length; i++) {
		previousSearchList(savedSearchHistory[i]);
	}
}

// Creates the current weather 
const currentWeatherSection = function(cityName) {
	// Gets data from weather API end point
	fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
		.then(function(response) {
			return response.json();
		})
		.then(function(response) {
			// Gets response for citty long and lat
			var cityLongitude = response.coord.lon;
			var cityLatitude = response.coord.lat;

			fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLatitude}&lon=${cityLongitude}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
			// Gets response and turns it into objects
				.then(function(response) {
					return response.json();
				})
				// Gets data from response and applies them to the current weather section
				.then(function(response) {
					renderSearchHistory(cityName);

					// Adds current weather container with border to page
					var currentWeatherContainer = $('current-weather-container');
					currentWeatherContainer.addClass('current-weather-container');

					// Adds city name, date, and weather icon to current weather section title
					var currentTitle = $('#current-title');
					var currentDay = moment().format("M/D/YYYY");
					currentTitle.text(`${cityName} (${currentDay})`);
					var currentIcon = $('#current-weather-icon');
					currentIcon.addClass('current-weather-icon');
					var currentIconCode = response.current.weather[0].icon;
					currentIcon.attr('src', `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);

					// Current temp
					var currentTemp = $('#current-temperature');
					currentTemp.text('Temperature: ' + response.current.temp + ' \u00B0F');

					// Current humidity
					var currentHumidity = $('#current-humidity');
					currentHumidity.text('Humidity: ' + response.current.humidity + '%');

					// Current wind speed
					var currentWindSpeed = $('#current-wind-speed');
					currentWindSpeed.text('Wind Speed: ' + response.current.wind_speed + 'MPH');

					// Current UV index
					var currentUvIndex = $('#current-uv-index');
					currentUvIndex.text("UV Index: ");
					var currentNumber = $('#current-number');
					currentNumber.text(response.current.uvi);

					// Adds the correct color for the UV index number
					if (response.current.uvi <= 2) {
						currentNumber.addClass('favorable');
					} else if (response.current.uvi >= 3 && response.current.uvi <= 7) {
						currentNumber.addClass('moderate');
					} else {
						currentNumber.addClass('severe');
					}
				});
		})
		.catch(function(err) {
			// Resets the search input
			$('#search-input').val('');

			// Alerts the user of error
			alert("We could not find the city you search for. Try something else.")
		});
};

const fiveDayForecastSection = function(cityName) {
	fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
		.then(function(response) {
			return response.json();
		})
		.then(function(response) {
			var cityLongitude = response.coord.lon;
			var cityLatitude = response.coord.lat;

			fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLatitude}&lon=${cityLongitude}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
				.then(function(response) {
					return response.json();
				})
				.then(function(response) {
					console.log(repsonse) 

					// 5 day forecast title
					var futureForecastTitle = $('#future-forecast-title');
					futureForecastTitle.text("5-Day Forecast");

					// Uses data from response to set up each day of 5 day forecast
					for (let i = 1; i <= 5; i++) {
						// Adds class to future cards
						var futureCard = $('.future-card');
						futureCard.addClass('future-card-details');

						// Adds date
						var futureDate = $('#future-date-' + i);
						date = moment().add(i, "d").format("M/D/YYYY");
						futureDate.text(date);

						// Adds icon
						var futureIcon = $('#future-icon-' + i);
						futureIcon.addClass('#future-icon');
						var futureIconCode = response.daily[i].weather[0].icon;
						futureIcon.attr('src', `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`);

						// Adds temperature
						var futureTemp = $('#future-temp-' + i);
						futureTemp.text("Temperature: " + response.daily[i].temp.day + " \u00B0F");
						
						// Adds humidity
						var futureHumidity = $('#future-humidity-' + i);
						futureHumidity.text("Humidity: " = response.daily[i].humidty + "%");
					}
				});
		});
};

// Called when search form is submitted
$('#search-form').on('submit', function() {
	event.preventDefault();

	var cityName = $('#search-input').val();

	if (cityName === "" || cityName == null) {
		// Alerts if empty search
		alert("Please enter a city.");
		event.preventDefault();
	} else {
		// Adds cityName to search history list and displays its weather conditions
		currentWeatherSection(cityName);
		fiveDayForecastSection(cityName);
	}
});

// Called when search hitory entry is clicked
$('#search-history-container').on('click', "p", function() {
	var previousCityName = $(this).text();
	currentWeatherSection(previousCityName);
	fiveDayForecastSection(previousCityName);

	var previousCityClicked = $(this);
	previousCityClicked.remove();
});

renderSearchHistory();