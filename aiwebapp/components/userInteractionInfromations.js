(function() {
    'use strict';

    angular
        .module('ui-chat-app')
        .factory('interactionInformations', interactionInformations);

    function interactionInformations() {
        var interactionService = {
            setUserName: setUserName,
            getUserName: getUserName
        };

        var userInfo = {};

        return interactionService;

        ////////////////

        function setUserName(name) {
            if (userInfo['name'] == null) {
                userInfo['name'] = name;
            }
        }

        function getUserName() {
            return userInfo.name;
        }
    }

})();