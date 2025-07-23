import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;

type Payload = {
  id: number;
  email: string;
  isAdmin: boolean;
};

export function signToken(payload: Payload): string {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET || 'your-secret';
  try {
    return jwt.verify(token, secret);
  } catch  {
    return null;
  }
}
