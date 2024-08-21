"use client"
import React, { useState } from "react";
import CustomTable from "@/components/client/common/CustomTable";
import AdminDashboardLayout from "@/components/server/admin/dashboard/AdminDashboardLayout";

const InstructorRevenue = () => {
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
    { key: "enrolled course", label: "Enrolled course" },
    { key: "instructor", label: "Instructor" },
    { key: "Total", label: "Total amount" },
    { key: "instructor", label: "Instructor revenue" },
    { key: "action", label: "Action" },
  ];

  // Handle filter change
  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(
      filters.map((filter) =>
        filter.key === id.replace("Filter", "") ? { ...filter, value } : filter
      )
    );
  };

  // Handle search change
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setFilters(
      filters.map((filter) =>
        filter.key === "search" ? { ...filter, value } : filter
      )
    );
  };
  return (
    <div>
      <AdminDashboardLayout>
        <div>
          <CustomTable
            data={data}
            headers={headers}
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleSearchChange={handleSearchChange}
            filterOptions={{
              category: [
                { value: "instructor", label: "Instructor" },
                { value: "Total", label: "Total" },
              ],
              level: [
                { value: "Beginner", label: "Beginner" },
                { value: "Intermediate", label: "Intermediate" },
              ],
            }}
          />
        </div>
      </AdminDashboardLayout>
    </div>
  );
};

export default InstructorRevenue;
