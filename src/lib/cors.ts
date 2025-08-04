import { NextRequest, NextResponse } from 'next/server';

const allowedOrigin = 'https://balemuya-recipesite.vercel.app/'; 

export function withCors(req: NextRequest, res: NextResponse) {
  const newRes = res.clone();
  newRes.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  newRes.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newRes.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return newRes;
}

export function handleOptions(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
