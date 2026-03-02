import { useState } from "react";
import api from "../../services/api";

const AddDepartment = () => {
  const [form, setForm] = useState({
    deptName: "",
    deptId: "",
    password: "",
  });

  const [dialog, setDialog] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/admin/complaints/create-department", {
        deptName: form.deptName,
        deptId: form.deptId,
        password: form.password,
      });

      setDialog({
        show: true,
        type: "success",
        message: "Department authority created successfully!",
      });

      setForm({
        deptName: "",
        deptId: "",
        password: "",
      });

    } catch (error) {
      console.error("Error creating department:", error);

      setDialog({
        show: true,
        type: "error",
        message: "Failed to create department. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-blue-600">
          Create Department Authority
        </h1>

        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8">

          <form onSubmit={handleCreate} className="space-y-6">

            {/* Department Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Department Name
              </label>
              <input
                type="text"
                placeholder="Enter department name"
                value={form.deptName}
                onChange={(e) =>
                  setForm({ ...form, deptName: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Department ID */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Department ID
              </label>
              <input
                type="text"
                placeholder="Enter department ID"
                value={form.deptId}
                onChange={(e) =>
                  setForm({ ...form, deptId: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition shadow-md"
            >
              Create Department
            </button>

          </form>
        </div>
      </div>

      {/* DIALOG POPUP */}
      {dialog.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md text-center">

            <h2
              className={`text-xl font-semibold mb-4 ${
                dialog.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {dialog.type === "success" ? "Success" : "Error"}
            </h2>

            <p className="text-gray-600 mb-6">
              {dialog.message}
            </p>

            <button
              onClick={() => setDialog({ ...dialog, show: false })}
              className={`px-6 py-2 rounded-full text-white transition ${
                dialog.type === "success"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              OK
            </button>

          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
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

export default AddDepartment;