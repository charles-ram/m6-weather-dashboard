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

const currentWeatherSection = function(cityName) {
	fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
		.then(function(response) {
			return response.json();
		})
		.then(function(response) {
			var cityLongitude = response.coord.lon;
			var cityLatitude = response.coord.lat;

			fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
				.then(function(response) {
					return response.json();
				})
				.then(function(response) {
					renderSearchHistory(cityName);

					var currentWeatherContainer = $('current-weather-container');
					currentWeatherContainer.addClass('current-weather-container');

					var currentTitle = $('#current-title');
				})
		})
}