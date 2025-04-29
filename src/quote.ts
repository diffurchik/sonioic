import {escapeMarkdownV2} from "./helper";

export const quoteView = (quote: string, author: string) => {
    const escapedQuote = escapeMarkdownV2(quote);
    const escapedAuthor = escapeMarkdownV2(author);
    return `✏️ ${escapedQuote} \n\n *${escapedAuthor}*`
}