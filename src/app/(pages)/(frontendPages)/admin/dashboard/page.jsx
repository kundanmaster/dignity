"use client"
import React from "react";
import AdminDashboardLayout from '@/components/server/admin/dashboard/AdminDashboardLayout'
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Revenue",
        data: [12000, 15000, 13000, 18000, 17000, 19000, 22000],
        borderColor: "#FFD700",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Revenue",
      },
    },
  };

  const cardsData = [
    { label: "Number of Courses", value: 29 },
    { label: "Total Students", value: 1050 },
    { label: "Active Users", value: 750 },
    { label: "Revenue Growth", value: "$ 45,000" },
  ];

  return (
    <>
    <AdminDashboardLayout>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
        <div className="w-full" style={{ height: "400px" }}>
          <Line data={data} options={options} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="relative flex flex-col bg-clip-border rounded-xl bg-gradient-to-tr from-black/65 to-black/95 border-black/80 text-white shadow-gray-900/20 shadow-md p-8"
          >
            <div className="text-center text-gray-700">
              <p className="block font-sans text-sm antialiased font-normal leading-normal text-primarygold uppercase">
                {card.label}
              </p>
              <h1 className="flex justify-center gap-1 mt-6 font-sans antialiased font-normal tracking-normal text-white text-3xl">
                <span className="">{card.value}</span>
              </h1>
            </div>
          </div>
        ))}
      </div>
      </AdminDashboardLayout>
    </>
  );
};

export default Dashboard;
