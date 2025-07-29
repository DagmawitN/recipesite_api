import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleOptions } from '@/lib/cors';

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return withCors(
      req,
      NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    );
  }

  const { comment, rating, userId, recipeId } = body;

  if (!comment || !rating || !userId || !recipeId) {
    return withCors(
      req,
      NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    );
  }

  if (isNaN(Number(recipeId))) {
    return withCors(
      req,
      NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 })
    );
  }

  try {
    const review = await prisma.review.create({
      data: {
        comment,
        rating,
        userId,
        recipeId: Number(recipeId),
      },
    });

    return withCors(req, NextResponse.json(review));
  } catch (error) {
    console.error('[POST_REVIEW_ERROR]', error);
    return withCors(
      req,
      NextResponse.json({ error: 'Server error' }, { status: 500 })
    );
  }
}

export function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}
