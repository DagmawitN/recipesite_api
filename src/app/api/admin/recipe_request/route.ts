import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleOptions } from '@/lib/cors';

export async function GET(req: NextRequest) {
  try {
    const requests = await prisma.recipeRequest.findMany();
    return withCors(req, NextResponse.json(requests, { status: 200 }));
  } catch (error) {
    console.error('Error fetching recipe requests:', error);
    return withCors(req, NextResponse.json({ error: 'Failed to fetch recipe requests' }, { status: 500 }));
  }
}

export function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}
