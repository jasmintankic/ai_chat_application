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

            proceedWithAnswers(message);

            if (_.isEmpty(AiResponse) && !isInit) {
                AiResponse = _.sample(globalResponses.questionNotDefinedProperly);
            } else if (isInit) {
                AiResponse = _.sample(globalResponses.welcome);
            }

            return AiResponse;
        }

        function proceedWithAnswers(message) {
            checkIfAskedForName(message);
            checkIfUserToldName(message);
            checkIfAskedForWeather(message);
            checkForSimpleQuestion(message, specificResponses.greetingsObject);
        }

        function checkForSimpleQuestion(message, questionObject) {
            var simpleQuestionValidator = 0;

            angular.forEach(questionObject.keys, function(value) {
                if (message.indexOf(value) >= 0) {
                    simpleQuestionValidator++;
                }
            });

            if (simpleQuestionValidator === questionObject.askedTrigger) {
                if (questionObject.isAsked > 0) {
                    AiResponse = _.sample(questionObject.alreadyAskedResponse);
                } else {
                    AiResponse = _.sample(questionObject.response);
                }
                questionObject.isAsked++;
            }

        }

        function checkIfAskedForWeather(message) {
            var askedForWeatherValidator = 0;
            angular.forEach(specificResponses.weatherObject.keys, function(value) {
                if (message.indexOf(value) >= 0) {
                    askedForWeatherValidator++;
                }
            });
            if (askedForWeatherValidator === specificResponses.weatherObject.askedTrigger) {
                var requestedCity = interactionInformations.getKeywordFromQuestion(message, specificResponses.weatherObject.keywordSeperator, 3);
                if (interactionInformations.checkIfAskedForCity(requestedCity, specificResponses.weatherObject.askedCities)) {
                    AiResponse = _.sample(specificResponses.weatherObject.alreadyAskedResponse).replace('REQUESTED_CITY', requestedCity);
                } else {
                    specificResponses.weatherObject.askedCities.push(requestedCity);
                    AiResponse = interactionInformations.getWeatherInCity(requestedCity, specificResponses.weatherObject.response);
                }
            }
        };


        function checkIfAskedForName(message) {
            var askedFornameValidator = 0;

            angular.forEach(specificResponses.nameObject.keys, function(value) {
                if (message.indexOf(value) >= 0) {
                    askedFornameValidator++;
                }
            });

            if (askedFornameValidator === specificResponses.nameObject.askedTrigger) {
                if (specificResponses.nameObject.isAsked > 0) {
                    if (interactionInformations.checkIfUserChangedName(interactionInformations.getUserName())) {
                        AiResponse = _.sample(specificResponses.nameObject.refuseToSpeakAboutNames);
                    } else {
                        AiResponse = _.sample(specificResponses.nameObject.alreadyAskedResponse);
                    }
                } else if (_.isEmpty(interactionInformations.getUserName())) {
                    AiResponse = _.sample(specificResponses.nameObject.response);
                } else if (!_.isEmpty(interactionInformations.getUserName())) {
                    AiResponse = _.sample(specificResponses.nameObject.response).replace(', may i know your name?', '.');
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
                    if (interactionInformations.checkIfUserChangedName(interactionInformations.getUserName())) {
                        AiResponse = _.sample(specificResponses.userNameObject.nameChangeResponse).replace('USER_NAME', interactionInformations.getUserName()).replace('REAL_NAME', interactionInformations.getRealName());
                    } else {
                        AiResponse = _.sample(specificResponses.userNameObject.alreadyAskedResponse).replace('USER_NAME', interactionInformations.getUserName());
                    }
                } else {
                    AiResponse = _.sample(specificResponses.userNameObject.response).replace('USER_NAME', interactionInformations.getUserName());
                }
                specificResponses.userNameObject.isAsked++;
            }
        };
    }

})();