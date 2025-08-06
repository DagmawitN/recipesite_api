import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = [
  'https://balemuya-recipesite.vercel.app', // production
  'http://localhost:3000', // local dev
];

export function withCors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0]; // default to prod if not matched

  const newRes = res.clone();
  newRes.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  newRes.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newRes.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return newRes;
}

export function handleOptions(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

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
