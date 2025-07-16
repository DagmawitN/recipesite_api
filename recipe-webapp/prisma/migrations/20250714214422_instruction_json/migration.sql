/*
  Warnings:

  - Changed the type of `list` on the `Ingredient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `step` on the `Instruction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `instructions` to the `RecipeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "list",
ADD COLUMN     "list" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Instruction" DROP COLUMN "step",
ADD COLUMN     "step" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "RecipeRequest" DROP COLUMN "instructions",
ADD COLUMN     "instructions" JSONB NOT NULL;
