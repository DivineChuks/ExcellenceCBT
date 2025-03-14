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
import PrivateAdminRoute from "./_components/PrivateAdminRoute";
import axios from "axios";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    totalExams: 0,
    pass: 0,
    fail: 0,
    passPercentage: 0,
    failPercentage: 0,
    averageScoresBySubject: []
  });
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Get token inside useEffect to avoid SSR issues
        const token = localStorage.getItem("token");
        
        const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        
        console.log("Dashboard data:", response.data);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [API_BASE_URL]);

  // Prepare data for Pie Chart - Pass/Fail Rates
  const pieData = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        label: "Pass/Fail Rates",
        data: [dashboardData.pass, dashboardData.fail],
        backgroundColor: ["#4CAF50", "#FF5722"],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for Bar Chart - Average Scores by Subject
  const barData = {
    labels: dashboardData.averageScoresBySubject.map((_, index) => `Subject ${index + 1}`),
    datasets: [
      {
        label: "Average Scores",
        data: dashboardData.averageScoresBySubject.map(subject => subject.averageScore),
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
        max: 100, // Assuming scores are out of 100
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
                    Welcome Excellence CBT
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
                    <SummaryCard 
                      title="Total Students" 
                      value={dashboardData.totalStudents} 
                      icon={<User size={40} />} 
                    />
                    <SummaryCard 
                      title="Total Subjects" 
                      value={dashboardData.totalSubjects} 
                      icon={<ClipboardList size={40} />} 
                    />
                    <SummaryCard 
                      title="Total Exams" 
                      value={dashboardData.totalExams} 
                      icon={<PieChart size={40} />} 
                    />
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                    <div className="bg-white p-4 rounded-md shadow-md">
                      <h2 className="font-bold text-lg mb-4">Pass/Fail Rates</h2>
                      <div className="w-64 h-64 mx-auto">
                        <Pie data={pieData} />
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-sm">
                          <span className="inline-block w-3 h-3 bg-[#4CAF50] mr-2"></span>
                          Pass: {dashboardData.passPercentage}%
                        </p>
                        <p className="text-sm">
                          <span className="inline-block w-3 h-3 bg-[#FF5722] mr-2"></span>
                          Fail: {dashboardData.failPercentage}%
                        </p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-md">
                      <h2 className="font-bold text-lg mb-4">Average Scores by Subject</h2>
                      <Bar data={barData} options={barOptions} />
                    </div>
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