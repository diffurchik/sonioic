import {MyContext, UserScheduleType} from "./types";
import {Telegraf} from "telegraf";
import {Context} from "node:vm";
import {DB} from "./db";
import {ScheduledTask} from 'node-cron'
import cron from 'node-cron';
import {sendQuote} from "./quote";

const scheduledJobs: Record<number, { quote?: ScheduledTask }> = {};

const db = new DB()

export async function loadSchedules(ctx: any, bot: Telegraf<MyContext>) {
    const schedules = await db.getAllUserSchedules()
    if (schedules && schedules.length !== 0) {
        schedules.forEach((schedule) => {
            scheduleCard(schedule, ctx, bot)
        })
    }
    console.log('scheduledJobs', scheduledJobs)
}

export function scheduleCard(userSettings: UserScheduleType, ctx: Context, bot: Telegraf<MyContext>) {
    const {userId, schedule, send_quote} = userSettings

    if (scheduledJobs[userId] && scheduledJobs[userId].quote) {
        scheduledJobs[userId].quote.stop()
        delete scheduledJobs[userId].quote
    }

    if (send_quote && schedule) {
        const [hours, minute] = schedule.split(':')
        const cronExpressionRandom = `0 ${minute} ${hours} * * *`

        if (!scheduledJobs[userId]) scheduledJobs[userId] = {}
        scheduledJobs[userId].quote = cron.schedule(
            cronExpressionRandom, async () => {
                const quote = await db.getRandomQuote();
                if (quote) {
                    await sendQuote(quote.content, quote.author, bot, userId);
                } else {
                    await ctx.reply('There is not cards to study \n Click "Add new" to start education');
                }
            }
        )
    }
}