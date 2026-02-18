import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import logoround from "../assets/logo-round.png";

const Signup = () => {
  const navigate = useNavigate();


  const [latitude, setLatitude] = useState(null);
const [longitude, setLongitude] = useState(null);
const [areaName, setAreaName] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dialog, setDialog] = useState({
  show: false,
  type: "", // success | error
  message: "",
});

const getLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setAreaName("Detected Location");
    },
    () => {
      alert("Unable to fetch location");
    }
  );
};



  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
  await api.post("/api/auth/signup", {
    fullName: name,
    phone,
    password,
    latitude,
  longitude,
  areaName,
  });

  setDialog({
    show: true,
    type: "success",
    message: "Signup successful! Please login.",
  });

} catch (error) {
  setDialog({
    show: true,
    type: "error",
    message: error.response?.data?.message || "Signup failed",
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
      alt="Civix Logo"
      className="w-20 h-20 object-contain"
    />

    {/* Heading */}
    <h1 className="text-3xl md:text-4xl font-bold leading-tight">
      Join Civix
    </h1>

    {/* Description */}
    <p className="text-gray-300 max-w-sm leading-relaxed text-sm md:text-base">
      Create your account and start reporting civic issues
      transparently and efficiently.
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
          Sign Up
        </h2>

        <p className="text-gray-500 mb-8">
          Create your account
        </p>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border-b-2 border-gray-300 py-3 focus:outline-none focus:border-green-500 transition"
             value={name}
  onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border-b-2 border-gray-300 py-3 focus:outline-none focus:border-green-500 transition"
              value={phone}
  onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border-b-2 border-gray-300 py-3 focus:outline-none focus:border-green-500 transition"
             value={password}
  onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
  type="button"
  onClick={getLocation}
  className="w-full mt-4 bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
>
  Use My Current Location
</button>


        <button
          type="submit"
          className="w-full mt-8 bg-green-500 text-white py-3 rounded-full font-semibold hover:bg-green-600 transition shadow-md"
        >
          Sign Up
        </button>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-500 cursor-pointer font-semibold"
          >
            Login
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
        {dialog.type === "error" ? "Signup Failed" : "Signup Successful"}
      </h2>

      <p className="text-gray-600 mb-6">
        {dialog.message}
      </p>

      <button
        onClick={() => {
          setDialog({ ...dialog, show: false });

          if (dialog.type === "success") {
            navigate("/login");
          }
        }}
        className={`px-6 py-2 rounded-full text-white ${
          dialog.type === "error"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
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

export default Signup;
