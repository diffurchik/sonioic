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
exports.botCommands = void 0;
const menu_1 = require("./menu");
const helper_1 = require("./helper");
const botCommands = (bot) => {
    bot.telegram
        .setMyCommands([
        { command: "main menu", description: "open main menu" },
        { command: "about", description: "Information about the bot" },
        { command: "help", description: "Get help" },
    ])
        .catch((err) => console.log(err));
    bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        yield ctx.reply("You are in the main menu.", menu_1.mainMenu);
    }));
    bot.command("help", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        yield ctx.reply((0, helper_1.getText)("help"));
    }));
    bot.command("about", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        yield ctx.reply((0, helper_1.getText)("about"), {
            parse_mode: "MarkdownV2",
        });
    }));
};
exports.botCommands = botCommands;
