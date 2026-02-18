import { useEffect, useState } from "react";
import api from "../../services/api";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const { data } = await api.get("/api/user/complaints/my");
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching my complaints:", error);
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
                className="bg-white border rounded-xl shadow p-6"
              >
                <h2 className="text-xl font-semibold text-green-600">
                  {c.title}
                </h2>

                <p className="mt-2 text-gray-700">{c.description}</p>

                <p className="text-sm text-gray-500 mt-2">
                  Status: {c.status}
                </p>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-full"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
