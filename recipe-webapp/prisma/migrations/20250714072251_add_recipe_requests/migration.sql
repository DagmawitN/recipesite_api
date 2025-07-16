-- CreateTable
CREATE TABLE "RecipeRequest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT,
    "instructions" TEXT,
    "ingredients" JSONB NOT NULL,
    "status" "RecipeStatus" NOT NULL DEFAULT 'PENDING',
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeRequest" ADD CONSTRAINT "RecipeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
