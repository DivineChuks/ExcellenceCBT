export const SummaryCard = ({ title, value, icon }) => (
    <div className="flex items-center justify-between bg-white p-4 py-8 rounded-md shadow-md">
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
      <div className="text-blue-500">{icon}</div>
    </div>
  );