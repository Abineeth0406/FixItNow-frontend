import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FA]">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center space-y-6">

        <h2 className="text-2xl font-bold text-[#0B1C2D]">
          Select Login Type
        </h2>

        <button
          onClick={() => navigate("/login/user")}
          className="w-full bg-green-500 text-white py-3 rounded-full font-semibold hover:bg-green-600 transition"
        >
          Login as User
        </button>

        <button
          onClick={() => navigate("/login/admin")}
          className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition"
        >
          Login as Admin
        </button>

        <button
          onClick={() => navigate("/login/department")}
          className="w-full bg-purple-500 text-white py-3 rounded-full font-semibold hover:bg-purple-600 transition"
        >
          Login as Department Authority
        </button>

      </div>
    </div>
  );
};

export default RoleSelection;