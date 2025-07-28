import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        status: 'APPROVED',
        ...(category ? { category: { name: category } } : {})
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        category: {
          select: { name: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    const recipesWithRating = [];

    for (const recipe of recipes) {
      const ratings = recipe.reviews.map(r => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;

      if (avgRating > 3.5) {
        await prisma.featuredRecipe.upsert({
          where: { recipeId: recipe.id },
          update: {
            averageRating: avgRating,
            featuredAt: new Date(),
          },
          create: {
            recipeId: recipe.id,
            averageRating: avgRating,
          },
        });
      }

      recipesWithRating.push({
        id: recipe.id,
        title: recipe.title,
        imageUrl: recipe.imageUrl,
        category: recipe.category.name,
        averageRating: parseFloat(avgRating.toFixed(1)),
      });
    }

    return NextResponse.json(recipesWithRating);
  } catch (error) {
    console.error('[GET_RECIPES_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}
