import { PrismaClient } from '@prisma/client';
import { PhraseRow } from './types';

const prisma = new PrismaClient();

export class StoicPhraseTable {
  async getRowByPhraseId(phraseId: number): Promise<PhraseRow | undefined> {
    try {
      const result: PhraseRow = await prisma.stoicPhrase.findUniqueOrThrow({
        where: { id: phraseId },
      });
      if (result) return result;
      if (!result) throw new Error();
    } catch (error) {
      console.error('Error getting a phrase by phraseID', error);
      return undefined;
    }
  }

  async getRandomQuote() {
    try {
      const phrases = await prisma.stoicPhrase.findMany();
      if (phrases.length === 0) {
        return undefined;
      }
      const randomIndex = Math.floor(Math.random() * phrases.length);
      return phrases[randomIndex];
    } catch (err) {
      console.error('Error getting a random phrase:', err);
      return undefined;
    }
  }

  async addUserPhrase(phrase: string, author: string, ruTranslation?: string) {
    try {
      const result = await prisma.stoicPhrase.create({
        data: { content: phrase, author, ruTranslation },
      });
      if (result) return result;
    } catch (err) {
      console.error('Error getting a random phrase:', err);
      return null;
    }
  }
}
