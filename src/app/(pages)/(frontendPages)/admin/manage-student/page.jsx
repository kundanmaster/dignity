"use client";
import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "@/components/server/admin/dashboard/AdminDashboardLayout";
import CustomTable from "@/components/client/common/CustomTable";
import { useRouter } from "next/navigation";
import { deleteStudent } from "@/utils/api";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
const ManageStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchStudents = async () => {
      try {
        const response = await fetch("/apiRoutes/manage-student");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);
  console.log("students", students);
  const [filters, setFilters] = useState([
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
    { key: "firstname", label: "First Name" },
    { key: "lastname", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    // { key: "action", label: "Action" },
  ];

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

  const dropdownItems = [
    // { key: "id", label: "Edit", onClick: (id) => () => onEdit(id) },
    { label: "Edit", onClick: (id) => () => onEdit(id) },

    {
      label: "Delete",
      onClick: (id) => () => handleDelete(id),
    },
  ];

  const onEdit = (id) => {
    if (id) {
      router.push(`/admin/add-new-student/${id}`);
      console.log("Id Selected: " + id);
    } else {
      console.log("Invalid ID");
      return;
    }
    // Add your edit logic here using the id
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      console.log(id);
      const response = await deleteStudent(id);
      toast.success("Student deleted successfully");
      console.log("Student deleted successfully:", response);
      // await fetchCourses(); // Fetch updated course data
      setLoading(false);
    } catch (error) {
      toast.error("Failed to delete student");
      console.error("Error deleting student:", error);
      setLoading(false);
    }
  };

  return (
    <AdminDashboardLayout>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader size={50} color={"#f0b65e"} loading={loading} />
        </div>
      ) : (
        <div>
          <CustomTable
            data={students}
            headers={headers}
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleSearchChange={handleSearchChange}
            items={dropdownItems}
            filterOptions={{
              category: [
                { value: "id", label: "Id" },
                { value: "Math", label: "Math" },
              ],
              // level: [
              //   { value: "Beginner", label: "Beginner" },
              //   { value: "Intermediate", label: "Intermediate" },
              // ],
            }}
          />
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default ManageStudent;
