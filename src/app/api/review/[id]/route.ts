import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/getuser';
import { withCors, handleOptions } from '@/lib/cors';

function getRecipeIdFromRequest(req: NextRequest): number | null {
  const url = new URL(req.url);
  const parts = url.pathname.split('/');
  const idStr = parts[parts.length - 1]; 

  const id = Number(idStr);
  return isNaN(id) ? null : id;
}

export async function POST(req: NextRequest) {
  const recipeId = getRecipeIdFromRequest(req);
  if (recipeId === null) {
    return withCors(req, NextResponse.json({ error: 'Invalid recipe id' }, { status: 400 }));
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    return withCors(req, NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    return withCors(req, NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }));
  }

  const { comment, rating } = body;

  if (!comment || !rating) {
    return withCors(req, NextResponse.json({ error: 'Missing fields' }, { status: 400 }));
  }

  try {
    const review = await prisma.review.create({
      data: {
        comment,
        rating,
        userId: user.id,
        recipeId,
      },
      include: {
        user: {
          select: { name: true, imageUrl: true },
        },
      },
    });

    return withCors(req, NextResponse.json(review));
  } catch (error) {
    console.error('[POST_REVIEW_ERROR]', error);
    return withCors(req, NextResponse.json({ error: 'Server error' }, { status: 500 }));
  }
}

export async function GET(req: NextRequest) {
  const recipeId = getRecipeIdFromRequest(req);
  if (recipeId === null) {
    return withCors(req, NextResponse.json({ error: 'Invalid recipe id' }, { status: 400 }));
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
