import { StoicPhraseTable } from '../../db/stoicPhraseTable';
import { mockPrismaClient } from '../setup';

describe.skip('StoicPhrase', () => {
  let stoicPhrase: StoicPhraseTable;

  beforeEach(() => {
    stoicPhrase = new StoicPhraseTable();
    jest.clearAllMocks();
  });

  describe('getRandomQuote', () => {
    it('should return a random quote when phrases exist', async () => {
      const mockPhrases = [
        { id: 1, content: 'Test phrase 1', author: 'Author 1', ruTranslation: 'Тест фраза 1' },
        { id: 2, content: 'Test phrase 2', author: 'Author 2', ruTranslation: 'Тест фраза 2' },
        { id: 3, content: 'Test phrase 3', author: 'Author 3', ruTranslation: 'Тест фраза 3' },
      ];

      mockPrismaClient.stoicPhrase.findMany.mockResolvedValue(mockPhrases);

      const result = await stoicPhrase.getRandomQuote();

      expect(mockPrismaClient.stoicPhrase.findMany).toHaveBeenCalledWith();
      expect(result).toBeDefined();
      expect(mockPhrases).toContain(result);
    });

    it('should return null when no phrases exist', async () => {
      mockPrismaClient.stoicPhrase.findMany.mockResolvedValue([]);

      const result = await stoicPhrase.getRandomQuote();

      expect(mockPrismaClient.stoicPhrase.findMany).toHaveBeenCalledWith();
      expect(result).toBeNull();
    });

    it('should return null when database error occurs', async () => {
      const mockError = new Error('Database connection failed');
      mockPrismaClient.stoicPhrase.findMany.mockRejectedValue(mockError);

      // Mock console.error to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await stoicPhrase.getRandomQuote();

      expect(mockPrismaClient.stoicPhrase.findMany).toHaveBeenCalledWith();
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Error getting a random phrase:', mockError);

      consoleSpy.mockRestore();
    });

    it('should return a single quote when only one phrase exists', async () => {
      const mockPhrases = [
        { id: 1, content: 'Single phrase', author: 'Author 1', ruTranslation: 'Одна фраза' },
      ];

      mockPrismaClient.stoicPhrase.findMany.mockResolvedValue(mockPhrases);

      const result = await stoicPhrase.getRandomQuote();

      expect(result).toEqual(mockPhrases[0]);
    });
  });
});
