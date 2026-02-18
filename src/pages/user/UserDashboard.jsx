import { useEffect, useState } from "react";
import api from "../../services/api";

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);

const [statusFilter, setStatusFilter] = useState("ALL");
const [sortBy, setSortBy] = useState("NONE");

  const totalIssues = complaints.length;
const resolvedCount = complaints.filter(c => c.status === "RESOLVED").length;
const inProgressCount = complaints.filter(c => c.status === "IN_PROGRESS").length;
const pendingCount = complaints.filter(c => c.status === "PENDING").length;

// const [statusFilter, setStatusFilter] = useState("ALL");

const [dialog, setDialog] = useState({
  show: false,
  type: "", // "success" | "error" | "confirm"
  message: "",
  actionId: null,
});


 useEffect(() => {
  fetchNearbyComplaints();

  const interval = setInterval(() => {
    fetchNearbyComplaints();
  }, 30000); // every 30 sec

  return () => clearInterval(interval);
}, []);



const fetchNearbyComplaints = async () => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    try {
      const { data } = await api.get(
        `/api/user/complaints/nearby?lat=${lat}&lng=${lng}&radius=5`
      );
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching nearby complaints:", error);
    }
  });
};



const handleUpvote = async (id) => {
  try {
    await api.post(`/api/upvotes/${id}`);
    fetchNearbyComplaints();   // ✅ FIXED
  } catch (error) {
    console.error("Error upvoting complaint:", error);
  }
};


  const handleDelete = (id) => {
  setDialog({
    show: true,
    type: "confirm",
    message: "Are you sure you want to delete this complaint?",
    actionId: id,
  });
};



  const confirmDelete = async () => {
  try {
    await api.delete(`/api/user/complaints/${dialog.actionId}`);
    fetchNearbyComplaints();

    setDialog({
      show: true,
      type: "success",
      message: "Complaint deleted successfully!",
      actionId: null,
    });
  } catch (error) {
    setDialog({
      show: true,
      type: "error",
      message: "Failed to delete complaint.",
      actionId: null,
    });
  }
};


  return (
    <div className="min-h-screen bg-white py-10 px-4">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-green-600">
  Nearby Civic Issues
</h1>

{/* KPI CARDS */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
  
  <div className="bg-white shadow-md rounded-xl p-6">
    <p className="text-gray-500 text-sm">Total Issues</p>
    <h2 className="text-2xl font-bold">{totalIssues}</h2>
  </div>

  <div className="bg-white shadow-md rounded-xl p-6">
    <p className="text-gray-500 text-sm">Pending</p>
    <h2 className="text-2xl font-bold text-yellow-600">{pendingCount}</h2>
  </div>

  <div className="bg-white shadow-md rounded-xl p-6">
    <p className="text-gray-500 text-sm">In Progress</p>
    <h2 className="text-2xl font-bold text-blue-600">{inProgressCount}</h2>
  </div>

  <div className="bg-white shadow-md rounded-xl p-6">
    <p className="text-gray-500 text-sm">Resolved</p>
    <h2 className="text-2xl font-bold text-green-600">{resolvedCount}</h2>
  </div>

</div>


<div className="mb-6 flex flex-wrap gap-4 items-center">

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border rounded-lg px-4 py-2 shadow"
  >
    <option value="ALL">All</option>
    <option value="PENDING">Pending</option>
    <option value="IN_PROGRESS">In Progress</option>
    <option value="RESOLVED">Resolved</option>
  </select>

  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="border rounded-lg px-4 py-2 shadow"
  >
    <option value="NONE">Sort By</option>
    <option value="UPVOTES">Most Upvoted</option>
    <option value="PRIORITY">Highest Priority</option>
  </select>

</div>


        {complaints.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-xl text-center text-gray-500 shadow">
            No complaints yet.
          </div>
        ) : (
          <div className="space-y-6">
            {complaints
  .filter(c => statusFilter === "ALL" || c.status === statusFilter)
  .sort((a, b) => {
    if (sortBy === "UPVOTES") return (b.upvotes || 0) - (a.upvotes || 0);
    if (sortBy === "PRIORITY") return (b.priority || 0) - (a.priority || 0);
    return 0;
  })
  .map((c) => (

              <div
                key={c.id}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">

                  {/* LEFT CONTENT */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-green-600">
                      {c.title}
                    </h2>

                    <p className="mt-2 text-gray-700">
                      {c.description}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      📍 {c.location}
                    </p>

                    {/* Status Badge */}
                    <div className="mt-3">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        c.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-600"
                          : c.status === "RESOLVED"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    {c.imagePath && (
                      <img
                        src={`http://localhost:8080/${c.imagePath}`}
                        alt="Complaint"
                        className="mt-4 w-60 rounded-lg border"
                      />
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-row md:flex-col gap-3">

                    <button
                      onClick={() => handleUpvote(c.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow"
                    >
                      👍 {c.upvotes || 0}
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {dialog.show && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
    <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md text-center">

      <h2
        className={`text-xl font-semibold mb-4 ${
          dialog.type === "error"
            ? "text-red-600"
            : dialog.type === "success"
            ? "text-green-600"
            : "text-blue-600"
        }`}
      >
        {dialog.type === "confirm"
          ? "Confirm Delete"
          : dialog.type === "success"
          ? "Success"
          : "Error"}
      </h2>

      <p className="text-gray-600 mb-6">
        {dialog.message}
      </p>

      <div className="flex justify-center gap-4">
        {dialog.type === "confirm" ? (
  <>
    <button
      onClick={() => setDialog({ ...dialog, show: false })}
      className="px-5 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-400"
    >
      Cancel
    </button>

    <button
      onClick={confirmDelete}
      className="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
    >
      Delete
    </button>
  </>

        ) : (
          <button
            onClick={() => setDialog({ ...dialog, show: false })}
            className={`px-6 py-2 rounded-full text-white ${
              dialog.type === "success"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            OK
          </button>
        )}
      </div>

    </div>
  </div>
)}

    </div>
  );
};

export default UserDashboard;
