import {Markup} from "telegraf";

    export const mainMenu = Markup.inlineKeyboard([
        [Markup.button.callback('Get a random stoic quote', 'GET_QUOTE')],
        [{text: '🗓️ Schedule', callback_data: 'GET_SCHEDULE'}]
    ])

    export const quoteMenu = {
        inline_keyboard: [
            [{text: '🇷🇺 Get a RU translation', callback_data: 'GET_RU_TRANSLATION'}],
            [{text:'Get another random quote', callback_data: 'GET_QUOTE'},
                {text: '🔙 Back to main menu', callback_data: 'MAIN_MANU'},],
        ]
    }

    export const backToPhraseMenu = {
        inline_keyboard: [[Markup.button.callback('🔙 Back to phrase', 'BACK_TO_PHRASE_MENU')]]
    }

    export const settingsMenu = {
        inline_keyboard: [
            [{text: '👍 I want to get random quote every day', callback_data: 'SET_QUOTE_DAILY'}],
            [{text: '⏰ Set time', callback_data: 'SET_TIME'}],
            [{text: '🔙 Back to main menu', callback_data: 'MAIN_MANU'}]
        ]
    }



