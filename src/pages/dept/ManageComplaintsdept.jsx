import { useState } from "react";
import DepartmentDashboard from "./DepartmentDashboard";

const ManageComplaints = () => {
  const [tab, setTab] = useState("ASSIGNED");

  return (
    <div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("ASSIGNED")}
          className={`px-4 py-2 rounded ${
            tab === "ASSIGNED" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Assigned
        </button>

        <button
          onClick={() => setTab("IN_PROGRESS")}
          className={`px-4 py-2 rounded ${
            tab === "IN_PROGRESS" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          In Progress
        </button>

        <button
          onClick={() => setTab("RESOLVED")}
          className={`px-4 py-2 rounded ${
            tab === "RESOLVED" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Resolved
        </button>
      </div>

      <DepartmentDashboard filterStatus={tab} />

    </div>
  );
};

export default ManageComplaints;
