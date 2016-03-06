(function() {
    'use strict';

    angular
        .module('ui-chat-app')
        .factory('wikiService', function($http) {
    var wikiService = {
        get: function(keyword) {
            return $http.jsonp('https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + keyword.name + '&callback=JSON_CALLBACK');
        }
    };

    return wikiService;

})

.controller('aiChatBrain', function($scope, wikiService) {
    wikiService.get({name: 'Sarajevo'}).then(function(data) {
    console.log(data.data);
    });

});

})();
