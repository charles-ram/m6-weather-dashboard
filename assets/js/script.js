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