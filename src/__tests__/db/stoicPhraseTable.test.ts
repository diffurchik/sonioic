import { StoicPhraseTable } from '../../db/stoicPhraseTable';
import { mockPrismaClient } from '../setup';
import { createMockStoicPhrase } from '../utils/testHelpers';

describe('StoicPhraseTable', () => {
  let stoicPhraseTable: StoicPhraseTable;
  let mockConsoleError: jest.SpyInstance;

  beforeEach(() => {
    stoicPhraseTable = new StoicPhraseTable();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockConsoleError.mockRestore();
  });

  describe('getRandomQuote', () => {
    it('should return a random quote when phrases exist', async () => {
      const mockPhrases = [
        createMockStoicPhrase({ id: 1, content: 'First quote' }),
        createMockStoicPhrase({ id: 2, content: 'Second quote' }),
        createMockStoicPhrase({ id: 3, content: 'Third quote' }),
      ];

      mockPrismaClient.stoicPhrase.findMany.mockResolvedValue(mockPhrases);

      const result = await stoicPhraseTable.getRandomQuote();

      expect(mockPrismaClient.stoicPhrase.findMany).toHaveBeenCalled();
      expect(mockPhrases).toContain(result);
    });

    it('should return undefined when no phrases exist', async () => {
      mockPrismaClient.stoicPhrase.findMany.mockResolvedValue([]);

      const result = await stoicPhraseTable.getRandomQuote();

      expect(mockPrismaClient.stoicPhrase.findMany).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      mockPrismaClient.stoicPhrase.findMany.mockRejectedValue(mockError);

      const result = await stoicPhraseTable.getRandomQuote();

      expect(mockPrismaClient.stoicPhrase.findMany).toHaveBeenCalled();
      expect(mockConsoleError).toHaveBeenCalledWith('Error getting a random phrase:', mockError);
      expect(result).toBeUndefined();
    });
  });

  describe('addUserPhrase', () => {
    it('should successfully create a new phrase', async () => {
      const mockResult = createMockStoicPhrase({
        content: 'New stoic wisdom',
        author: 'Marcus Aurelius',
      });

      mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockResult);

      const result = await stoicPhraseTable.addUserPhrase('New stoic wisdom', 'Marcus Aurelius');

      expect(mockPrismaClient.stoicPhrase.create).toHaveBeenCalledWith({
        data: {
          content: 'New stoic wisdom',
          author: 'Marcus Aurelius',
          ruTranslation: undefined,
        },
      });
      expect(result).toEqual(mockResult);
    });

    it('should create a phrase with Russian translation when provided', async () => {
      const mockResult = createMockStoicPhrase({
        content: 'Test phrase',
        author: 'Test Author',
        ruTranslation: 'Тест фраза',
      });

      mockPrismaClient.stoicPhrase.create.mockResolvedValue(mockResult);

      const result = await stoicPhraseTable.addUserPhrase(
        'Test phrase',
        'Test Author',
        'Тест фраза'
      );

      expect(mockPrismaClient.stoicPhrase.create).toHaveBeenCalledWith({
        data: {
          content: 'Test phrase',
          author: 'Test Author',
          ruTranslation: 'Тест фраза',
        },
      });
      expect(result).toEqual(mockResult);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      mockPrismaClient.stoicPhrase.create.mockRejectedValue(mockError);

      const result = await stoicPhraseTable.addUserPhrase('Test phrase', 'Test Author');

      expect(mockPrismaClient.stoicPhrase.create).toHaveBeenCalled();
      expect(mockConsoleError).toHaveBeenCalledWith('Error getting a random phrase:', mockError);
      expect(result).toBeNull();
    });
  });
});
