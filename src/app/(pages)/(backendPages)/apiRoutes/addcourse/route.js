import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/db";


export const GET = async (request) => {
  let id = request.nextUrl.searchParams.get("id");
  // const token = request.cookies.get("token")?.value; 

  // if (!token) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const client = await pool.connect(); 

    let result;

    if (id) {
      result = await client.query("SELECT * FROM courses WHERE id = $1", [id]);
    } else {
      result = await client.query("SELECT * FROM courses ORDER BY id ASC");
    }

    client.release();

    if (result.rows.length > 0) {
      return NextResponse.json(
        { success: true, courses: result.rows },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "Courses not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  const token = req.cookies.get("token")?.value;
  console.log("token details", token);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded.id);
    const client = await pool.connect();

    const {
      courseOverviewProvider,
      courseOverviewUrl,
      coursePrice,
      courseTitle,
      description,
      discountedPrice,
      faq,
      hasDiscount,
      isFreeCourse,
      metaDescription,
      metaKeywords,
      requirements,
      selectedLanguage,
      selectedProgrammingLanguage,
      selectedProgrammingLevel,
      shortDescription,
      lesson,
      section,
      status,
      thumbnail,
      coursetype
    } = await req.json();

    const courseId = Math.floor(100 + Math.random() * 90000);
    const createdBy = decoded.id;
    console.log(courseId);

    const insertQuery = `
      INSERT INTO courses (
        course_id,
        course_overview_provider,
        course_overview_url,
        course_price,
        course_title,
        description,
        discounted_price,
        faq,
        has_discount,
        is_free_course,
        meta_description,
        meta_keywords,
        requirements,
        selected_language,
        selected_programming_language,
        selected_programming_level,
        short_description,
        created_by, 
        lesson,
        section,
        status,
        thumbnail,
        coursetype
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      ) RETURNING *;
    `;

    const result = await client.query(insertQuery, [
      courseId,
      courseOverviewProvider,
      courseOverviewUrl,
      coursePrice,
      courseTitle,
      description,
      discountedPrice,
      faq,
      hasDiscount,
      isFreeCourse,
      metaDescription,
      metaKeywords,
      requirements,
      selectedLanguage,
      selectedProgrammingLanguage,
      selectedProgrammingLevel,
      shortDescription,
      createdBy,
      lesson,
      section,
      status,
      thumbnail,
      coursetype
    ]);

    client.release();

    if (result.rows.length > 0) {
      const course = result.rows[0];
      return NextResponse.json({ success: true, course }, { status: 201 });
    } else {
      return NextResponse.json({ error: "Course not added" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error inserting course details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  const token = req.cookies.get("token")?.value;
  console.log("token details", token);
  let id = req.nextUrl.searchParams.get("id");
  console.log(id);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded.id);
    const client = await pool.connect();

    const {
      id,
      courseOverviewProvider,
      courseOverviewUrl,
      coursePrice,
      courseTitle,
      description,
      discountedPrice,
      faq,
      hasDiscount,
      isFreeCourse,
      metaDescription,
      metaKeywords,
      requirements,
      selectedLanguage,
      selectedProgrammingLanguage,
      selectedProgrammingLevel,
      shortDescription,
      lesson,
      section,
      status,
      thumbnail,
      coursetype
    } = await req.json();

    const updateQuery = `
      UPDATE courses
      SET
        course_overview_provider = $2,
        course_overview_url = $3,
        course_price = $4,
        course_title = $5,
        description = $6,
        discounted_price = $7,
        faq = $8,
        has_discount = $9,
        is_free_course = $10,
        meta_description = $11,
        meta_keywords = $12,
        requirements = $13,
        selected_language = $14,
        selected_programming_language = $15,
        selected_programming_level = $16,
        short_description = $17,
        lesson = $18,
        section = $19,
        status = $20,
        thumbnail = $21,
        coursetype = $22
      WHERE
        id = $1
      RETURNING *;
    `;

    const result = await client.query(updateQuery, [
      id,
      courseOverviewProvider,
      courseOverviewUrl,
      coursePrice,
      courseTitle,
      description,
      discountedPrice,
      faq,
      hasDiscount,
      isFreeCourse,
      metaDescription,
      metaKeywords,
      requirements,
      selectedLanguage,
      selectedProgrammingLanguage,
      selectedProgrammingLevel,
      shortDescription,
      lesson,
      section,
      status,
      thumbnail,
      coursetype
    ]);

    client.release();

    if (result.rows.length > 0) {
      const updatedCourse = result.rows[0];
      return NextResponse.json({ success: true, course: updatedCourse }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Course not found or updated" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error updating course details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};


// DELETE handler
export const DELETE = async (req) => {
  const token = req.cookies.get("token")?.value;
  const id = req.nextUrl.searchParams.get("id");
  console.log(id);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await pool.connect();

    const deleteQuery = `
      DELETE FROM courses
      WHERE id = $1
      RETURNING *;
    `;

    const result = await client.query(deleteQuery, [id]);

    client.release();

    if (result.rows.length > 0) {
      return NextResponse.json({ success: true, message: "Course deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Course not found or not deleted" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};