// src/app/api/recipe/[id]/route.ts

import { prisma } from '@/lib/db';
import {  NextResponse } from 'next/server';

export async function POST(
  req: Request,
  context: { params: { id: string } }
) {
  const recipeId = context.params.id;

  let body;
  try {
    body = await req.json();
  } catch (_error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { comment, rating, userId } = body;

  if (!comment || !rating || !userId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const review = await prisma.review.create({
      data: {
        comment,
        rating,
        userId,
        recipeId,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('[POST_REVIEW_ERROR]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
