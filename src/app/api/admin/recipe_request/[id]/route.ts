import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/getuser';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recipeRequestId = parseInt(params.id);
    if (isNaN(recipeRequestId)) {
      return NextResponse.json({ error: 'Invalid recipe request ID' }, { status: 400 });
    }

    const body = await req.json();
    const { categoryId } = body;

    if (!categoryId) {
      return NextResponse.json({ error: 'categoryId is required' }, { status: 400 });
    }

    // Get recipe request
    const recipeRequest = await prisma.recipeRequest.findUnique({
      where: { id: recipeRequestId },
    });

    if (!recipeRequest) {
      return NextResponse.json({ error: 'Recipe request not found' }, { status: 404 });
    }

    // Create the recipe
    const recipe = await prisma.recipe.create({
      data: {
        title: recipeRequest.title,
        imageUrl: recipeRequest.imageUrl,
        status: 'APPROVED',
        userId: recipeRequest.userId,
        categoryId: categoryId,
      },
    });

    // Delete the original request
    await prisma.recipeRequest.delete({
      where: { id: recipeRequestId },
    });

    return NextResponse.json({ message: 'Recipe approved and created', recipe });
  } catch (error) {
    console.error('Error in approving recipe:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}