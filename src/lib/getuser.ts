// lib/getuser.ts
import { verifyToken } from './auth';

export async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload || typeof payload !== 'object' || !('id' in payload)) {
    return null;
  }

  return payload; // expected to contain at least { id: number }
}
