"use client";
import React, { useState, useEffect } from "react";
import SearchableSelect from "@/components/client/common/SearchableSelect";
import AdminDashboardLayout from "@/components/server/admin/dashboard/AdminDashboardLayout";
import axios from "axios";
import { useAuth } from "@/hooks/auth/authContext";
import { ClipLoader } from "react-spinners";
const CourseEnrollment = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  const Course_Details = [
    { label: "Beginner", value: "Beginner", category: "level" },
    { label: "Intermediate", value: "Intermediate", category: "level" },
    { label: "Advanced", value: "Advanced", category: "level" },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/apiRoutes/manage-student");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data.users);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get("/apiRoutes/addcourse"); // Assuming the API route is at /api/courses
        if (response.data.success) {
          console.log(response.data.courses);
          setCourses(response.data.courses); // Update courses state with fetched data
        } else {
          console.error("Failed to fetch courses:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
    fetchStudents();
  }, []);
  
  const [formData, setFormData] = useState({
    userDetails: "",
    courseDetails: "",
  });

  const handleUserSelect = (selectedOption) => {
    setUserDetails(selectedOption);
    setFormData({ ...formData, userDetails: selectedOption?.value || "" });
  };

  const handleCourseSelect = (selectedOption) => {
    setCourseDetails(selectedOption);
    setFormData({ ...formData, courseDetails: selectedOption?.value || "" });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    setTimeout(() => {
      console.log(formData);
      setLoading(false); // Set loading to false after submission
    }, 2000);
  };

  return (
    <AdminDashboardLayout>
      <div>
        <div className="p-10 bg-white shadow-md rounded-md">
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3"></div>
            <div className="md:w-1/2">
              <h1>Enrollment Form</h1>
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Users <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="md:w-1/2">
              {students?.length > 0 ? (
                <SearchableSelect
                  options={students.map((student) => ({
                    label:
                      student.id +
                      " - " +
                      student.firstname +
                      " " +
                      student.lastname,
                    value: student.id,
                  }))}
                  onSelect={(value) => handleUserSelect(value)}
                />
              ) : (
               <p><ClipLoader size={20} color={"#F27B21"} /></p> 
              )}
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Course to enroll <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="md:w-1/2">
              {courses.length > 0 ? (
                <SearchableSelect
                  options={courses.map((course) => ({
                    label: course.course_id + " - " + course.course_title + " ",
                    value: course.course_id,
                  }))}
                  onSelect={(value) => handleCourseSelect(value)}
                />
              ) : (
                <p><ClipLoader size={20} color={"#F27B21"}/></p>
              )}
            </div>
          </div>

          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3"></div>
            <div className="md:w-1/2">
              <button
                className={`btn-design-1 ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p>Submitting...</p>
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default CourseEnrollment;
