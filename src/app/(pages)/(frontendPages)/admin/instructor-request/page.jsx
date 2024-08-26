"use client";
import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "@/components/server/admin/dashboard/AdminDashboardLayout";
import CustomTable from "@/components/client/common/CustomTable";
import { useRouter } from "next/navigation";
import { deleteInstructor } from "@/utils/api";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import ConfirmModal from "../../../../../components/client/common/ConfirmModel";

const ManageInstructor = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [remark, setRemark] = useState(""); // Add state for remark
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchStudents = async () => {
      try {
        const response = await fetch("/apiRoutes/instructor-request");
        if (!response.ok) {
          throw new Error("Failed to fetch instructors");
        }
        const data = await response.json();
        setStudents(data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching instructors:", error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

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
    { key: "verified", label: "Verified" },
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

  const dropdownItems = [
    { label: "Accept", onClick: (id) => () => openModal("accept", id) },
    { label: "Reject", onClick: (id) => () => openModal("reject", id) },
  ];

  const openModal = (action, id) => {
    setModalAction(action);
    setSelectedId(id);
    setRemark(""); // Reset the remark when opening the modal
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalAction(null);
    setSelectedId(null);
    setRemark("");
  };

  const handleConfirm = async () => {
    if (modalAction === "reject" && selectedId) {
      setLoading(true);
      try {
        await deleteInstructor(selectedId, remark); // Pass the remark to the API
        toast.success("Instructor rejected successfully");
        setStudents(students.filter(student => student.id !== selectedId));
      } catch (error) {
        toast.error("Failed to reject instructor");
        console.error("Error rejecting instructor:", error);
      }
      setLoading(false);
    } else if (modalAction === "accept" && selectedId) {
      setLoading(true);
      try {
        const response = await fetch(`/apiRoutes/instructor-request?id=${selectedId}`, {
          method: "PATCH",
        });
        const result = await response.json();
        if (result.success) {
          toast.success("Instructor verified successfully");
          setStudents(students.map(student => student.id === selectedId ? { ...student, verified: 'verified' } : student));
        } else {
          toast.error("Failed to verify instructor");
        }
      } catch (error) {
        toast.error("Error verifying instructor");
        console.error("Error verifying instructor:", error);
      }
      setLoading(false);
    }
    closeModal();
  };

  return (
    <AdminDashboardLayout>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader size={50} color={"#F27B21"} loading={loading} />
        </div>
      ) : (
        <div>
          <div className="text-bold text-xl bg-white p-4">
            Unverified Instructor List
          </div>
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
                { value: "instructor", label: "Instructor" },
              ],
              level: [
                { value: "Beginner", label: "Beginner" },
                { value: "Intermediate", label: "Intermediate" },
              ],
            }}
          />
          {showModal && (
            <ConfirmModal
              isOpen={showModal}
              onClose={closeModal}
              onConfirm={handleConfirm}
              title={modalAction === "reject" ? "Confirm Rejection" : "Confirm Action"}
              message={modalAction === "reject" ? "Please provide a remark for rejecting this instructor." : "Are you sure you want to verify this instructor?"}
              confirmLabel={modalAction === "reject" ? "Yes, Reject" : "Yes, Verify"}
              cancelLabel="No, Cancel"
              additionalContent={
                modalAction === "reject" ? (
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Enter your remark here..."
                    rows={4}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                ) : null
              }
            />
          )}
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default ManageInstructor;
