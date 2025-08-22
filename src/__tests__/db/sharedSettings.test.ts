import { SharedSettingsTable } from '../../db/sharedSettingsTable';
import { mockPrismaClient } from '../setup';

describe.skip('SharedSettings', () => {
  let sharedSettings: SharedSettingsTable;

  beforeEach(() => {
    sharedSettings = new SharedSettingsTable();
    jest.clearAllMocks();
  });

  describe('addUserPhrase', () => {
    it('should create a phrase with all required fields', async () => {
      const mockCreatedPhrase = {
        id: 1,
        content: 'Test phrase',
        author: 'Test Author',
        ruTranslation: 'Тест фраза',
      };

      mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockCreatedPhrase);

      const result = await sharedSettings.addUserPhrase(
        'Test phrase',
        'Test Author',
        '123',
        'Тест фраза'
      );

      expect(mockPrismaClient.stoicPhrase.create).toHaveBeenCalledWith({
        data: {
          content: 'Test phrase',
          author: 'Test Author',
          ruTranslation: 'Тест фраза',
        },
      });
      expect(result).toEqual(mockCreatedPhrase);
    });

    it('should create a phrase without translation when optional', async () => {
      const mockCreatedPhrase = {
        id: 1,
        content: 'Test phrase',
        author: 'Test Author',
        ruTranslation: null,
      };

      mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockCreatedPhrase);

      const result = await sharedSettings.addUserPhrase(
        'Test phrase',
        'Test Author',
        '123'
      );

      expect(mockPrismaClient.stoicPhrase.create).toHaveBeenCalledWith({
        data: {
          content: 'Test phrase',
          author: 'Test Author',
          ruTranslation: undefined,
        },
      });
      expect(result).toEqual(mockCreatedPhrase);
    });

    it('should create a phrase with empty string translation', async () => {
      const mockCreatedPhrase = {
        id: 1,
        content: 'Test phrase',
        author: 'Test Author',
        ruTranslation: '',
      };

      mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockCreatedPhrase);

      const result = await sharedSettings.addUserPhrase(
        'Test phrase',
        'Test Author',
        '123',
        ''
      );

      expect(mockPrismaClient.stoicPhrase.create).toHaveBeenCalledWith({
        data: {
          content: 'Test phrase',
          author: 'Test Author',
          ruTranslation: '',
        },
      });
      expect(result).toEqual(mockCreatedPhrase);
    });

    it('should return undefined when database error occurs', async () => {
      const mockError = new Error('Database connection failed');
      mockPrismaClient.stoicPhrase.create.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await sharedSettings.addUserPhrase(
        'Test phrase',
        'Test Author',
        '123'
      );

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith('Error adding user phrase:', mockError);

      consoleSpy.mockRestore();
    });

    it('should handle special characters in phrase content', async () => {
      const mockCreatedPhrase = {
        id: 1,
        content: 'Special chars: !@#$%^&*()',
        author: 'Special Author',
        ruTranslation: 'Спец символы: !@#$%^&*()',
      };

      mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockCreatedPhrase);

      const result = await sharedSettings.addUserPhrase(
        'Special chars: !@#$%^&*()',
        'Special Author',
        '123',
        'Спец символы: !@#$%^&*()'
      );

      expect(mockPrismaClient.stoicPhrase.create).toHaveBeenCalledWith({
        data: {
          content: 'Special chars: !@#$%^&*()',
          author: 'Special Author',
          ruTranslation: 'Спец символы: !@#$%^&*()',
        },
      });
      expect(result).toEqual(mockCreatedPhrase);
    });

    it('should handle long phrases and author names', async () => {
      const longPhrase = 'A'.repeat(1000);
      const longAuthor = 'B'.repeat(100);
      const longTranslation = 'C'.repeat(500);

      const mockCreatedPhrase = {
        id: 1,
        content: longPhrase,
        author: longAuthor,
        ruTranslation: longTranslation,
      };

      mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockCreatedPhrase);

      const result = await sharedSettings.addUserPhrase(
        longPhrase,
        longAuthor,
        '123',
        longTranslation
      );

      expect(mockPrismaClient.stoicPhrase.create).toHaveBeenCalledWith({
        data: {
          content: longPhrase,
          author: longAuthor,
          ruTranslation: longTranslation,
        },
      });
      expect(result).toEqual(mockCreatedPhrase);
    });
  });
});
