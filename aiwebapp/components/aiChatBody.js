(function() {
    'use strict';

    angular
        .module('ui-chat-app')
        .directive('aiChatBody', aiChatBody);

    function aiChatBody($timeout) {
        var directive = {
            restrict: 'E',
            templateUrl: 'components/views/ai-chat-body.html',
            link: linkFunction
        };
        return directive;

        function linkFunction($scope) {

            $scope.conversation = [];
            $scope.userMessage;
            $scope.botResponse;
            var chatMessage = {};

            var processChatMessage = function (message) {
                console.log(message);
                console.log('test');
            };


            $scope.sendMessage = function(message) {
                if (!_.isEmpty(message)) {
                    chatMessage = {};
                    chatMessage.type = 'user';
                    chatMessage.content = message;
                    $scope.conversation.push(chatMessage);
                    autoChatScroll();
                    $scope.userMessage = '';
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