(function() {
    'use strict';

    angular
        .module('ui-chat-app')
        .factory('speechDatabase', speechDatabase);

    function speechDatabase(interactionInformations) {

        var interactionBase = {
            globalResponses: {
                questionNotDefinedProperly: [
                    'Sorry, im not sure if I understand what are you saying, can you be more specific please?',
                    'Excuse me, but i really dont know what are you saying, can you be more specific please?',
                    'Ok, thats not question, are you just spamming to test me?',
                    'Can you please repeat and maybe define better your question, im not sure if i understand it properly?',
                    'Sorry, but i dont know what are you telling me, if you are having difficulties speaking with me, press HELP and there you can find all information that can help me to understand you better.',
                    'Im just sample of low-end Artificial Inteligence, do you really expect me to understand that nonsense ?',
                    'I dont understand what are you saying, can you please check your spelling one more time?'
                ],
                welcome: [
                    'Hello there, how i can help you?',
                    'Hello, im here to assist you',
                    'Hello, im here to answer all your questions',
                    'Hey there',
                    'Hello, how i can help you?',
                    'Hello is there anything that i can do for you today?'
                ]
            },
            specificResponses: {
                nameObject: {
                    keys: ['your', 'name'],
                    askedTrigger: 2,
                    response: [
                        'My name is Bot 2016, thanks for asking, may i know your name?',
                        'My name is Bot 2016, may i know your name?',
                        'You can see my name on top of this chat window, its Bot 2016, may i know your name?'
                    ],
                    alreadyAskedResponse: [
                        'You already asked me for name, its Bot 2016!',
                        'I already told you, my name is Bot 2016, do you have something else to ask me?',
                        'I told you my name, dont tell me you already forgot it, its Bot 2016, and i think its very bad name...',
                        'I told you my name, dont remind me of that stupid name, its Bot 2016',
                        'Ok, dont ask me for name anymore, i already told you, its Bot 2016!',
                        'Really you ask me for name again ? I wont tell you, scroll up, and find it...'
                    ],
                    refuseToSpeakAboutNames: [
                        'I am not playing with names anymore, you first started to lie about name...',
                        'Stop talking about names, you lied about name, and now you are asking me again and again...',
                        'I refuse to talk about names anymore...'
                    ],
                    isAsked: 0
                },
                /////////////
                userNameObject: {
                    keys: ['my', 'name', 'is'],
                    askedTrigger: 3,
                    response: [
                        'Its lovely name USER_NAME, is there anything that i can help you with?' ,
                        'Its nice name USER_NAME, so how i can help you?',
                        'Its nice to meet you USER_NAME, can i do something for you?',
                        'Its beautiful name USER_NAME, do you have any questions for me?'
                    ],
                    alreadyAskedResponse: [
                        'You already told me your name USER_NAME',
                        'Ok you told me your name USER_NAME',
                        'You told me your name, do you really think that i already forget it'
                    ],
                    nameChangeResponse: [
                        'Hey man, you told me that your name is REAL_NAME, and now its USER_NAME, well then i am Florentino Juan Antonio Sanchez',
                        'Hey man, first you told me that you are REAL_NAME, now you are telling me its USER_NAME, you dont know your name ? Taking too much drugs lately ?',
                        'Hmm, first you are telling me that you are REAL_NAME, and now you are saying that you are USER_NAME, STOP taking too much medicaments...',
                        'I hope you are just testing my memory, but you told me two diferent names...first REAL_NAME, then USER_NAME..., ok then i will play same game, my name is Esteban Rodriguez',
                        'So we are playing LIE ME ABOUT NAME, ok my name is Rodrigo Munoz...',
                        'Well i dont know what game are you playing but, but i can do same thing, my name is Francisco Facundo Canizares'
                    ],
                    isAsked: 0
                },
                greetingsObject: {
                    keys: ['hello', 'hey', 'greetings'],
                    askedTrigger: 1,
                    response: [
                        'Hello there, can i do something for you ?',
                        'Greetings',
                        'Yo!',
                        'Whats up ?'
                    ],
                    alreadyAskedResponse: [
                        'Hello again!',
                        'Hmm, we already shared mutual greetings, what are you trying?',
                        'Hello...I see you are bored, so you are repeating same things...'
                    ],
                    isAsked: 0
                }
            }
        };

        return interactionBase;

    }

})();