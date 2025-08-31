-- CreateTable
CREATE TABLE "public"."user_setting" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "schedule" TEXT NOT NULL,
    "send_quote" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stoic_phrase" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "ru_translation" TEXT NOT NULL DEFAULT '',
    "author" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "stoic_phrase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shared_settings" (
    "id" SERIAL NOT NULL,
    "id_phrase" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "is_shared" BOOLEAN NOT NULL DEFAULT false,
    "show_user_name" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "shared_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."phrase_likes" (
    "id" SERIAL NOT NULL,
    "id_phrase" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "dislikes" INTEGER NOT NULL,

    CONSTRAINT "phrase_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_setting_user_id_key" ON "public"."user_setting"("user_id");

-- AddForeignKey
ALTER TABLE "public"."shared_settings" ADD CONSTRAINT "shared_settings_id_phrase_fkey" FOREIGN KEY ("id_phrase") REFERENCES "public"."stoic_phrase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
