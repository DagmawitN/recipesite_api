import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { signToken } from '@/lib/auth';
import { withCors, handleOptions } from '@/lib/cors';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      isAdmin: true, 
    },
  });

  if (!user) {
    return withCors(request, NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }));
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return withCors(request, NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }));
  }

  const token = signToken({ id: user.id, email: user.email, isAdmin: user.isAdmin });

  return withCors(request, NextResponse.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin, 
    },
    token,
  }));
}

export function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}
