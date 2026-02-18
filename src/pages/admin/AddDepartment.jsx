import { useState } from "react";
import api from "../../services/api";

const AddDepartment = () => {
  const [form, setForm] = useState({
    deptName: "",
    deptId: "",
    password: "",
  });

  const handleCreate = async () => {
    try {
      await api.post("/api/admin/complaints/create-department", {
        deptName: form.deptName,
        deptId: form.deptId,
        password: form.password,
      });

      alert("Department authority created successfully!");

      // Clear form after success
      setForm({
        deptName: "",
        deptId: "",
        password: "",
      });

    } catch (error) {
      console.error("Error creating department:", error);
      alert("Failed to create department.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow">

      <h2 className="text-2xl font-semibold text-blue-600 mb-6">
        Create Department Authority
      </h2>

      <input
        type="text"
        placeholder="Department Name"
        value={form.deptName}
        onChange={(e) =>
          setForm({ ...form, deptName: e.target.value })
        }
        className="w-full border rounded-lg p-3 mb-4"
      />

      <input
        type="text"
        placeholder="Department ID"
        value={form.deptId}
        onChange={(e) =>
          setForm({ ...form, deptId: e.target.value })
        }
        className="w-full border rounded-lg p-3 mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        className="w-full border rounded-lg p-3 mb-6"
      />

      <button
        onClick={handleCreate}
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Create Department
      </button>

    </div>
  );
};

export default AddDepartment;
