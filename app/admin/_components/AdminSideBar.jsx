"use client";
import {
  BookOpen,
  CircleUser,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SidebarItem } from "./SidebarItem";
import { SidebarMenu } from "./SidebarMenu";
// import { useDispatch } from "react-redux";

const AdminSideBar = () => {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("dashboard");
  const [openMenus, setOpenMenus] = useState({});
  const pathname = usePathname();
  
  const handleLogout = () => {
    localStorage.clear();
    router.push("/admin/auth");
  };

  useEffect(() => {
    switch (pathname) {
      case "/admin/dashboard":
        setActiveLink("dashboard");
        break;
      case "/admin/students/view":
        setActiveLink("students");
        break;
      case "/admin/subjects":
      case "/admin/subjects/add":
        setActiveLink("subjects");
        break;
      case "/admin/questions/create":
        setActiveLink("questions");
        break;
      case "/admin/exams/view":
        setActiveLink("exams");
        break;
      case "/admin/settings":
        setActiveLink("settings");
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
    <div className="h-screen w-[18rem] hidden md:flex flex-col border-r border-gray-100 py-8 pr-4 sticky top-0 overflow-y-auto bg-gradient-to-b from-white to-gray-50 shadow-sm">
      {/* Header */}
      <Link href="/" className="px-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
          <h2 className="font-bold text-base bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            Excellence CBT
          </h2>
        </div>
      </Link>

      {/* Divider */}
      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Menu */}
      <div className="mt-8 flex flex-col gap-4 px-4">
        {/* Dashboard */}
        <SidebarItem
          icon={<LayoutDashboard size={18} className="text-blue-600" />}
          label="Dashboard"
          href="/admin/dashboard"
          active={activeLink === "dashboard"}
        />

        {/* Students */}
        <SidebarItem
          icon={<CircleUser size={18} className="text-indigo-600" />}
          label="Students"
          href="/admin/students/view"
          active={activeLink === "students"}
        />

        {/* Subjects */}
        <SidebarItem
          icon={<BookOpen size={18} className="text-purple-600" />}
          label="Subjects"
          href="/admin/subjects"
          active={activeLink === "subjects"}
        />

        {/* Exams */}
        <SidebarMenu
          icon={<ClipboardList size={18} className="text-emerald-600" />}
          label="Exams"
          isOpen={openMenus.exams}
          toggleMenu={() => toggleMenu("exams")}
          active={activeLink === "exams"}
          subItems={[
            { label: "All Exams", href: "/admin/exams/view" },
            { label: "Add Questions", href: "/admin/questions/create" },
          ]}
        />

        {/* Settings */}
        <SidebarItem
          icon={<Settings size={18} className="text-gray-600" />}
          label="Settings"
          href="/admin/settings"
          active={activeLink === "settings"}
        />
      </div>

      {/* Logout */}
      <div className="px-6 mt-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSideBar;