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
exports.botOn = void 0;
const filters_1 = require("telegraf/filters");
const userSetting_1 = require("./db/userSetting");
const stoicPhraseTable_1 = require("./db/stoicPhraseTable");
const sharedSettingsTable_1 = require("./db/sharedSettingsTable");
const botOn = (bot, userActionState) => {
    const userSetting = new userSetting_1.UserSetting();
    const stoicPhrase = new stoicPhraseTable_1.StoicPhraseTable();
    const sharedSettings = new sharedSettingsTable_1.SharedSettingsTable();
    bot.on((0, filters_1.message)('text'), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = ctx.from.id;
        if (!userActionState[userId]) {
            yield ctx.reply('Please start by selecting an action.');
            return;
        }
        let state = userActionState[userId];
        if (state.step === 'setTime') {
            const time = ctx.message.text;
            if (!/^\d{2}:\d{2}$/.test(time)) {
                return ctx.reply("Invalid time format. Please, enter time as HH:MM (24-hour) For example, 09:30.");
            }
            const result = yield userSetting.updateUserSchedule(userId, {
                schedule: time,
            });
            if ((result === null || result === void 0 ? void 0 : result.schedule) === time) {
                return ctx.replyWithMarkdownV2(`👍 Successfully updated schedule for *${time}*`);
            }
            else {
                return ctx.reply("Failed to update schedule for " + time);
            }
        }
        if (state.step === 'addQuote') {
            const quote = ctx.message.text;
            const userId = ctx.from.id;
            if (!userActionState[userId]) {
                yield ctx.reply('Please start by selecting an action.');
                return;
            }
            if (userId) {
                const result = yield stoicPhrase.addUserPhrase(quote, '');
                if (result && result.id) {
                    yield ctx.reply('Congrats');
                    yield sharedSettings.addUserPhrase(userId, result.id);
                }
            }
        }
    }));
};
exports.botOn = botOn;
