/*
  Warnings:

  - You are about to drop the column `ru_translate` on the `StoicPhraseTable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE stoic_phrase DROP COLUMN "ru_translate",
ADD COLUMN     "author" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ru_translation" TEXT NOT NULL DEFAULT '';
