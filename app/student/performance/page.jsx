"use client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/app/components/Container";
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
import StudentSideBar from "../_components/StudentSideBar";
import StudentNavBar from "../_components/StudentNavBar";
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
    // <PrivateAdminRoute>
    <div className="flex md:pl-8 min-h-screen">
      <StudentSideBar />
      <div className="flex flex-col w-full">
        <StudentNavBar />
        <div className="px-8 py-3 md:py-8 w-full flex justify-center items-start">
          <Container>
            <div className="">
              <div className="flex flex-col gap-2">
                <h2 className="font-bold text-xl hidden md:flex">
                  Performance
                </h2>
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
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SummaryCard title="Total Students" value="500" icon={<User size={40} />} />
                  <SummaryCard title="Total Subjects" value="10" icon={<ClipboardList size={40} />} />
                  <SummaryCard title="Total Exams" value="15" icon={<PieChart size={40} />} />
                </div> */}

                {/* Charts */}
                <div className="grid grid-cols-1 gap-10 mt-10">
                  <div className="bg-white p-8 rounded-md shadow-md">
                    <h2 className="font-bold text-lg mb-4">Pass/Fail Rates</h2>
                    <div className="w-80 h-80 mx-auto">
                      <Pie data={pieData} />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow-md">
                    <h2 className="font-bold text-lg mb-4">Average Scores by Subject</h2>
                    <Bar data={barData} options={barOptions} />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
                  {/* <QuickActionCard title="Register a Student" />
                  <QuickActionCard title="Add a Subject" />
                  <QuickActionCard title="Create New Exam" /> */}
                </div>
              </main>
            )}
          </Container>
        </div>
      </div>
    </div>
    // </PrivateAdminRoute>
  );
};

export default AdminDashboard;
