(function() {
    'use strict';

    angular
        .module('ui-chat-app')
        .factory('comunicationService', comunicationService);

    function comunicationService() {
        var speechService = {
            processAnswer: processAnswer
        };

        var questionNotDefinedProperlyResponse = [
        'Sorry, im not sure if I understand what are you saying, can you be more specific please ?',
        'Excuse me, but i really dont know what are you saying, can you be more specific please?',
        'Ok, thats not question, are you just spamming to test me ?',
        'Can you please repeat and maybe define better your question, im not sure if i understand it properly ?', 
        'Sorry, but i dont know what are you telling me, if you are having difficulties speaking with me, press HELP and there you can find all information that can help me to understand you better.',
        'Im just sample of low-end Artificial Inteligence, do you really expect me to understand that nonsense ?',
        'I dont understand what are you saying, can you please check your spelling one more time ?'
        ];

        var AiResponse;

        return speechService;

        ////////////////

        function processAnswer(message){
            AiResponse = '';
            checkIfAskedForName(message);

            if(_.isEmpty(AiResponse)) {
                AiResponse = _.sample(questionNotDefinedProperlyResponse);
            }

            return AiResponse;
        }

        function checkIfAskedForName (message) {
            var nameKeys = 'your,name';
        };

        ///work in progress
    }

})();
