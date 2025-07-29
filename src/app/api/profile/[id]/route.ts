import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    const userId = parseInt(id || '');

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Reformat favorites to extract just the recipe object
    const favorites = user.favorites.map((fav) => fav.recipe);

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      postedRecipes: user.recipes,
      favoriteRecipes: favorites,
    });
  } catch (error) {
    console.error('[GET_USER_BY_ID_ERROR]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}