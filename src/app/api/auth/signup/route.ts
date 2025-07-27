import { prisma } from '@/lib/db';
import { NextResponse , NextRequest} from 'next/server';
import bcrypt from 'bcrypt';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { email, password, name, isAdmin = false } = await request.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      isAdmin, 
    },
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin, 
  });

  return NextResponse.json({
    message: 'Signup successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    },
    token,
  });
}
