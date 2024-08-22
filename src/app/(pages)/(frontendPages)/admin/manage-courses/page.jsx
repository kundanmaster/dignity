"use client";
import React, { useState, useEffect } from "react";
import AdminDashboardLayout from "@/components/server/admin/dashboard/AdminDashboardLayout";
import CustomTable from "@/components/client/common/CustomTable";
import axios from "axios";
import { useRouter } from "next/navigation";
import { deleteCourse } from "@/utils/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners"; // Import the spinner component

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/apiRoutes/addcourse");
      if (response.data.success) {
        setCourses(response.data.courses);
        setLoading(false);
      } else {
        console.error("Failed to fetch courses:", response.data.error);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const [filters, setFilters] = useState([
    {
      key: "category",
      label: "Category",
      type: "select",
      value: "",
      placeholder: "",
      filterOptions: [
        { value: "Physics", label: "Physics" },
        { value: "Math", label: "Math" },
      ],
    },
    {
      key: "level",
      label: "Level",
      type: "select",
      value: "",
      placeholder: "",
      filterOptions: [
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
      ],
    },
    {
      key: "search",
      label: "Search",
      type: "text",
      value: "",
      placeholder: "Search...",
    },
  ]);

  const headers = [
    { key: "id", label: "Id" },
    { key: "course_title", label: "Course Title" },
    { key: "selected_programming_language", label: "Category" },
    { key: "section", label: "Section & Lesson" },
    { key: "enroll", label: "Enroll Student" },
    { key: "status", label: "Status" },
    { key: "course_price", label: "Price" },
  ];

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(
      filters.map((filter) =>
        filter.key === id.replace("Filter", "") ? { ...filter, value } : filter
      )
    );
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setFilters(
      filters.map((filter) =>
        filter.key === "search" ? { ...filter, value } : filter
      )
    );
  };

  const cardsData = [
    { label: "Active Courses", value: courses.length },
    { label: "Pending Courses", value: 0 },
    { label: "Free Courses", value: courses.filter(course => course.is_free_course).length },
    { label: "Paid Courses", value: courses.filter(course => !course.is_free_course).length },
  ];

  const onEdit = (id) => {
    console.log("Edit clicked for ID:", id);
    if (id) {
      router.push(`/admin/add-new-course/${id}`);
    } else {
      toast.warning(`Invalid course ID: ${id}`);
      console.log("Invalid ID");
      return;
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await deleteCourse(id);
      toast.success("Course deleted successfully:", response);
      console.log("Course deleted successfully:", response);
      await fetchCourses();
      setLoading(false);
    } catch (error) {
      toast.error("Error deleting course:", error);
      console.error("Error deleting course:", error);
      setLoading(false);
    }
  };

  const dropdownItems = [
    { label: "Edit", onClick: (id) => () => onEdit(id) },
    { label: "Delete", onClick: (id) => () => handleDelete(id) },
  ];

  return (
    <>
      <AdminDashboardLayout>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <ClipLoader size={50} color={"#F27B21"} loading={loading} />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
              {cardsData.map((card, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-clip-border rounded-xl bg-gradient-to-tr from-black/65 to-black/95 border-black/80 text-white shadow-gray-900/20 shadow-md p-8"
                >
                  <div className="text-center text-gray-700">
                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-primarygold uppercase">
                      {card.label}
                    </p>
                    <h1 className="flex justify-center gap-1 mt-6 font-sans antialiased font-normal tracking-normal text-white text-3xl">
                      <span className="">{card.value}</span>
                    </h1>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white shadow-gray-900/20">
              <div className="mt-8">
                <CustomTable
                  data={courses}
                  headers={headers}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  handleSearchChange={handleSearchChange}
                  items={dropdownItems}
                  filterOptions={{
                    category: [
                      { value: "id", label: "Id" },
                      { value: "course", label: "Course" },
                    ],
                    level: [
                      { value: "Beginner", label: "Beginner" },
                      { value: "Intermediate", label: "Intermediate" },
                    ],
                  }}
                  customCellRender={(item, header) => {
                    if (header.key === "section" || header.key === "lesson") {
                      return (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {header.key === "section"
                              ? `T-Section: ${item.section}`
                              : `T-Lesson: ${item.lesson}`}
                          </div>
                        </td>
                      );
                    } else {
                      return (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item[header.key]}
                          </div>
                        </td>
                      );
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </AdminDashboardLayout>
    </>
  );
};

export default ManageCourses;
