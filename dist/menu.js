"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsMenu = exports.backToPhraseMenu = exports.quoteMenu = exports.mainMenu = void 0;
const telegraf_1 = require("telegraf");
const types_1 = require("./types");
exports.mainMenu = telegraf_1.Markup.inlineKeyboard([
    [telegraf_1.Markup.button.callback('Get a random stoic quote', types_1.Actions.GET_QUOTE)],
    [telegraf_1.Markup.button.callback('📝 Add a stoic quote', types_1.Actions.ADD_QUOTE)],
    [{ text: '🗓️ Schedule', callback_data: 'GET_SCHEDULE' }]
]);
exports.quoteMenu = {
    inline_keyboard: [
        [{ text: '🇷🇺 Get a RU translation', callback_data: types_1.Actions.GET_RU_TRANSLATION }],
        [{ text: 'Get another random quote', callback_data: types_1.Actions.GET_QUOTE },
            { text: '🔙 Back to main menu', callback_data: types_1.Actions.BACK_TO_MAIN_MENU },],
    ]
};
exports.backToPhraseMenu = {
    inline_keyboard: [[telegraf_1.Markup.button.callback('🔙 Back to phrase', 'BACK_TO_PHRASE_MENU')]]
};
const settingsMenu = (isSendingQuoteDaily = false) => {
    const textSendRandomCard = isSendingQuoteDaily ? '🛑 Stop send me a random quote daily' : ` 🤓 Send me a random quote daily`;
    return {
        inline_keyboard: [
            [{ text: textSendRandomCard, callback_data: types_1.Actions.SET_QUOTE_DAILY }],
            [{ text: '⏰ Set time', callback_data: types_1.Actions.SET_TIME }],
            [{ text: '🔙 Back to main menu', callback_data: types_1.Actions.BACK_TO_MAIN_MENU }],
        ]
    };
};
exports.settingsMenu = settingsMenu;
