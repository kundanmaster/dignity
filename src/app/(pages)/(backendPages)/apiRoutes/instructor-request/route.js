// pages/apiRoutes/instructor-request.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/db";

export const GET = async (req) => {
  const id = req.nextUrl.searchParams.get("id");
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await pool.connect();

    let result;
    if (id) {
      result = await client.query("SELECT * FROM users WHERE id = $1", [id]);
    } else {
      result = await client.query(
        "SELECT * FROM users WHERE role = 'instructor' AND verified = 'unverified'"
      );
    }

    client.release();

    if (result.rows.length > 0) {
      const transformedUsers = result.rows.map((user) => {
        let socialinfo = {};
        try {
          socialinfo = user.socialinfo ? JSON.parse(user.socialinfo) : {};
        } catch (e) {
          console.error("Error parsing socialinfo JSON:", e);
        }

        return {
          ...user,
          facebook: socialinfo.facebook || "",
          linkedin: socialinfo.linkedin || "",
          twitter: socialinfo.twitter || "",
        };
      });

      return NextResponse.json(
        { success: true, users: transformedUsers },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "Users not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PATCH = async (req) => {
  const id = req.nextUrl.searchParams.get("id");
  console.log(id);

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const client = await pool.connect();

    const result = await client.query(
      "UPDATE users SET verified = 'verified' WHERE id = $1 RETURNING *",
      [id]
    );

    client.release();

    if (result.rows.length > 0) {
      return NextResponse.json(
        { success: true, user: result.rows[0] },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error updating instructor:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
