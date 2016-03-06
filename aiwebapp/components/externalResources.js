'use strict';

angular.module('ui-chat-app')
	.factory('weatherInfoResource', function($resource) {
		return $resource('http://api.openweathermap.org/data/2.5/find');
	})

	.factory('externalResourcesService', function($q, weatherInfoResource) {

		var externalResourcesService = {};

		externalResourcesService.getWeatherInfo = function(city) {
			var weatherObject = {
				q: city,
				units: 'metric',
				appid: 'a232c1c0480a53ff51b834e8093462b6'
			};
			return weatherInfoResource.get(weatherObject,{}).$promise;
		};

		return externalResourcesService;
	});
