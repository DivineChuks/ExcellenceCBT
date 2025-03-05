"use client";
import {
  BookOpen,
  CircleUser,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
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
    localStorage.clear()
    router.push("/admin/auth")
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

  console.log("activeLink---->", activeLink)

  return (
    <div className="h-screen w-[18rem] hidden md:flex flex-col border-r border-gray-200 py-8 pr-4 sticky top-0 overflow-y-auto bg-white">
      {/* Header */}
      <Link href="/">
        <h2 className="font-bold text-2xl px-4">Excellence CBT</h2>
      </Link>

      {/* Menu */}
      <div className="mt-10 flex flex-col gap-6">
        {/* Dashboard */}
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          href="/admin/dashboard"
          active={activeLink === "dashboard"}
        />

        {/* Students */}
        <SidebarItem
          icon={<CircleUser size={20} />}
          label="Students"
          href="/admin/students/view"
          active={activeLink === "students"}
        />

        {/* Students */}
        {/* <SidebarMenu
          icon={<CircleUser size={20} />}
          label="Students"
          isOpen={openMenus.students}
          toggleMenu={() => { toggleMenu("students") }}
          active={activeLink === "students"}
          subItems={[
            { label: "All Students", href: "/admin/students/view" },
            { label: "Register Students", href: "/admin/students/register" },
          ]}
        /> */}

        <SidebarItem
          icon={<BookOpen size={20} />}
          label="Subjects"
          href="/admin/subjects"
          active={activeLink === "subjects"}
        />

        {/* Questions */}
        {/* <SidebarMenu
          icon={<FileText size={20} />}
          label="Questions"
          isOpen={openMenus.questions}
          toggleMenu={() => toggleMenu("questions")}
          active={activeLink === "questions"}
          subItems={[
            { label: "Manage Questions", href: "/admin/questions/manage" },
            { label: "Create Questions", href: "/admin/questions/create" },
          ]}
        /> */}

        {/* Exams */}
        <SidebarMenu
          icon={<ClipboardList size={20} />}
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
          icon={<Settings size={20} />}
          label="Settings"
          href="/admin/settings"
          active={activeLink === "settings"}
        />
      </div>

      {/* Logout */}
      <div className="px-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-100 rounded"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>

  );
};

export default AdminSideBar;
