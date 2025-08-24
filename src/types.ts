import { Scenes } from 'telegraf';

export interface MyWizardSession extends Scenes.WizardSessionData {
  myWizardSessionProp: number;
  englishPhrase: string;
  translation: string;
}

export type ActionSteps = 'setTime' | 'addQuote';

export enum Actions {
  GET_QUOTE = 'GET_QUOTE',
  ADD_QUOTE = 'ADD_QUOTE',

  GET_RU_TRANSLATION = 'GET_RU_TRANSLATION',

  BACK_TO_PHRASE_MENU = 'BACK_TO_PHRASE_MENU',
  BACK_TO_MAIN_MENU = 'BACK_TO_MAIN_MENU',

  GET_SCHEDULE = 'GET_SCHEDULE',
  SET_TIME = 'SET_TIME',
  SET_QUOTE_DAILY = 'SET_QUOTE_DAILY',

  YES = 'Yes',
  NO = 'No',
  CANCEL = 'Cancel',
  SAVE = 'Save',
}

export type MyContext = Scenes.WizardContext<MyWizardSession>;

export interface UserData {
  userId?: number;
  username?: string;
}

export type Quote = {
  id: number;
  content: string;
  author: string;
  ru_translation: string;
};

export type UserScheduleType = {
  id: number;
  userId: number;
  send_quote: boolean;
  schedule: string;
};
