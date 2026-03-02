import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminDashboard = ({ filterStatus, showSplitView }) => {

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoutDialog, setLogoutDialog] = useState(false);
const [departments, setDepartments] = useState([]);
  const [sortBy, setSortBy] = useState("");
// const [complaints, setComplaints] = useState([]);

  const [dialog, setDialog] = useState({
  show: false,
  type: "",
  complaintId: null,
  departmentEmail: "",
  priority: "LOW",
});


// const verifyComplaint = async (id) => {
//   try {
//     await api.put(`/admin/verify/${id}`);

//     setComplaints(prev =>
//       prev.map(c =>
//         c.id === id
//           ? { ...c, status: "COMPLETED" }
//           : c
//       )
//     );

//   } catch (err) {
//     console.error(err);
//   }
// };

const verifyComplaint = async (id) => {
  try {
    await api.put(`/api/admin/complaints/${id}/resolve`); // Make sure backend marks it resolved
    fetchComplaints(); // Refresh list
  } catch (err) {
    console.error("Error marking complaint resolved:", err);
  }
};

const fetchDepartments = async () => {
  try {
    const { data } = await api.get("/api/admin/complaints/departments");
    setDepartments(data);
  } catch (error) {
    console.error("Error fetching departments:", error);
  }
};

// const [departmentDialog, setDepartmentDialog] = useState({
//   show: false,
//   deptName: "",
//   deptId: "",
//   password: "",
// });



  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const { data } = await api.get("/api/admin/complaints");
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchComplaints();
  fetchDepartments();

  const interval = setInterval(() => {
    fetchComplaints();
  }, 5000);

  return () => clearInterval(interval);
}, []);










  // Approve complaint
  const approveComplaint = async (id, departmentEmail, priority) => {
  try {
    await api.put(`/api/admin/complaints/${id}/approve`, {
      departmentEmail,
      priority,
    });

    fetchComplaints();
  } catch (error) {
    console.error("Error approving complaint:", error);
  }
};




  // Reject complaint
  const rejectComplaint = async (id) => {
    try {
      await api.put(`/api/admin/complaints/${id}/reject`);
      fetchComplaints();
    } catch (error) {
      console.error("Error rejecting complaint:", error);
    }
  };

  if (loading)


    return (
      <p className="text-center mt-6 text-gray-500">
        Loading complaints...
      </p>
    );




