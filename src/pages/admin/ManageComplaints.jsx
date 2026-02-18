import { useState } from "react";
import AdminDashboard from "./AdminDashboard";

const ManageComplaints = () => {
  const [view, setView] = useState("APPROVED");

  return (
    <div>

      <AdminDashboard filterStatus={view} />

      <div className="fixed bottom-6 right-6">
        <button
          onClick={() =>
            setView(view === "APPROVED" ? "REJECTED" : "APPROVED")
          }
          className="px-6 py-3 bg-red-600 text-white rounded-full shadow-lg"
        >
          {view === "APPROVED"
            ? "View Rejected Complaints"
            : "View Approved Complaints"}
        </button>
      </div>

    </div>
  );
};

export default ManageComplaints;
