/*
  Warnings:

  - You are about to drop the `Likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shared` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StoicPhraseTable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Likes";

-- DropTable
DROP TABLE "Shared";

-- DropTable
DROP TABLE stoic_phrase;

-- DropTable
DROP TABLE "UserSetting";

-- CreateTable
CREATE TABLE "user_setting" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "schedule" TEXT NOT NULL,
    "send_quote" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stoic_phrase" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "ru_translation" TEXT NOT NULL DEFAULT '',
    "author" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "stoic_phrase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared_settings" (
    "id" SERIAL NOT NULL,
    "id_phrase" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "is_shared" BOOLEAN NOT NULL DEFAULT false,
    "show_user_name" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "shared_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phrase_likes" (
    "id" SERIAL NOT NULL,
    "id_phrase" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "dislikes" INTEGER NOT NULL,

    CONSTRAINT "phrase_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_setting_user_id_key" ON "user_setting"("user_id");