const filteredComplaints = complaints
  .filter((c) => {
    if (filterStatus) return c.status === filterStatus;
    return c.status === "PENDING"
  })
  .sort((a, b) => {
    if (sortBy === "UPVOTES")
      return (b.upvotesCount || 0) - (a.upvotesCount || 0);

    if (sortBy === "PRIORITY_HIGH_LOW") {
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    if (sortBy === "PRIORITY_LOW_HIGH") {
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }



 


    return 0;
  });

  

console.log("Filtered Complaints:", filteredComplaints);
console.log("showSplitView:", showSplitView);


  return (
    <div>
      <div className="max-w-6xl mx-auto">

        {/* TOP NAVIGATION */}
      {/* <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">
            Admin Panel
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-full ${
                activeTab === "dashboard"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("approved")}
              className={`px-4 py-2 rounded-full ${
                activeTab === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Approved
            </button>

            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-4 py-2 rounded-full ${
                activeTab === "rejected"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Rejected
            </button>
          </div>
        </div> */}

                    {/* <button
          onClick={() =>
            setDepartmentDialog({ show: true, fullName: "", phone: "", password: "" })
          }
          className="px-4 py-2 rounded-full bg-blue-600 text-white"
        >
          + Add Department
        </button> */}


<div className="mb-6">
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="border rounded-lg px-4 py-2 shadow"
  >
    <option value="" disabled>
      Sort By
    </option>
    <option value="NONE">None</option>
    <option value="UPVOTES">Most Upvoted</option>
    <option value="PRIORITY_HIGH_LOW">Priority High → Low</option>
    <option value="PRIORITY_LOW_HIGH">Priority Low → High</option>
  </select>
</div>




        {filteredComplaints.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-xl text-center text-gray-500 shadow">
            No complaints available.
          </div>
        ) : (
          <div className="space-y-6">


            {filteredComplaints.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6">

  {/* LEFT SIDE */}
  <div className="flex-1">

    {/* NORMAL IMAGE VIEW */}
{["PENDING", "REJECTED", "RESOLVED"].includes(c.status) && c.imagePath && (
  <img
    src={`${import.meta.env.VITE_API_URL}/${c.imagePath}`}
    alt="Complaint"
    className="w-full max-h-60 object-cover rounded-lg border mb-4"
  />
)}

    <h2 className="text-xl font-semibold text-green-600">
      {c.title}
    </h2>

    <p className="mt-2 text-gray-700">{c.description}</p>

                    <p className="text-sm text-gray-500 mt-2">
                      📍 {c.location?.latitude}, {c.location?.longitude}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      👍 Upvotes: {c.upvotesCount || 0}
                    </p>


                   <p className="text-sm mt-2">
  🚨 Priority:{" "}
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${
      c.priority === "HIGH"
        ? "bg-red-100 text-red-600"
        : c.priority === "MEDIUM"
        ? "bg-yellow-100 text-yellow-600"
        : "bg-green-100 text-green-600"
    }`}
  >
    {c.priority}
  </span>
</p>

                    {/* STATUS BADGE */}
                    <div className="mt-3 flex gap-2 items-center">
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-600">
                        {c.status}
                      </span>

                      

                      {c.status === "APPROVED" && (
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            c.resolved
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}

                        >
                          {c.resolved ? "Resolved" : "Not Resolved"}
                        </span>
                      )}

                     
                    </div>



















{showSplitView && ["APPROVED", "IN_PROGRESS"].includes(c.status) && (
  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* USER UPLOADED IMAGE */}
    <div>
      <p className="text-sm font-semibold mb-1 text-gray-600">User Uploaded</p>
      {c.imagePath ? (
        <img
          src={`${import.meta.env.VITE_API_URL}/${c.imagePath}`}
          className="w-full rounded-lg border"
        />
      ) : (
        <div className="h-32 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400">
          No Image
        </div>
      )}
    </div>

    {/* DEPARTMENT EVIDENCE */}
    <div>
      <p className="text-sm font-semibold mb-1 text-gray-600">Department Evidence</p>
      {c.resolvedImageUrl ? (
       


        <img
  src={`${import.meta.env.VITE_API_URL}/${c.resolvedImageUrl}`}
  className="w-full rounded-lg border"
  onError={() => console.log("IMAGE FAILED:", c.resolvedImageUrl)}
  onLoad={() => console.log("IMAGE LOADED:", c.resolvedImageUrl)}
/>
      ) : (
        <div className="h-32 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400">
          Not Uploaded Yet
        </div>
      )}

      {/* RESOLVE BUTTON */}
      {c.status === "IN_PROGRESS" && c.resolvedImageUrl && (
        <button
          onClick={() => verifyComplaint(c.id)}  // This should call your API to mark resolved
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Mark as Resolved
        </button>
      )}
    </div>
  </div>
)}
                  </div>

                 {/* RIGHT SIDE */}
<div className="flex flex-col justify-end h-full">

  {c.status === "PENDING" && (
    <div className="flex gap-3 mt-auto">
      <button
        onClick={() =>
          setDialog({
            show: true,
            type: "approve",
            complaintId: c.id,
            departmentEmail: "",
            priority: "MEDIUM",
          })
        }
        className="px-4 py-2 bg-green-600 text-white rounded-full"
      >
        Approve & Assign
      </button>

      <button
        onClick={() =>
          setDialog({
            show: true,
            type: "reject",
            complaintId: c.id,
          })
        }
        className="px-4 py-2 bg-red-600 text-white rounded-full"
      >
        Reject
      </button>
    </div>
  )}

</div>
                        
                </div>
              </div>
            ))}








          </div>
        )}
      </div>

      {/* DIALOG */}
      {dialog.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md text-center">

            {dialog.type === "approve" && (
              <>
                <h2 className="text-xl font-semibold text-green-600 mb-4">
                  Assign Department
                </h2>

                <select
  value={dialog.departmentEmail}
  onChange={(e) =>
    setDialog({
      ...dialog,
      departmentEmail: e.target.value,
    })
  }
  className="w-full border rounded-lg p-2 mb-4"
>
  <option value="">Select Department</option>

  {departments.map((dept) => (
    <option key={dept.id} value={dept.email}>
      {dept.fullName} ({dept.email})
    </option>
  ))}
</select>

                <select
  value={dialog.priority}
  onChange={(e) =>
    setDialog({
      ...dialog,
      priority: e.target.value,
    })
  }
  className="w-full border rounded-lg p-2 mb-4"
>
  <option value="LOW">LOW</option>
  <option value="MEDIUM">MEDIUM</option>
  <option value="HIGH">HIGH</option>
</select>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setDialog({ show: false })}
                    className="px-5 py-2 bg-black text-white rounded-full"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={async () => {
                      await approveComplaint(
                        dialog.complaintId,
                        dialog.departmentEmail,
                        dialog.priority

                      );
                      setDialog({ show: false });
                    }}
                    className="px-5 py-2 bg-green-600 text-white rounded-full"
                  >
                    Approve
                  </button>
                </div>
              </>
            )}

            {dialog.type === "reject" && (
              <>
                <h2 className="text-xl font-semibold text-red-600 mb-4">
                  Confirm Reject
                </h2>

                <p className="text-gray-600 mb-6">
                  Are you sure you want to reject this complaint?
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setDialog({ show: false })}
                    className="px-5 py-2 bg-black text-white rounded-full"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={async () => {
                      await rejectComplaint(dialog.complaintId);
                      setDialog({ show: false });
                    }}
                    className="px-5 py-2 bg-red-600 text-white rounded-full"
                  >
                    Reject
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}



      

    </div>
  );
};

export default AdminDashboard;
