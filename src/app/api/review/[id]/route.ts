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
    const reviews = await prisma.review.findMany({
      where: { recipeId },
      include: {
        user: {
          select: { name: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return withCors(req, NextResponse.json(reviews));
  } catch (error) {
    console.error('[GET_REVIEWS_ERROR]', error);
    return withCors(req, NextResponse.json({ error: 'Server error' }, { status: 500 }));
  }
}

export function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}
