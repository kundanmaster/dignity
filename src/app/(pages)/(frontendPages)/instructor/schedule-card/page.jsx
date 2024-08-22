"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import InstructorDashboardLayout from "@/components/server/instructor/dashboard/InstructorDahboardLayout";
import SearchableSelect from "@/components/client/common/SearchableSelect";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useAuth } from "@/hooks/auth/authContext";
import { toast } from "sonner";
import ConfirmModal from "../../../../../components/client/common/ConfirmModel"; // Import the modal

const ScheduleCard = () => {
  const { user } = useAuth();
  const [fields, setFields] = useState([
    {
      date: "",
      time_to: "",
      time_from: "",
      url: "",
      courseID: "",
      instructorID: "",
    },
  ]);
  const [courses, setCourses] = useState([]);
  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [errors, setErrors] = useState([]); // State to track validation errors

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/apiRoutes/addcourse");
        if (response.data.success) {
          setCourses(response.data.courses);
        } else {
          console.error("Failed to fetch courses:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (user && user.id) {
      setFields((prevFields) =>
        prevFields.map((field) => ({ ...field, instructorID: user.id }))
      );
    }
  }, [user]);

  const handleFieldChange = (index, field, value) => {
    const newFields = [...fields];
    newFields[index][field] = value;
    setFields(newFields);
  };

  const handleAddSlot = () => {
    setFields([
      ...fields,
      {
        date: "",
        time_to: "",
        time_from: "",
        url: "",
        courseID: "",
        instructorID: user?.id || "",
      },
    ]);
  };

  const handleDeleteSlot = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handleCourseSelect = (selectedOption) => {
    setCourseDetails(selectedOption);
    setFields((prevFields) =>
      prevFields.map((field) => ({
        ...field,
        courseID: selectedOption?.value || "",
      }))
    );
  };

  const validateFields = () => {
    const newErrors = fields.map((field, index) => {
      let fieldErrors = {};

      if (!field.date) {
        fieldErrors.date = "Date is required";
      }
      if (!field.time_to) {
        fieldErrors.time_to = "End time is required";
      }
      if (!field.time_from) {
        fieldErrors.time_from = "Start time is required";
      }
      if (!field.url) {
        fieldErrors.url = "URL is required";
      }
      if (!field.courseID) {
        fieldErrors.courseID = "Course selection is required";
      }

      return fieldErrors;
    });

    setErrors(newErrors);
    return newErrors.every((fieldErrors) => Object.keys(fieldErrors).length === 0);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/apiRoutes/schedule", fields, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        toast.success("Schedule saved successfully");
        console.log("Schedules saved successfully:", response.data.schedule);
      } else {
        toast.error("Error saving schedules");
        console.error("Error saving schedules:", response.data.error);
      }
    } catch (error) {
      toast.error("Error submitting schedules");
      console.error("Error submitting schedules:", error);
    } finally {
      setLoading(false);
      setIsModalOpen(false); // Close modal after submission
    }
  };

  const formatDateToMMDDYYYY = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
  };

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return "";
    const [month, day, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleFormSubmit = () => {
    if (validateFields()) {
      setIsModalOpen(true); // Open modal if validation passes
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  return (
    <InstructorDashboardLayout>
      <div className="p-4 border rounded bg-white shadow w-full">
        <h2 className="text-2xl font-bold mb-4">
          Schedule your class{" "}
          <span className="text-red-400">
            (* Please mention the details as per the zoom page)
          </span>
        </h2>
        {fields.map((field, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Slot {index + 1}</h3>
              {fields.length > 1 && (
                <button
                  onClick={() => handleDeleteSlot(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>

            <div className="flex space-x-4 mb-2">
              <div>
                <label className="block text-gray-700">
                  Url meeting <span className="text-red-500 ">*</span>
                </label>
                <Link
                  href="https://us05web.zoom.us/meeting/schedule?amp_device_id=18e5d3f3-5a20-49e9-a8f1-84b949663d7f"
                  target="_blank"
                >
                  <button className="bg-goldlight hover:bg-primarygold text-white px-4 py-2 rounded-lg ">
                    Generate URL
                  </button>
                </Link>
              </div>
              <div>
                <label className="block text-gray-700">Select Date</label>
                <input
                  type="date"
                  value={formatDateToYYYYMMDD(field.date)}
                  onChange={(e) =>
                    handleFieldChange(
                      index,
                      "date",
                      formatDateToMMDDYYYY(e.target.value)
                    )
                  }
                  className="w-full p-2 border rounded-lg"
                />
                {errors[index]?.date && (
                  <p className="text-red-500 text-sm">{errors[index].date}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Select Time To</label>
                <input
                  type="time"
                  value={field.time_to}
                  onChange={(e) =>
                    handleFieldChange(index, "time_to", e.target.value)
                  }
                  className="w-full  p-2 border rounded-lg"
                  min="09:00"
                  max="18:00"
                  required
                />
                {errors[index]?.time_to && (
                  <p className="text-red-500 text-sm">{errors[index].time_to}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Select Time From</label>
                <input
                  type="time"
                  value={field.time_from}
                  onChange={(e) =>
                    handleFieldChange(index, "time_from", e.target.value)
                  }
                  className="w-full  p-2 border rounded-lg"
                  min="09:00"
                  max="18:00"
                  required
                />
                {errors[index]?.time_from && (
                  <p className="text-red-500 text-sm">{errors[index].time_from}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700">
                  Select Course <span className="text-red-500 ">*</span>
                </label>

                {courses.length > 0 ? (
                  <SearchableSelect
                    options={courses.map((course) => ({
                      label: `${course.id} - ${course.course_title}`,
                      value: course.id,
                    }))}
                    onSelect={(value) => handleCourseSelect(value)}
                  />
                ) : (
                  <ClipLoader size={20} color={"#F27B21"} />
                )}
                {errors[index]?.courseID && (
                  <p className="text-red-500 text-sm">{errors[index].courseID}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-gray-700">
                URL <span className="text-red-500 ">*</span>
              </label>
              <input
                type="text"
                value={field.url}
                onChange={(e) =>
                  handleFieldChange(index, "url", e.target.value)
                }
                className="w-full  p-2 border rounded-lg"
                placeholder="Enter the URL"
              />
              {errors[index]?.url && (
                  <p className="text-red-500 text-sm">{errors[index].url}</p>
                )}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleAddSlot}
            className="bg-goldlight hover:bg-primarygold text-white px-4 py-2 rounded-lg"
          >
            Add another slot
          </button>
          <button
            onClick={handleFormSubmit}
            className="bg-goldlight hover:bg-primarygold text-white px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSubmit}
        />
      </div>
    </InstructorDashboardLayout>
  );
};

export default ScheduleCard;
