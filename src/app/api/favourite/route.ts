import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/getuser';


export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { recipeId } = await request.json();
    if (!recipeId) return NextResponse.json({ error: 'Missing recipeId' }, { status: 400 });

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Recipe already favorited' },
        { status: 409 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        recipeId,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: 'Favorited', favorite });
  } catch (error) {
    console.error('Error in POST /api/favourite:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
// app/api/favourite/route.ts
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error in GET /api/favourite:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { recipeId } = await request.json();
    if (!recipeId) return NextResponse.json({ error: 'Missing recipeId' }, { status: 400 });

    await prisma.favorite.delete({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId,
        },
      },
    });

    return NextResponse.json({ message: 'Unfavorited' });
  } catch (error) {
    console.error('Error in DELETE /api/favourite:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}