import { prisma } from '@/lib/db';
import {  NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { title, imageUrl, instructions, ingredients, userId } = await req.json();

  if (!title || !ingredients || !userId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const request = await prisma.recipeRequest.create({
    data: {
      title,
      imageUrl,
      instructions,
      ingredients, 
      userId,
    },
  });

  return NextResponse.json(request);
}
