import { UserSetting } from "../../db/userSetting";
import { UserScheduleType } from "../../types";
import { mockPrismaClient } from "../setup";

describe("UserSetting", () => {
  let userSetting: UserSetting;

  beforeEach(() => {
    userSetting = new UserSetting();
    jest.clearAllMocks();
  });

  describe("getUserSchedule", () => {
    it("should return user schedule when user exists", async () => {
      const mockSchedule: UserScheduleType = {
        id: 1,
        userId: 123,
        send_quote: true,
        schedule: "09:00",
      };

      mockPrismaClient.userSetting.findUnique.mockResolvedValue(mockSchedule);

      const result = await userSetting.getUserSchedule(123);

      expect(mockPrismaClient.userSetting.findUnique).toHaveBeenCalledWith({
        where: { userId: 123 },
      });
      expect(result).toEqual(mockSchedule);
    });

    it("should return null when user does not exist", async () => {
      mockPrismaClient.userSetting.findUnique.mockResolvedValue(null);

      const result = await userSetting.getUserSchedule(999);

      expect(mockPrismaClient.userSetting.findUnique).toHaveBeenCalledWith({
        where: { userId: 999 },
      });
      expect(result).toBeNull();
    });

    it("should return null when database error occurs", async () => {
      const mockError = new Error("Database connection failed");
      mockPrismaClient.userSetting.findUnique.mockRejectedValue(mockError);

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await userSetting.getUserSchedule(123);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error getting user schedule:",
        mockError
      );

      consoleSpy.mockRestore();
    });
  });

  describe("getAllUserSchedules", () => {
    it("should return all user schedules with send_quote true", async () => {
      const mockSchedules: UserScheduleType[] = [
        { id: 1, userId: 123, send_quote: true, schedule: "09:00" },
        { id: 2, userId: 456, send_quote: true, schedule: "18:00" },
      ];

      mockPrismaClient.userSetting.findMany.mockResolvedValue(mockSchedules);

      const result = await userSetting.getAllUserSchedules();

      expect(mockPrismaClient.userSetting.findMany).toHaveBeenCalledWith({
        where: { send_quote: true },
      });
      expect(result).toEqual(mockSchedules);
    });

    it("should return undefined when no schedules found", async () => {
      mockPrismaClient.userSetting.findMany.mockResolvedValue(null);

      const result = await userSetting.getAllUserSchedules();

      expect(result).toBeUndefined();
    });

    it("should return undefined when database error occurs", async () => {
      const mockError = new Error("Database connection failed");
      mockPrismaClient.userSetting.findMany.mockRejectedValue(mockError);

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await userSetting.getAllUserSchedules();

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error getting all user schedules:",
        mockError
      );

      consoleSpy.mockRestore();
    });

    it("should return empty array when no users have send_quote true", async () => {
      mockPrismaClient.userSetting.findMany.mockResolvedValue([]);

      const result = await userSetting.getAllUserSchedules();

      expect(result).toEqual([]);
    });
  });

  describe("updateUserSchedule", () => {
    it("should update user schedule successfully", async () => {
      const mockUpdatedSchedule: UserScheduleType = {
        id: 1,
        userId: 123,
        send_quote: false,
        schedule: "10:00",
      };

      const updates = {
        send_quote: false,
        schedule: "10:00",
      };

      mockPrismaClient.userSetting.update.mockResolvedValue(
        mockUpdatedSchedule
      );

      const result = await userSetting.updateUserSchedule(123, updates);

      expect(mockPrismaClient.userSetting.update).toHaveBeenCalledWith({
        where: { userId: 123 },
        data: updates,
      });
      expect(result).toEqual(mockUpdatedSchedule);
    });

    it("should update only specified fields", async () => {
      const mockUpdatedSchedule: UserScheduleType = {
        id: 1,
        userId: 123,
        send_quote: true,
        schedule: "09:00",
      };

      const updates = {
        send_quote: true,
      };

      mockPrismaClient.userSetting.update.mockResolvedValue(
        mockUpdatedSchedule
      );

      const result = await userSetting.updateUserSchedule(123, updates);

      expect(mockPrismaClient.userSetting.update).toHaveBeenCalledWith({
        where: { userId: 123 },
        data: updates,
      });
      expect(result).toEqual(mockUpdatedSchedule);
    });

    it("should return undefined when database error occurs", async () => {
      const mockError = new Error("Database connection failed");
      mockPrismaClient.userSetting.update.mockRejectedValue(mockError);

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const updates = { send_quote: false };
      const result = await userSetting.updateUserSchedule(123, updates);

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error updating user schedule:",
        mockError
      );

      consoleSpy.mockRestore();
    });

    it("should handle partial updates correctly", async () => {
      const mockUpdatedSchedule: UserScheduleType = {
        id: 1,
        userId: 123,
        send_quote: true,
        schedule: "12:00",
      };

      const updates = {
        userId: 123,
        schedule: "12:00",
      };

      mockPrismaClient.userSetting.update.mockResolvedValue(
        mockUpdatedSchedule
      );

      const result = await userSetting.updateUserSchedule(123, updates);

      expect(mockPrismaClient.userSetting.update).toHaveBeenCalledWith({
        where: { userId: 123 },
        data: updates,
      });
      expect(result).toEqual(mockUpdatedSchedule);
    });
  });
});
