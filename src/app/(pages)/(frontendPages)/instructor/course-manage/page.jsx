"use client";
import React, { useState, useEffect } from "react";
import InstructorDashboardLayout from "@/components/server/instructor/dashboard/InstructorDahboardLayout";
import CustomTable from "@/components/client/common/CustomTable";
import axios from "axios";
import { useRouter } from "next/navigation";
import { deleteCourse } from "@/utils/api";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import Link from "next/link";

const CourseManage = () => {
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
      key: "search",
      label: "Search",
      type: "text",
      value: "",
      placeholder: "Search by Course Title, Language, etc.",
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      value: "",
      placeholder: "Select Status",
      filterOptions: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      key: "level",
      label: "Level",
      type: "select",
      value: "",
      placeholder: "Select Level",
      filterOptions: [
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
      ],
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      value: "",
      placeholder: "Select Category",
      filterOptions: [
        { value: "health", label: "Health" },
        { value: "technology", label: "Technology" },
        // Add more categories as needed
      ],
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
    const key = id.replace("Filter", "");
    const updatedFilters = filters.map((filter) =>
      filter.key === key ? { ...filter, value } : filter
    );
    setFilters(updatedFilters);
    // Trigger re-filtering
    filterCourses(updatedFilters.find((filter) => filter.key === "search")?.value || "");
  };
  

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setFilters(
      filters.map((filter) =>
        filter.key === "search" ? { ...filter, value } : filter
      )
    );
    filterCourses(value); // Call the function to filter courses
  };
  
  const filterCourses = (searchTerm) => {
    if (!searchTerm) {
      setCourses(courses); // Reset to show all courses if searchTerm is empty
      return;
    }
    const filteredCourses = courses.filter((course) => {
      return (
        course.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.selected_language.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_price.toString().includes(searchTerm)
      );
    });
    setCourses(filteredCourses);
  };

  const cardsData = [
    { label: "Active Courses", value: courses.length },
    { label: "Pending Courses", value: 0 },
    {
      label: "Free Courses",
      value: courses.filter((course) => course.is_free_course).length,
    },
    {
      label: "Paid Courses",
      value: courses.filter((course) => !course.is_free_course).length,
    },
  ];

  const onEdit = (id) => {
    if (id) {
      router.push(`/instructor/add-new-course/${id}`);
    } else {
      toast.warning(`Invalid course ID: ${id}`);
      console.log("Invalid ID");
      return;
    }
  };
  useEffect(() => {
    if (courses.length === 0 && !loading) {
      toast.error("No courses found. Please refine your search or try again.");
    }
  }, [courses, loading]);
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
    <div>
      <InstructorDashboardLayout>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <ClipLoader size={50} color={"#f0b65e"} loading={loading} />
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
                <div className="flex justify-end">
                  <Link href="/instructor/add-new-course/">
                    <button className="rounded-full p-2 m-2 border-2 hover:border-black hover:text-amber-400">
                      + Add Course
                    </button>
                  </Link>
                </div>
                <CustomTable
                  data={courses}
                  headers={headers}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  handleSearchChange={handleSearchChange}
                  items={dropdownItems}
                  filterOptions={{
                    status: [
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                    ],
                    level: [
                      { value: "Beginner", label: "Beginner" },
                      { value: "Intermediate", label: "Intermediate" },
                    ],
                    category: [
                      { value: "health", label: "Health" },
                      { value: "technology", label: "Technology" },
                    ],
                  }}
                  customCellRender={(item, header) => {
                    if (header.key === "section" || header.key === "lesson") {
                      return (
                        <td key={header} className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {header.key === "section"
                              ? `T-Section: ${item.section}`
                              : `T-Lesson: ${item.lesson}`}
                          </div>
                        </td>
                      );
                    } else {
                      return (
                        <td key={header} className="px-6 py-4 whitespace-nowrap">
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
      </InstructorDashboardLayout>
    </div>
  );
};

export default CourseManage;
