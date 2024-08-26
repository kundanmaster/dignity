"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useAuth } from "@/hooks/auth/authContext";

const Banner = () => {
  const { user } = useAuth();
  const [selectedCourseType, setSelectedCourseType] = useState("classroom");
  const [location, setLocation] = useState("");
  const [selected_language, setLanguage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const handleCourseTypeChange = (type) => {
    setSelectedCourseType(type);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleSeeAvailableClasses = async () => {
    const payload = {
      coursetype: selectedCourseType,
      // location,
      selected_language,
      course_title: selectedCourse,
    };

    try {
      const response = await fetch("/apiRoutes/coursedetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch available classes");
      }

      const data = await response.json();
      console.log("Available Classes:", data);

      // Redirect to the available classes page or show results
      // For example:
      // router.push('/available-classes');
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const classroomCourses = [
    "HIPPA",
    "Bloodborne Pathogens",
    "Basic Life Support",
    "Pediatric Life Support",
    "Advanced Cardiac Life Support",
    "CPR and First Aid",
    "Food Handlers Card",
    "Dementia Care and Management",
    "Fall Prevention Awareness Training",
    "Supporting Individuals Diagnosed with Attention Deficit Hyperactivity Disorder",
    "End of Life Care",
    "Principles of Positive Behavior Support",
  ];

  const zoomClasses = [
    "Article 9",
    "Positive Behaviour Support",
    "Preventive Abuse, Neglect, and Exploitation",
    "Foundational Leadership Development",
    "Becoming a Skilled Caregiver",
  ];

  const courseOptions =
    selectedCourseType === "classroom" ? classroomCourses : zoomClasses;

  return (
    <>
      <div id="online">
        {user && user.role === "user" && (
          <div className="bg-[#faf7f3] py-2">
            <div className="container mx-auto flex justify-center items-center px-4">
              <p className="text-6xl font-bold">
                Welcome Back {user?.firstname}!
              </p>
            </div>
          </div>
        )}
        <div className="bg-[#faf7f3] py-2">
          <div className="container mx-auto flex justify-center items-center px-4">
            <p className="text-4xl font-bold">
              Welcome To Dignity Medical Training{" "}
            </p>
          </div>
        </div>
        <div className="bg-[#faf7f3] py-10">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-center md:text-left p-4">
              <h2 className="text-4xl font-bold mb-2">Enroll in Training Now</h2>
              <p className="text-lg text-gray-600 mb-4">
                Provides a range of certification and training programs,
                including online options.
              </p>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-around mb-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="course-type"
                      className="form-radio text-red-500"
                      defaultChecked
                      onChange={() => handleCourseTypeChange("classroom")}
                    />
                    <span className="ml-2 text-sm flex items-center">
                      <i className="fas fa-chalkboard-teacher mr-2"></i> Classroom Courses
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="course-type"
                      className="form-radio text-red-500"
                      onChange={() => handleCourseTypeChange("zoom")}
                    />
                    <span className="ml-2 text-sm flex items-center">
                      <i className="fas fa-video mr-2"></i> Zoom Classes
                    </span>
                  </label>
                  {/* <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="course-type"
                      className="form-radio text-red-500"
                    />
                    <span className="ml-2 text-sm flex items-center">
                      <i className="fas fa-laptop mr-2"></i> Online - Self Paced
                    </span>
                  </label> */}
                </div>
                <div className="flex space-x-2">
                  <select
                    className="border border-gray-300 rounded px-3 py-2 w-1/3"
                    value={location}
                    onChange={handleLocationChange}
                  >
                    <option value="">Location</option>
                    <option value="arizona">Arizona</option>
                  </select>
                  <select
                    className="border border-gray-300 rounded px-3 py-2 w-1/3"
                    value={selected_language}
                    onChange={handleLanguageChange}
                  >
                    <option value="">Language</option>
                    <option value="English">English</option>
                    <option value="spanish">Spanish</option>
                  </select>
                  <select
                    className="border border-gray-300 rounded px-3 py-2 w-1/3"
                    value={selectedCourse}
                    onChange={handleCourseChange}
                  >
                    <option value="">Select Course</option>
                    {courseOptions.map((course, index) => (
                      <option key={index} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleSeeAvailableClasses}
                  className="mt-4 bg-primarygold text-white py-2 px-6 rounded-full w-full hover:bg-goldlight hover:text-white transition-colors duration-300"
                >
                  SEE AVAILABLE CLASSES
                </button>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 flex justify-end">
              <Image
                src="/images/pages/enroll timing now.jpg"
                alt="Training"
                width={600}
                height={200}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        <div
          className="relative w-full h-64 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/pages/at2.png')` }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="text-center text-white">
              <FaStar className="text-6xl mb-4 mx-auto" />
              <h1 className="text-2xl md:text-3xl font-bold">
                Greetings from at - Your Dignity Medical TRAINING Partner
              </h1>
            </div>
          </div>
        </div>
        <section
          className="flex flex-col md:flex-row items-center bg-white py-12"
          id="aboutus"
        >
          <div className="md:w-1/2 w-full flex justify-center md:justify-end">
            <Image
              src="/images/pages/at2.png"
              alt="Classroom Image"
              width={600}
              height={100}
              className="rounded-l-lg"
            />
          </div>
          <div className="md:w-1/2 w-full bg-goldlight p-8 rounded-r-lg">
            <h2 className="text-white text-2xl font-bold mb-4">
              Why use Dignity Medical Training ?
            </h2>
            <p className="text-white mb-4">
              DMT provides healthcare professionals in Phoenix with
              comprehensive training and invaluable hands-on experience, taught
              by experienced instructors dedicated to top-tier education. You'll
              acquire practical skills and in-depth knowledge essential for
              furthering your careers in healthcare. Join Dignity Medical
              Training today and take an important step toward realizing your
              professional goals as a caregiver or healthcare professional; with
              its focus on excellence and community impact, Dignity Medical
              Training stands as your trusted partner in professional
              development, guaranteeing you are prepared for success in
              healthcare.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default Banner;
