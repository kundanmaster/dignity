"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/server/user/dashboard/DashboardLayout";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "@/hooks/auth/authContext";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useRouter } from "next/navigation";

const fetchEnrollmentData = async (id) => {
  try {
    const response = await axios.get(`/apiRoutes/paypalcaptureorder?user_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching enrollment data:", error);
    return [];
  }
};

const fetchCourses = async () => {
  try {
    const response = await axios.get("/apiRoutes/addcourse");
    if (response.data.success && Array.isArray(response.data.courses)) {
      return response.data.courses;
    } else {
      console.error("Failed to fetch courses:", response.data.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

const CoursesPage = () => {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const id = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const enrollment = await fetchEnrollmentData(id);
        setEnrollmentData(enrollment);
      }
      const courses = await fetchCourses();
      setCoursesData(courses);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  console.log(enrollmentData);

  const handleNext = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === coursesData.length - 4 ? 0 : prevSlide + 1
    );
  };

  const handlePrev = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? coursesData.length - 4 : prevSlide - 1
    );
  };

  const handleRouteOnclick = (courseId) => {
    router.push(`/user/enrollpage/${courseId}`);
  };

  // Placeholder data while loading
  const placeholderData = [
    {
      course_title: "Loading...",
      value: 0,
      href: "/",
      img: "/images/pages/first_aid.jpg",
    },
  ];


  if (loading) return <p>Loading...</p>;

  if (!enrollmentData) return <p>Course not found</p>;
  return (
    <DashboardLayout>
      <div className="text-2xl font-bold">Your Enrolled Course...</div>
      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
          {(loading ? placeholderData : enrollmentData).map((card, index) => (
            <Link key={index} href={card.href || `/user/courses/${card.id}`}>
              <div className="relative flex flex-col bg-clip-border rounded-xl overflow-hidden bg-gradient-to-tr from-white/65 to-white/95 border-black/80 text-white shadow-gray-900/20 shadow-md h-full">
                <div className="relative h-64">
                  <Image
                    src={card.img || "/images/pages/first_aid.jpg"}
                    alt="Course Image"
                    width={500}
                    height={500}
                    className="rounded-t-xl object-cover"
                  />
                </div>
                <div className="absolute bottom-0 w-full p-4 bg-black bg-opacity-60 text-left">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-primarygold uppercase">
                    <span className="text-white">Course Title: </span> {card.course_title}
                  </p>
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-primarygold uppercase">
                    <span className="text-white">Course ID:</span> {card.course_id}
                  </p>
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-primarygold uppercase">
                    <span className="text-white">Time:</span> {card.date_time}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="text-2xl font-bold py-5">Course Suggestion</div>
      <div className="py-10">
        <div className="relative flex justify-center items-center space-x-4">
          <button
            onClick={handlePrev}
            className="absolute left-0 text-gray-500 hover:text-gray-700 focus:outline-none bg-black/20 hover:bg-black/40 h-full px-3 z-10"
          >
            <MdArrowBackIosNew size={20} />
          </button>
          <div className="flex space-x-4 overflow-x-hidden">
            <div className="flex justify-center space-x-4">
              {coursesData
                .slice(currentSlide, currentSlide + 4)
                .map((card, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col bg-clip-border rounded-xl overflow-hidden bg-gradient-to-tr from-black/65 to-black/95 border-black/80 text-white shadow-gray-900/20 shadow-md min-w-[250px]"
                  >
                    <div className="relative h-64">
                      <Image
                        src={card.img || "/images/pages/first_aid.jpg"}
                        alt="Course Suggestion Image"
                        width={500}
                        height={500}
                        className="rounded-t-xl object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 w-full p-4 bg-black bg-opacity-60 flex flex-col justify-between">
                      <div className="flex justify-between mb-2">
                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-primarygold uppercase">
                          {card.course_title}
                        </p>
                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-primarygold uppercase">
                          ${card.course_price}
                        </p>
                      </div>
                      <div className="text-center">
                        <button
                          onClick={() => handleRouteOnclick(card.id)}
                          className="bg-primarygold text-black px-4 py-2 rounded-lg hover:bg-goldlight hover:text-white transition-colors"
                        >
                          Enroll
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <button
            onClick={handleNext}
            className="absolute right-0 text-gray-500 hover:text-gray-700 focus:outline-none bg-black/20 hover:bg-black/40 h-full px-3 z-10"
          >
            <MdArrowForwardIos size={20} />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoursesPage;
