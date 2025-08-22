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
exports.bot = void 0;
const telegraf_1 = require("telegraf");
const dotenv_1 = require("dotenv");
const actions_1 = require("./actions");
const menu_1 = require("./menu");
const botOn_1 = require("./botOn");
const commands_1 = require("./commands");
const schedule_1 = require("./schedule");
(0, dotenv_1.config)();
const isProduction = process.env.NODE_ENV === 'production';
const BOT_TOKEN = isProduction ? process.env.BOT_TOKEN_PROD : process.env.BOT_TOKEN_TEST;
if (!BOT_TOKEN) {
    throw new Error('Bot token is missing. Please add your bot token.');
}
console.log(`✅ Using ${isProduction ? 'PROD' : 'TEST'} bot token`);
exports.bot = new telegraf_1.Telegraf(BOT_TOKEN);
const phrasesList = {};
const userActionState = {};
(0, actions_1.actions)(exports.bot, phrasesList, userActionState);
(0, commands_1.botCommands)(exports.bot);
(0, botOn_1.botOn)(exports.bot, userActionState);
exports.bot.start((ctx) => ctx.reply('Welcome to the bot! Choose an option:', menu_1.mainMenu));
exports.bot.launch()
    .then(() => console.log('Bot is running...'))
    .catch(error => console.error('Launch failed', error));
if (exports.bot)
    exports.bot.telegram.getMe().then((ctx) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, schedule_1.loadSchedules)(ctx, exports.bot, phrasesList);
    }));
process.once('SIGINT', () => exports.bot.stop('SIGINT'));
process.once('SIGTERM', () => exports.bot.stop('SIGTERM'));
