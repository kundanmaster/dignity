'use client'
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { ClipLoader } from "react-spinners";
import Header from "../../components/client/common/Header";
import Image from "next/image";

// Fallback image URL
const FALLBACK_IMAGE = "/images/pages/instructor.jpg";

const InstructorPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/apiRoutes/manage-instructor");
        if (!response.ok) {
          throw new Error("Failed to fetch instructors");
        }
        const data = await response.json();
        setStudents(data.users);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={"#F27B21"} loading={loading} />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="p-4">
        <Typography variant="h4" className="mb-4 p-4">
          Instructors
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {students.map((instructor) => (
            <Card key={instructor.id} className="w-full max-w-sm mx-auto p-4">
              <CardHeader color="blue-gray" className="relative h-32">
                <Image
                  src={instructor.profilePicture || FALLBACK_IMAGE}
                  alt={instructor.firstname}
                  height={500}
                  width={500}
                  size="lg"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
              </CardHeader>
              <CardBody>
                <Typography variant="h6" className="font-bold text-center mb-2">
                  {instructor.firstname}
                </Typography>
                <Typography variant="small" className="text-center">
                  {instructor.email}
                </Typography>
                <Typography
                  variant="small"
                  className="text-center text-gray-600 mt-1"
                >
                  {instructor.role}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default InstructorPage;
