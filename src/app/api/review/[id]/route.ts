import { prisma } from '@/lib/db';
import {  NextResponse } from 'next/server';

export async function GET(
  req:Request,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: { recipeId: params.id },
      include: {
        user: {
          select: { name: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch  {
    console.error('[GET_REVIEWS_ERROR]');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
