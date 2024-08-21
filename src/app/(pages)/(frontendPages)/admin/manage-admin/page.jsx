"use client"
import React, { useState, useEffect } from "react";
import CustomTable from "@/components/client/common/CustomTable";
import AdminDashboardLayout from "@/components/server/admin/dashboard/AdminDashboardLayout";
import { useRouter } from "next/navigation";
import { deleteAdmin } from "@/utils/api";
import { ClipLoader } from "react-spinners";
const ManageAdmin = () => {
  // const [data, setData] = useState([
  //   {
  //     id: 1,
  //     coupon: "Course 1",
  //     discount: "Physics",
  //     validity: "Lesson 1",
  //     action: "Edit",
  //   },
  //   {
  //     id: 2,
  //     coupon: "Course 2",
  //     discount: "Math",
  //     validity: "Lesson 2",
  //     action: "Edit",
  //   },
  //   {
  //     id: 3,
  //     coupon: "Course 3",
  //     discount: "Chemistry",
  //     validity: "Lesson 3",
  //     action: "Edit",
  //   },
  //   {
  //     id: 4,
  //     coupon: "Course 4",
  //     discount: "Biology",
  //     validity: "Lesson 4",
  //     action: "Edit",
  //   },
  //   {
  //     id: 5,
  //     coupon: "Course 5",
  //     discount: "History",
  //     validity: "Lesson 5",
  //     action: "Edit",
  //   },
  //   // ...more data as needed
  // ]);

  // Filters state
  const [admin, setAdmin] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    const fetchAdmin = async () => {
      try {
        const response = await fetch('/apiRoutes/manage-admin');
        if (!response.ok) {
          throw new Error('Failed to fetch Admin');
          
        }
        const data = await response.json();
        setAdmin(data.users); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Admin:', error);
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);
  console.log("Admin", admin);
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
    { key: "firstname", label: "First Name" },
    { key: "lastname", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    // { key: "action", label: "Action" },
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


  const dropdownItems = [
    // { key: "id", label: "Edit", onClick: (id) => () => onEdit(id) },
    {  label: "Edit", onClick: (id) => () => onEdit(id) },

    {
      
      label: "Delete",
      onClick: (id)=> () => handleDelete(id),
    },
  ];

  const onEdit = (id) => {
    if(id){
      router.push(`/admin/add-new-admin/${id}`);
      console.log("Id Selected: " + id);
    }else{
      console.log("Invalid ID");
      return;
    }
    // Add your edit logic here using the id
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      console.log(id);
      const response = await deleteAdmin(id);
      console.log("Admin deleted successfully:", response);
      // await fetchCourses(); // Fetch updated course data
      setLoading(false);
    } catch (error) {
      console.error("Error deleting course:", error);
      setLoading(false);
    }
  };
  return (
    <div>
      <AdminDashboardLayout>
      {loading ? (
          <div className="flex justify-center items-center h-screen">
            <ClipLoader size={50} color={"#f0b65e"} loading={loading} />
          </div>
        ) : (
        <div>
          <CustomTable
            data={admin}
            headers={headers}
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleSearchChange={handleSearchChange}
            items={dropdownItems}
            filterOptions={{
              category: [
                { value: "id", label: "Id" },
                { value: "firstname", label: "First Name" },
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
    </div>
  );
};

export default ManageAdmin;
