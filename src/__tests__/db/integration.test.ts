import { StoicPhraseTable } from "../../db/stoicPhraseTable";
import { UserSetting } from "../../db/userSetting";
import { SharedSettingsTable } from "../../db/sharedSettingsTable";
import {
  createMockUserSchedule,
  createMockStoicPhrase,
} from "../utils/testHelpers";
import { mockPrismaClient } from "../setup";

describe.skip("Database Integration Tests", () => {
  let stoicPhrase: StoicPhraseTable;
  let userSetting: UserSetting;
  let sharedSettings: SharedSettingsTable;

  beforeEach(() => {
    stoicPhrase = new StoicPhraseTable();
    userSetting = new UserSetting();
    sharedSettings = new SharedSettingsTable();
    jest.clearAllMocks();
  });

  describe("Complete User Workflow", () => {
    it("should handle complete user workflow: add phrase, set schedule, get quote", async () => {
      // Step 1: Add a user phrase
      const mockPhrase = createMockStoicPhrase({
        content: "Wisdom comes from experience",
        author: "Socrates",
        ruTranslation: "Мудрость приходит с опытом",
      });

      mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockPhrase);

      const addedPhrase = await sharedSettings.addUserPhrase(
        "Wisdom comes from experience",
        "Socrates",
        "123",
        "Мудрость приходит с опытом"
      );

      expect(addedPhrase).toEqual(mockPhrase);

      // Step 2: Set user schedule
      const mockSchedule = createMockUserSchedule({
        userId: 123,
        send_quote: true,
        schedule: "09:00",
      });

      mockPrismaClient.userSetting.update.mockResolvedValue(mockSchedule);

      const updatedSchedule = await userSetting.updateUserSchedule(123, {
        send_quote: true,
        schedule: "09:00",
      });

      expect(updatedSchedule).toEqual(mockSchedule);

      // Step 3: Get random quote (should include the newly added phrase)
      const allPhrases = [
        mockPhrase,
        createMockStoicPhrase({
          id: 2,
          content: "Another wisdom quote",
          author: "Aristotle",
          ruTranslation: "Еще одна мудрая цитата",
        }),
      ];

      mockPrismaClient.stoicPhrase.findMany.mockResolvedValue(allPhrases);

      const randomQuote = await stoicPhrase.getRandomQuote();

      expect(randomQuote).toBeDefined();
      expect(allPhrases).toContain(randomQuote);
    });

    it("should handle multiple users with different schedules", async () => {
      // User 1: Morning schedule
      const user1Schedule = createMockUserSchedule({
        userId: 123,
        schedule: "08:00",
      });

      // User 2: Evening schedule
      const user2Schedule = createMockUserSchedule({
        userId: 456,
        schedule: "20:00",
      });

      mockPrismaClient.userSetting.findMany.mockResolvedValue([
        user1Schedule,
        user2Schedule,
      ]);

      const allSchedules = await userSetting.getAllUserSchedules();

      expect(allSchedules).toHaveLength(2);
      expect(allSchedules).toContain(user1Schedule);
      expect(allSchedules).toContain(user2Schedule);
    });

    it("should handle error scenarios gracefully across classes", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Simulate database connection failure
      const dbError = new Error("Database connection lost");
      mockPrismaClient.stoicPhrase.findMany.mockRejectedValue(dbError);
      mockPrismaClient.userSetting.findUnique.mockRejectedValue(dbError);

      // All operations should handle errors gracefully
      const quote = await stoicPhrase.getRandomQuote();
      const schedule = await userSetting.getUserSchedule(123);

      expect(quote).toBeNull();
      expect(schedule).toBeNull();
      expect(consoleSpy).toHaveBeenCalledTimes(2);

      consoleSpy.mockRestore();
    });
  });

  describe("Data Consistency", () => {
    it("should maintain data consistency across operations", async () => {
      // Create a phrase
      const phrase = createMockStoicPhrase();
      mockPrismaClient.stoicPhrase.create.mockResolvedValue(phrase);

      await sharedSettings.addUserPhrase(
        phrase.content,
        phrase.author,
        "123",
        phrase.ruTranslation
      );

      // Verify the phrase can be retrieved
      mockPrismaClient.stoicPhrase.findMany.mockResolvedValue([phrase]);
      const retrievedPhrase = await stoicPhrase.getRandomQuote();

      expect(retrievedPhrase).toEqual(phrase);
    });

    it("should handle concurrent operations correctly", async () => {
      const phrases = [
        createMockStoicPhrase({ id: 1 }),
        createMockStoicPhrase({ id: 2 }),
        createMockStoicPhrase({ id: 3 }),
      ];

      mockPrismaClient.stoicPhrase.findMany.mockResolvedValue(phrases);

      // Simulate concurrent quote requests
      const promises = [
        stoicPhrase.getRandomQuote(),
        stoicPhrase.getRandomQuote(),
        stoicPhrase.getRandomQuote(),
      ];

      const results = await Promise.all(promises);

      // All should return valid quotes
      results.forEach((result) => {
        expect(result).toBeDefined();
        expect(phrases).toContain(result);
      });

      // Database should be called once per request
      expect(mockPrismaClient.stoicPhrase.findMany).toHaveBeenCalledTimes(3);
    });
  });
});
