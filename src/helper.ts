import { Context } from "node:vm";
import { UserData } from "./types";
import { texts } from "./texts";

export function getUserData(ctx: Context): UserData {
  const fromData = ctx.from;
  let userData: UserData = {};
  if (fromData) {
    userData.userId = fromData.id;
    userData.username = fromData.username;
  }
  return userData;
}

export function escapeMarkdownV2(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

export function getText(key: keyof typeof texts): string {
  return escapeMarkdownV2(texts[key]);
}
