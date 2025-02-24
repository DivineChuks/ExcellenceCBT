import Link from "next/link";

export const SidebarItem = ({ icon, label, href, active }) => (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded ${
        active ? "bg-blue-500 text-white" : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );