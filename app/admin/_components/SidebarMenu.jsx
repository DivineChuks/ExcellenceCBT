// SidebarMenu.jsx
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React from "react";

export const SidebarMenu = ({
  icon,
  label,
  isOpen,
  toggleMenu,
  active,
  subItems,
}) => {
  return (
    <div className="flex flex-col">
      <button
        onClick={toggleMenu}
        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
          active
            ? "bg-blue-50 text-blue-700 font-medium"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-5">{icon}</div>
          <span>{label}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pl-4 mt-1 ml-4 border-l border-gray-200 space-y-1">
          {subItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div
                className={`py-2 px-4 text-sm rounded-md transition-all duration-200 ${
                  active
                    ? "text-blue-600 hover:bg-blue-50"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};