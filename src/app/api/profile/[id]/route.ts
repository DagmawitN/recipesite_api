import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleOptions } from '@/lib/cors';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    const userId = parseInt(id || '');

    if (isNaN(userId)) {
      return withCors(req, NextResponse.json({ error: 'Invalid user ID' }, { status: 400 }));
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        recipes: {
          select: {
            id: true,
            title: true,
            status: true,
            imageUrl: true,
            createdAt: true,
          },
        },
        favorites: {
          select: {
            recipe: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return withCors(req, NextResponse.json({ error: 'User not found' }, { status: 404 }));
    }

    const favorites = user.favorites.map((fav) => fav.recipe);

    return withCors(req, NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      postedRecipes: user.recipes,
      favoriteRecipes: favorites,
    }));
  } catch (error) {
    console.error('[GET_USER_BY_ID_ERROR]', error);
    return withCors(req, NextResponse.json({ error: 'Server error' }, { status: 500 }));
  }
}

export function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}
