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
const stoicPhraseTable_1 = require("../../db/stoicPhraseTable");
const userSetting_1 = require("../../db/userSetting");
const sharedSettingsTable_1 = require("../../db/sharedSettingsTable");
const testHelpers_1 = require("../utils/testHelpers");
const setup_1 = require("../setup");
describe.skip("Database Integration Tests", () => {
    let stoicPhrase;
    let userSetting;
    let sharedSettings;
    beforeEach(() => {
        stoicPhrase = new stoicPhraseTable_1.StoicPhraseTable();
        userSetting = new userSetting_1.UserSetting();
        sharedSettings = new sharedSettingsTable_1.SharedSettingsTable();
        jest.clearAllMocks();
    });
    describe("Complete User Workflow", () => {
        it("should handle complete user workflow: add phrase, set schedule, get quote", () => __awaiter(void 0, void 0, void 0, function* () {
            // Step 1: Add a user phrase
            const mockPhrase = (0, testHelpers_1.createMockStoicPhrase)({
                content: "Wisdom comes from experience",
                author: "Socrates",
                ruTranslation: "Мудрость приходит с опытом",
            });
            setup_1.mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockPhrase);
            const addedPhrase = yield sharedSettings.addUserPhrase("Wisdom comes from experience", "Socrates", "123", "Мудрость приходит с опытом");
            expect(addedPhrase).toEqual(mockPhrase);
            // Step 2: Set user schedule
            const mockSchedule = (0, testHelpers_1.createMockUserSchedule)({
                userId: 123,
                send_quote: true,
                schedule: "09:00",
            });
            setup_1.mockPrismaClient.userSetting.update.mockResolvedValue(mockSchedule);
            const updatedSchedule = yield userSetting.updateUserSchedule(123, {
                send_quote: true,
                schedule: "09:00",
            });
            expect(updatedSchedule).toEqual(mockSchedule);
            // Step 3: Get random quote (should include the newly added phrase)
            const allPhrases = [
                mockPhrase,
                (0, testHelpers_1.createMockStoicPhrase)({
                    id: 2,
                    content: "Another wisdom quote",
                    author: "Aristotle",
                    ruTranslation: "Еще одна мудрая цитата",
                }),
            ];
            setup_1.mockPrismaClient.stoicPhrase.findMany.mockResolvedValue(allPhrases);
            const randomQuote = yield stoicPhrase.getRandomQuote();
            expect(randomQuote).toBeDefined();
            expect(allPhrases).toContain(randomQuote);
        }));
        it("should handle multiple users with different schedules", () => __awaiter(void 0, void 0, void 0, function* () {
            // User 1: Morning schedule
            const user1Schedule = (0, testHelpers_1.createMockUserSchedule)({
                userId: 123,
                schedule: "08:00",
            });
            // User 2: Evening schedule
            const user2Schedule = (0, testHelpers_1.createMockUserSchedule)({
                userId: 456,
                schedule: "20:00",
            });
            setup_1.mockPrismaClient.userSetting.findMany.mockResolvedValue([
                user1Schedule,
                user2Schedule,
            ]);
            const allSchedules = yield userSetting.getAllUserSchedules();
            expect(allSchedules).toHaveLength(2);
            expect(allSchedules).toContain(user1Schedule);
            expect(allSchedules).toContain(user2Schedule);
        }));
        it("should handle error scenarios gracefully across classes", () => __awaiter(void 0, void 0, void 0, function* () {
            const consoleSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => { });
            // Simulate database connection failure
            const dbError = new Error("Database connection lost");
            setup_1.mockPrismaClient.stoicPhrase.findMany.mockRejectedValue(dbError);
            setup_1.mockPrismaClient.userSetting.findUnique.mockRejectedValue(dbError);
            // All operations should handle errors gracefully
            const quote = yield stoicPhrase.getRandomQuote();
            const schedule = yield userSetting.getUserSchedule(123);
            expect(quote).toBeNull();
            expect(schedule).toBeNull();
            expect(consoleSpy).toHaveBeenCalledTimes(2);
            consoleSpy.mockRestore();
        }));
    });
    describe("Data Consistency", () => {
        it("should maintain data consistency across operations", () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a phrase
            const phrase = (0, testHelpers_1.createMockStoicPhrase)();
            setup_1.mockPrismaClient.stoicPhrase.create.mockResolvedValue(phrase);
            yield sharedSettings.addUserPhrase(phrase.content, phrase.author, "123", phrase.ruTranslation);
            // Verify the phrase can be retrieved
            setup_1.mockPrismaClient.stoicPhrase.findMany.mockResolvedValue([phrase]);
            const retrievedPhrase = yield stoicPhrase.getRandomQuote();
            expect(retrievedPhrase).toEqual(phrase);
        }));
        it("should handle concurrent operations correctly", () => __awaiter(void 0, void 0, void 0, function* () {
            const phrases = [
                (0, testHelpers_1.createMockStoicPhrase)({ id: 1 }),
                (0, testHelpers_1.createMockStoicPhrase)({ id: 2 }),
                (0, testHelpers_1.createMockStoicPhrase)({ id: 3 }),
            ];
            setup_1.mockPrismaClient.stoicPhrase.findMany.mockResolvedValue(phrases);
            // Simulate concurrent quote requests
            const promises = [
                stoicPhrase.getRandomQuote(),
                stoicPhrase.getRandomQuote(),
                stoicPhrase.getRandomQuote(),
            ];
            const results = yield Promise.all(promises);
            // All should return valid quotes
            results.forEach((result) => {
                expect(result).toBeDefined();
                expect(phrases).toContain(result);
            });
            // Database should be called once per request
            expect(setup_1.mockPrismaClient.stoicPhrase.findMany).toHaveBeenCalledTimes(3);
        }));
    });
});
