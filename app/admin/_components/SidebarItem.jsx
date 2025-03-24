// SidebarItem.jsx
import Link from "next/link";
import React from "react";

export const SidebarItem = ({ icon, label, href, active }) => {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          active
            ? "bg-blue-50 text-blue-700 font-medium"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <div className="w-5">{icon}</div>
        <span>{label}</span>
        {active && (
          <div className="ml-auto h-2 w-2 rounded-full bg-blue-600"></div>
        )}
      </div>
    </Link>
  );
};

