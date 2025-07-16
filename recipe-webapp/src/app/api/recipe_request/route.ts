import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { title, imageUrl, instructions, ingredients, userId } = await req.json();

  if (!title || !ingredients || !userId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const request = await prisma.recipeRequest.create({
    data: {
      title,
      imageUrl,
      instructions,
      ingredients, // expects array of { name, amount, unit }
      userId,
    },
  });

  return NextResponse.json(request);
}
