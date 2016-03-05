(function() {
	'use strict';
}());

angular.module('ui-chat-app', ['ngResource'])
.config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);