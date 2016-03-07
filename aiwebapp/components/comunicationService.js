(function() {
    'use strict';

    angular
        .module('ui-chat-app')
        .factory('comunicationService', comunicationService);

    function comunicationService(speechDatabase, interactionInformations, $q, externalResourcesService) {
        var speechService = {
            checkIfAskedForWeather: checkIfAskedForWeather,
            checkIfAskedForName: checkIfAskedForName,
            checkIfUserToldName: checkIfUserToldName,
            checkForSimpleQuestion: checkForSimpleQuestion,
            checkIfNeedWikiData: checkIfNeedWikiData
        };

        return speechService;

        ////////////////


        function checkForSimpleQuestion(message, questionObject) {
            var simpleQuestionValidator = 0;

            angular.forEach(questionObject.keys, function(value) {
                if (message.indexOf(value) >= 0) {
                    simpleQuestionValidator++;
                }
            });

            if (simpleQuestionValidator === questionObject.askedTrigger) {
                if (questionObject.isAsked > 0) {
                    questionObject.isAsked++;
                    return _.sample(questionObject.alreadyAskedResponse);
                } else {
                    questionObject.isAsked++;
                    return _.sample(questionObject.response);
                }
                
            }

        }

        function checkIfAskedForWeather(message) {
            var aiMessage = {};
            aiMessage.type = 'ai';

            var defer = $q.defer();

            var askedForWeatherValidator = 0;

            angular.forEach(speechDatabase.specificResponses.weatherObject.keys, function(value) {
                if (message.indexOf(value) >= 0) {
                    askedForWeatherValidator++;
                }
            });
            if (askedForWeatherValidator === speechDatabase.specificResponses.weatherObject.askedTrigger) {
                var requestedCity = interactionInformations.getKeywordFromQuestion(message, speechDatabase.specificResponses.weatherObject.keywordSeperator, 3);
                if (interactionInformations.checkIfAskedForCity(requestedCity, speechDatabase.specificResponses.weatherObject.askedCities)) {
                    aiMessage.content = _.sample(speechDatabase.specificResponses.weatherObject.alreadyAskedResponse).replace('REQUESTED_CITY', requestedCity);
                    defer.resolve(aiMessage);
                } else {
                    speechDatabase.specificResponses.weatherObject.askedCities.push(requestedCity);
                    externalResourcesService.getWeatherInfo(requestedCity).then(function(response) {
                        aiMessage.content = _.sample(speechDatabase.specificResponses.weatherObject.response).replace('REQUESTED_CITY', requestedCity).replace('TEMP', Math.round(response.list[0].main.temp)).replace('WEATHER_DESC', response.list[0].weather[0].description);
                        defer.resolve(aiMessage);
                    });
                }
            } else {
                defer.resolve(aiMessage);
            }

            return defer.promise;
        };

        function checkIfNeedWikiData(message) {
            var aiMessage = {};
            aiMessage.type = 'ai';

            var defer = $q.defer();

            var askedForWikiValidator = 0;

            angular.forEach(speechDatabase.specificResponses.wikiObject.keys, function(value) {
                if (message.indexOf(value) >= 0) {
                    askedForWikiValidator++;
                }
            });
            if (askedForWikiValidator === speechDatabase.specificResponses.wikiObject.askedTrigger) {
                var requestedInfo = interactionInformations.getKeywordFromQuestion(message, speechDatabase.specificResponses.wikiObject.keywordSeperator, 5);
                if (interactionInformations.checkIfAskedForCity(requestedInfo, speechDatabase.specificResponses.wikiObject.askedValues)) {
                    aiMessage.content = _.sample(speechDatabase.specificResponses.wikiObject.alreadyAskedResponse).replace('ASKED_QUESTION', requestedInfo);
                    defer.resolve(aiMessage);
                } else {
                    speechDatabase.specificResponses.wikiObject.askedValues.push(requestedInfo);
                    externalResourcesService.getInfoFromWiki(requestedInfo).then(function(response) {
                        angular.forEach(response.query.pages, function(value){
                            if(value.extract && value.extract.length > 50) {
                                aiMessage.content = _.sample(speechDatabase.specificResponses.wikiObject.tooMuchTextResponses).replace('ASKED_VALUE', requestedInfo);
                                aiMessage.fullContent = value.extract;
                            } else if (value.extract && (value.extract.length < 50 && value.extract.length>5)) {
                                aiMessage.content = _.sample(speechDatabase.specificResponses.wikiObject.response).replace('ASKED_QUESTION', value.extract);
                            } else {
                                aiMessage.content = _.sample(speechDatabase.specificResponses.wikiObject.dontHaveInfoResponse).replace('ASKED_VALUE', requestedInfo);
                            }
                        });
                        defer.resolve(aiMessage);
                    });
                }
            } else {
                defer.resolve(aiMessage);
            }

            return defer.promise;
        };


        function checkIfAskedForName(message) {
            var askedFornameValidator = 0;

            angular.forEach(speechDatabase.specificResponses.nameObject.keys, function(value) {
                if (message.indexOf(value) >= 0) {
                    askedFornameValidator++;
                }
            });

            if (askedFornameValidator === speechDatabase.specificResponses.nameObject.askedTrigger) {
                if (speechDatabase.specificResponses.nameObject.isAsked > 0) {
                    if (interactionInformations.checkIfUserChangedName(interactionInformations.getUserName())) {
                        speechDatabase.specificResponses.nameObject.isAsked++;
                        return _.sample(speechDatabase.specificResponses.nameObject.refuseToSpeakAboutNames);
                    } else {
                        speechDatabase.specificResponses.nameObject.isAsked++;
                        return _.sample(speechDatabase.specificResponses.nameObject.alreadyAskedResponse);
                    }
                } else if (_.isEmpty(interactionInformations.getUserName())) {
                    speechDatabase.specificResponses.nameObject.isAsked++;
                    return _.sample(speechDatabase.specificResponses.nameObject.response);
                } else if (!_.isEmpty(interactionInformations.getUserName())) {
                    speechDatabase.specificResponses.nameObject.isAsked++;
                    return _.sample(speechDatabase.specificResponses.nameObject.response).replace(', may i know your name?', '.');
                }
            }
        };

        function checkIfUserToldName(message) {
            var userToldNameValidator = 0;

            angular.forEach(speechDatabase.specificResponses.userNameObject.keys, function(value) {
                if (message.indexOf(value) >= 0) {
                    userToldNameValidator++;
                }
            });

            if (userToldNameValidator === speechDatabase.specificResponses.userNameObject.askedTrigger) {

                var keyWord = message.lastIndexOf('is');
                var name = message.substring(keyWord + 3);
                interactionInformations.setUserName(name);

                if (speechDatabase.specificResponses.userNameObject.isAsked > 0) {
                    if (interactionInformations.checkIfUserChangedName(interactionInformations.getUserName())) {
                        speechDatabase.specificResponses.userNameObject.isAsked++;
                        return _.sample(speechDatabase.specificResponses.userNameObject.nameChangeResponse).replace('USER_NAME', interactionInformations.getUserName()).replace('REAL_NAME', interactionInformations.getRealName());
                    } else {
                        speechDatabase.specificResponses.userNameObject.isAsked++;
                        return _.sample(speechDatabase.specificResponses.userNameObject.alreadyAskedResponse).replace('USER_NAME', interactionInformations.getUserName());
                    }
                } else {
                    speechDatabase.specificResponses.userNameObject.isAsked++;
                    return _.sample(speechDatabase.specificResponses.userNameObject.response).replace('USER_NAME', interactionInformations.getUserName());
                }
            }
        };
    }

})();