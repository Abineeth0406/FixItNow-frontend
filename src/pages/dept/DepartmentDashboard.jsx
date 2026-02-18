import { useEffect, useState } from "react";
import api from "../../services/api";

const DepartmentDashboard = ({ filterStatus }) => {

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileUploads, setFileUploads] = useState({}); // track files per complaint

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get("/api/department/complaints");
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

  // Mark as In Progress
  const startWork = async (id) => {
    try {
      await api.put(`/api/department/complaints/${id}/start`);
      fetchComplaints();
    } catch (error) {
      console.error("Error starting work:", error);
    }
  };

  // Resolve complaint with file upload
  const resolveComplaint = async (id) => {
    const file = fileUploads[id];
    if (!file) return alert("Please select a file to upload before resolving.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.put(`/api/department/complaints/${id}/resolve`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFileUploads((prev) => ({ ...prev, [id]: null })); // reset file
      fetchComplaints();
    } catch (error) {
      console.error("Error resolving complaint:", error);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading complaints...</p>;

  const filteredComplaints = filterStatus
  ? complaints.filter((c) => c.status === filterStatus)
  : complaints;


  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Department Dashboard</h1>

      

      {filteredComplaints.length === 0 ? (
        <p className="text-gray-500">No assigned complaints.</p>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((c) => (
            <div
              key={c.id}
              className="border rounded shadow p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center"
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{c.title}</h2>
                <p className="mt-1">{c.description}</p>
                <p className="text-sm text-gray-600 mt-1">Location: {c.location}</p>
                <p className="font-medium mt-1">Status: {c.status}</p>
                {c.imagePath && (
                  <img
                    src={`http://localhost:8080/${c.imagePath}`}
                    alt="Complaint"
                    className="mt-2 w-48 rounded"
                  />
                )}
              </div>

              <div className="flex flex-col space-y-2 mt-3 md:mt-0 md:ml-4">
                {c.status === "PENDING" && (
                  <button
                    onClick={() => startWork(c.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Start Work
                  </button>
                )}

                {c.status === "IN_PROGRESS" && (
                  <>
                    <input
                      type="file"
                      onChange={(e) =>
                        setFileUploads((prev) => ({ ...prev, [c.id]: e.target.files[0] }))
                      }
                      className="border rounded px-2 py-1"
                    />
                    <button
                      onClick={() => resolveComplaint(c.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mt-2"
                    >
                      Resolve & Upload File
                    </button>
                  </>
                )}

                {c.status === "RESOLVED" && (
                  <p className="text-green-600 font-semibold">Completed</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentDashboard;
