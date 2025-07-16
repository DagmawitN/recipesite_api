/*
  Warnings:

  - You are about to drop the column `amount` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Instruction` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `list` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Made the column `step` on table `Instruction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "amount",
DROP COLUMN "name",
DROP COLUMN "unit",
ADD COLUMN     "list" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Instruction" DROP COLUMN "name",
ALTER COLUMN "step" SET NOT NULL;

-- DropTable
DROP TABLE "Comment";
