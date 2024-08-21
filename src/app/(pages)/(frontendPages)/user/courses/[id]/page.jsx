"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/authContext";
import axios from "axios";
import { useParams } from "next/navigation";

const fetchCourseDetails = async (id) => {
  try {
    const response = await axios.get(`/apiRoutes/paypalcaptureorder?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course details:", error);
    return null;
  }
};

const CoursesPage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    const getCourseDetails = async () => {
      const data = await fetchCourseDetails(id);
      setCourse(data);
      setLoading(false);
    };

    getCourseDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (!course) return <p>Course not found</p>;

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-5">
        
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <Image
            src={course.img || "/images/pages/first_aid.jpg"}
            alt={course[0].capture_id ? `Course image for ${course[0].capture_id}` : "Course image"}
            width={1200}
            height={500}
            className="object-cover w-full h-64"
          />
          <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-lg">
            <p className="text-xl font-semibold">{course[0].capture_id}</p>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{course[0].capture_id}</h2>
          <p className="text-lg mb-4">{course[0].description}</p>
          <p className="text-sm text-gray-600 mb-2">
            Instructor: {course[0].instructor_first_name} {course[0].instructor_last_name}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Course Title: {course[0].course_title}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Start Date: {course[0].date_time}
          </p>
          <p className="text-lg font-semibold mb-4">
            Price: ${course[0].course_price}
          </p>

          <div className="flex justify-between items-center">
            <Link target="_blank"
            // https://meet.google.com/erv-qmrf-aiy
              href={`${course[0].course_url}`}
              className="bg-primarygold text-white px-6 py-2 rounded-lg hover:bg-goldlight hover:text-white transition-colors"
            >
              Start Class
            </Link>
         
            <Link href={'/user/courses'} className="bg-primarygold text-white px-6 py-2 rounded-lg hover:bg-goldlight hover:text-white transition-colors">
                Go To Course
            </Link>

    
            {user?.role === "admin" && (
              <Link 
                href={`/admin/edit/${course[0].course_url}`}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Edit Course
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
