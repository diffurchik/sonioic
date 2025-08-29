import { Scenes, session, Telegraf } from 'telegraf';
import { config } from 'dotenv';
import { actions } from './actions';
import { ActionSteps, MyContext, Quote } from './types';
import { mainMenu } from './menu';
import { botOn } from './botOn';
import { botCommands } from './commands';
import { loadSchedules } from './schedule';
import { addPhraseWizard } from './Scenes/addPhraseScene';

config();

const isProduction = process.env.NODE_ENV === 'production';
const BOT_TOKEN = isProduction ? process.env.BOT_TOKEN_PROD : process.env.BOT_TOKEN_TEST;

if (!BOT_TOKEN) {
  throw new Error('Bot token is missing. Please add your bot token.');
}

console.log(`✅ Using ${isProduction ? 'PROD' : 'TEST'} bot token`);

export const bot = new Telegraf<MyContext>(BOT_TOKEN);
const stage = new Scenes.Stage<MyContext>([addPhraseWizard]);
bot.use(session());
bot.use(stage.middleware());

const phrasesList: Record<number, Quote> = {};
const userActionState: Record<number, { step: ActionSteps }> = {};

actions(bot, phrasesList, userActionState);
botCommands(bot);
botOn(bot, userActionState);

bot.start((ctx) => ctx.reply('Welcome to the bot! Choose an option:', mainMenu));

bot
  .launch()
  .then(() => console.log('Bot is running...'))
  .catch((error) => console.error('Launch failed', error));

if (bot)
  bot.telegram.getMe().then(async (ctx) => {
    await loadSchedules(ctx, bot, phrasesList);
  });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
