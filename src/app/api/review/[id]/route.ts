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
    const reviews = await prisma.review.findMany({
      where: { recipeId: recipeId },
      include: {
        user: {
          select: { name: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch {
    console.error('[GET_REVIEWS_ERROR]');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}