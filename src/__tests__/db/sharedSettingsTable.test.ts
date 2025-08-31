import { SharedSettingsTable } from '../../db/sharedSettingsTable';
import { mockPrismaClient } from '../setup';

describe('SharedSettingsTable', () => {
  let sharedSettingsTable: SharedSettingsTable;
  let mockConsoleError: jest.SpyInstance;

  beforeEach(() => {
    sharedSettingsTable = new SharedSettingsTable();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockConsoleError.mockRestore();
  });

  describe('setPhraseSharingPreference', () => {
    it('should successfully create a shared setting', async () => {
      const mockResult = {
        id: 1,
        userId: 123,
        phraseId: 456,
        isShared: true,
      };

      mockPrismaClient.sharedSettings = {
        ...mockPrismaClient.sharedSettings,
        create: jest.fn().mockResolvedValue(mockResult),
      };

      const result = await sharedSettingsTable.setPhraseSharingPreference(123, 456, true);

      expect(mockPrismaClient.sharedSettings.create).toHaveBeenCalledWith({
        data: { userId: 123, phraseId: 456, isShared: true },
      });
      expect(result).toEqual(mockResult);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      mockPrismaClient.sharedSettings = {
        ...mockPrismaClient.sharedSettings,
        create: jest.fn().mockRejectedValue(mockError),
      };

      const result = await sharedSettingsTable.setPhraseSharingPreference(123, 456, true);

      expect(mockPrismaClient.sharedSettings.create).toHaveBeenCalledWith({
        data: { userId: 123, phraseId: 456, isShared: true },
      });
      expect(mockConsoleError).toHaveBeenCalledWith('Error adding user phrase:', mockError);
      expect(result).toBeUndefined();
    });

    it('should handle null result from database', async () => {
      mockPrismaClient.sharedSettings = {
        ...mockPrismaClient.sharedSettings,
        create: jest.fn().mockResolvedValue(null),
      };

      const result = await sharedSettingsTable.setPhraseSharingPreference(123, 456, false);

      expect(mockPrismaClient.sharedSettings.create).toHaveBeenCalledWith({
        data: { userId: 123, phraseId: 456, isShared: false },
      });
      expect(result).toBeUndefined();
    });

    it('should handle zero values correctly', async () => {
      const mockResult = {
        id: 0,
        userId: 0,
        phraseId: 0,
        isShared: false,
      };

      mockPrismaClient.sharedSettings = {
        ...mockPrismaClient.sharedSettings,
        create: jest.fn().mockResolvedValue(mockResult),
      };

      const result = await sharedSettingsTable.setPhraseSharingPreference(0, 0, false);

      expect(mockPrismaClient.sharedSettings.create).toHaveBeenCalledWith({
        data: { userId: 0, phraseId: 0, isShared: false },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getRowsByCondition', () => {
    it('should successfully retrieve rows with userId filter', async () => {
      const mockResult = [
        {
          id: 1,
          userId: 123,
          phraseId: 456,
          isShared: true,
          showUserName: false,
        },
        {
          id: 2,
          userId: 123,
          phraseId: 789,
          isShared: false,
          showUserName: true,
        },
      ];

      mockPrismaClient.sharedSettings = {
        ...mockPrismaClient.sharedSettings,
        findMany: jest.fn().mockResolvedValue(mockResult),
      };

      const result = await sharedSettingsTable.getRowsByCondition({ userId: 123, isShared: true });

      expect(mockPrismaClient.sharedSettings.findMany).toHaveBeenCalledWith({
        where: { OR: [{ userId: 123 }, { isShared: true }] },
      });
      expect(result).toEqual(mockResult);
    });

    it('should successfully retrieve rows with isShared filter', async () => {
      const mockResult = [
        {
          id: 1,
          userId: 123,
          phraseId: 456,
          isShared: false,
          showUserName: false,
        },
      ];

      mockPrismaClient.sharedSettings = {
        ...mockPrismaClient.sharedSettings,
        findMany: jest.fn().mockResolvedValue(mockResult),
      };

      const result = await sharedSettingsTable.getRowsByCondition({ isShared: false, userId: 123 });

      expect(mockPrismaClient.sharedSettings.findMany).toHaveBeenCalledWith({
        where: { OR: [{ userId: 123 }, { isShared: false }] },
      });
      expect(result).toEqual(mockResult);
    });

    it('should handle empty result array', async () => {
      mockPrismaClient.sharedSettings = {
        ...mockPrismaClient.sharedSettings,
        findMany: jest.fn().mockResolvedValue([]),
      };

      const result = await sharedSettingsTable.getRowsByCondition({ userId: 999, isShared: false });

      expect(mockPrismaClient.sharedSettings.findMany).toHaveBeenCalledWith({
        where: { OR: [{ userId: 999 }, { isShared: false }] },
      });
      expect(result).toEqual([]);
    });

    it('should handle null result from database', async () => {
      mockPrismaClient.sharedSettings = {
        ...mockPrismaClient.sharedSettings,
        findMany: jest.fn().mockResolvedValue(null),
      };

      const result = await sharedSettingsTable.getRowsByCondition({ userId: 123, isShared: true });

      expect(mockPrismaClient.sharedSettings.findMany).toHaveBeenCalledWith({
        where: { OR: [{ userId: 123 }, { isShared: true }] },
      });
      expect(result).toBeUndefined();
    });
  });
});
