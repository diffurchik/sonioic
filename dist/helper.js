"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserData = getUserData;
exports.escapeMarkdownV2 = escapeMarkdownV2;
exports.getText = getText;
const texts_1 = require("./texts");
function getUserData(ctx) {
    const fromData = ctx.from;
    let userData = {};
    if (fromData) {
        userData.userId = fromData.id;
        userData.username = fromData.username;
    }
    return userData;
}
function escapeMarkdownV2(text) {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}
function getText(key) {
    return escapeMarkdownV2(texts_1.texts[key]);
}
