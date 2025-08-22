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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSchedules = loadSchedules;
exports.scheduleCard = scheduleCard;
const node_cron_1 = __importDefault(require("node-cron"));
const quote_1 = require("./quote");
const userSetting_1 = require("./db/userSetting");
const stoicPhraseTable_1 = require("./db/stoicPhraseTable");
const scheduledJobs = {};
const userSetting = new userSetting_1.UserSetting();
const stoicPhrase = new stoicPhraseTable_1.StoicPhraseTable();
function loadSchedules(ctx, bot, phrasesList) {
    return __awaiter(this, void 0, void 0, function* () {
        const schedules = yield userSetting.getAllUserSchedules();
        if (schedules && schedules.length !== 0) {
            schedules.forEach((schedule) => {
                scheduleCard(schedule, ctx, bot, phrasesList);
            });
        }
        console.log('scheduledJobs', scheduledJobs);
    });
}
function scheduleCard(userSettings, ctx, bot, phrasesList) {
    const { userId, schedule, send_quote } = userSettings;
    if (scheduledJobs[userId] && scheduledJobs[userId].quote) {
        scheduledJobs[userId].quote.stop();
        delete scheduledJobs[userId].quote;
    }
    if (send_quote && schedule) {
        const [hours, minute] = schedule.split(':');
        const cronExpressionRandom = `0 ${minute} ${hours} * * *`;
        if (!scheduledJobs[userId])
            scheduledJobs[userId] = {};
        scheduledJobs[userId].quote = node_cron_1.default.schedule(cronExpressionRandom, () => __awaiter(this, void 0, void 0, function* () {
            const quote = yield stoicPhrase.getRandomQuote();
            if (quote) {
                phrasesList[userId] = { id: quote.id, author: quote.author, content: quote.content, ru_translation: quote.ruTranslation };
                yield (0, quote_1.sendQuote)(quote.content, quote.author, bot, userId);
            }
            else {
                yield ctx.reply('There is not cards to study \n Click "Add new" to start education');
            }
        }));
    }
}
