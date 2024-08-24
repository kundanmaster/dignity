"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth/authContext";
import InstructorDashboardLayout from "@/components/server/instructor/dashboard/InstructorDahboardLayout";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const fetchEnrollmentData = async (id) => {
  try {
    const response = await axios.get(`/apiRoutes/schedule?instructor_id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching enrollment data:", error);
    return [];
  }
};

const InstructorSchedules = () => {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const id = user?.id;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await fetchEnrollmentData(id);
        setEnrollmentData(data.schedules);
        setFilteredData(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);
  console.log(enrollmentData);

  useEffect(() => {
    const filtered = enrollmentData.filter(
      (item) => item.id // Adjust filter field
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [searchTerm, enrollmentData]);

  // Calculate pagination details
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // Commented out pagination slice
  // const paginatedData = filteredData.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

//   const handlebutton = (item) => {
//     router.push(`/instructor/enroll-class/${item.id}`);
//   };

  return (
    <InstructorDashboardLayout>
      <div>
        <div className="flex justify-end pb-2">
          <Link href="/instructor/schedule-card">
            <button className="bg-goldlight hover:bg-primarygold text-white px-4 py-2 rounded-lg">
              Schedule slot
            </button>
          </Link>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="pb-4 bg-white dark:bg-gray-900">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search course by ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Course ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Instructor ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Time From
                </th>
                <th scope="col" className="px-6 py-3">
                  Time To
                </th>
                <th scope="col" className="px-6 py-3">
                  URL
                </th>
                <th scope="col" className="px-6 py-3">
                  Updated At
                </th>
                {/* <th scope="col" className="px-6 py-3">
                  Action
                </th> */}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {item.course_id}
                    </td>
                    <td className="px-6 py-4">{item.instructor_id}</td>
                    <td className="px-6 py-4">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{item.time_from}</td>
                    <td className="px-6 py-4">{item.time_to}</td>
                    <td className="px-6 py-4">{item.url}</td>
                    <td className="px-6 py-4">
                      {new Date(item.updated_at).toLocaleDateString()}
                    </td>
                    {/* <td className="px-6 py-4">
                      <button
                        className="px-4 py-2 rounded-lg text-white bg-goldlight hover:bg-primarygold"
                        onClick={() => handlebutton(item)}
                      >
                        View class
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-4 py-2 mx-1 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </InstructorDashboardLayout>
  );
};

export default InstructorSchedules;
