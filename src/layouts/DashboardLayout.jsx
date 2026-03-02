import { Outlet, useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const DashboardLayout = ({ role }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false); // close menu on mobile
  };

  return (
    <div className="flex min-h-screen">

      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-gray-800 text-white flex justify-between items-center px-4 py-3 z-50">
        <h2 className="font-bold ">{role === "USER" && "My Civic Portal"}
  {role === "ADMIN" && "Admin Control Panel"}
  {role === "DEPARTMENT_AUTHORITY" && "Service Department Portal"}</h2>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl"
        >
          ☰
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`w-64 bg-gray-800 text-white p-5 flex flex-col h-screen fixed left-0 top-0 transform transition-transform duration-300 z-40
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >

        <h2 className="text-xl font-bold mb-6 hidden md:block">
  {role === "USER" && "My Civic Portal"}
  {role === "ADMIN" && "Admin Control Panel"}
  {role === "DEPARTMENT_AUTHORITY" && "Service Department Portal"}
</h2>

        {/* USER MENU */}
        {role === "USER" && (
          <div className="flex flex-col gap-4">

            <button
              onClick={() => goTo("/user/dashboard")}
              className="text-left hover:text-green-400"
            >
              Dashboard
            </button>

            <button
              onClick={() => goTo("/user/create-issue")}
              className="text-left hover:text-green-400"
            >
              Create Issue
            </button>

            <Link
              to="/user/my-complaints"
              onClick={() => setMenuOpen(false)}
              className="hover:text-green-400"
            >
              My Complaints
            </Link>

            <button
              onClick={() => goTo("/user/profile")}
              className="text-left hover:text-green-400"
            >
              Edit Profile
            </button>

          </div>
        )}

        {/* ADMIN MENU */}
        {role === "ADMIN" && (
          <div className="flex flex-col gap-6">

            <button
              onClick={() => goTo("/admin/dashboard")}
              className="text-left hover:text-green-400"
            >
              Dashboard
            </button>

            <button
              onClick={() => goTo("/admin/manage-complaints")}
              className="text-left hover:text-green-400"
            >
              Manage Complaints
            </button>

            <button
              onClick={() => goTo("/admin/add-department")}
              className="text-left hover:text-green-400"
            >
              Add Department
            </button>

          </div>
        )}

        {/* DEPARTMENT MENU */}
        {role === "DEPARTMENT_AUTHORITY" && (
          <div className="flex flex-col gap-6">

            <button
              onClick={() => goTo("/department/dashboard")}
              className="text-left hover:text-green-400"
            >
              Dashboard
            </button>

            <button
              onClick={() => goTo("/department/manage-complaints")}
              className="text-left hover:text-green-400"
            >
              Manage Complaints
            </button>

          </div>
        )}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 px-3 py-2 rounded"
        >
          Logout
        </button>

      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 bg-gray-100 md:ml-64 mt-14 md:mt-0">
        <Outlet />
      </div>

    </div>
  );
};

export default DashboardLayout;