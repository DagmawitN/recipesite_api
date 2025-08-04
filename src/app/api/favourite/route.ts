import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/getuser';
import { withCors, handleOptions } from '@/lib/cors';

async function parseJson(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  console.log('POST /api/favourite');
  
  const user = await getUserFromRequest(request);
  if (!user) {
    return withCors(request, NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
  }

  const body = await parseJson(request);
  if (!body || !body.recipeId) {
    return withCors(request, NextResponse.json({ error: 'Missing or invalid recipeId' }, { status: 400 }));
  }

  const { recipeId } = body;

  try {
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

    console.log('Favorited:', favorite);
    return withCors(request, NextResponse.json({ message: 'Favorited', favorite }));
  } catch (error) {
    console.error(' POST error:', error);
    return withCors(request, NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }));
  }
}

export async function GET(request: NextRequest) {
  console.log('GET /api/favourite');

  const user = await getUserFromRequest(request);
  if (!user) {
    return withCors(request, NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: { recipe: true }, // Optional: include recipe details
    });

    return withCors(request, NextResponse.json(favorites));
  } catch (error) {
    console.error('GET error:', error);
    return withCors(request, NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }));
  }
}

export async function DELETE(request: NextRequest) {
  console.log('DELETE /api/favourite');

  const user = await getUserFromRequest(request);
  if (!user) {
    return withCors(request, NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
  }

  const body = await parseJson(request);
  if (!body || !body.recipeId) {
    return withCors(request, NextResponse.json({ error: 'Missing or invalid recipeId' }, { status: 400 }));
  }

  const { recipeId } = body;

  try {
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
    console.error(' DELETE error:', error);
    return withCors(
      request,
      NextResponse.json(
        {
          error: 'Internal Server Error',
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      )
    );
  }
}

export function OPTIONS(request: NextRequest) {
  console.log('OPTIONS /api/favourite');
  return handleOptions(request);
}
