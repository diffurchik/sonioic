import { SharedSettingsTable } from '../db/sharedSettingsTable';
import { StoicPhraseTable } from '../db/stoicPhraseTable';

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

    const result = await this.stoicRepo.addUserPhrase(
      phrase,
      inputAuthor,
      ruTranslation
    );

    if (result && result.id) {
      await this.sharedRepo.sharePhraseWithUser(
        userId,
        result.id,
        isShared ?? false
      );
    }
  }
}
