import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        status: 'APPROVED',
        ...(category ? { category: { name: category } } : {}),
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        category: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error('[GET_RECIPES_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}
