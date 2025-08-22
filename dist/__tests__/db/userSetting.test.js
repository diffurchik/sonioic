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
const userSetting_1 = require("../../db/userSetting");
const setup_1 = require("../setup");
describe("UserSetting", () => {
    let userSetting;
    beforeEach(() => {
        userSetting = new userSetting_1.UserSetting();
        jest.clearAllMocks();
    });
    describe("getUserSchedule", () => {
        it("should return user schedule when user exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockSchedule = {
                id: 1,
                userId: 123,
                send_quote: true,
                schedule: "09:00",
            };
            setup_1.mockPrismaClient.userSetting.findUnique.mockResolvedValue(mockSchedule);
            const result = yield userSetting.getUserSchedule(123);
            expect(setup_1.mockPrismaClient.userSetting.findUnique).toHaveBeenCalledWith({
                where: { userId: 123 },
            });
            expect(result).toEqual(mockSchedule);
        }));
        it("should return null when user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            setup_1.mockPrismaClient.userSetting.findUnique.mockResolvedValue(null);
            const result = yield userSetting.getUserSchedule(999);
            expect(setup_1.mockPrismaClient.userSetting.findUnique).toHaveBeenCalledWith({
                where: { userId: 999 },
            });
            expect(result).toBeNull();
        }));
        it("should return null when database error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error("Database connection failed");
            setup_1.mockPrismaClient.userSetting.findUnique.mockRejectedValue(mockError);
            const consoleSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => { });
            const result = yield userSetting.getUserSchedule(123);
            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith("Error getting user schedule:", mockError);
            consoleSpy.mockRestore();
        }));
    });
    describe("getAllUserSchedules", () => {
        it("should return all user schedules with send_quote true", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockSchedules = [
                { id: 1, userId: 123, send_quote: true, schedule: "09:00" },
                { id: 2, userId: 456, send_quote: true, schedule: "18:00" },
            ];
            setup_1.mockPrismaClient.userSetting.findMany.mockResolvedValue(mockSchedules);
            const result = yield userSetting.getAllUserSchedules();
            expect(setup_1.mockPrismaClient.userSetting.findMany).toHaveBeenCalledWith({
                where: { send_quote: true },
            });
            expect(result).toEqual(mockSchedules);
        }));
        it("should return undefined when no schedules found", () => __awaiter(void 0, void 0, void 0, function* () {
            setup_1.mockPrismaClient.userSetting.findMany.mockResolvedValue(null);
            const result = yield userSetting.getAllUserSchedules();
            expect(result).toBeUndefined();
        }));
        it("should return undefined when database error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error("Database connection failed");
            setup_1.mockPrismaClient.userSetting.findMany.mockRejectedValue(mockError);
            const consoleSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => { });
            const result = yield userSetting.getAllUserSchedules();
            expect(result).toBeUndefined();
            expect(consoleSpy).toHaveBeenCalledWith("Error getting all user schedules:", mockError);
            consoleSpy.mockRestore();
        }));
        it("should return empty array when no users have send_quote true", () => __awaiter(void 0, void 0, void 0, function* () {
            setup_1.mockPrismaClient.userSetting.findMany.mockResolvedValue([]);
            const result = yield userSetting.getAllUserSchedules();
            expect(result).toEqual([]);
        }));
    });
    describe("updateUserSchedule", () => {
        it("should update user schedule successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUpdatedSchedule = {
                id: 1,
                userId: 123,
                send_quote: false,
                schedule: "10:00",
            };
            const updates = {
                send_quote: false,
                schedule: "10:00",
            };
            setup_1.mockPrismaClient.userSetting.update.mockResolvedValue(mockUpdatedSchedule);
            const result = yield userSetting.updateUserSchedule(123, updates);
            expect(setup_1.mockPrismaClient.userSetting.update).toHaveBeenCalledWith({
                where: { userId: 123 },
                data: updates,
            });
            expect(result).toEqual(mockUpdatedSchedule);
        }));
        it("should update only specified fields", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUpdatedSchedule = {
                id: 1,
                userId: 123,
                send_quote: true,
                schedule: "09:00",
            };
            const updates = {
                send_quote: true,
            };
            setup_1.mockPrismaClient.userSetting.update.mockResolvedValue(mockUpdatedSchedule);
            const result = yield userSetting.updateUserSchedule(123, updates);
            expect(setup_1.mockPrismaClient.userSetting.update).toHaveBeenCalledWith({
                where: { userId: 123 },
                data: updates,
            });
            expect(result).toEqual(mockUpdatedSchedule);
        }));
        it("should return undefined when database error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error("Database connection failed");
            setup_1.mockPrismaClient.userSetting.update.mockRejectedValue(mockError);
            const consoleSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => { });
            const updates = { send_quote: false };
            const result = yield userSetting.updateUserSchedule(123, updates);
            expect(result).toBeUndefined();
            expect(consoleSpy).toHaveBeenCalledWith("Error updating user schedule:", mockError);
            consoleSpy.mockRestore();
        }));
        it("should handle partial updates correctly", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUpdatedSchedule = {
                id: 1,
                userId: 123,
                send_quote: true,
                schedule: "12:00",
            };
            const updates = {
                userId: 123,
                schedule: "12:00",
            };
            setup_1.mockPrismaClient.userSetting.update.mockResolvedValue(mockUpdatedSchedule);
            const result = yield userSetting.updateUserSchedule(123, updates);
            expect(setup_1.mockPrismaClient.userSetting.update).toHaveBeenCalledWith({
                where: { userId: 123 },
                data: updates,
            });
            expect(result).toEqual(mockUpdatedSchedule);
        }));
    });
});
