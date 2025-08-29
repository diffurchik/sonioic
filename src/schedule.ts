import { MyContext, Quote, UserScheduleType } from './types';
import { Telegraf } from 'telegraf';
import { Context } from 'node:vm';
import { ScheduledTask } from 'node-cron';
import cron from 'node-cron';
import { sendQuote } from './quote';
import { UserSetting } from './db/userSetting';
import { StoicPhraseTable } from './db/stoicPhraseTable';

const scheduledJobs: Record<number, { quote?: ScheduledTask }> = {};

const userSetting = new UserSetting();
const stoicPhrase = new StoicPhraseTable();

export async function loadSchedules(
  ctx: any,
  bot: Telegraf<MyContext>,
  phrasesList: Record<number, Quote>
) {
  const schedules = await userSetting.getAllUserSchedules();
  if (schedules && schedules.length !== 0) {
    schedules.forEach((schedule) => {
      scheduleCard(schedule, ctx, bot, phrasesList);
    });
  }
  console.log('scheduledJobs', scheduledJobs);
}

export function scheduleCard(
  userSettings: UserScheduleType,
  ctx: Context,
  bot: Telegraf<MyContext>,
  phrasesList: Record<number, Quote>
) {
  const { userId, schedule, send_quote } = userSettings;

  if (scheduledJobs[userId] && scheduledJobs[userId].quote) {
    scheduledJobs[userId].quote.stop();
    delete scheduledJobs[userId].quote;
  }

  if (send_quote && schedule) {
    const [hours, minute] = schedule.split(':');
    const cronExpressionRandom = `0 ${minute} ${hours} * * *`;

    if (!scheduledJobs[userId]) scheduledJobs[userId] = {};

    scheduledJobs[userId].quote = cron.schedule(cronExpressionRandom, async () => {
      const quote = await stoicPhrase.getRandomQuote();
      if (quote) {
        phrasesList[userId] = {
          id: quote.id,
          author: quote.author,
          content: quote.content,
          ru_translation: quote.ruTranslation,
        };
        await sendQuote(quote.content, quote.author, bot, userId);
      } else {
        await ctx.reply('There is not cards to study \n Click "Add new" to start education');
      }
    });
  }
}
