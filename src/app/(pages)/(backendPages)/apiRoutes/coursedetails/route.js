import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const GET = async () => {
  try {
    const client = await pool.connect();

    const result = await client.query(`
      SELECT DISTINCT ON (e.paypal_order_id)
        e.*, 
        s.instructor_id,
        u.firstname AS instructor_first_name,
        u.lastname AS instructor_last_name,
        s.url AS course_url
      FROM public.enrollment e
      INNER JOIN public.schedule s ON e.course_id = s.course_id
      INNER JOIN public.users u ON s.instructor_id = u.id
      ORDER BY e.paypal_order_id, e.create_time DESC;
    `);

    client.release();

    if (result.rows.length > 0) {
      return NextResponse.json(
        { success: true, enrollmentData: result.rows },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "No enrollment data found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching enrollment data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
