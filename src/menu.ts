import {Markup} from "telegraf";
import {Actions} from "./types";

export const mainMenu = Markup.inlineKeyboard([
    [Markup.button.callback('Get a random stoic quote', Actions.GET_QUOTE)],
    [{text: '🗓️ Schedule', callback_data: 'GET_SCHEDULE'}]
])

export const quoteMenu = {
    inline_keyboard: [
        [{text: '🇷🇺 Get a RU translation', callback_data: Actions.GET_RU_TRANSLATION}],
        [{text: 'Get another random quote', callback_data: Actions.GET_QUOTE},
            {text: '🔙 Back to main menu', callback_data: Actions.BACK_TO_MAIN_MENU},],
    ]
}

export const backToPhraseMenu = {
    inline_keyboard: [[Markup.button.callback('🔙 Back to phrase', 'BACK_TO_PHRASE_MENU')]]
}

export const settingsMenu = (isSendingQuoteDaily: boolean = false) => {
    const textSendRandomCard: string = isSendingQuoteDaily ? '🛑 Stop send me a random quote daily' : ` 🤓 Send me a random quote daily`
    return {
        inline_keyboard: [
            [{text: textSendRandomCard, callback_data: Actions.SET_QUOTE_DAILY}],
            [{text: '⏰ Set time', callback_data: Actions.SET_TIME}],
            [{text: '🔙 Back to main menu', callback_data: Actions.BACK_TO_MAIN_MENU}],
        ]
    }
}



