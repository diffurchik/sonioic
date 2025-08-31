import { getRandomElement } from '../../utils/utils';
import { SharedSettingsTable } from '../sharedSettingsTable';
import { StoicPhraseTable } from '../stoicPhraseTable';
import { PhraseRow, SharedRow } from '../types';

interface stoicPhraseServiceData {
  userId: number;
  phrase: string;
  userAuthor?: string;
  isShared?: boolean;
  ruTranslation?: string;
}

export class StoicPhraseService {
  private stoicRepo = new StoicPhraseTable();
  private sharedRepo = new SharedSettingsTable();

  async addPhraseFromUser(data: stoicPhraseServiceData) {
    const { userId, phrase, userAuthor, isShared, ruTranslation } = data;
    const inputAuthor = userAuthor ? userAuthor : 'Animus';

    const result = await this.stoicRepo.addUserPhrase(phrase, inputAuthor, ruTranslation);

    if (result && result.id) {
      await this.sharedRepo.setPhraseSharingPreference(userId, result.id, isShared ?? false);
    }
  }

  async getRandomPhraseForUser(userId: number): Promise<PhraseRow | undefined> {
    const sharedRows: SharedRow[] | undefined = await this.sharedRepo.getRowsByCondition({
      isShared: true,
      userId,
    });

    if (!sharedRows || !sharedRows.length) return undefined;

    const randomRow: SharedRow | undefined = getRandomElement(sharedRows);

    if (randomRow?.id) {
      const phrase: PhraseRow | undefined = await this.stoicRepo.getRowByPhraseId(randomRow?.id);
      return phrase;
    }

    const result = this.stoicRepo.getRandomQuote();
    return result;
  }
}
