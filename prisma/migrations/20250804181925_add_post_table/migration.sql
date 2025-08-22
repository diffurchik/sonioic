/*
  Warnings:

  - Changed the type of `userId` on the `UserSetting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "UserSetting" ADD COLUMN     "send_quote" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Shared" (
    "id" SERIAL NOT NULL,
    "id_phrase" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "shared" BOOLEAN NOT NULL DEFAULT false,
    "show_user_name" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Shared_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Likes" (
    "id" SERIAL NOT NULL,
    "id_phrase" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "unlikes" INTEGER NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSetting_userId_key" ON "UserSetting"("userId");
