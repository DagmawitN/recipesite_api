import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id; 
  const data = await request.json();

  try {
    const updated = await prisma.recipe.update({
      where: { id }, 
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PUT /api/recipe_request/[id]]', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
