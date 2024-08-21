"use client"
import React,{ useState, useEffect } from "react";
import CustomCard from "@/components/client/common/CustomCard";
import social_issu from "public/images/pages/social_issues.jpg";
import physicimg from "public/images/pages/physics.jpg";
import AdminDashboardLayout from "@/components/server/admin/dashboard/AdminDashboardLayout";
import axios from "axios";
import { useAuth } from "@/hooks/auth/authContext";
import { FaJava, FaPython, FaJs, FaHtml5, FaPhp } from "react-icons/fa";
import { FaAtom, FaThermometer, FaMagnet, FaRocket } from "react-icons/fa";
import { FaHandsHelping, FaStethoscope, FaGavel, FaGraduationCap, FaBalanceScale, FaChild, FaUsers, FaBullhorn } from 'react-icons/fa';

const CourseCategory = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/apiRoutes/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
    
  }, []);


  const programmingLanguages = [
  { name: "Social Issues", email: "Social Work", icon: <FaHandsHelping /> },
  { name: "Health", email: "Healthcare", icon: <FaStethoscope /> },
  { name: "Legal", email: "Legal System", icon: <FaGavel /> },
  { name: "Education", email: "Education", icon: <FaGraduationCap /> },
  { name: "Human Rights", email: "Human Rights", icon: <FaBalanceScale /> },
  { name: "Child Welfare", email: "Child Welfare", icon: <FaChild /> },
  { name: "Community Support", email: "Community", icon: <FaUsers /> },
  { name: "Policy and Advocacy", email: "Advocacy", icon: <FaBullhorn /> }
  ];

  const physicsCourses = [
    { name: "Quantum Mechanics", email: "Physics Course", icon: <FaAtom /> },
    {
      name: "Thermodynamics",
      email: "Physics Course",
      icon: <FaThermometer />,
    },
    { name: "Electromagnetism", email: "Physics Course", icon: <FaMagnet /> },
    { name: "Relativity", email: "Physics Course", icon: <FaRocket /> },
  ];

  return (
    <AdminDashboardLayout>
      <div className="flex gap-4">
        <CustomCard
          label={"All Courses"}
          custom_img={social_issu}
          customers={programmingLanguages}
        />
        {/* <CustomCard
          label="Health"
          custom_img={physicimg}
          customers={physicsCourses}
        /> */}
      </div>
    </AdminDashboardLayout>
  );
};

export default CourseCategory;
