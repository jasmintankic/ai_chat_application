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
            checkIfNeedWikiData: checkIfNeedWikiData,
            checkForSimpleQuestionWithReplaceWar: checkForSimpleQuestionWithReplaceWar,
            checkIfAskedForImage: checkIfAskedForImage
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

            if (questionObject.antiKeys) {
                var antiKeyValidator = 0;
                angular.forEach(questionObject.antiKeys, function(value) {
                    if (message.indexOf(value) >= 0) {
                        antiKeyValidator++;
                    }
                });
                if (antiKeyValidator >= questionObject.antiKeyTrigger) {
                    simpleQuestionValidator = null;
                }
            }

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

        function checkForSimpleQuestionWithReplaceWar(message, questionObject, whatToFind, whatToRepleace) {
            var simpleQuestionValidatorRepleacer = 0;

            angular.forEach(questionObject.keys, function(value) {
                if (message.indexOf(value) >= 0) {
                    simpleQuestionValidatorRepleacer++;
                }
            });

            if (questionObject.antiKeys) {
                var antiKeyValidator = 0;
                angular.forEach(questionObject.antiKeys, function(value) {
                    if (message.indexOf(value) >= 0) {
                        antiKeyValidator++;
                    }
                });
                if (antiKeyValidator >= questionObject.antiKeyTrigger) {
                    simpleQuestionValidatorRepleacer = null;
                }
            }

            if (simpleQuestionValidatorRepleacer === questionObject.askedTrigger) {
                if (questionObject.askedValues) {
                    var askedFor = interactionInformations.getKeywordFromQuestion(message, questionObject.keywordSeperator, 4);
                    if(interactionInformations.checkIfAskedForThat(askedFor, questionObject.askedValues)) {
                        return _.sample(questionObject.alreadyAskedResponse).replace(whatToFind, askedFor).replace(whatToFind, askedFor);
                    } else {
                        questionObject.askedValues.push(askedFor);
                        return _.sample(questionObject.response).replace(whatToFind, askedFor).replace(whatToFind, askedFor);
                    }
                } else {
                    if (questionObject.isAsked > 0) {
                        questionObject.isAsked++;
                        return _.sample(questionObject.alreadyAskedResponse).replace(whatToFind, whatToRepleace);
                    } else {
                        questionObject.isAsked++;
                        return _.sample(questionObject.response).replace(whatToFind, whatToRepleace);
                    }
                }
            }
        }

        function checkIfAskedForWeather(message) {
            var aiMessage = {};
            aiMessage.type = 'ai';

            var defer = $q.defer();

            var askedForWeatherValidator = 0,
                antiKeyValidator = 0,
                shouldNotProceed = interactionInformations.checkIfConflict(message, speechDatabase.specificResponses.weatherObject.antiKeys, speechDatabase.specificResponses.weatherObject.antiKeyTrigger);


            angular.forEach(speechDatabase.specificResponses.weatherObject.keys, function(value) {
                if (message.indexOf(value) >= 0) {
                    askedForWeatherValidator++;
                }
            });

            if (askedForWeatherValidator === speechDatabase.specificResponses.weatherObject.askedTrigger && !shouldNotProceed) {
                var requestedCity = interactionInformations.getKeywordFromQuestion(message, speechDatabase.specificResponses.weatherObject.keywordSeperator, 3);
                if (interactionInformations.checkIfAskedForThat(requestedCity, speechDatabase.specificResponses.weatherObject.askedCities)) {
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

        function checkIfAskedForImage(message) {
            var aiMessage = {};
            aiMessage.type = 'ai';

            var defer = $q.defer();

            var primaryValidator = 0;

            angular.forEach(speechDatabase.specificResponses.askedForGoogleImages.secondaryKeys, function(value) {
                if (message.indexOf(value) >= 0) {
                    primaryValidator++;
                }
            });

            if(speechDatabase.specificResponses.askedForGoogleImages.askedTrigger !== primaryValidator) {
                var requestedInfo = interactionInformations.getKeywordFromQuestion(message, speechDatabase.specificResponses.askedForGoogleImages.keywordSeperator, 3);
                primaryValidator = 0;
                angular.forEach(speechDatabase.specificResponses.askedForGoogleImages.keys, function(value) {
                    if (message.indexOf(value) >= 0) {
                        primaryValidator++;
                    }
                });
            } else {
                var requestedInfo = interactionInformations.getKeywordFromQuestion(message, speechDatabase.specificResponses.askedForGoogleImages.secondKeywordSeperator, 3);
            }

            if (primaryValidator === speechDatabase.specificResponses.wikiObject.askedTrigger) {
                if (interactionInformations.checkIfAskedForThat(requestedInfo, speechDatabase.specificResponses.askedForGoogleImages.askedValues)) {
                    aiMessage.content = _.sample(speechDatabase.specificResponses.askedForGoogleImages.alreadyAskedResponse).replace('ASKED_VALUE', requestedInfo);
                    defer.resolve(aiMessage);
                } else {
                    externalResourcesService.getRequestedImage(requestedInfo).then(function(response) {
                        aiMessage.content = _.sample(speechDatabase.specificResponses.askedForGoogleImages.response).replace('ASKED_VALUE', requestedInfo);
                        aiMessage.photos = [];
                        angular.forEach(response.items, function(value) {
                            aiMessage.photos.push(value.link);
                        });
                        speechDatabase.specificResponses.askedForGoogleImages.askedValues.push(requestedInfo);
                        defer.resolve(aiMessage);
                    }, function(){
                        aiMessage.content = _.sample(speechDatabase.specificResponses.askedForGoogleImages.cantFindAlbumResponse).replace('ASKED_VALUE', requestedInfo);
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

            var askedForWikiValidator = 0,
                antiKeysWikiValidator = 0;

            angular.forEach(speechDatabase.specificResponses.wikiObject.keys, function(value) {
                if (message.lastIndexOf(value) >= 0) {
                    askedForWikiValidator++;
                }
            });

            angular.forEach(speechDatabase.specificResponses.wikiObject.antiKeys, function(value) {
                if (message.lastIndexOf(value) >= 0) {
                    antiKeysWikiValidator++;
                }
            });

            if (antiKeysWikiValidator >= speechDatabase.specificResponses.wikiObject.antiKeyTrigger) {
                askedForWikiValidator = null;
            }

            if (askedForWikiValidator === speechDatabase.specificResponses.wikiObject.askedTrigger) {

                if (message.lastIndexOf(speechDatabase.specificResponses.wikiObject.keys[3]) !== -1) {
                    var requestedInfo = interactionInformations.getKeywordFromQuestion(message, speechDatabase.specificResponses.wikiObject.keywordSeperator, 9);
                } else {
                    var requestedInfo = interactionInformations.getKeywordFromQuestion(message, speechDatabase.specificResponses.wikiObject.keywordSeperator, 6);
                }

                if (interactionInformations.checkIfAskedForThat(requestedInfo, speechDatabase.specificResponses.wikiObject.askedValues)) {
                    aiMessage.content = _.sample(speechDatabase.specificResponses.wikiObject.alreadyAskedResponse).replace('ASKED_QUESTION', requestedInfo);
                    defer.resolve(aiMessage);
                } else {
                    speechDatabase.specificResponses.wikiObject.askedValues.push(requestedInfo);
                    externalResourcesService.getInfoFromWiki(requestedInfo).then(function(response) {
                        angular.forEach(response.query.pages, function(value) {
                            if (value.extract && (value.extract.indexOf(speechDatabase.specificResponses.wikiObject.errorHandler) < 0)) {
                                if (value.extract.length > 50) {
                                    aiMessage.content = _.sample(speechDatabase.specificResponses.wikiObject.tooMuchTextResponses).replace('ASKED_VALUE', requestedInfo);
                                    aiMessage.fullContent = value.extract;
                                } else {
                                    aiMessage.content = _.sample(speechDatabase.specificResponses.wikiObject.response).replace('ASKED_QUESTION', value.extract);
                                }
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