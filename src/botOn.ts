import {message} from "telegraf/filters";
import {MyContext} from "./types";
import {Telegraf} from "telegraf";

export const botOn = (bot: Telegraf<MyContext>) => {

    bot.on(message('text'), async (ctx) => {
        const userId = ctx.from.id;
        await ctx.reply(`Hello ${userId}`);
    })
}

