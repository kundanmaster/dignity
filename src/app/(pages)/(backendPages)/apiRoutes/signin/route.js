// src/app/pages/api/auth/signin/route.js

import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
export const POST = async (req) => {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { email, password } = await req.json();
  
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }
  const client = await pool.connect();

  try {
 
    const result = await client.query(
      'SELECT id, firstname, lastname, email, password,role FROM users WHERE email = $1',
      [email]
    );
  
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isValid = await bcrypt.compare(password, user.password);

      if (isValid) {
        const token = jwt.sign(
          { id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname , role: user.role},
          process.env.JWT_SECRET,
          { expiresIn: '1d' } // 1 day
        );
        const response = NextResponse.json({ success: true, user,token}, { status: 200 });
        response.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 24, path: '/' });
       
        return response;
      }
    }

    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  } catch (error) {
    console.error('Error during signin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
};
