-- AlterTable
ALTER TABLE "RecipeRequest" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "FeaturedRecipe" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL,
    "featuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeaturedRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedRecipe_recipeId_key" ON "FeaturedRecipe"("recipeId");

-- AddForeignKey
ALTER TABLE "FeaturedRecipe" ADD CONSTRAINT "FeaturedRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
