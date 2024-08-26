// pages/api/stripe-payment.js
import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // Adjust the path to your actual db file
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(req) {
  const client = await pool.connect();

  try {
    // Parse the request body
    const { amount, currency, enrollmentData } = await req.json();

    // Ensure that the origin is set; otherwise, use a fallback URL
    const origin = req.headers.origin || "https://dignity-sand.vercel.app";
    // const origin = req.headers.origin || "https://localhost:3000";

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: enrollmentData.courseTitle,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
    //   success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    //   success_url: `http://localhost:3000/stripe-success?amount={amount}`,
      success_url: `${origin}/stripe-success?amount=${amount/100}`,
      cancel_url: `${origin}/`,
      metadata: enrollmentData, // Attach additional data to the session
    });

    // Retrieve payment intent to get payment status and ID
    const paymentIntent = session.payment_intent
      ? await stripe.paymentIntents.retrieve(session.payment_intent)
      : null;

    // Generate fallback values if payment data is not available
    const paymentIntentId = paymentIntent
      ? paymentIntent.id
      : Math.floor(Math.random() * 1000000000).toString();
    const transactionStatus = paymentIntent ? paymentIntent.status : "unknown";

    // Insert payment and additional details into the database
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
      (paypal_order_id, user_id, course_id, first_name, last_name, instructor_id, url, email, phone_number, address, additional_info, date_time, location, course_title, course_price, transaction_status, create_time) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW()) 
      RETURNING id;
    `;

    const result = await client.query(insertQuery, [
      session.id, // Using Stripe session ID as a placeholder for PayPal order ID
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
      transactionStatus, // transaction_status
    ]);
    console.log(result);

    // Return session ID for client-side handling
    return NextResponse.json(
      { success: true, sessionId: session.id, enrollmentId: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing Stripe payment:", error);
    return NextResponse.json(
      { error: "Error processing Stripe payment" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
