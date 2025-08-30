import { StoicPhraseService } from '../../../db/services/stoicPhraseService';
import { PhraseRow, SharedRow } from '../../../db/types';

jest.mock('../../../db/stoicPhraseTable');
jest.mock('../../../db/sharedSettingsTable');
jest.mock('../../../utils/utils');

import { StoicPhraseTable } from '../../../db/stoicPhraseTable';
import { SharedSettingsTable } from '../../../db/sharedSettingsTable';
import { getRandomElement } from '../../../utils/utils';

const MockStoicPhraseTable = StoicPhraseTable as jest.MockedClass<typeof StoicPhraseTable>;
const MockSharedSettingsTable = SharedSettingsTable as jest.MockedClass<typeof SharedSettingsTable>;
const MockGetRandomElement = getRandomElement as jest.MockedFunction<typeof getRandomElement>;

describe('StoicPhraseService', () => {
  let stoicPhraseService: StoicPhraseService;
  let mockStoicRepo: jest.Mocked<StoicPhraseTable>;
  let mockSharedRepo: jest.Mocked<SharedSettingsTable>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStoicRepo = new MockStoicPhraseTable() as jest.Mocked<StoicPhraseTable>;
    mockSharedRepo = new MockSharedSettingsTable() as jest.Mocked<SharedSettingsTable>;

    MockStoicPhraseTable.mockImplementation(() => mockStoicRepo);
    MockSharedSettingsTable.mockImplementation(() => mockSharedRepo);

    stoicPhraseService = new StoicPhraseService();
  });

  describe('addPhraseFromUser', () => {
    it('should successfully add a phrase with author', async () => {
      const mockPhraseResult = {
        id: 1,
        content: 'Test phrase',
        author: 'Animus',
        ruTranslation: '',
      };

      mockStoicRepo.addUserPhrase.mockResolvedValue(mockPhraseResult);
      mockSharedRepo.setPhraseSharingPreference.mockResolvedValue(undefined);

      await stoicPhraseService.addPhraseFromUser({
        userId: 123,
        phrase: 'Test phrase',
        isShared: true,
      });

      expect(mockStoicRepo.addUserPhrase).toHaveBeenCalledWith('Test phrase', 'Animus', undefined);
      expect(mockSharedRepo.setPhraseSharingPreference).toHaveBeenCalledWith(123, 1, true);
    });

    it('should handle case when phrase creation fails', async () => {
      mockStoicRepo.addUserPhrase.mockResolvedValue(null);

      await stoicPhraseService.addPhraseFromUser({
        userId: 123,
        phrase: 'Test phrase',
        isShared: true,
      });

      expect(mockStoicRepo.addUserPhrase).toHaveBeenCalledWith('Test phrase', 'Animus', undefined);
      expect(mockSharedRepo.setPhraseSharingPreference).not.toHaveBeenCalled();
    });

    it('should handle case when phrase has no id', async () => {
      const mockPhraseResult = {
        id: 0,
        content: 'Test phrase',
        author: 'Animus',
        ruTranslation: '',
      };

      mockStoicRepo.addUserPhrase.mockResolvedValue(mockPhraseResult);

      await stoicPhraseService.addPhraseFromUser({
        userId: 123,
        phrase: 'Test phrase',
        isShared: true,
      });

      expect(mockStoicRepo.addUserPhrase).toHaveBeenCalledWith('Test phrase', 'Animus', undefined);
      expect(mockSharedRepo.setPhraseSharingPreference).not.toHaveBeenCalled();
    });

    it('should use default isShared value when not provided', async () => {
      const mockPhraseResult = {
        id: 1,
        content: 'Test phrase',
        author: 'Animus',
        ruTranslation: '',
      };

      mockStoicRepo.addUserPhrase.mockResolvedValue(mockPhraseResult);
      mockSharedRepo.setPhraseSharingPreference.mockResolvedValue(undefined);

      await stoicPhraseService.addPhraseFromUser({
        userId: 123,
        phrase: 'Test phrase',
      });

      expect(mockStoicRepo.addUserPhrase).toHaveBeenCalledWith('Test phrase', 'Animus', undefined);
      expect(mockSharedRepo.setPhraseSharingPreference).toHaveBeenCalledWith(123, 1, false);
    });
  });

  describe('getRandomSharedPhrase', () => {
    it('should return a random shared phrase successfully', async () => {
      const mockSharedRows: SharedRow[] = [
        {
          id: 1,
          userId: 123,
          phraseId: 456,
          isShared: true,
          showUserName: false,
        },
        {
          id: 2,
          userId: 789,
          phraseId: 101,
          isShared: true,
          showUserName: true,
        },
      ];

      const mockPhrase: PhraseRow = {
        id: 456,
        content: 'Test shared phrase',
        author: 'Test Author',
        ruTranslation: 'Test translation',
      };

      mockSharedRepo.getRowsByCondition.mockResolvedValue(mockSharedRows);
      MockGetRandomElement.mockReturnValue(mockSharedRows[0]);
      mockStoicRepo.getRowByPhraseId.mockResolvedValue(mockPhrase);

      const result = await stoicPhraseService.getRandomSharedPhrase();

      expect(mockSharedRepo.getRowsByCondition).toHaveBeenCalledWith({ isShared: true });
      expect(MockGetRandomElement).toHaveBeenCalledWith(mockSharedRows);
      expect(mockStoicRepo.getRowByPhraseId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPhrase);
    });

    it('should return null when no shared rows exist', async () => {
      mockSharedRepo.getRowsByCondition.mockResolvedValue([]);

      const result = await stoicPhraseService.getRandomSharedPhrase();

      expect(mockSharedRepo.getRowsByCondition).toHaveBeenCalledWith({ isShared: true });
      expect(result).toBeNull();
    });

    it('should return null when shared rows are undefined', async () => {
      mockSharedRepo.getRowsByCondition.mockResolvedValue(undefined);

      const result = await stoicPhraseService.getRandomSharedPhrase();

      expect(mockSharedRepo.getRowsByCondition).toHaveBeenCalledWith({ isShared: true });
      expect(result).toBeNull();
    });
  });
});
