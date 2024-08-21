"use client";
import React, { useState, useEffect } from "react";
import CustomTable from "@/components/client/common/CustomTable";
import AdminDashboardLayout from "@/components/server/admin/dashboard/AdminDashboardLayout";
import axios from "axios";

const EnrollHistory = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState([
    {
      key: "search",
      label: "Search",
      type: "text",
      value: "",
      placeholder: "Search by user ID or enrollment ID...",
    },
  ]);

  const headers = [
    { key: "id", label: "Id" },
    { key: "course_title", label: "Course Title" },
    { key: "user_id", label: "User ID" },
    { key: "first_name", label: "User Name" },
    { key: "instructor_id", label: "Instructor ID" },
    { key: "instructor_first_name", label: "Instructor Name" },
    { key: "date_time", label: "Start Date" },
    { key: "paypal_order_id", label: "PayPal Order ID" },
    { key: "course_price", label: "Course Price" },
    { key: "transaction_status", label: "Transaction Status" },
  ];

  const fetchEnrollmentData = async (searchTerm) => {
    try {
      let url = "/apiRoutes/paypalcaptureorder";
      if (searchTerm) {
        url += `?user_id=${searchTerm}&id=${searchTerm}`;
      }
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching enrollment data:", error);
    }
  };

  useEffect(() => {
    fetchEnrollmentData();
  }, []);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.key === "search" ? { ...filter, value: searchTerm } : filter
      )
    );
    fetchEnrollmentData(searchTerm);
  };

  return (
    <AdminDashboardLayout>
      <div>
        <CustomTable
          data={data}
          headers={headers}
          filters={filters}
          handleFilterChange={handleSearchChange}
          handleSearchChange={handleSearchChange}
        />
      </div>
    </AdminDashboardLayout>
  );
};

export default EnrollHistory;
