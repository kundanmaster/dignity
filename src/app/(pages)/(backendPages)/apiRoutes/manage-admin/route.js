// pages/apiRoutes/userdetails.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/db";
import bcrypt from 'bcrypt';

export const GET = async (req) => {
    const id = req.nextUrl.searchParams.get("id");
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Verify the JWT token (make sure to set your JWT_SECRET in environment variables)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const client = await pool.connect();

        let result;
        if (id) {
            // If an ID is provided, fetch the user with that ID
            result = await client.query("SELECT * FROM users WHERE id = $1", [id]);
        } else {
            // If no ID is provided, fetch all users with the role 'admin'
            result = await client.query("SELECT * FROM users WHERE role = 'admin'");
        }

        client.release();

        if (result.rows.length > 0) {
            // Transform data to include individual social fields
            const transformedUsers = result.rows.map(user => {
                let socialinfo = {};
                try {
                    // Handle cases where socialinfo is null or empty
                    socialinfo = user.socialinfo ? JSON.parse(user.socialinfo) : {};
                } catch (e) {
                    // Handle the case where JSON parsing fails
                    console.error('Error parsing socialinfo JSON:', e);
                }

                // Return user data with individual social fields
                return {
                    ...user,
                    facebook: socialinfo.facebook || '',
                    linkedin: socialinfo.linkedin || '',
                    twitter: socialinfo.twitter || ''
                };
            });

            return NextResponse.json({ success: true, users: transformedUsers }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Users not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};

export const POST = async (req) => {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      biography,
      email,
      firstname,
      lastname,
      password,
      userImage,
      facebook,
      linkedin,
      twitter,
    } = await req.json();

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Combine social information into a single field
    const socialinfo = { facebook, linkedin, twitter };

    const client = await pool.connect();

    const query = `
      INSERT INTO users (biography, email, firstname, lastname, password, userimage, socialinfo, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      biography,
      email,
      firstname,
      lastname,
      hashedPassword,
      userImage,
      JSON.stringify(socialinfo),
      "admin",
    ];

    const result = await client.query(query, values);

    client.release();

    if (result.rows.length > 0) {
      const user = result.rows[0];
      return NextResponse.json({ success: true, user }, { status: 201 });
    } else {
      return NextResponse.json({ error: "User not inserted" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error inserting user details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const { id, biography, email, firstname, lastname, password, userImage, facebook, linkedin, twitter } = await req.json();
  
      // Encrypt the password if it's provided
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  
      // Combine social information into a single field
      const socialinfo = { facebook, linkedin, twitter };
  
      const client = await pool.connect();
  
      // Prepare the update query with conditional fields
      const fields = [];
      const values = [];
      let index = 1;
  
      if (biography) {
        fields.push(`biography = $${index++}`);
        values.push(biography);
      }
      if (email) {
        fields.push(`email = $${index++}`);
        values.push(email);
      }
      if (firstname) {
        fields.push(`firstname = $${index++}`);
        values.push(firstname);
      }
      if (lastname) {
        fields.push(`lastname = $${index++}`);
        values.push(lastname);
      }
      if (hashedPassword) {
        fields.push(`password = $${index++}`);
        values.push(hashedPassword);
      }
      if (userImage) {
        fields.push(`userimage = $${index++}`);
        values.push(userImage);
      }
      fields.push(`socialinfo = $${index++}`);
      values.push(JSON.stringify(socialinfo));
  
      // Add the user ID to the values array
      values.push(id);
  
      const query = `
        UPDATE users
        SET ${fields.join(', ')}
        WHERE id = $${index}
        RETURNING *
      `;
  
      const result = await client.query(query, values);
  
      client.release();
  
      if (result.rows.length > 0) {
        const user = result.rows[0];
        return NextResponse.json({ success: true, user }, { status: 200 });
      } else {
        return NextResponse.json({ error: "User not updated" }, { status: 400 });
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };


  export const DELETE = async (req) => {
    const token = req.cookies.get("token")?.value;
    const id = req.nextUrl.searchParams.get("id");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
  
      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }
  
      const client = await pool.connect();
  
      const query = `
        DELETE FROM users
        WHERE id = $1
        RETURNING *
      `;
  
      const result = await client.query(query, [id]);
      client.release();
  
      if (result.rows.length > 0) {
        const user = result.rows[0];
        return NextResponse.json({ success: true, user }, { status: 200 });
      } else {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };

  