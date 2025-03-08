"use client";
import { SidebarItem } from "@/app/admin/_components/SidebarItem";
import { SidebarMenu } from "@/app/admin/_components/SidebarMenu";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  BarChart3,
  BookOpen,
  LogOut,
  Settings,
  BarChart,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const StudentSideBar = () => {
  const [activeLink, setActiveLink] = useState("");
  const [openMenus, setOpenMenus] = useState({});
  const pathname = usePathname();

  useEffect(() => {
    switch (pathname) {
      case "/student/performance":
        setActiveLink("performance");
        break;
      case "/student/take-exam":
        setActiveLink("take-exam");
        break;
      case "/student/practice-questions":
        setActiveLink("practice-questions");
        break;
      case "/student/scores":
        setActiveLink("scores");
        break;
      default:
        setActiveLink("");
    }
  }, [pathname]);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <div className="h-screen w-[18rem] hidden md:flex flex-col border-r border-gray-200 py-8 pr-4 sticky top-0 overflow-y-auto bg-white">
      {/* Header */}
      <Link href="/">
        <h2 className="font-bold text-2xl px-4">Excellence CBT</h2>
      </Link>

      {/* Menu */}
      <div className="mt-10 flex flex-col gap-6">
        {/* Take a Test */}
        <SidebarItem
          icon={<ClipboardList size={20} />}
          label="Take Exam"
          href="/student/take-exam"
          active={activeLink === "take-exam"}
        />

        {/* Practice Questions */}
        <SidebarItem
          icon={<BookOpen size={20} />}
          label="Practice Questions"
          href="/student/practice-questions"
          active={activeLink === "practice-questions"}
        />

        {/* My Scores */}
        <SidebarItem
          icon={<UserCircle size={20} />}
          label="My Profile"
          href="/student/scores"
          active={activeLink === "scores"}
        />

        {/* Activities */}
        <SidebarItem
          icon={<BarChart size={20} />}
          label="Performance"
          href="/student/performance"
          active={activeLink === "performance"}
        />
      </div>

      {/* Logout */}
      <div className="px-4 mt-auto">
        <button
          onClick={() => console.log("Logout")}
          className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-100 rounded"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSideBar;
