"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SideBar from "../_components/AdminSideBar";
import Container from "@/app/components/Container";
import AdminNavBar from "../_components/AdminNavBar";
import { SummaryCard } from "./_components/SummaryCard";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bell, ClipboardList, PieChart, User } from "lucide-react";
import { QuickActionCard } from "./_components/QuickActionCard";
import PrivateAdminRoute from "./_components/PrivateAdminRoute"
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false)

  const pieData = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        label: "Pass/Fail Rates",
        data: [70, 30], // Example data
        backgroundColor: ["#4CAF50", "#FF5722"],
        borderWidth: 1,
      },
    ],
  };

  // Data for Bar Chart
  const barData = {
    labels: ["Math", "Physics", "Biology", "Chemistry", "English"], // Example subjects
    datasets: [
      {
        label: "Average Scores",
        data: [85, 78, 92, 88, 75], // Example scores
        backgroundColor: ["#2196F3", "#4CAF50", "#FF9800", "#FF5722", "#9C27B0"],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <PrivateAdminRoute>
      <div className="flex md:pl-8 min-h-screen">
        <SideBar />
        <div className="flex flex-col w-full">
          <AdminNavBar />
          <div className="px-8 py-3 md:py-8 w-full flex justify-center items-start">
            <Container>
              <div className="">
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold text-xl hidden md:flex">
                    Welcome Excellence
                  </h2>
                  <p className="text-base text-gray-500">
                    This is your current analysis
                  </p>
                </div>
              </div>
              {loading ? (
                <div className="space-y-6 mt-8">
                  <div className="flex flex-col md:flex-row gap-4 w-full">
                    <Skeleton className="h-24 w-full md:w-1/3" />
                    <Skeleton className="h-24 w-full md:w-1/3" />
                    <Skeleton className="h-24 w-full md:w-1/3" />
                  </div>
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : (
                <main className="flex flex-col mt-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SummaryCard title="Total Students" value="500" icon={<User size={40} />} />
                    <SummaryCard title="Total Subjects" value="10" icon={<ClipboardList size={40} />} />
                    <SummaryCard title="Total Exams" value="15" icon={<PieChart size={40} />} />
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                    <div className="bg-white p-4 rounded-md shadow-md">
                      <h2 className="font-bold text-lg mb-4">Pass/Fail Rates</h2>
                      <div className="w-64 h-64 mx-auto">
                        <Pie data={pieData} />
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-md">
                      <h2 className="font-bold text-lg mb-4">Average Scores by Subject</h2>
                      <Bar data={barData} options={barOptions} />
                    </div>
                  </div>

                  {/* Recent Activities */}
                  <div className="mt-10 bg-white p-4 rounded-md shadow-md">
                    <h2 className="font-bold text-lg mb-4">Recent Activities</h2>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span>John Doe registered for Chemistry</span>
                        <span className="text-gray-500 text-sm">2 hours ago</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>New exam added: Biology Test 1</span>
                        <span className="text-gray-500 text-sm">1 day ago</span>
                      </li>
                    </ul>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
                    <QuickActionCard title="Register a Student" />
                    <QuickActionCard title="Add a Subject" />
                    <QuickActionCard title="Create New Exam" />
                  </div>
                </main>
              )}
            </Container>
          </div>
        </div>
      </div>
    </PrivateAdminRoute>
  );
};

export default AdminDashboard;
