"use client";
import React, { useState } from "react";
import CustomTable from "@/components/client/common/CustomTable";
import InstructorDashboardLayout from "@/components/server/instructor/dashboard/InstructorDahboardLayout";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners"; // Import the spinner component
const SalesReport = () => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([
    {
      // id: 1,
      // coupon: "Course 1",
      // discount: "Physics",
      // validity: "Lesson 1",
      // action: "Edit",
    },
    // {
    //   id: 2,
    //   coupon: "Course 2",
    //   discount: "Math",
    //   validity: "Lesson 2",
    //   action: "Edit",
    // },
    // {
    //   id: 3,
    //   coupon: "Course 3",
    //   discount: "Chemistry",
    //   validity: "Lesson 3",
    //   action: "Edit",
    // },
    // {
    //   id: 4,
    //   coupon: "Course 4",
    //   discount: "Biology",
    //   validity: "Lesson 4",
    //   action: "Edit",
    // },
    // {
    //   id: 5,
    //   coupon: "Course 5",
    //   discount: "History",
    //   validity: "Lesson 5",
    //   action: "Edit",
    // },
    // ...more data as needed
  ]);

  // Filters state
  const [filters, setFilters] = useState([
    {
      key: "search",
      label: "Search",
      type: "text",
      value: "",
      placeholder: "Search...",
    },
  ]);

  // Table headers configuration
  const headers = [
    { key: "id", label: "Id" },
    { key: "Course", label: "course" },
    { key: "instructor", label: "instructor" },
    { key: "revenue", label: "revenue" },
    { key: "action", label: "Action" },
  ];

  // Handle filter change
  // const handleFilterChange = (e) => {
  //   const { id, value } = e.target;
  //   setFilters(
  //     filters.map((filter) =>
  //       filter.key === id.replace("Filter", "") ? { ...filter, value } : filter
  //     )
  //   );
  // };

  // Handle search change
  // const handleSearchChange = (e) => {
  //   const { value } = e.target;
  //   setFilters(
  //     filters.map((filter) =>
  //       filter.key === "search" ? { ...filter, value } : filter
  //     )
  //   );
  // };
  return (
    <div>
      <InstructorDashboardLayout>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <ClipLoader size={50} color={"#F27B21"} loading={loading} />
          </div>
        ) : (
          <div>
            <CustomTable
              data={data}
              headers={headers}
              filters={filters}
              // handleFilterChange={handleFilterChange}
              // handleSearchChange={handleSearchChange}
              filterOptions={{
                category: [
                  { value: "id", label: "Id" },
                  { value: "revenue", label: "Revenue" },
                ],
                level: [
                  { value: "Beginner", label: "Beginner" },
                  { value: "Intermediate", label: "Intermediate" },
                ],
              }}
            />
          </div>
        )}
      </InstructorDashboardLayout>
    </div>
  );
};

export default SalesReport;
