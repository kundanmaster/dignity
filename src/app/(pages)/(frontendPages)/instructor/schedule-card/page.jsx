"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import InstructorDashboardLayout from "@/components/server/instructor/dashboard/InstructorDahboardLayout";
import SearchableSelect from "@/components/client/common/SearchableSelect";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useAuth } from "@/hooks/auth/authContext";
import { toast } from "sonner";

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

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true
    try {
      const response = await axios.post("/apiRoutes/schedule", fields, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        toast.success("Schedule saved successfully");
        console.log("Schedules saved successfully:", response.data.schedule);
        // Handle success, e.g., show a success message or redirect
      } else {
        toast.error("Error saving schedules");
        console.error("Error saving schedules:", response.data.error);
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      toast.error("Error submitting schedules");
      console.error("Error submitting schedules:", error);
      // Handle network or server error
    } finally {
      setLoading(false); // Set loading to false
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
  return (
    <InstructorDashboardLayout>
      <div className="p-4 border rounded bg-white shadow w-full">
        <h2 className="text-2xl font-bold mb-4">Schedule your class</h2>
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
                <Link href="https://us05web.zoom.us/meeting/schedule?amp_device_id=18e5d3f3-5a20-49e9-a8f1-84b949663d7f">
                  <button className="bg-black text-white px-4 py-2 rounded-lg ">
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
                  <ClipLoader size={20} color={"#f0b65e"} />
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
                placeholder="Enter your meeting url here"
              />
            </div>
          </div>
        ))}
        <button
          onClick={handleAddSlot}
          className="bg-black text-white px-4 py-2 rounded mt-4 hover:bg-black/80"
        >
          Add more slot
        </button>
        <div className="text-center">
          <button
            className={`bg-black text-white px-4 py-2 rounded mt-4 hover:bg-black/80 ml-2 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={handleSubmit}
            disabled={loading}
            type="button"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="ml-1">Saving...</span>
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </InstructorDashboardLayout>
  );
};

export default ScheduleCard;
