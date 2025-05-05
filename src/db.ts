import {Prisma, PrismaClient} from "@prisma/client";
import {UserScheduleType} from "./types";

const prisma = new PrismaClient();

export class DB {
    async getRandomQuote() {
        try {
            const phrases = await prisma.stoicPhrase.findMany();
            if (phrases.length === 0) {
                return null;
            }
            const randomIndex = Math.floor(Math.random() * phrases.length);
            return phrases[randomIndex];
        } catch (err) {
            console.error('Error getting a random phrase:', err);
            return null;
        }
    }

    async getUserSchedule(userID: number) {
        try {
            const schedule = await prisma.userSetting.findUnique({where: {userId: userID}});
            if (!schedule) {
                return null;
            } else {
                return schedule;
            }
        } catch (err) {
            console.error('Error getting user schedule:', err);
            return null;
        }
    }

    async getAllUserSchedules(): Promise<UserScheduleType[] | undefined> {
        try {
            const schedules = await prisma.userSetting.findMany({where: {send_quote: true}});
            if(!schedules) {
                return undefined;
            } else {
                return schedules;
            }
        } catch (err) {
            console.error('Error getting all user schedules:', err);
        }
    }

    async addUserQuote(){}

    async updateUserSchedule(userID: number, updates: Prisma.UserSettingUpdateInput){
        try  {
            const result= await prisma.userSetting.update({where: {userId: userID}, data: updates});
            if(result){
                return result;
            }
        } catch (err) {
            console.error('Error updating user schedule:', err);
        }
    }
}

