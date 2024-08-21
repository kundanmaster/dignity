"use client";
import React from "react";
import InstructorDashboardLayout from "@/components/server/instructor/dashboard/InstructorDahboardLayout";
import Image from "next/image";
import Link from "next/link";

const Dashboard = () => {
  const cardsData = [
    { label: "Schedules", value: 2, href:"/instructor/schedule-card", img:"/images/pages/schedule.jpg" },
    { label: "Manage courses", value: 6, href:"/instructor/course-manage", img:"/images/pages/manageCourse.jpg" },
    { label: "Sales report", value: 5, href:"/instructor/sales-report", img:"/images/pages/salesReport.jpg" },
    { label: "Manage profile", value: 1, href:"/instructor/manage-profile", img:"/images/pages/profileManage.jpg"},
  ];

  return (
    <div>
      <InstructorDashboardLayout>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
          {cardsData.map((card, index) => (
            <Link key={index} href={card.href}>
              <div
                className="flex flex-col bg-clip-border rounded-xl overflow-hidden bg-gradient-to-tr from-black/65 to-black/95 border-black/80 text-white shadow-gray-900/20 shadow-md h-full z-10"
              >
                <div className="h-40">
                  <Image
                    src={card.img}
                    alt="alt"
                    width={500}
                    height={500}
                    className="rounded-t-xl object-cover"
                  />
                </div>
                <div className="w-full p-4 bg-black bg-opacity-60 text-center">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-primarygold uppercase">
                    {card.label}
                  </p>
                  <h1 className="flex justify-center gap-1 mt-2 font-sans antialiased font-normal tracking-normal text-white text-3xl">
                    <span>{card.value}</span>
                  </h1>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </InstructorDashboardLayout>
    </div>
  );
};

export default Dashboard;
