import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // Extract recipe id from URL
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  const recipeId = parseInt(id || '');

  if (isNaN(recipeId)) {
    return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 });
  }

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: {
        title: true,
        imageUrl: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
        ingredients: {
          select: {
            list: true,
          },
        },
        instructions: {
          select: {
            step: true,
          },
        },
        reviews: {
          select: {
            comment: true,
            rating: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('[GET_RECIPE_BY_ID_ERROR]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}