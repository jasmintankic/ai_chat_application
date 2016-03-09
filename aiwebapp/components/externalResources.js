'use strict';

angular.module('ui-chat-app')
	.factory('weatherInfoResource', function($resource) {
		return $resource('http://api.openweathermap.org/data/2.5/find', {
			units: 'metric',
			appid: 'a232c1c0480a53ff51b834e8093462b6'
		});
	})
	.factory('googleImagesResource', function($resource) {
		return $resource('https://www.googleapis.com/customsearch/v1', {
			imgSize: 'medium',
			searchType: 'image',
			fileType: 'jpg',
			num: 1,
			key: 'AIzaSyCd3pY89Qp9AcXIOX5H82vY5ljq5zGInQM',
			cx: '002902139457744718226:_qpao-l4lsc'
		});
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

.factory('externalResourcesService', function($q, weatherInfoResource, wikiResources, googleImagesResource) {

	var externalResourcesService = {};

	externalResourcesService.getWeatherInfo = function(city) {
		var weatherObject = {
			q: city,
			units: 'metric',
			appid: 'a232c1c0480a53ff51b834e8093462b6'
		};
		return weatherInfoResource.get(weatherObject, {}).$promise;
	};

	externalResourcesService.getRequestedImage = function(image) {
		var imageObject = {
			q: image
		};
		return googleImagesResource.get(imageObject, {}).$promise;
	};

	externalResourcesService.getWeatherInfo = function(city) {
		var weatherObject = {
			q: city
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