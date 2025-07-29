import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const requests = await prisma.recipeRequest.findMany();
    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error('Error fetching recipe requests:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe requests' }, { status: 500 });
  }
}