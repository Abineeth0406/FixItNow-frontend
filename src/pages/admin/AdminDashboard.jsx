import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminDashboard = ({ filterStatus }) => {

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoutDialog, setLogoutDialog] = useState(false);

  // const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | approved | rejected

  const [dialog, setDialog] = useState({
    show: false,
    type: "", // approve | reject
    complaintId: null,
    departmentPhone: "",
  });


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
  }, []);

  // Approve complaint
  const approveComplaint = async (id, departmentPhone) => {
    try {
      await api.put(`/api/admin/complaints/${id}/approve`, {
        departmentPhone,
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

  // Change resolved status
  // const toggleResolved = async (id, currentStatus) => {
  //   try {
  //     await api.put(`/api/admin/complaints/${id}/resolve`, {
  //       resolved: !currentStatus,
  //     });
  //     fetchComplaints();
  //   } catch (error) {
  //     console.error("Error updating resolve status:", error);
  //   }
  // };

  if (loading)
    return (
      <p className="text-center mt-6 text-gray-500">
        Loading complaints...
      </p>
    );

  // Filter based on tab
  // const filteredComplaints = complaints.filter((c) => {
  //   if (activeTab === "dashboard") return c.status === "PENDING";
  //   if (activeTab === "approved") return c.status === "APPROVED";
  //   if (activeTab === "rejected") return c.status === "REJECTED";
  //   return true;
  // });

  const filteredComplaints = filterStatus
  ? complaints.filter((c) => c.status === filterStatus)
  : complaints;



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

        {filteredComplaints.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-xl text-center text-gray-500 shadow">
            No complaints available.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredComplaints.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-6">

                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-green-600">
                      {c.title}
                    </h2>

                    <p className="mt-2 text-gray-700">{c.description}</p>

                    <p className="text-sm text-gray-500 mt-2">
                      📍 {c.location}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      👍 Upvotes: {c.upvotes || 0}
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

                    {c.imagePath && (
                      <img
                        src={`http://localhost:8080/${c.imagePath}`}
                        alt="Complaint"
                        className="mt-4 w-60 rounded-lg border"
                      />
                    )}
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex flex-col gap-4">

                    {/* APPROVE / REJECT only for PENDING */}
                    {c.status === "PENDING" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            setDialog({
                              show: true,
                              type: "approve",
                              complaintId: c.id,
                              departmentPhone: "",
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

                    {/* RESOLVE BUTTON for APPROVED */}
                    {/* {c.status === "APPROVED" && (
                      <button
                        onClick={() =>
                          toggleResolved(c.id, c.resolved)
                        }
                        className={`px-4 py-2 rounded-full text-white ${
                          c.resolved
                            ? "bg-yellow-500"
                            : "bg-green-600"
                        }`}
                      >
                        {c.resolved
                          ? "Mark as Not Resolved"
                          : "Mark as Resolved"}
                      </button>
                    )} */}

               


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

                <input
                  type="text"
                  placeholder="Enter Department Phone"
                  value={dialog.departmentPhone}
                  onChange={(e) =>
                    setDialog({
                      ...dialog,
                      departmentPhone: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-2 mb-4"
                />

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
                        dialog.departmentPhone
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
