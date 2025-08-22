import { Telegraf } from "telegraf";
import { Context } from "node:vm";
import { Actions, ActionSteps, MyContext, Quote } from "./types";
import { getUserData } from "./helper";
import { backToPhraseMenu, mainMenu, quoteMenu, settingsMenu } from "./menu";
import { quoteView } from "./quote";
import { StoicPhraseTable } from "./db/stoicPhraseTable";
import { UserSetting } from "./db/userSetting";

export const actions = (
  bot: Telegraf<MyContext>,
  phrasesList: Record<number, Quote>,
  userActionState: Record<number, { step: ActionSteps }>
) => {
  const stoicPhrase = new StoicPhraseTable();
  const userSetting = new UserSetting();

  bot.action(Actions.GET_QUOTE, async (ctx: Context) => {
    const { userId } = getUserData(ctx);
    const phrase = await stoicPhrase.getRandomQuote();
    if (phrase && userId) {
      phrasesList[userId] = {
        id: phrase.id,
        content: phrase.content,
        ru_translation: phrase.ruTranslation,
        author: phrase.author,
      };
      await ctx.replyWithMarkdownV2(quoteView(phrase.content, phrase.author), {
        reply_markup: quoteMenu,
      });
    } else {
      await ctx.reply(
        "❌ Unable to retrieve quote. Please try again later or contact @diffurchik if the issue persists."
      );
    }
  });

  bot.action(Actions.GET_RU_TRANSLATION, async (ctx) => {
    const { userId } = getUserData(ctx);
    if (userId) {
      await ctx.editMessageText(phrasesList[userId].ru_translation, {
        reply_markup: backToPhraseMenu,
      });
    }
  });

  bot.action(Actions.BACK_TO_MAIN_MENU, async (ctx: Context) => {
    await ctx.editMessageText(
      "You are in the main menu. \nChoose an option:",
      mainMenu
    );
  });

  bot.action(Actions.BACK_TO_PHRASE_MENU, async (ctx) => {
    const { userId } = getUserData(ctx);
    if (userId) {
      await ctx.editMessageText(
        quoteView(phrasesList[userId].content, phrasesList[userId].author),
        { reply_markup: quoteMenu, parse_mode: "MarkdownV2" }
      );
    }
  });

  bot.action(Actions.GET_SCHEDULE, async (ctx) => {
    const { userId } = getUserData(ctx);
    if (userId) {
      const schedule = await userSetting.getUserSchedule(userId);
      const send_quote_daily = schedule?.send_quote;
      const quote_time = schedule ? schedule.schedule : null;
      const text: string =
        `Your current settings is: \n\n` +
        `▪️Send a random quote daily: ${send_quote_daily ? `✅` : `No`}\n` +
        `▪️Time to send a random card: *${quote_time ? quote_time : "No"}*\n `;
      await ctx.editMessageText(text, {
        reply_markup: settingsMenu(send_quote_daily),
        parse_mode: "MarkdownV2",
      });
    }
  });

  bot.action(Actions.SET_TIME, async (ctx) => {
    try {
      const { userId } = getUserData(ctx);
      await ctx.reply(
        "At what time (HH:MM, 24-hour format) should I send you a random quote daily?",
        { reply_markup: { force_reply: true } }
      );
      if (userId) {
        userActionState[userId] = { step: "setTime" };
      }
    } catch (error) {
      console.log(error);
    }
  });

  bot.action(Actions.SET_QUOTE_DAILY, async (ctx) => {
    try {
      const { userId } = getUserData(ctx);
      if (userId) {
        const userSchedule = await userSetting.getUserSchedule(userId);
        let result;
        if (userSchedule) {
          result = await userSetting.updateUserSchedule(userId, {
            send_quote: !userSchedule?.send_quote,
          });
        } else {
          result = await userSetting.createUserSchedule(userId, {sendQuote: true});
        }

        if (result) {
          await ctx.reply("👍 Successfully updated settings", mainMenu);
        } else {
          await ctx.replyWithMarkdownV2(
            "Failed to update schedule. Please, try again or ask help @diffurchik"
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  bot.action(Actions.ADD_QUOTE, async (ctx) => {
    try {
      const { userId } = getUserData(ctx);
      if (userId) {
        await ctx.reply(
            "Please, send me a quote", { reply_markup: { force_reply: true } });
        userActionState[userId] = { step: "addQuote" };
      }
    } catch (e){
      console.log(e);
    }
  })
};
