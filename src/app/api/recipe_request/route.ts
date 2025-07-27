import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, imageUrl, instructions, ingredients, userId } = body;

    if (!title || !ingredients || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, ingredients, or userId' },
        { status: 400 }
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

    return NextResponse.json(request, { status: 201 });

  } catch (error) {
    console.error('[POST /api/recipe_request]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
