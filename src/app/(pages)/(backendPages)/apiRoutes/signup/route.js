import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';

export const POST = async (request) => {

  const body = await request.json();

  const { firstname, lastname, email, password } = body;

  if (!firstname || !email || !password) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role ="user";
    const result = await client.query(
      'INSERT INTO users (firstname, lastname, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [firstname, lastname, email, hashedPassword,role]
    );

    return NextResponse.json({ success: true, userId: result.rows[0].id }, { status: 201 });

  } catch (error) {
    console.error('Error during signup:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

  } finally {

    client.release();

  }
};
