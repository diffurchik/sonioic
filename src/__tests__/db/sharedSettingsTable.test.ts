import { SharedSettingsTable } from '../../db/sharedSettingsTable';
import { mockPrismaClient } from '../setup';

describe.skip('SharedSettingsTable', () => {
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

  describe('sharePhraseWithUser', () => {
    it('should successfully create a shared setting', async () => {
      const mockResult = {
        id: 1,
        userId: 123,
        phraseId: 456,
        isShared: true,
      };

      mockPrismaClient.sharedSettings = {
        create: jest.fn().mockResolvedValue(mockResult),
      };

      const result = await sharedSettingsTable.sharePhraseWithUser(123, 456, true);

      expect(mockPrismaClient.sharedSettings.create).toHaveBeenCalledWith({
        data: { userId: 123, phraseId: 456, isShared: true },
      });
      expect(result).toEqual(mockResult);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      mockPrismaClient.sharedSettings = {
        create: jest.fn().mockRejectedValue(mockError),
      };

      const result = await sharedSettingsTable.sharePhraseWithUser(123, 456, true);

      expect(mockPrismaClient.sharedSettings.create).toHaveBeenCalledWith({
        data: { userId: 123, phraseId: 456, isShared: true },
      });
      expect(mockConsoleError).toHaveBeenCalledWith('Error adding user phrase:', mockError);
      expect(result).toBeUndefined();
    });

    it('should handle null result from database', async () => {
      mockPrismaClient.sharedSettings = {
        create: jest.fn().mockResolvedValue(null),
      };

      const result = await sharedSettingsTable.sharePhraseWithUser(123, 456, false);

      expect(mockPrismaClient.sharedSettings.create).toHaveBeenCalledWith({
        data: { userId: 123, phraseId: 456, isShared: false },
      });
      expect(result).toBeUndefined();
    });
  });
});
