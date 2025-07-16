import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/getuser';

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { recipeId } = await request.json();
  if (!recipeId) return NextResponse.json({ error: 'Missing recipeId' }, { status: 400 });

  const favorite = await prisma.favorite.create({
    data: {
      recipeId,
      userId: user.id,
    },
  });

  return NextResponse.json({ message: 'Favorited', favorite });
}

export async function DELETE(request: Request) {
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
}
