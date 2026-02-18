import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logoround from "../assets/logo-round.png";
const Login = () => {
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [dialog, setDialog] = useState({
  show: false,
  type: "", // success | error
  message: "",
});


  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/api/auth/login", {
      phone,
      password,
    });

    const { accessToken, refreshToken, role } = res.data;

    // Store tokens
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);

    // Role-based redirect
    if (role === "USER") {
      navigate("/user/dashboard");
    } else if (role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (role === "DEPARTMENT_AUTHORITY") {
      navigate("/department/dashboard");
    }

  } catch (error) {
    setDialog({
  show: true,
  type: "error",
  message: error.response?.data?.message || "Invalid Credentials",
});

  }
};

return (
  <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F7FA]">









    {/* BLUE PANEL */}
<div className="relative w-full md:w-1/2 bg-gradient-to-b from-[#0B1C2D] to-[#12344D] text-white flex flex-col justify-center items-center px-8 md:px-16 py-20 md:py-0 overflow-hidden">

  {/* Content Wrapper */}
  <div className="flex flex-col items-center text-center space-y-6">

    {/* Logo */}
    <img
      src={logoround}
      alt="Logo"
      className="w-20 h-20 object-contain"
    />

    {/* Heading */}
    <h1 className="text-3xl md:text-4xl font-bold leading-tight">
      Welcome to FixItNow
    </h1>

    {/* Description */}
    <p className="text-gray-300 max-w-sm leading-relaxed text-sm md:text-base">
      Smart civic issue reporting platform for transparent governance.
    </p>

  </div>

  {/* MOBILE CURVE */}
  <div className="absolute bottom-0 left-0 w-full h-24 bg-[#F4F7FA] rounded-t-[60px] md:hidden"></div>

  {/* DESKTOP CURVE */}
  <div className="hidden md:block absolute right-0 top-0 h-full w-32 bg-[#F4F7FA] rounded-l-[120px]"></div>

</div>

























    {/* FORM PANEL */}
    <div className="flex w-full md:w-1/2 justify-center items-center px-6 py-12 md:py-0">

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B1C2D] mb-2">
          Login
        </h2>

        <p className="text-gray-500 mb-8">
          Access your account
        </p>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border-b-2 border-gray-300 py-3 focus:outline-none focus:border-green-500 transition"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b-2 border-gray-300 py-3 focus:outline-none focus:border-green-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-8 bg-green-500 text-white py-3 rounded-full font-semibold hover:bg-green-600 transition shadow-md"
        >
          Login
        </button>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-green-500 cursor-pointer font-semibold"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
{/* DIALOG */}
{dialog.show && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
    <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md text-center">

      <h2
        className={`text-xl font-semibold mb-4 ${
          dialog.type === "error"
            ? "text-red-600"
            : "text-green-600"
        }`}
      >
        {dialog.type === "error" ? "Login Failed" : "Success"}
      </h2>

      <p className="text-gray-600 mb-6">
        {dialog.message}
      </p>

      <button
        onClick={() => setDialog({ ...dialog, show: false })}
        className={`px-6 py-2 rounded-full text-white ${
          dialog.type === "error"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        OK
      </button>

    </div>
  </div>
)}


  </div>
);



};

export default Login;
