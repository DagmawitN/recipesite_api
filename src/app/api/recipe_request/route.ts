import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleOptions } from '@/lib/cors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, imageUrl, instructions, ingredients, userId } = body;

    if (!title || !ingredients || !userId) {
      return withCors(
        req,
        NextResponse.json(
          { error: 'Missing required fields: title, ingredients, or userId' },
          { status: 400 }
        )
      );
    }

    const request = await prisma.recipeRequest.create({
      data: {
        title,
        imageUrl: imageUrl || '',
        instructions: instructions || '',
        ingredients,
        userId,
      },
    });

    return withCors(req, NextResponse.json(request, { status: 201 }));
  } catch (error) {
    console.error('[POST /api/recipe_request]', error);
    return withCors(
      req,
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    );
  }
}

export function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}
