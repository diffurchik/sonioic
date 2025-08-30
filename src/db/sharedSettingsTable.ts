import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SharedSettingsTable {
  async setPhraseSharingPreference(userId: number, phraseId: number, isShared: boolean) {
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

  async getRowsByCondition(options: { userId?: number; isShared?: boolean }) {
    const { userId, isShared } = options;

    try {
      const result = await prisma.sharedSettings.findMany({
        where: {
          ...(userId !== undefined && { userId }),
          ...(isShared !== undefined && { isShared }),
        },
      });

      if (result) {
        return result;
      }
    } catch (error) {
      console.error('Error adding user phrase:', error); //todo
    }
  }
}
