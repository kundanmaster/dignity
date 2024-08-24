"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/auth/authContext";

const fetchClassDetails = async (id) => {
  try {
    const response = await axios.get(`/apiRoutes/enrollwithid?id=${id}`);
    return response.data; // Assuming this returns an array of class objects
  } catch (error) {
    console.error("Error fetching class details:", error);
    return [];
  }
};

const EnrollClass = () => {
  const [classData, setClassData] = useState([]); // Handle an array of items
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    const getClassDetails = async () => {
      const data = await fetchClassDetails(id);
      setClassData(data);
      setLoading(false);
    };

    getClassDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (classData.length === 0) return <p>No classes found</p>; // Handle no data scenario

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {classData.map((classItem) => (
          <div key={classItem.capture_id} className="relative mb-6">
            <Image
              src={classItem.img || "/images/pages/first_aid.jpg"}
              alt={classItem.course_title ? `Image for ${classItem.course_title}` : "Class image"}
              width={1200}
              height={500}
              className="object-cover w-full h-64"
            />
            <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-lg">
              <p className="text-xl font-semibold">{classItem.capture_id}</p>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">{classItem.course_title}</h2>
              <p className="text-lg mb-4">{classItem.description}</p>
              <p className="text-sm text-gray-600 mb-4">
                Start Date: {classItem.date_time}
              </p>

              <div className="flex justify-between items-center">
                <Link
                  href={`${classItem.url}`}
                  target="_blank"
                  className="bg-primarygold text-white px-6 py-2 rounded-lg hover:bg-goldlight hover:text-white transition-colors"
                >
                  Start Class
                </Link>

                <Link
                  href="/instructor/enroll-class"
                  className="bg-primarygold text-white px-6 py-2 rounded-lg hover:bg-goldlight hover:text-white transition-colors"
                >
                  Back to Enroll Class
                </Link>

                {user?.role === "admin" && (
                  <Link
                    href={`/admin/edit/${classItem.capture_id}`}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Edit Class
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrollClass;
