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
exports.sendQuote = exports.quoteView = void 0;
const helper_1 = require("./helper");
const menu_1 = require("./menu");
const quoteView = (quote, author) => {
    const escapedQuote = (0, helper_1.escapeMarkdownV2)(quote);
    const escapedAuthor = (0, helper_1.escapeMarkdownV2)(author);
    return `✏️ ${escapedQuote} \n\n *${escapedAuthor}*`;
};
exports.quoteView = quoteView;
const sendQuote = (quote, author, bot, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const text = (0, exports.quoteView)(quote, author);
    return yield bot.telegram.sendMessage(userId, `${text}`, { reply_markup: menu_1.quoteMenu, parse_mode: "MarkdownV2" });
});
exports.sendQuote = sendQuote;
