import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleOptions } from '@/lib/cors';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  const recipeId = parseInt(id || '');

  if (isNaN(recipeId)) {
    return withCors(req, NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 }));
  }

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: {
        title: true,
        imageUrl: true,
        createdAt: true,
        category: { select: { name: true } },
        ingredients: { select: { list: true } },
        instructions: { select: { step: true } },
        reviews: {
          select: {
            comment: true,
            rating: true,
            createdAt: true,
            user: { select: { name: true, imageUrl: true } },
          },
        },
      },
    });

    if (!recipe) {
      return withCors(req, NextResponse.json({ error: 'Recipe not found' }, { status: 404 }));
    }

    return withCors(req, NextResponse.json(recipe));
  } catch (error) {
    console.error('[GET_RECIPE_BY_ID_ERROR]', error);
    return withCors(req, NextResponse.json({ error: 'Server error' }, { status: 500 }));
  }
}

export function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}
