import { PlusCircle } from "lucide-react";

export const QuickActionCard = ({ title }) => (
    <div className="flex items-center justify-between bg-blue-500 text-white p-4 rounded-md shadow-md hover:bg-blue-600 cursor-pointer">
        <h3 className="font-bold">{title}</h3>
        <PlusCircle size={24} />
    </div>
);