import {Markup} from "telegraf";

    export const mainMenu = Markup.inlineKeyboard([
        [Markup.button.callback('Get a Random Stoic Quote', 'GET_QUOTE')],
    ])

    export const quoteMenu = {
        inline_keyboard: [[Markup.button.callback('Get a RU translation', 'GET_RU_TRANSLATION')]]
    }

    export const backToPhraseMenu = {
        inline_keyboard: [[Markup.button.callback('Back to phrase', 'BACK_TO_PHRASE_MENU')]]
    }



