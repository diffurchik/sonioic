"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const types_1 = require("./types");
const helper_1 = require("./helper");
const menu_1 = require("./menu");
const quote_1 = require("./quote");
const stoicPhraseTable_1 = require("./db/stoicPhraseTable");
const userSetting_1 = require("./db/userSetting");
const actions = (bot, phrasesList, userActionState) => {
    const stoicPhrase = new stoicPhraseTable_1.StoicPhraseTable();
    const userSetting = new userSetting_1.UserSetting();
    bot.action(types_1.Actions.GET_QUOTE, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = (0, helper_1.getUserData)(ctx);
        const phrase = yield stoicPhrase.getRandomQuote();
        if (phrase && userId) {
            phrasesList[userId] = {
                id: phrase.id,
                content: phrase.content,
                ru_translation: phrase.ruTranslation,
                author: phrase.author,
            };
            yield ctx.replyWithMarkdownV2((0, quote_1.quoteView)(phrase.content, phrase.author), {
                reply_markup: menu_1.quoteMenu,
            });
        }
        else {
            yield ctx.reply("❌ Unable to retrieve quote. Please try again later or contact @diffurchik if the issue persists.");
        }
    }));
    bot.action(types_1.Actions.GET_RU_TRANSLATION, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = (0, helper_1.getUserData)(ctx);
        if (userId) {
            yield ctx.editMessageText(phrasesList[userId].ru_translation, {
                reply_markup: menu_1.backToPhraseMenu,
            });
        }
    }));
    bot.action(types_1.Actions.BACK_TO_MAIN_MENU, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        yield ctx.editMessageText("You are in the main menu. \nChoose an option:", menu_1.mainMenu);
    }));
    bot.action(types_1.Actions.BACK_TO_PHRASE_MENU, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = (0, helper_1.getUserData)(ctx);
        if (userId) {
            yield ctx.editMessageText((0, quote_1.quoteView)(phrasesList[userId].content, phrasesList[userId].author), { reply_markup: menu_1.quoteMenu, parse_mode: "MarkdownV2" });
        }
    }));
    bot.action(types_1.Actions.GET_SCHEDULE, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = (0, helper_1.getUserData)(ctx);
        if (userId) {
            const schedule = yield userSetting.getUserSchedule(userId);
            const send_quote_daily = schedule === null || schedule === void 0 ? void 0 : schedule.send_quote;
            const quote_time = schedule ? schedule.schedule : null;
            const text = `Your current settings is: \n\n` +
                `▪️Send a random quote daily: ${send_quote_daily ? `✅` : `No`}\n` +
                `▪️Time to send a random card: *${quote_time ? quote_time : "No"}*\n `;
            yield ctx.editMessageText(text, {
                reply_markup: (0, menu_1.settingsMenu)(send_quote_daily),
                parse_mode: "MarkdownV2",
            });
        }
    }));
    bot.action(types_1.Actions.SET_TIME, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = (0, helper_1.getUserData)(ctx);
            yield ctx.reply("At what time (HH:MM, 24-hour format) should I send you a random quote daily?", { reply_markup: { force_reply: true } });
            if (userId) {
                userActionState[userId] = { step: "setTime" };
            }
        }
        catch (error) {
            console.log(error);
        }
    }));
    bot.action(types_1.Actions.SET_QUOTE_DAILY, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = (0, helper_1.getUserData)(ctx);
            if (userId) {
                const userSchedule = yield userSetting.getUserSchedule(userId);
                let result;
                if (userSchedule) {
                    result = yield userSetting.updateUserSchedule(userId, {
                        send_quote: !(userSchedule === null || userSchedule === void 0 ? void 0 : userSchedule.send_quote),
                    });
                }
                else {
                    result = yield userSetting.createUserSchedule(userId, { sendQuote: true });
                }
                if (result) {
                    yield ctx.reply("👍 Successfully updated settings", menu_1.mainMenu);
                }
                else {
                    yield ctx.replyWithMarkdownV2("Failed to update schedule. Please, try again or ask help @diffurchik");
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }));
    bot.action(types_1.Actions.ADD_QUOTE, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = (0, helper_1.getUserData)(ctx);
            if (userId) {
                yield ctx.reply("Please, send me a quote", { reply_markup: { force_reply: true } });
                userActionState[userId] = { step: "addQuote" };
            }
        }
        catch (e) {
            console.log(e);
        }
    }));
};
exports.actions = actions;
