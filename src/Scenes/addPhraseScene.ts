import { Scenes } from 'telegraf';
import { MyContext } from '../types';
import { finishMenu, mainMenu, yesNoMenu } from '../menu';
import { StoicPhraseService } from '../services/stoicPhraseService';

export const addPhraseWizard = new Scenes.WizardScene<MyContext>(
  'add-phrase',

  //Step 1: get a stoic quote and ask author question
  async (ctx) => {
    (ctx.wizard.state as any).data = {};
    await ctx.reply('Please send the phrase text 📝');
    return ctx.wizard.next();
  },

  async (ctx) => {
    if ('text' in ctx.message!) {
      (ctx.wizard.state as any).data.quote = ctx.message.text;
    } else {
      await ctx.reply('Please send text, not other content.');
    }

    await ctx.reply('Do you want to add an author? 👤', yesNoMenu);
    return ctx.wizard.next();
  },

  //Step 2: if a user what do add author
  async (ctx) => {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const answer = ctx.callbackQuery.data;
      await ctx.answerCbQuery();
      if (answer === 'Yes') {
        await ctx.reply('Please enter the author name:');
      }
      if (answer === 'No') {
        await ctx.reply('Okay, no author will be added.');
      }
    }
    return ctx.wizard.next();
  },

  async (ctx: MyContext) => {
    if ('text' in ctx.message!) {
      (ctx.wizard.state as any).data.author = ctx.message.text;
    } else {
      await ctx.reply('Please send text, not other content.');
    }

    await ctx.reply(
      'Do you want to share this stoic quote with others? 📢',
      yesNoMenu
    );
    return ctx.wizard.next();
  },

  //Step 3: Sharing
  async (ctx: MyContext) => {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const answer = ctx.callbackQuery.data;
      await ctx.answerCbQuery();
      if (answer === 'Yes') {
        await ctx.reply(
          'Thank you for sharing your wisdom! 🌿 Your quote will inspire others in the Stoic community and help spread thoughtful reflections.'
        );
      }
      if (answer === 'No') {
        await ctx.reply(
          'No worries! 🌿 Your quote will stay private, and we respect your choice.'
        );
      }

      (ctx.wizard.state as any).data.isShared = answer === 'Yes';

      const { quote, author, isShared } = (ctx.wizard.state as any).data;
      const checkMessage = `Your quote is: ${quote}\n Author: ${author}\n Shared: ${isShared}\n\n Do you want to save it?`;

      await ctx.reply(checkMessage, finishMenu);
      return ctx.wizard.next();
    }
  },

  //Step 4: DB
  async (ctx: MyContext) => {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const answer = ctx.callbackQuery.data;
      await ctx.answerCbQuery();

      if (answer === 'Cancel') {
        await ctx.reply(
          'Action cancelled. You can always add a quote later. What do you want to do now?',
          mainMenu
        );
        return ctx.scene.leave();
      }

      if (answer === 'Save') {
        const phraseService = new StoicPhraseService();
        const { quote, author, isShared } = (ctx.wizard.state as any).data;

        const userId = ctx.from?.id;
        if (userId) {
          await phraseService.addPhraseFromUser({
            userId,
            phrase: quote,
            userAuthor: author,
            isShared,
          });
          await ctx.reply(
            'Great! Your quote has been recorded. You can add more quotes anytime.'
          );
        } else {
          await ctx.reply(
            'Hmm, something went wrong with your ID. Reach out to @diffurchik'
          );
        }
        return ctx.scene.leave();
      }
    }
  }
);
