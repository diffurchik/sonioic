import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StoicPhraseTable {
  async getRandomQuote() {
    try {
      const phrases = await prisma.stoicPhrase.findMany();
      if (phrases.length === 0) {
        return null;
      }
      const randomIndex = Math.floor(Math.random() * phrases.length);
      return phrases[randomIndex];
    } catch (err) {
      console.error('Error getting a random phrase:', err);
      return null;
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
