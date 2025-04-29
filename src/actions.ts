import {Telegraf} from 'telegraf';
import {Context} from "node:vm";
import {MyContext, Quote} from "./types";
import {DB} from "./db";
import {getUserData} from "./helper";
import {backToPhraseMenu, quoteMenu, settingsMenu} from "./menu";
import {quoteView} from "./quote";

export const actions = (bot: Telegraf<MyContext>, phrasesList: Record<number, Quote>) => {
    const db = new DB();

    bot.action('GET_QUOTE', async (ctx: Context) => {
        const {userId} = getUserData(ctx)
        const phrase = await db.getRandomQuote()
        if (phrase && userId) {
            phrasesList[userId] = {id: phrase.id, content: phrase.content, ru_translation: phrase.ru_translation, author: phrase.author};
            await ctx.replyWithMarkdownV2(quoteView(phrase.content, phrase.author), {reply_markup: quoteMenu})
        } else {
            await ctx.reply('error')
        }
    })

    bot.action('GET_RU_TRANSLATION', async (ctx) => {
        const {userId} = getUserData(ctx)
        if (userId) {
            await ctx.editMessageText(phrasesList[userId].ru_translation, {reply_markup: backToPhraseMenu});
        }
    })

    bot.action('BACK_TO_PHRASE_MENU', async (ctx) => {
        const {userId} = getUserData(ctx)
        if (userId) {
            await ctx.editMessageText(quoteView(
                phrasesList[userId].content, phrasesList[userId].author),
                {reply_markup: quoteMenu, parse_mode: 'MarkdownV2'});
        }
    })

    bot.action('SET_SCHEDULE', async (ctx) => {
        const {userId} = getUserData(ctx)
        if (userId) {
        const schedule = await db.getUserSchedule(userId)
        const send_quote_daily = schedule?.send_quote
        const quote_time = schedule? schedule.schedule : null
            const text: string = `Your current settings is: \n\n` +
                `▪️Send a random quote daily: ${send_quote_daily ? `✅` : `No`}\n` +
                `▪️Time to send a random card: *${quote_time ? quote_time : 'No'}*\n `
            await ctx.editMessageText(text, {reply_markup: settingsMenu, parse_mode: "MarkdownV2"})
        }
    })
}