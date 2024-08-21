// src/app/pages/api/auth/signout/route.js
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  return response;
};
