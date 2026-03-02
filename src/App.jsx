import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateIssue from "./pages/user/CreateIssue";
import DepartmentDashboard from "./pages/dept/DepartmentDashboard";
import Signup from "./pages/Signup";
import MyComplaints from "./pages/user/MyComplaints";

import AddDepartment from "./pages/admin/AddDepartment";
import ManageComplaints from "./pages/admin/ManageComplaints";

import DeptManageComplaints from "./pages/dept/ManageComplaintsdept";

import RoleSelection from "./pages/RoleSelection";
import Profile from "./pages/user/Profile";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



import DepartmentManageComplaints from "./pages/dept/DepartmentManageComplaints";

function App() {
  return (
    <div className="app-container">
      <Routes>

       

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<RoleSelection />} />
<Route path="/login/user" element={<Login type="USER" />} />
<Route path="/login/admin" element={<Login type="ADMIN" />} />
<Route path="/login/department" element={<Login type="DEPARTMENT_AUTHORITY" />} />

        <Route path="/signup" element={<Signup />} />

        {/* ================= USER ROUTES ================= */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <DashboardLayout role="USER" />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="create-issue" element={<CreateIssue />} />

             <Route path="my-complaints" element={<MyComplaints />} /> 
             <Route path="profile" element={<Profile />} /> 
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <DashboardLayout role="ADMIN" />
    </ProtectedRoute>
  }
>

<Route path="add-department" element={<AddDepartment />} />


  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="manage-complaints" element={<ManageComplaints />} />
</Route>


        {/* ================= DEPARTMENT ROUTES ================= */}
        <Route
  path="/department"
  element={
    <ProtectedRoute allowedRoles={["DEPARTMENT_AUTHORITY"]}>
      <DashboardLayout role="DEPARTMENT_AUTHORITY" />
    </ProtectedRoute>
  }
>
  <Route path="dashboard" element={<DepartmentDashboard />} />
  <Route path="manage-complaints" element={<DepartmentManageComplaints />} />
</Route>

        <Route path="manage-complaints" element={<DepartmentManageComplaints />} />


     


      </Routes>

       <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}

export default App;
