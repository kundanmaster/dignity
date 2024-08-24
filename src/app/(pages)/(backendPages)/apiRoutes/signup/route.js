import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';

export const POST = async (request) => {
  const body = await request.json();
  const { firstname, lastname, email, password, role } = body;

  if (!firstname || !email || !password) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    // Check if the email already exists
    const emailCheckResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (emailCheckResult.rows.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash the password and insert the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertResult = await client.query(
      'INSERT INTO users (firstname, lastname, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [firstname, lastname, email, hashedPassword, role]
    );

    return NextResponse.json({ success: true, userId: insertResult.rows[0].id }, { status: 201 });

  } catch (error) {
    console.error('Error during signup:', error);

    // Handle duplicate key error
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

  } finally {
    client.release();
  }
};
