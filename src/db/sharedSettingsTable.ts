import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export class SharedSettingsTable {
  async addUserPhrase(
    userId: number,
    phraseId: number
  ) {
    try {
      const result = await prisma.sharedSettings.create({data: {userId, phraseId}})
      if (result) {
        return result;
      }
    } catch (err) {
      console.error("Error adding user phrase:", err);
    }
  }
}
