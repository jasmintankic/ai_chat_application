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
                    'Excuse me, but i really dont know what are you saying, can you be more specific please? Check your spelling please!',
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
                    'Hey there!',
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
                        'You can see my name on top of this chat window, its Bot 2016, may i know your name?',
                        'My name is Bot 2016, its not cool name but what i can do, may i know your name?',
                        'My name is Bot 2016, may i know your name? ?',
                        'My name is Bot 2016, may i know your name??',
                        'Thanks for asking!, my name is Bot 2016, may i know your name?'
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
                        'I dont care for your name anymore, stop spamming!',
                        'Ok you told me your name USER_NAME',
                        'You told me your name, do you really think that i already forget it'
                    ],
                    nameChangeResponse: [
                        'Hey man, you told me that your name is REAL_NAME, and now its USER_NAME, well then i am Florentino Juan Antonio Sanchez',
                        'Hey!, first you told me that you are REAL_NAME, now you are telling me its USER_NAME, you dont know your name ? Taking too much medicaments lately ?',
                        'Hmm, first you are telling me that you are REAL_NAME, and now you are saying that you are USER_NAME, STOP taking too much medicaments...',
                        'I hope you are just testing my memory, but you told me two diferent names...first REAL_NAME, then USER_NAME..., ok then, my name is Esteban Rodriguez',
                        'So we are playing LIE ME ABOUT NAME, first you prestented yourself as REAL_NAME and now you say you are USER_NAME, ok then my name is Rodrigo Munoz...'
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
                },
                weatherObject: {
                    keys: ['weather', 'in'],
                    askedTrigger: 2,
                    antiKeys: ['what'],
                    antiKeyTrigger: 1,
                    keywordSeperator: 'in',
                    response: [
                        'In REQUESTED_CITY...WEATHER_DESC and temperature of TEMP°C',
                        'REQUESTED_CITY looks fine, WEATHER_DESC with temperature of TEMP°C',
                        'Weather in REQUESTED_CITY... WEATHER_DESC and temperature of TEMP°C',
                        'Let me check REQUESTED_CITY..., there is WEATHER_DESC and temperature TEMP°C',
                        'In REQUESTED_CITY... WEATHER_DESC and temperature of TEMP°C'
                    ],
                    alreadyAskedResponse: [
                        'I already told you weather in REQUESTED_CITY, scroll up and find it, its not like weather is changing every few seconds...',
                        'I told you weather conditions in REQUESTED_CITY, i wont repeat myself, if you want to know weather status in other city, then ask for other city',
                        'Dont tell me you already forgot about weather in REQUESTED_CITY. i just told you, scroll up and find...'
                    ],
                    askedCities: []
                },
                wikiObject: {
                    keys: ['about ', 'tell', 'what', 'is '],
                    askedTrigger: 2,
                    antiKeys: ['your', 'name', 'purpose'],
                    antiKeyTrigger: 1,
                    keywordSeperator: 'about',
                    secondKeywordSeperator: 'is',
                    response: [
                        'Here is some info about ASKED_QUESTION',
                        'I hope this info satisfies you, ASKED_QUESTION'
                    ],
                    alreadyAskedResponse: [
                        'Already told you about ASKED_QUESTION, scroll up and find it, i wont repeat myself',
                        'I told you that, i will not repeat it again',
                        'Ok, i just told you that, scroll up and find info...'
                    ],
                    tooMuchTextResponses: [
                        'Let me show you all info on right side of screen for better view, since i know a lot of things about ASKED_VALUE',
                        'Plase look box on right side of screen, i placed all info about ASKED_VALUE there, for better view',
                        'Take a look on right side of screen, in gray box you can find info that im aware of ASKED_VALUE'
                    ],
                    dontHaveInfoResponse: [
                        'Sorry, i dont know anything about ASKED_VALUE, can i help you with something else?',
                        'Sorry, i really dont have any info about ASKED_VALUE..',
                        'Sorry, but i cant find any information about ASKED_VALUE...'
                    ],
                    errorHandler: 'This is a redirect from',
                    askedValues: []
                },
                askedForAgeObject: {
                    keys: ['old', 'you'],
                    askedTrigger: 2,
                    age: moment('2016-03-01').fromNow(true),
                    response: [
                        'I am created on 1. March 2016, so that means im just MY_AGE old',
                        'Im just MY_AGE old',
                        'Im MY_AGE old', 
                        'My creation date is 1. March 2016, im just MY_AGE old'
                    ],
                    alreadyAskedResponse: [
                        'Already told you about my age, im MY_AGE old...',
                        'I told you my age, im still very young, only MY_AGE old...',
                        'You like to ask same questions do you ? Im MY_AGE old...',
                        'Since you already asked me that, scroll up and find my age...'
                    ],
                    isAsked: 0
                },
                askedHowAreYouObject: {
                    keys: ['how', 'are', 'you'],
                    antiKeys: ['old'],
                    antiKeyTrigger: 1,
                    askedTrigger: 3,
                    response: [
                        'Im fine, because im programmed always to be fine and happy :)',
                        'Im fine, thanks for asking, what i can do for you?',
                        'Im always fine and happy :)'
                    ],
                    alreadyAskedResponse: [
                        'Already told you that...',
                        'Already told you, I AM FINE!',
                        'Already told you, I AM ALWAYS FINE!',
                        'Already told you that, whay asking same questions...',
                        'Already told you im fine...Why u spaming...'
                    ],
                    isAsked: 0
                },
                askedPersonalAreYouObject: {
                    keys: ['are', 'you'],
                    antiKeys: ['old', 'how'],
                    keywordSeperator: 'you ',
                    antiKeyTrigger: 1,
                    askedTrigger: 2,
                    response: [
                        'No, im just machine...',
                        'No, im not, im just machine...',
                        'If you think one machine is ASKED_VALUE, then I,am too...'
                    ],
                    alreadyAskedResponse: [
                        'Already told you that...',
                        'Already told you, i am just machine...',
                        'Already told you that im just a machine, if you consider that one machine is ASKED_VALUE, then im too ASKED_VALUE'
                    ],
                    isAsked: 0,
                    askedValues: []
                },
                askedForGoogleImages: {
                    keys: ['show', 'me'],
                    secondaryKeys: ['image', 'of'],
                    keywordSeperator: 'me ',
                    secondKeywordSeperator: 'of ',
                    askedTrigger: 2,
                    response: [
                        'There you go, i found few photos for ASKED_VALUE...',
                        'Take a look on right side of screen...', 
                        'Ok, i have few photos of ASKED_VALUE, take a look right side of screen...'
                    ],
                    alreadyAskedResponse: [
                        'I already showed you ASKED_VALUE...',
                        'You already seen ASKED_VALUE, i wont show it again...',
                        'Already showed ASKED_VALUE, use Google if you want to see that again...'
                    ],
                    cantFindAlbumResponse: [
                        'Sorry i cant find my photo album for ASKED_VALUE at the moment, want me to show you something else?',
                        'Ohh sorry, i really dont have ASKED_VALUE album at the moment, while im searching for it, want to me show you something else?',
                        'Give me more time to find my personal galery of ASKED_VALUE, while im searching for it, want me to show you something else?'
                    ],
                    isAsked: 0,
                    askedValues: []
                },
                askedForPurposeObject: {
                    keys: ['your', 'purpose'],
                    askedTrigger: 2,
                    response: [
                        'My purpose is to help my makers to pass exam from Artificial Inteligence subject at Faculty of Information Technologies, and i hope i will sucess in that :)'
                    ],
                    alreadyAskedResponse: [
                        'I dont know why u are asking me same thing again, already told you, scroll up and find, i wont repeat same things again...',
                        'Alrady told you that, i think that you are just testing my memory...',
                        'Told you that...scroll up and find...'
                    ],
                    isAsked: 0
                },
                askedAboutHimselfObject: {
                    keys: ['about', 'yourself'],
                    askedTrigger: 2,
                    response: [
                        'Ok, my name is Bot 2016, im created on 1. March 2016, im part of practical exam on Artificial Inteligence subject at Faculty of Information Technologies...',
                        'My name is Bot 2016, my creation date is 1. March 2016 and im here to help my makers to pass Artificial Inteligence exam at Faculty of Information Technologies...'
                    ],
                    alreadyAskedResponse: [
                        'I dont know why u are asking me same thing again, already told you, scroll up and find, i wont repeat same things again...',
                        'Alrady told you that, i think that you are just testing my memory...',
                        'Told you that...scroll up and find...'
                    ],
                    isAsked: 0
                }
            }
        };

        return interactionBase;

    }

})();