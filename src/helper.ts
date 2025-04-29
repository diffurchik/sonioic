import {Context} from "node:vm";
import {UserData} from "./types";

export function getUserData(ctx: Context): UserData {
    const fromData = ctx.from
    let userData: UserData = {}
    if(fromData){
        userData.userId = fromData.id
        userData.username = fromData.username
    }
    return userData;
}

export function escapeMarkdownV2(text: string): string {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1')
}