/*
  Warnings:

  - Added the required column `imageUrl` to the `RecipeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipeRequest" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" BYTEA NOT NULL;
