import { MyContext } from "./types";
import { Telegraf } from "telegraf";
import { mainMenu } from "./menu";
import { Context } from "node:vm";
import { getText } from "./helper";

export const botCommands = (bot: Telegraf<MyContext>) => {
  bot.telegram
    .setMyCommands([
      { command: "main menu", description: "open main menu" },
      { command: "about", description: "Information about the bot" },
      { command: "help", description: "Get help" },
    ])
    .catch((err) => console.log(err));

  bot.command("start", async (ctx) => {
    await ctx.reply("You are in the main menu.", mainMenu);
  });

  bot.command("help", async (ctx: Context) => {
    await ctx.reply(getText("help"));
  });

  bot.command("about", async (ctx: Context) => {
    await ctx.reply(getText("about"), {
      parse_mode: "MarkdownV2",
    });
  });
};
