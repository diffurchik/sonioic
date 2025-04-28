import {MyContext} from "./types";
import {Telegraf} from "telegraf";
import {mainMenu} from "./menu";
import {Context} from "node:vm";

export const botCommands = (bot: Telegraf<MyContext>) => {
    bot.telegram.setMyCommands([
        {command: 'start', description: 'Start the bot'},
        {command: 'help', description: 'Get help'}
    ]).catch(err => console.log(err));

    bot.command('start', async (ctx) => {
            await ctx.reply("You are in the main menu Choose an option:", mainMenu)
        }
    )

    bot.command('help', async (ctx: Context) => {
        await ctx.reply('Please, write @diffurchik if you have any troubles');
    })
}