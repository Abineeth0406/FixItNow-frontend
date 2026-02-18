import { Outlet, useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";


const DashboardLayout = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
     <div className="w-64 bg-gray-800 text-white p-5 flex flex-col h-screen fixed left-0 top-0">



        <h2 className="text-xl font-bold mb-6">{role} Panel</h2>

        {role === "USER" && (
  <div className="flex flex-col gap-4">
    <button
      onClick={() => navigate("/user/dashboard")}
      className="text-left hover:text-green-400"
    >
      Dashboard
    </button>

    <button
      onClick={() => navigate("/user/create-issue")}
      className="text-left hover:text-green-400"
    >
      Create Issue
    </button>

    <Link
      to="/user/my-complaints"
      className="hover:text-green-400"
    >
      My Complaints
    </Link>
  </div>
)}




{role === "ADMIN" && (
  <div className="flex flex-col gap-6">

    <button
      onClick={() => navigate("/admin/dashboard")}
      className="text-left hover:text-green-400"
    >
      Dashboard
    </button>

    <button
      onClick={() => navigate("/admin/manage-complaints")}
      className="text-left hover:text-green-400"
    >
      Manage Complaints
    </button>

    <button
      onClick={() => navigate("/admin/add-department")}
      className="text-left hover:text-green-400"
    >
      Add Department
    </button>

  </div>
)}




{role === "DEPARTMENT_AUTHORITY" && (
  <div className="flex flex-col gap-6">

    <button
      onClick={() => navigate("/department/dashboard")}
      className="text-left hover:text-green-400"
    >
      Dashboard
    </button>

    <button
      onClick={() => navigate("/department/manage-complaints")}
      className="text-left hover:text-green-400"
    >
      Manage Complaints
    </button>

  </div>
)}


















        <button
  onClick={handleLogout}
  className="mt-auto bg-red-500 px-3 py-2 rounded"
>
  Logout
</button>

      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-gray-100 ml-64">

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
