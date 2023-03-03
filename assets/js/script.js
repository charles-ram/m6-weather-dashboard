// Open Weather API Setup
var apiKey = "4850edb1e38f4b73aa1af8123fd6fe1c";
var previousSearches = [];

// Function to make a list of previous searches
const previousSearchList = function(cityName) {
	$('.past-search:contains("' + cityName + '")').remove();

	//
	let searchEntry = $("<p>");
	searchEntry.addClass('past-search');
	searchEntry.text(cityName);

	//
	let searchEntryContainer = $("<div>");
	searchEntryContainer.addClass('past-search-container');

	//
	searchEntryContainer.append(searchEntry);

	//
	let searchEntryContainerEl = $("#search-history-container");
	searchEntryContainerEl.append(searchEntryContainer);

	if (previousSearches.length > 0) {
		var savedSearches = localStorage.getItem("savedSearches");
		savedSearches = JSON.parse(previousSearches);
	}

	// 
	savedSearches.push(cityName);
	localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

	// Resets the search input
	$("#search-input").val("");

};