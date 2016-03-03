(function() {
    'use strict';

    angular
        .module('ui-chat-app')
        .factory('comunicationService', comunicationService);

    function comunicationService(speechDatabase, interactionInformations) {
        var speechService = {
            processAnswer: processAnswer
        };

        var AiResponse,
            specificResponses = speechDatabase.specificResponses,
            globalResponses = speechDatabase.globalResponses;

        return speechService;

        ////////////////

        function processAnswer(message, isInit) {
            AiResponse = '';

            checkIfAskedForName(message);
            checkIfUserToldName(message);

            if (_.isEmpty(AiResponse) && !isInit) {
                AiResponse = _.sample(globalResponses.questionNotDefinedProperly);
            } else if (isInit) {
                AiResponse = _.sample(globalResponses.welcome);
            }

            return AiResponse;
        }

        function checkIfAskedForName(message) {
            var askedFornameValidator = 0;

            angular.forEach(specificResponses.nameObject.keys, function(value) {
                if (message.indexOf(value) >= 0) {
                    askedFornameValidator++;
                }
            });

            if (askedFornameValidator === specificResponses.nameObject.askedTrigger) {
                if (specificResponses.nameObject.isAsked > 0) {
                    AiResponse = _.sample(specificResponses.nameObject.alreadyAskedResponse);
                } else if(_.isEmpty(interactionInformations.getUserName())) {
                    AiResponse = _.sample(specificResponses.nameObject.response);
                } else if (!_.isEmpty(interactionInformations.getUserName())) {
                    AiResponse = _.sample(specificResponses.nameObject.response).replace(', may i know your name?','.');
                }
                specificResponses.nameObject.isAsked++;
            }
        };

        function checkIfUserToldName(message) {
            var userToldNameValidator = 0;

            angular.forEach(specificResponses.userNameObject.keys, function(value) {
                if (message.indexOf(value) >= 0) {
                    userToldNameValidator++;
                }
            });

            if (userToldNameValidator === specificResponses.userNameObject.askedTrigger) {
                
                var keyWord = message.lastIndexOf('is');
                var name = message.substring(keyWord + 3);
                interactionInformations.setUserName(name);

                if (specificResponses.userNameObject.isAsked > 0) {
                    AiResponse = _.sample(specificResponses.userNameObject.alreadyAskedResponse).replace('USER_NAME',interactionInformations.getUserName());
                } else {
                    AiResponse = _.sample(specificResponses.userNameObject.response).replace('USER_NAME',interactionInformations.getUserName());
                }
                specificResponses.userNameObject.isAsked++;
            }
        };
    }

})();