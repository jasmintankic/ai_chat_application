(function() {
    'use strict';

    angular
        .module('ui-chat-app')
        .factory('interactionInformations', interactionInformations);

    function interactionInformations() {
        var interactionService = {
            setUserName: setUserName,
            getUserName: getUserName,
            getRealName: getRealName,
            checkIfUserChangedName: checkIfUserChangedName
        };

        var userInfo = {};

        return interactionService;

        ////////////////

        function setUserName(name) {
            if (userInfo['name'] == null) {
                userInfo['name'] = name;
                userInfo['realName'] = name;
            } else {
                userInfo.name = name;
            }
        }

        function checkIfUserChangedName (name) {
            if(name !== userInfo.realName) {
                return true;
            } else {
                return false;
            }
        }

        function getUserName() {
            return userInfo.name;
        }

        function getRealName() {
            return userInfo.realName;
        }
    }

})();