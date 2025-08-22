"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSetting = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserSetting {
    getUserSchedule(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schedule = yield prisma.userSetting.findUnique({
                    where: { userId: userID },
                });
                if (!schedule) {
                    return null;
                }
                else {
                    return schedule;
                }
            }
            catch (err) {
                console.error("Error getting user schedule:", err);
                return null;
            }
        });
    }
    getAllUserSchedules() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schedules = yield prisma.userSetting.findMany({
                    where: { send_quote: true },
                });
                if (!schedules) {
                    return undefined;
                }
                else {
                    return schedules;
                }
            }
            catch (err) {
                console.error("Error getting all user schedules:", err);
            }
        });
    }
    createUserSchedule(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { schedule = '09:00', sendQuote = false } = options;
            try {
                const result = yield prisma.userSetting.create({ data: { userId, schedule, send_quote: sendQuote } });
                if (result) {
                    return result;
                }
            }
            catch (err) {
                console.error("Error creating user schedule:", err);
            }
        });
    }
    updateUserSchedule(userID, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma.userSetting.update({
                    where: { userId: userID },
                    data: updates,
                });
                if (result) {
                    return result;
                }
            }
            catch (err) {
                console.error("Error updating user schedule:", err);
            }
        });
    }
}
exports.UserSetting = UserSetting;
