import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export class DB {
    async getRandomPhrase() {
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
}

