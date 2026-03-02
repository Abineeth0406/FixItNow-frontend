import { useState } from "react";
import DepartmentDashboard from "./DepartmentDashboard";

const DepartmentManageComplaints = () => {

  const [view, setView] = useState("APPROVED");

  return (
    <div className="max-w-6xl mx-auto">

      {/* TOP FILTER BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-6">

        <button
          onClick={() => setView("APPROVED")}
          className={`px-5 py-2 rounded-full ${
            view === "APPROVED"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Assigned
        </button>

        <button
          onClick={() => setView("IN_PROGRESS")}
          className={`px-5 py-2 rounded-full ${
            view === "IN_PROGRESS"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          In Progress
        </button>

        <button
          onClick={() => setView("RESOLVED")}
          className={`px-5 py-2 rounded-full ${
            view === "RESOLVED"
              ? "bg-green-700 text-white"
              : "bg-gray-200"
          }`}
        >
          Completed
        </button>

      </div>

      <DepartmentDashboard filterStatus={view} />

    </div>
  );
};

export default DepartmentManageComplaints;