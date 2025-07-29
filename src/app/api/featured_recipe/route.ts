import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleOptions } from '@/lib/cors';

export async function GET(request: NextRequest) {
  try {
    const featuredRecipes = await prisma.featuredRecipe.findMany({
      include: {
        recipe: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            createdAt: true,
            category: {
              select: { name: true },
            },
          },
        },
      },
    });

    const formatted = featuredRecipes.map((item) => ({
      id: item.recipe.id,
      title: item.recipe.title,
      imageUrl: item.recipe.imageUrl,
      createdAt: item.recipe.createdAt,
      category: item.recipe.category.name,
      averageRating: item.averageRating,
    }));

    return withCors(request, NextResponse.json(formatted));
  } catch (error) {
    console.error('[FEATURED_RECIPES_FETCH_ERROR]', error);
    return withCors(
      request,
      NextResponse.json({ error: 'Failed to fetch featured recipes' }, { status: 500 })
    );
  }
}

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}
