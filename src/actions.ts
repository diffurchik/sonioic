import {Telegraf} from 'telegraf';
import {Context} from "node:vm";
import {MyContext, Quote} from "./types";
import {DB} from "./db";
import {getUserData} from "./helper";
import {backToPhraseMenu, quoteMenu} from "./menu";

export const actions = (bot: Telegraf<MyContext>, phrasesList: Record<number, Quote>) => {
    const db = new DB();

    bot.action('GET_QUOTE', async (ctx: Context) => {
        const {userId} = getUserData(ctx)
        const phrase = await db.getRandomPhrase()
        if (phrase && userId) {
            phrasesList[userId] = {id: phrase.id, content: phrase.content, ru_translation: phrase.ru_translation};
            await ctx.reply(phrase.content, {reply_markup: quoteMenu})
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
            await ctx.editMessageText(phrasesList[userId].content, {reply_markup: quoteMenu});
        }
    })
}