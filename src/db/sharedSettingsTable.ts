import { PrismaClient } from '@prisma/client';
import { SharedRow } from './types';

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

  async getRowsByCondition(options: {
    userId: number;
    isShared: boolean;
  }): Promise<SharedRow[] | undefined> {
    const { userId, isShared } = options;

    try {
      const result = await prisma.sharedSettings.findMany({
        where: {
          OR: [{ userId }, { isShared }],
        },
      });

      if (result) {
        return result;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error('Error getting a phrase:', error);
      return undefined;
    }
  }
}
