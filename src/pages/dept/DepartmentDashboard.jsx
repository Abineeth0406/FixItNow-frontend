import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
// import { toast } from "react-toastify";

const DepartmentDashboard = ({ filterStatus }) => {

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("PRIORITY_HIGH_LOW");

  const fileInputRefs = useRef({});

  const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };


  const [toast, setToast] = useState({
  show: false,
  type: "",
  message: "",
});

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get("/api/department/complaints");
      setComplaints(data);
    } catch (error) {
      console.error(error);
      setToast({
  show: true,
  type: "error",
  message: "Failed to load complaints",
});

setTimeout(() => {
  setToast((prev) => ({ ...prev, show: false }));
}, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

const startWork = async (id) => {
  try {
    await api.put(`/api/department/complaints/${id}/start`);

    setToast({
      show: true,
      type: "success",
      message: "Work started successfully!",
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);

    fetchComplaints();
  } catch (error) {
    console.error(error);

    setToast({
      show: true,
      type: "error",
      message: "Failed to start work.",
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  }
};

  const handleUploadClick = (id) => {
    fileInputRefs.current[id].click();
  };

  const handleFileSelected = async (e, id) => {

    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {

      await api.put(
        `/api/department/complaints/${id}/upload-fixed-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setToast({
  show: true,
  type: "success",
  message: "Fix evidence uploaded successfully",
});

setTimeout(() => {
  setToast((prev) => ({ ...prev, show: false }));
}, 3000);

      fetchComplaints();

    } catch (error) {
      console.error(error);
      setToast({
  show: true,
  type: "error",
  message: "Upload failed",
});

setTimeout(() => {
  setToast((prev) => ({ ...prev, show: false }));
}, 3000);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-6 text-gray-500">
        Loading complaints...
      </p>
    );

  const filteredComplaints = (filterStatus
    ? complaints.filter((c) => c.status === filterStatus)
    : complaints
  ).sort((a, b) => {

    if (sortBy === "PRIORITY_HIGH_LOW") {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    if (sortBy === "PRIORITY_LOW_HIGH") {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto">

      {/* SORT */}
      <div className="mb-6">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg px-4 py-2 shadow"
        >
          <option value="PRIORITY_HIGH_LOW">
            Priority High → Low
          </option>
          <option value="PRIORITY_LOW_HIGH">
            Priority Low → High
          </option>
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

                  {c.imagePath && (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${c.imagePath}`}
                      alt="Complaint"
                      className="w-full max-h-60 object-cover rounded-lg border mb-4"
                    />
                  )}

                  <h2 className="text-xl font-semibold text-green-600">
                    {c.title}
                  </h2>

                  <p className="mt-2 text-gray-700">
                    {c.description}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    📍 {c.location}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    👍 Upvotes: {c.upvotesCount || 0}
                  </p>

                  {/* PRIORITY */}
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

                  {/* STATUS */}
                  <div className="mt-3 flex gap-2 items-center">

                    <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-600">
                      {c.status}
                    </span>

                    {c.resolved && (
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-100 text-green-600">
                        Resolved
                      </span>
                    )}

                  </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-col gap-4 justify-center">

                  {c.status === "APPROVED" && (
                    <button
                      onClick={() => startWork(c.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                    >
                      Start Work
                    </button>
                  )}

                  {c.status === "IN_PROGRESS" && (
                    <>
                      <button
                        onClick={() => handleUploadClick(c.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                      >
                        Upload Image
                      </button>

                      <input
                        type="file"
                        accept="image/*"
                        ref={(el) => (fileInputRefs.current[c.id] = el)}
                        onChange={(e) => handleFileSelected(e, c.id)}
                        style={{ display: "none" }}
                      />
                    </>
                  )}

                </div>

              </div>

            </div>
          ))}

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

export default DepartmentDashboard;