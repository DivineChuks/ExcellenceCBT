"use client";
import { Bell, Menu, MenuIcon, Search, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AdminNavBar = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear()
    router.push("/admin/auth")
  };

  return (
    <header className="flex items-center justify-between bg-white shadow-md px-6 py-4 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none"
          onClick={toggleMenu}
        >
          <Menu size={20} />
        </button>
        <Image
          src="/jamb.png"
          width={50}
          height={40}
          alt="Admin Logo"
          className="cursor-pointer"
        />
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center flex-grow mx-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            onClick={toggleMenu}
          >
            <User size={20} />
            <span className="hidden md:inline text-sm font-medium">Admin</span>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2 z-50">
              <a
                href="/admin/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Profile
              </a>
              <a
                href="/admin/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <button
                onClick={() => handleLogout()}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavBar;
