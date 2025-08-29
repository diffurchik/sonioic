import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SharedSettingsTable {
  async sharePhraseWithUser(userId: number, phraseId: number, isShared: boolean) {
    try {
      const result = await prisma.sharedSettings.create({
        data: { userId, phraseId, isShared },
      });
      if (result) {
        return result;
      }
    } catch (err) {
      console.error('Error adding user phrase:', err);
    }
  }
}
