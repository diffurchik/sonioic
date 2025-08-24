import { message } from 'telegraf/filters';
import { ActionSteps, MyContext } from './types';
import { Telegraf } from 'telegraf';
import { UserSetting } from './db/userSetting';

export const botOn = (
  bot: Telegraf<MyContext>,
  userActionState: Record<number, { step: ActionSteps }>
) => {
  const userSetting = new UserSetting();

  bot.on(message('text'), async (ctx) => {
    const userId = ctx.from.id;

    if (!userActionState[userId]) {
      await ctx.reply('Please start by selecting an action.');
      return;
    }

    let state = userActionState[userId];

    if (state.step === 'setTime') {
      const time = ctx.message.text;
      if (!/^\d{2}:\d{2}$/.test(time)) {
        return ctx.reply(
          'Invalid time format. Please, enter time as HH:MM (24-hour) For example, 09:30.'
        );
      }
      const result = await userSetting.updateUserSchedule(userId, {
        schedule: time,
      });
      if (result?.schedule === time) {
        return ctx.replyWithMarkdownV2(
          `👍 Successfully updated schedule for *${time}*`
        );
      } else {
        return ctx.reply('Failed to update schedule for ' + time);
      }
    }
  });
};
