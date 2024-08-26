"use client";
import React, { useState, useEffect } from "react";
import ProgressTabs from "@/components/client/common/ProgressTabs";
import Editor from "@/components/client/common/Editor";
import ThumbnailCarousel from "@/components/client/common/ThumbnailCarousel";
import AdminDashboardLayout from "@/components/server/admin/dashboard/AdminDashboardLayout";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
const SearchableSelect = dynamic(
  () => import("@/components/client/common/SearchableSelect"),
  {
    ssr: false, // Set ssr to false to prevent SSR for this component
  }
);

const courseSchema = z.object({
  courseTitle: z.string().min(1, "Course title is required."),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  selectedProgrammingLanguage: z.string().nullable(),
  selectedProgrammingLevel: z.string().nullable(),
  selectedLanguage: z.string().nullable(),
  faq: z.string().optional(),
  requirements: z.string().optional(),
  isFreeCourse: z.boolean(),
  coursePrice: z.string().optional(),
  hasDiscount: z.boolean(),
  discountedPrice: z.string().optional(),
  courseOverviewProvider: z.string().nullable(),
  coursetype: z.string().nullable(),
  courseOverviewUrl: z.string().optional(),
  metaKeywords: z.string().optional(),
  metaDescription: z.string().optional(),
  lesson: z.string().optional(),
  section: z.string().optional(),
  status: z.string().optional(),
  thumbnail: z.string().optional(),
});

