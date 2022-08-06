/*
  Warnings:

  - You are about to drop the column `slug` on the `Deck` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Deck_slug_key";

-- AlterTable
ALTER TABLE "Deck" DROP COLUMN "slug";
