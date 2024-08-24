import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Update the import path as needed

export async function GET(request) {
  // Access searchParams directly outside of try/catch
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("user_id");

  if (!id) {
    return NextResponse.json(
      { error: "instructor_id is required" },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();
    
    const query = `
      SELECT e.*, 
             u.firstname AS instructor_first_name, 
             u.lastname AS instructor_last_name
      FROM public.enrollment e
      LEFT JOIN public.users u
      ON e.instructor_id = u.id
      WHERE e.instructor_id = $1
    `;

    const result = await client.query(query, [parseInt(id)]);

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "No records found for the provided id" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("Error fetching enrollment data:", error);
    return NextResponse.json(
      { error: "Error fetching enrollment data" },
      { status: 500 }
    );
  }
}
