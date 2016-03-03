(function() {
    'use strict';

    angular
        .module('ui-chat-app')
        .directive('aiChatBody', aiChatBody);

    function aiChatBody($timeout, comunicationService) {
        var directive = {
            restrict: 'E',
            templateUrl: 'components/views/ai-chat-body.html',
            link: linkFunction
        };
        return directive;

        function linkFunction($scope) {

            $scope.conversation = [];
            $scope.userMessage;

            var processChatMessage = function (message) {
                var aiMessage = {};
                aiMessage.type = 'ai';
                aiMessage.content = comunicationService.processAnswer(message);
                $scope.conversation.push(aiMessage);
            };


            $scope.sendMessage = function(message) {
                if (!_.isEmpty(message)) {
                    var chatMessage = {};
                    chatMessage.type = 'user';
                    chatMessage.content = message;
                    $scope.conversation.push(chatMessage);
                    autoChatScroll();
                    $scope.userMessage = '';
                    processChatMessage();
                }
            };

            var autoChatScroll = function() {
                $timeout(function() {
                    var box = document.getElementById('conversation');
                    box.scrollTop = box.scrollHeight;
                });
            };

            console.log('AI BODY IS IN FUNCTION');
        }
    }
})();