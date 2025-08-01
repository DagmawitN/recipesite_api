import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/getuser';
import { withCors, handleOptions } from '@/lib/cors';

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  const requestId = parseInt(id || '');

  const user = await getUserFromRequest(request);

  if (!user || !user.isAdmin) {
    return withCors(request, NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
  }

  const { status, categoryId } = await request.json();

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return withCors(request, NextResponse.json({ error: 'Invalid status' }, { status: 400 }));
  }

  const recipeRequest = await prisma.recipeRequest.findUnique({
    where: { id: requestId },
  });

  if (!recipeRequest) {
    return withCors(request, NextResponse.json({ error: 'Recipe request not found' }, { status: 404 }));
  }

  if (status === 'REJECTED') {
    await prisma.recipeRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });

    return withCors(request, NextResponse.json({ message: 'Recipe request rejected' }, { status: 200 }));
  }

  try {
    const recipe = await prisma.recipe.create({
      data: {
        title: recipeRequest.title,
        imageUrl: recipeRequest.imageUrl,
        status: 'APPROVED',
        userId: recipeRequest.userId,
        categoryId: categoryId,
      },
    });

    await prisma.ingredient.create({
      data: {
        list: recipeRequest.ingredients as Prisma.InputJsonValue,
        recipeId: recipe.id,
      },
    });

    await prisma.instruction.create({
      data: {
        step: recipeRequest.instructions as Prisma.InputJsonValue,
        recipeId: recipe.id,
      },
    });

    await prisma.recipeRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' },
    });

    return withCors(request, NextResponse.json({ message: 'Recipe approved and created successfully' }, { status: 201 }));
  } catch (error) {
    console.error('Error approving recipe:', error);
    return withCors(request, NextResponse.json({ error: 'Failed to approve recipe' }, { status: 500 }));
  }
}

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}
