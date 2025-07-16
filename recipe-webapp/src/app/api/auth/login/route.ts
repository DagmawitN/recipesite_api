import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      isAdmin: true, // 👈 include isAdmin
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // 👇 include isAdmin in token
  const token = signToken({ id: user.id, email: user.email, isAdmin: user.isAdmin });

  return NextResponse.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin, // 👈 include in response
    },
    token,
  });
}
