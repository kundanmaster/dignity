"use client";
import React, { useState, useEffect } from "react";
import CustomCard from "@/components/client/common/CustomCard";
import AdminDashboardLayout from "@/components/server/admin/dashboard/AdminDashboardLayout";
import axios from "axios";
import { FaGraduationCap } from 'react-icons/fa';
import onlineclass from "/public/images/pages/online-class.jpg";
import zoomclass from "/public/images/pages/zoom.png";
import { GiOpenBook } from "react-icons/gi";
import { useRouter } from "next/navigation";

// Mapping of providers to icons
const iconMap = {
  'vimeo': <FaGraduationCap />,
  // Add other mappings if necessary
};

const CourseCategory = () => {
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/apiRoutes/addcourse");
        if (response.data.success) {
          setCourses(response.data.courses);
        } else {
          console.error("Error fetching courses:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Filter courses by category
  const onlineCourses = courses.filter(course => course.coursetype === 'online_classes');
  const zoomCourses = courses.filter(course => course.coursetype === 'zoom_classes');

  // Transform course data for CustomCard
  const transformCourseData = (courseList) => courseList.map((course) => ({
    name: (course.selected_programming_language || '').toUpperCase(),
    email: course.course_title,
    icon: iconMap[course.course_overview_provider] || <GiOpenBook />,
    onEdit: () => onEdit(course.id), // Pass course ID to onEdit
  }));

  const onlineCoursesData = transformCourseData(onlineCourses);
  const zoomCoursesData = transformCourseData(zoomCourses);

  const onEdit = (id) => {
    console.log("Edit clicked for ID:", id);
    if (id) {
      router.push(`/admin/add-new-course/${id}`);
    } else {
      console.log("Invalid ID");
      return;
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="flex gap-4">
        <CustomCard
          label={"Online Classes"}
          custom_img={onlineclass} // Update as necessary
          customers={onlineCoursesData}
        />
        <CustomCard
          label={"Zoom Classes"}
          custom_img={zoomclass} // Update as necessary
          customers={zoomCoursesData}
        />
      </div>
    </AdminDashboardLayout>
  );
};

export default CourseCategory;
