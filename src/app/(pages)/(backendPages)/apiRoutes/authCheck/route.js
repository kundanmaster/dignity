// src/app/pages/api/auth/check.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
export const GET = async (req) => {
  const token = req.cookies.get('token');
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    console.log(jwt.verify(token, process.env.JWT_SECRET));
    console.log("token found");
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    console.log("error on token", error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
};
