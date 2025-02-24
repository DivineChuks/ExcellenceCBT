import { ChevronDown, ChevronRight } from "lucide-react";
import { SidebarItem } from "./SidebarItem";

export const SidebarMenu = ({ icon, label, isOpen, toggleMenu, subItems }) => (
    <div>
      <button
        onClick={toggleMenu}
        className="flex items-center justify-between w-full px-4 py-2 mb-4 rounded hover:bg-gray-100 text-gray-700"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {isOpen && (
        <div className="pl-8 flex flex-col gap-2">
          {subItems.map((item, idx) => (
            <SidebarItem
              key={idx}
              icon={null}
              label={item.label}
              href={item.href}
              active={false}
            />
          ))}
        </div>
      )}
    </div>
  );