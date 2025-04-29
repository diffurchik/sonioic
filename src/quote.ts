import {escapeMarkdownV2} from "./helper";
import {quoteMenu} from "./menu";
import {MyContext} from "./types";
import {Telegraf} from "telegraf";

export const quoteView = (quote: string, author: string) => {
    const escapedQuote = escapeMarkdownV2(quote);
    const escapedAuthor = escapeMarkdownV2(author);
    return `✏️ ${escapedQuote} \n\n *${escapedAuthor}*`
}

export const sendQuote = async (quote: string, author: string, bot: Telegraf<MyContext>, userId: number) => {
    const text = quoteView(quote, author);
    return await bot.telegram.sendMessage(userId, `${text}`, {reply_markup: quoteMenu, parse_mode: "MarkdownV2"})
}