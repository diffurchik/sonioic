import {PrismaClient} from "@prisma/client";
import {UserScheduleType} from "../types";

const prisma = new PrismaClient()

export class UserSetting {
    async getUserSchedule(userID: number) {
        try {
            const schedule = await prisma.userSetting.findUnique({
                where: {userId: userID},
            });
            if (!schedule) {
                return null;
            } else {
                return schedule;
            }
        } catch (err) {
            console.error("Error getting user schedule:", err);
            return null;
        }
    }

    async getAllUserSchedules(): Promise<UserScheduleType[] | undefined> {
        try {
            const schedules = await prisma.userSetting.findMany({
                where: {send_quote: true},
            });
            if (!schedules) {
                return undefined
            } else {
                return schedules
            }
        } catch (err) {
            console.error("Error getting all user schedules:", err)
        }
    }

    async createUserSchedule(userId: number, options: {schedule?: string, sendQuote?: boolean} ): Promise<UserScheduleType | undefined > {
        const { schedule = '09:00', sendQuote = false } = options
        try {
            const result = await prisma.userSetting.create({data: {userId, schedule, send_quote: sendQuote}})
            if (result) {
                return result
            }
        } catch (err) {
            console.error("Error creating user schedule:", err);
        }
    }

    async updateUserSchedule(
        userID: number,
        updates: {
            userId?: number
            schedule?: string
            send_quote?: boolean
        }
    ) {
        try {
            const result = await prisma.userSetting.update({
                where: {userId: userID},
                data: updates,
            })

            if (result) {
                return result
            }
        } catch (err) {
            console.error("Error updating user schedule:", err)
        }
    }
}