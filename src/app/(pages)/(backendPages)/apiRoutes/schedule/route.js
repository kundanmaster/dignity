import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from "@/lib/db"; // Ensure this imports your database connection


export const GET = async (req) => {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const token = req.cookies.get("token")?.value;
  
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      // Verify the JWT token (make sure to set your JWT_SECRET in environment variables)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Connect to the database
      const client = await pool.connect();
      let result;
  
      if (id) {
        // If an ID is provided, fetch the user with that ID
        result = await client.query("SELECT * FROM schedule WHERE course_id = $1", [id]);
      } else {
        // If no ID is provided, fetch all schedule with the role 'user'
        result = await client.query("SELECT * FROM schedule");
      }
  
      client.release();
  
      // Return the fetched data
      return NextResponse.json({ authenticated: true, schedules: result.rows }, { status: 200 });
  
    } catch (error) {
      console.error("Error verifying token or fetching data", error);
      return NextResponse.json({ authenticated: false, message: 'Authentication failed or error fetching data' }, { status: 401 });
    }
  };



export const POST = async (req) => {
  try {
    // Parse the request body
    const schedules = await req.json();

    if (!Array.isArray(schedules) || schedules.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty data' }, { status: 400 });
    }

    // Prepare SQL query
    const query = `
      INSERT INTO schedule (course_id, date, instructor_id, time_to, time_from, url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    // Insert each schedule entry into the database
    const client = await pool.connect();
    try {
      await client.query('BEGIN'); // Start transaction

      const insertedSchedules = [];
      for (const schedule of schedules) {
        const { courseID, date, instructorID, time_to, time_from, url } = schedule;

        // Validate the required fields
        if (!courseID || !date || !instructorID || !time_to || !time_from || !url) {
          await client.query('ROLLBACK');
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const values = [courseID, date, instructorID, time_to, time_from, url];
        const result = await client.query(query, values);

        if (result.rows.length > 0) {
          insertedSchedules.push(result.rows[0]);
        } else {
          await client.query('ROLLBACK');
          return NextResponse.json({ error: 'Schedule not inserted' }, { status: 400 });
        }
      }

      await client.query('COMMIT'); // Commit transaction
      return NextResponse.json({ success: true, schedules: insertedSchedules }, { status: 201 });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error inserting schedules:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
