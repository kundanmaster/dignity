"use client";
import React, { useState } from "react";
import InstructorDashboardLayout from "@/components/server/instructor/dashboard/InstructorDahboardLayout";
import { useAuth } from "@/hooks/auth/authContext";

const ManageProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstname || "",
    lastName: user?.lastname || "",
    email: user?.email || "",
    bio: user?.biography || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic, e.g., sending the updated data to an API
    console.log("Profile updated:", formData);
  };

  return (
    <InstructorDashboardLayout>
      <div className=" bg-white">
        {/* <h1 className="text-2xl font-semibold mb-6 p-2">Manage Profile</h1> */}
        <form onSubmit={handleSubmit} className="p-10 rounded-md shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-700"
              disabled
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-gray-700 h-24"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primarygold text-white px-4 py-2 rounded-md hover:bg-goldlight hover:text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </InstructorDashboardLayout>
  );
};

export default ManageProfile;
