(function() {
    'use strict';

    angular
        .module('ui-chat-app')
        .directive('aiChatBody', aiChatBody);

    function aiChatBody($timeout, comunicationService, externalResourcesService, $q, speechDatabase) {
        var directive = {
            restrict: 'E',
            templateUrl: 'components/views/aibody.html',
            link: linkFunction
        };
        return directive;

        function linkFunction($scope) {

            $scope.conversation = [];
            $scope.userMessage;
            $scope.fullInfo;
            $scope.showMoreInfo = false;

            var init = function() {
                processChatMessage('', true);
            };
            
            var processChatMessage = function(message, isInit) {
                message = message.toLowerCase();
                var aiResponses = [];

                var aiMessage = {};
                aiMessage.type = 'ai';
                aiMessage.content = null;


                if (isInit) {
                    aiMessage.content = _.sample(speechDatabase.globalResponses.welcome);
                    $scope.conversation.push(aiMessage);
                    autoChatScroll();
                } else {
                    $q.all([comunicationService.checkIfAskedForWeather(message),
                        comunicationService.checkIfNeedWikiData(message)]
                        ).then(function(data) {
                            
                        aiResponses.push(data[0].content, data[1].content, comunicationService.checkIfAskedForName(message), 
                            comunicationService.checkForSimpleQuestionWithReplaceWar(message, speechDatabase.specificResponses.askedForAgeObject, 'MY_AGE', speechDatabase.specificResponses.askedForAgeObject.age), 
                            comunicationService.checkIfUserToldName(message), 
                            comunicationService.checkForSimpleQuestion(message, speechDatabase.specificResponses.greetingsObject),
                            comunicationService.checkForSimpleQuestion(message, speechDatabase.specificResponses.askedHowAreYouObject),
                            comunicationService.checkForSimpleQuestionWithReplaceWar(message, speechDatabase.specificResponses.askedPersonalAreYouObject, 'ASKED_VALUE', speechDatabase.specificResponses.askedPersonalAreYouObject.askedValues[0]));

                        aiMessage.content = getCorrectAnswer(aiResponses);

                        if(data[1].fullContent) {
                            $scope.fullInfo = data[1].fullContent;
                            $scope.showMoreInfo = true;
                        }

                        if (_.isEmpty(aiMessage.content)) {
                            aiMessage.content = _.sample(speechDatabase.globalResponses.questionNotDefinedProperly);
                        }

                        $scope.conversation.push(aiMessage);
                        autoChatScroll();
                    });
                }
            };

            $scope.sendMessage = function(message) {
                $scope.fullInfo = '';
                $scope.showMoreInfo = false;
                if (!_.isEmpty(message)) {
                    var chatMessage = {};
                    chatMessage.type = 'user';
                    chatMessage.content = message;
                    $scope.conversation.push(chatMessage);
                    $scope.userMessage = '';
                    processChatMessage(message, false);
                }
            };

            var getCorrectAnswer = function(answers) {
                var answer;
                angular.forEach(answers, function(value) {
                    if (!_.isEmpty(value)) {
                        answer = value;
                    }
                });
                return answer;
            };

            var autoChatScroll = function() {
                $timeout(function() {
                    var box = document.getElementById('conversation');
                    box.scrollTop = box.scrollHeight;
                });
            };

            init();
        }
    }
})();