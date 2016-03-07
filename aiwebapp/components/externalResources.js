'use strict';

angular.module('ui-chat-app')
	.factory('weatherInfoResource', function($resource) {
		return $resource('http://api.openweathermap.org/data/2.5/find');
	})

.factory('wikiResources', function($resource) {
	return $resource('https://en.wikipedia.org/w/api.php', {
		action: 'query',
		prop: 'extracts',
		exintro: 'explaintext',
		format: 'json',
		callback: 'JSON_CALLBACK'
	}, {
		get: {
			method: 'JSONP'
		}
	});
})

.factory('externalResourcesService', function($q, weatherInfoResource, wikiResources) {

	var externalResourcesService = {};

	externalResourcesService.getWeatherInfo = function(city) {
		var weatherObject = {
			q: city,
			units: 'metric',
			appid: 'a232c1c0480a53ff51b834e8093462b6'
		};
		return weatherInfoResource.get(weatherObject, {}).$promise;
	};

	externalResourcesService.getInfoFromWiki = function(keyWord) {
		var wikiObject = {
			titles: keyWord
		};
		return wikiResources.get(wikiObject, {}).$promise;
	};

	return externalResourcesService;
});