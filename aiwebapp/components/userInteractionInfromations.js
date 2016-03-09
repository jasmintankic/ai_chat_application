(function() {
    'use strict';

    angular
        .module('ui-chat-app')
        .factory('interactionInformations', interactionInformations);

    function interactionInformations(externalResourcesService) {
        var interactionService = {
            setUserName: setUserName,
            getUserName: getUserName,
            getRealName: getRealName,
            checkIfUserChangedName: checkIfUserChangedName,
            getKeywordFromQuestion: getKeywordFromQuestion,
            checkIfAskedForThat: checkIfAskedForThat
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

        function checkIfAskedForThat(askedValue, askedValues) {
            var asked = false;
            angular.forEach(askedValues, function(value){
                if(askedValue === value) {
                    asked = true;
                }
            });
            return asked;
        }

        function getKeywordFromQuestion(message, key, seperator) {
            var keyWord = message.lastIndexOf(key);
            var targetWord = message.substring(keyWord + seperator);
            return targetWord;
        };

    }

})();