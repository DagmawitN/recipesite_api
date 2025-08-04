import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/getuser';
import { withCors, handleOptions } from '@/lib/cors';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return withCors(request, NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    }

    const { recipeId } = await request.json();
    if (!recipeId) {
      return withCors(request, NextResponse.json({ error: 'Missing recipeId' }, { status: 400 }));
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId,
        },
      },
    });

    if (existing) {
      return withCors(request, NextResponse.json({ error: 'Recipe already favorited' }, { status: 409 }));
    }

    const favorite = await prisma.favorite.create({
      data: {
        recipeId,
        userId: user.id,
      },
    });

    return withCors(request, NextResponse.json({ message: 'Favorited', favorite }));
  } catch (error) {
    console.error('Error in POST /api/favourite:', error);
    return withCors(request, NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }));
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return withCors(request, NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
    });

    return withCors(request, NextResponse.json(favorites));
  } catch (error) {
    console.error('Error in GET /api/favourite:', error);
    return withCors(request, NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }));
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return withCors(request, NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    }

    const { recipeId } = await request.json();
    if (!recipeId) {
      return withCors(request, NextResponse.json({ error: 'Missing recipeId' }, { status: 400 }));
    }

    await prisma.favorite.delete({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId,
        },
      },
    });

    return withCors(request, NextResponse.json({ message: 'Unfavorited' }));
  } catch (error) {
    console.error('Error in DELETE /api/favourite:', error);
    return withCors(request, NextResponse.json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 }));
  }
}

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}
