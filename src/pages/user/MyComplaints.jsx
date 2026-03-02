import { useEffect, useState } from "react";
import api from "../../services/api";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [editingComplaint, setEditingComplaint] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });

  const filteredComplaints = complaints.filter(
  (c) => c.status === "APPROVED" || c.status === "IN_PROGRESS"
);

  const [dialog, setDialog] = useState({
    show: false,
    message: "",
    complaintId: null,
  });

  const [toast, setToast] = useState({
  show: false,
  type: "",
  message: "",
});

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const { data } = await api.get("/api/user/complaints/my");
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      alert("Failed to load your complaints.");
    }
  };

  const handleEditClick = (complaint) => {
    setEditingComplaint(complaint.id);
    setFormData({
      title: complaint.title,
      description: complaint.description,
      location: complaint.location,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleUpdate = async (id) => {
  try {
    await api.put(`/api/user/complaints/${id}`, formData);

    fetchMyComplaints();
    setEditingComplaint(null);

    setToast({
      show: true,
      type: "success",
      message: "Changes saved successfully!",
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);

  } catch (error) {

    setToast({
      show: true,
      type: "error",
      message: "Failed to save changes",
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  }
};
  

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/user/complaints/${id}`);
      fetchMyComplaints();
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-green-600">
          My Complaints
        </h1>

        {complaints.length === 0 ? (
          <div className="bg-gray-100 p-6 rounded-xl text-center">
            You have not submitted any complaints yet.
          </div>
        ) : (
          <div className="space-y-6">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl shadow-md p-6 relative hover:shadow-lg transition"
              >

                {/* Complaint Image */}
                {c.imagePath && (
                  <div
                    onClick={() =>
                      alert(
                        "Image cannot be modified. Please delete and create a new complaint."
                      )
                    }
                    className="cursor-not-allowed"
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${c.imagePath}`}
                      alt="Complaint"
                      className="w-full h-56 object-cover rounded-lg mb-4 opacity-95 hover:opacity-80 transition"
                    />
                  </div>
                )}

                {editingComplaint === c.id ? (
                  <>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="border p-2 w-full rounded mb-2"
                    />

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="border p-2 w-full rounded mb-2"
                    />

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="border p-2 w-full rounded mb-2"
                    />

                    <p className="text-sm text-gray-500 mb-3">
                      Image cannot be edited. To change image, delete and create a new complaint.
                    </p>

                    <button
                      onClick={() => handleUpdate(c.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-full mr-3"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingComplaint(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-full"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-green-600">
                      {c.title}
                    </h2>

                    <p className="mt-2 text-gray-700">
                      {c.description}
                    </p>

                    <span
                      className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                        c.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {c.status}
                    </span>

                    {c.status !== "PENDING" && (
                      <p className="text-sm text-red-500 mt-2">
                        This complaint is under administrative control and cannot be modified.
                      </p>
                    )}
                  </>
                )}

                {editingComplaint !== c.id && (
  <div className="mt-4">
    <button
      onClick={() => handleEditClick(c)}
      disabled={c.status !== "PENDING"}
      className="mr-3 px-4 py-2 bg-blue-600 text-white rounded-full"
    >
      Edit
    </button>

    <button
      onClick={() =>
        setDialog({
          show: true,
          message: "Are you sure you want to delete this complaint?",
          complaintId: c.id,
        })
      }
      disabled={c.status !== "PENDING"}
      className="px-4 py-2 bg-red-600 text-white rounded-full"
    >
      Delete
    </button>
  </div>
)}

              </div>
            ))}
          </div>
        )}
      </div>

      {/* DELETE CONFIRM DIALOG */}
      {dialog.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md text-center">

            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Confirm Delete
            </h2>

            <p className="text-gray-600 mb-6">
              {dialog.message}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  await handleDelete(dialog.complaintId);
                  setDialog({ ...dialog, show: false });
                }}
                className="px-6 py-2 rounded-full text-white bg-red-600 hover:bg-red-700"
              >
                Yes, Delete
              </button>

              <button
                onClick={() => setDialog({ ...dialog, show: false })}
                className="px-6 py-2 rounded-full text-white bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}


      {toast.show && (
  <div className="fixed bottom-6 right-6 z-50">
    <div
      className={`flex items-center justify-between min-w-[250px] px-4 py-3 rounded-lg shadow-lg text-white ${
        toast.type === "error"
          ? "bg-red-600"
          : "bg-green-600"
      }`}
    >
      <span className="text-sm font-medium">
        {toast.message}
      </span>

      <button
        onClick={() => setToast({ ...toast, show: false })}
        className="ml-4 text-white font-bold"
      >
        ✕
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default MyComplaints;