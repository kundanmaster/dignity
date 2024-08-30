import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // Adjust the path to your actual db file

// const PAYPAL_API = "https://api-m.sandbox.paypal.com/v2/checkout/orders";
const PAYPAL_API = "https://api-m.paypal.com/v2/checkout/orders";
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET;

const getAccessToken = async () => {
  const response = await fetch(
    // "https://api-m.sandbox.paypal.com/v1/oauth2/token",
     "https://api-m.paypal.com/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    }
  );

  const data = await response.json();
  return data.access_token;
};

export async function POST(req) {
  const client = await pool.connect();

  try {
    const { orderId, enrollmentData } = await req.json();
    console.log("data sending are:", { orderId }, { enrollmentData });

    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API}/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const capture = await response.json();

    if (!response.ok) {
      throw new Error(capture.error || "Error capturing PayPal order");
    }

    // Insert the order details into the database
    const {
      user_id,
      course_id,
      firstName,
      lastName,
      instructor_id,
      url,
      email,
      phoneNumber,
      address,
      additionalInfo,
      date_time,
      location,
      courseTitle,
      course_price,
    } = enrollmentData;

    const insertQuery = `
      INSERT INTO enrollment 
      ( paypal_order_id, user_id, course_id, first_name, last_name, instructor_id, url, email, phone_number, address, additional_info, date_time, location, course_title, course_price, transaction_status, capture_id, create_time) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW()) 
      RETURNING id;
    `;

    const result = await client.query(insertQuery, [
      orderId,
      user_id,
      course_id,
      firstName,
      lastName,
      instructor_id,
      url,
      email,
      phoneNumber,
      address,
      additionalInfo,
      date_time,
      location,
      courseTitle,
      course_price,
      capture.status, // transaction_status
      capture.id, // capture_id
      // capture.create_time, // create_time
    ]);

    return NextResponse.json(
      { success: true, enrollmentId: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return NextResponse.json(
      { error: "Error capturing PayPal order" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
// Adjust the import based on your project structure


export async function GET(req) {
  const client = await pool.connect();

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const userId = url.searchParams.get("user_id");
    const id = url.searchParams.get("id");

    // Convert query parameters to integers if they are numbers
    const userIdInt = userId && !isNaN(parseInt(userId)) ? parseInt(userId) : undefined;
    const idInt = id && !isNaN(parseInt(id)) ? parseInt(id) : undefined;

    // Simulate an admin check (replace with actual auth check)
    const isAdmin = true; // Set this condition to check if the user is an admin

    // Ensure at least one parameter is provided if not an admin
    if (!isAdmin && !userIdInt && !idInt) {
      return NextResponse.json(
        { error: "Either user_id or id is required" },
        { status: 400 }
      );
    }

    // Build query conditions based on parameters
    let queryConditions = [];
    let queryParams = [];
    if (!isAdmin) {
      if (userIdInt) {
        queryConditions.push(`e.user_id = $${queryParams.length + 1}`);
        queryParams.push(userIdInt);
      }
      if (idInt) {
        queryConditions.push(`e.id = $${queryParams.length + 1}`);
        queryParams.push(idInt);
      }
    }

    const queryConditionString = queryConditions.length > 0 ? `WHERE ${queryConditions.join(' OR ')}` : '';

    // Construct query
    const query = `
      SELECT e.*, 
        u.firstname AS instructor_first_name, 
        u.lastname AS instructor_last_name
      FROM public.enrollment e
      LEFT JOIN public.users u ON e.instructor_id = u.id
      ${queryConditionString}
    `;

    const result = await client.query(query, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "No enrollment data found for the provided criteria" },
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
  } finally {
    client.release();
  }
}
