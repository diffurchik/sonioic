import {MyContext} from "./types";
import {Telegraf} from "telegraf";

// export async function loadSchedules(ctx: any, bot: Telegraf<MyContext>) {
//     const schedules = await getAllUserSchedules()
//     if (schedules && schedules.length !== 0) {
//         schedules.forEach((schedule) => {
//             scheduleCard(schedule, ctx, bot)
//         })
//     }
// }
//
// export function scheduleCard(schedule: UserScheduleType, ctx: Context, bot: Telegraf<MyContext>) {
//     const {user_id, rand_card_time, show_random_card, reminder_time, send_reminder} = schedule
//
//
//     if (scheduledJobs[user_id] && scheduledJobs[user_id].randomCard) {
//         scheduledJobs[user_id].randomCard.stop()
//         delete scheduledJobs[user_id].randomCard
//     }
//
//     if(show_random_card && rand_card_time) {
//         const [randHours, randMinute] = rand_card_time.split(':')
//         const cronExpressionRandom = `0 ${randMinute} ${randHours} * * *`
//
//         if(!scheduledJobs[user_id]) scheduledJobs[user_id] = {}
//         scheduledJobs[user_id].randomCard = cron.schedule(
//             cronExpressionRandom, async () => {
//                 const randomCard = await getRandomCardByUserId(user_id);
//                 console.log('randomCard', randomCard)
//                 if (randomCard) {
//                     console.log('ctx', ctx)
//                     await bot.telegram.sendMessage(user_id, "✨ *Scheduled Card* ✨", {parse_mode: 'MarkdownV2'})
//
//                     await sendCardViaBot(randomCardMenu, randomCard, bot, user_id);
//                 } else {
//                     await ctx.reply('There is not cards to study \n Click "Add new" to start education');
//                 }
//             }
//         )
//     }
//
//     if (scheduledJobs[user_id] && scheduledJobs[user_id].reminder) {
//         scheduledJobs[user_id].reminder.stop()
//         delete scheduledJobs[user_id].reminder
//     }
//
//     if(send_reminder && reminder_time){
//         const [remindHours, remindMinute] = reminder_time.split(':')
//         const cronExpressionReminder = `0 ${remindMinute} ${remindHours} * * *`
//         if(!scheduledJobs[user_id]) scheduledJobs[user_id] = {}
//         scheduledJobs[user_id].reminder = cron.schedule(cronExpressionReminder, async () => {
//             console.log(`send reminder for ${user_id}`)
//             await bot.telegram.sendMessage(user_id, '💡*Time to study*💡', {reply_markup: optionsToLearnMenu, parse_mode: 'MarkdownV2'})
//         })
//     }
//
// }