const AddNewCourse = () => {
  const tabs = ["Basic", "Info", "Price", "Media", "SEO", "Finished"];
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { id } = useParams();
  console.log(id);

  // Form state management
  const [formData, setFormData] = useState({
    courseTitle: "",
    shortDescription: "",
    description: "",
    selectedProgrammingLanguage: null,
    selectedProgrammingLevel: null,
    selectedLanguage: null,
    faq: "",
    requirements: "",
    isFreeCourse: false,
    coursePrice: "",
    hasDiscount: false,
    discountedPrice: "",
    courseOverviewProvider: null,
    coursetype: null,
    courseOverviewUrl: "",
    metaKeywords: "",
    metaDescription: "",
    lesson: "",
    section: "",
    status: "",
    thumbnail: "",
  });

  // State variables for select options
  const [selectedProgramming_language, setSelectedProgramming_language] =
    useState(null);
  const [selectedProgramming_level, setSelectedProgramming_level] =
    useState(null);
  const [selectedlanguage, setSelectedlanguage] = useState(null);

  // Static select options
  const Programming_language = [
    { label: "Social Issues", value: "social_issues", category: "Social Work" },
    { label: "Health", value: "health", category: "Healthcare" },
    { label: "Legal", value: "legal", category: "Legal System" },
    { label: "Education", value: "education", category: "Education" },
    { label: "Human Rights", value: "human_rights", category: "Human Rights" },
    {
      label: "Child Welfare",
      value: "child_welfare",
      category: "Child Welfare",
    },
    {
      label: "Community Support",
      value: "community_support",
      category: "Community",
    },
    {
      label: "Policy and Advocacy",
      value: "policy_and_advocacy",
      category: "Advocacy",
    },
  ];

  const Programming_level = [
    { label: "Beginner", value: "Beginner", category: "level" },
    { label: "Intermediate", value: "Intermediate", category: "level" },
    { label: "Advanced", value: "Advanced", category: "level" },
  ];

  const language = [
    { label: "English", value: "English", category: "language" },
  ];

  const courseOverviewProvider = [
    { label: "youtube", value: "youtube", category: "provider" },
    { label: "vimeo", value: "vineo", category: "provider" },
    { label: "Html5", value: "html5", category: "provider" },
  ]; // Replace with your actual data

  const coursetype = [
    { label: "Zoom Classes", value: "zoom_classes", category: "coursetype" },
    {
      label: "Online Classes",
      value: "online_classes",
      category: "coursetype",
    },
    {
      label: "Online Self Paced",
      value: "online_self_paced",
      category: "coursetype",
    },
  ];
  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFormData({
      ...formData,
      [id]: checked,
    });
  };

  // Handle searchable select changes
  const handleSelectChange = (selectedItem, category) => {
    const selectedValue = selectedItem.value; // Extract only the value
    switch (category) {
      case "Programming_language":
        setSelectedProgramming_language(selectedValue);
        setFormData({
          ...formData,
          selectedProgrammingLanguage: selectedValue,
        });
        break;
      case "Programming_level":
        setSelectedProgramming_level(selectedValue);
        setFormData({
          ...formData,
          selectedProgrammingLevel: selectedValue,
        });
        break;
      case "language":
        setSelectedlanguage(selectedValue);
        setFormData({
          ...formData,
          selectedLanguage: selectedValue,
        });
        break;
      case "courseOverviewProvider":
        setFormData({
          ...formData,
          courseOverviewProvider: selectedValue,
        });
        break;
      case "coursetype":
        setFormData({
          ...formData,
          coursetype: selectedValue,
        });
        break;
      default:
        break;
    }

    console.log("Selected value:", selectedValue); // Log the selected value only
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate formData using the zod schema
      const validatedData = courseSchema.parse(formData);
      // Clear previous errors if validation is successful
      setErrors({});
      // Send validated data to backend endpoint
      console.log(validatedData);
      const response = await axios.post("/apiRoutes/addcourses", validatedData);
      toast.success("Course added successfully");
      console.log("Course added successfully:", response.data);

      // Reset formData state
      setFormData({
        courseTitle: "",
        shortDescription: "",
        description: "",
        selectedProgrammingLanguage: null,
        selectedProgrammingLevel: null,
        selectedLanguage: null,
        faq: "",
        requirements: "",
        isFreeCourse: false,
        coursePrice: "",
        hasDiscount: false,
        discountedPrice: "",
        courseOverviewProvider: null,
        coursetype: null,
        courseOverviewUrl: "",
        metaKeywords: "",
        metaDescription: "",
        lesson: "",
        section: "",
        status: "",
        thumbnail: "",
      });

      setLoading(false);
      router.push("/admin/manage-courses");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set errors from validation failure
        const errorMessages = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {});
        setErrors(errorMessages);
        toast.error("Validation failed. Please check your input.");
        console.error("Validation errors:", error.errors);
      } else {
        // Handle other errors
        toast.error("Error adding course");
        console.error("Error adding course:", error);
      }
      setLoading(false);
    }
  };

  return (
    <AdminDashboardLayout>
      {/* <p>Editing Course ID: {id}</p> */}
      <div className="bg-white shadow-md rounded-md">
        <ProgressTabs tabs={tabs} activeTab={activeTab}>
          <div>
            {/* Basic tab */}
            <div className="container mx-auto p-4">
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="courseTitle"
                  >
                    Course title <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:w-1/2">
                  <input
                    className={`block w-full p-2 text-gray-900 border ${
                      errors.courseTitle ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    id="courseTitle"
                    placeholder="Enter the title"
                    type="text"
                    value={formData.courseTitle}
                    onChange={handleInputChange}
                  />
                  {errors.courseTitle && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.courseTitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="shortDescription"
                  >
                    Short Description
                  </label>
                </div>
                <div className="md:w-1/2">
                  <textarea
                    id="shortDescription"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Description
                  </label>
                </div>
                <div className="md:w-1/2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <Editor
                    value={formData.description}
                    onChange={(value) =>
                      handleInputChange({
                        target: { id: "description", value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Select a category <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:w-1/2">
                  <SearchableSelect
                    options={Programming_language}
                    onSelect={(value) =>
                      handleSelectChange(value, "Programming_language")
                    }
                    defaultValue={Programming_language.find(
                      (option) =>
                        option.value === formData.selectedProgrammingLanguage
                    )}
                  />
                </div>
              </div>

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Level
                  </label>
                </div>
                <div className="md:w-1/2">
                  <SearchableSelect
                    options={Programming_level}
                    onSelect={(value) =>
                      handleSelectChange(value, "Programming_level")
                    }
                    defaultValue={Programming_level.find(
                      (option) =>
                        option.value === formData.selectedProgrammingLevel
                    )}
                  />
                </div>
              </div>

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Language made in
                  </label>
                </div>
                <div className="md:w-1/2">
                  <SearchableSelect
                    options={language}
                    onSelect={(value) => handleSelectChange(value, "language")}
                    defaultValue={language.find(
                      (option) => option.value === formData.selectedLanguage
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info tab */}
          <div>
            <div className="container mx-auto p-4">
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="status"
                  >
                    Status
                  </label>
                </div>
                <div className="md:w-1/2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      id="status"
                      checked={formData.status === "active"}
                      onChange={(e) => {
                        const newStatus = e.target.checked
                          ? "active"
                          : "no active";
                        setFormData({ ...formData, status: newStatus });
                      }}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-goldlight"></div>
                  </label>
                </div>
              </div>

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="lesson"
                  >
                    Lesson
                  </label>
                </div>
                <div className="md:w-1/2">
                  <input
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="lesson"
                    placeholder="Enter number of lesson"
                    type="number"
                    value={formData.lesson}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="section"
                  >
                    Section
                  </label>
                </div>
                <div className="md:w-1/2">
                  <input
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="section"
                    placeholder="Enter number of sections"
                    type="text"
                    value={formData.section}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="faq"
                  >
                    Course faq
                  </label>
                </div>
                <div className="md:w-1/2">
                  <input
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="faq"
                    placeholder="Enter the title"
                    type="text"
                    value={formData.faq}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3"></div>
                <div className="md:w-1/2">
                  <textarea
                    id="requirements"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."
                    value={formData.requirements}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Price tab */}
          <div>
            <div className="container mx-auto p-4">
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="isFreeCourse"
                  >
                    Is it a free course?
                  </label>
                </div>
                <div className="md:w-1/2">
                  <input
                    id="isFreeCourse"
                    type="checkbox"
                    className="h-6 w-6 text-gray-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    checked={formData.isFreeCourse}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </div>

              {!formData.isFreeCourse && (
                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <label
                      className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                      htmlFor="coursePrice"
                    >
                      Course Price $
                    </label>
                  </div>
                  <div className="md:w-1/2">
                    <input
                      className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="coursePrice"
                      placeholder="Enter the price"
                      type="text"
                      value={formData.coursePrice}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="hasDiscount"
                  >
                    Has Discount?
                  </label>
                </div>
                <div className="md:w-1/2">
                  <input
                    id="hasDiscount"
                    type="checkbox"
                    className="h-6 w-6 text-gray-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    checked={formData.hasDiscount}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </div>

              {formData.hasDiscount && (
                <div className="md:flex md:items-center mb-6">
                  <div className="md:w-1/3">
                    <label
                      className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                      htmlFor="discountedPrice"
                    >
                      Discounted Price
                    </label>
                  </div>
                  <div className="md:w-1/2">
                    <input
                      className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="discountedPrice"
                      placeholder="Enter the discounted price"
                      type="text"
                      value={formData.discountedPrice}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Media tab */}
          <div>
            <div className="container mx-auto p-4">
              {/* Thumbnail carousel */}
              <ThumbnailCarousel
                value={formData.thumbnail}
                onChange={handleInputChange}
                defaultValue={formData.thumbnail}
              />

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Course Overview Provider
                  </label>
                </div>
                <div className="md:w-1/2">
                  <SearchableSelect
                    options={courseOverviewProvider}
                    onSelect={(value) =>
                      handleSelectChange(value, "courseOverviewProvider")
                    }
                    defaultValue={courseOverviewProvider.find(
                      (option) =>
                        option.value === formData.courseOverviewProvider
                    )}
                  />
                </div>
              </div>

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="courseOverviewUrl"
                  >
                    Course Overview URL
                  </label>
                </div>
                <div className="md:w-1/2">
                  <input
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="courseOverviewUrl"
                    placeholder="Enter the URL"
                    type="text"
                    value={formData.courseOverviewUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Course Overview Provider
                  </label>
                </div>
                <div className="md:w-1/2">
                  <SearchableSelect
                    options={coursetype}
                    onSelect={(value) =>
                      handleSelectChange(value, "coursetype")
                    }
                    defaultValue={coursetype.find(
                      (option) => option.value === formData.coursetype
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEO tab */}
          <div>
            <div className="container mx-auto p-4">
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="metaKeywords"
                  >
                    Meta Keywords
                  </label>
                </div>
                <div className="md:w-1/2">
                  <input
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="metaKeywords"
                    placeholder="Enter meta keywords"
                    type="text"
                    value={formData.metaKeywords}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="metaDescription"
                  >
                    Meta Description
                  </label>
                </div>
                <div className="md:w-1/2">
                  <textarea
                    id="metaDescription"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter meta description"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Finished tab */}
          <div>
            <div className="container mx-auto p-4">
              <p className="text-lg text-center font-semibold text-gray-700 mb-4">
                Congratulations! You are one click away to add new course.
              </p>
              {/* Display summary of entered data */}
              <div className="text-center">
                <button
                  className={`btn-design-1 ${
                    loading ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  onClick={handleSubmit}
                  disabled={loading}
                  type="submit"
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
                      <span className="ml-1">Saving Course...</span>
                    </span>
                  ) : id ? (
                    "Update Course"
                  ) : (
                    "Save Course"
                  )}
                </button>
              </div>
            </div>
          </div>
        </ProgressTabs>
      </div>
    </AdminDashboardLayout>
  );
};

export default AddNewCourse;
