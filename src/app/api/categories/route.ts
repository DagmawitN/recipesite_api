import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { withCors, handleOptions } from '@/lib/cors';

export async function GET(req: NextRequest) {
  const categories = await prisma.category.findMany();
  return withCors(req, NextResponse.json(categories));
}

export function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}