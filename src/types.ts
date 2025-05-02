import {Scenes} from "telegraf";

export interface MyWizardSession extends Scenes.WizardSessionData {
    myWizardSessionProp: number;
    englishPhrase: string
    translation: string
}

export type MyContext = Scenes.WizardContext<MyWizardSession>;

export interface UserData {
    userId?: number
    username?: string
}

export type Quote = {
    id: number;
    content: string;
    author: string;
    ru_translation: string;
}

export type UserScheduleType = {
    id: number;
    userId: string,
    send_quote: boolean,
    schedule: string
}