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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
const [passwordError, setPasswordError] = useState("");
  const [dialog, setDialog] = useState({
  show: false,
  type: "", // success | error
  message: "",
});

const [toast, setToast] = useState({
  show: false,
  type: "", // success | error
  message: "",
});


const getLocation = () => {
  if (!navigator.geolocation) {
    setToast({
      show: true,
      type: "error",
      message: "Geolocation not supported by your browser.",
    });
  setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);

    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setAreaName("Detected Location");

      setToast({
        show: true,
        type: "success",
        message: "Location detected successfully!",
      });
    },
    () => {
      setToast({
        show: true,
        type: "error",
        message: "Unable to fetch location.",
      });
    }
  );
};


const validatePhone = (value) => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian 10-digit mobile format

  if (!phoneRegex.test(value)) {
    setPhoneError("Invalid phone number");
  } else {
    setPhoneError("");
  }
};


const validatePassword = () => {
  if (password.length < 8) {
    setPasswordError("Password must be at least 8 characters long");
    return false;
  }

  if (password !== confirmPassword) {
    setPasswordError("Passwords do not match");
    return false;
  }

  setPasswordError("");
  return true;
};


 const handleSubmit = async (e) => {
  e.preventDefault();
  setEmailError("");
setPhoneError("");
setPasswordError("");

  if (loading) return; // 🛑 extra safety

  if (!validatePassword()) return;

  if (phoneError || phone.length !== 10) {
    setDialog({
      show: true,
      type: "error",
      message: "Please enter a valid phone number.",
    });
    return;
  }

  try {
    setLoading(true); // ✅ start loading

    await api.post("/api/auth/signup", {
      fullName: name,
      email,
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
  const errors = error.response?.data;

  if (errors && typeof errors === "object") {

    if (errors.email) setEmailError(errors.email);
    if (errors.phone) setPhoneError(errors.phone);
    if (errors.password) setPasswordError(errors.password);

    // If backend sends unknown error
    if (errors.error) {
      setDialog({
        show: true,
        type: "error",
        message: errors.error,
      });
    }

  } else {
    // Unexpected system error
    setDialog({
      show: true,
      type: "error",
      message: "Something went wrong. Please try again.",
    });
  }
}finally {
    setLoading(false); // ✅ always stop loading
  }
};

return (
  <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F7FA]">

    {/* BLUE PANEL */}
<div className="relative w-full md:w-1/2 bg-gradient-to-b from-[#0B1C2D] to-[#12344D] text-white flex flex-col justify-center items-center px-8 md:px-16 py-20 md:py-0 pb-32 overflow-hidden">

  {/* Content Wrapper */}
  <div className="flex flex-col items-center text-center space-y-6 z-10">

    {/* Logo */}
    <img
      src={logoround}
      alt="Civix Logo"
      className="w-20 h-20 object-contain"
    />

    {/* Heading */}
    <h1 className="text-3xl md:text-4xl font-bold leading-tight">
      Join FixItNow
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
  type="email"
  placeholder="Email Address"
  className={`w-full border-b-2 py-3 focus:outline-none transition ${
    emailError
      ? "border-red-500 focus:border-red-500"
      : "border-gray-300 focus:border-green-500"
  }`}
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    setEmailError(""); // clear while typing
  }}
  required
/>

{emailError && (
  <p className="text-red-500 text-xs mt-1">
    {emailError}
  </p>
)}

          <div className="relative">
  <input
    type="text"
    placeholder="Phone Number"
    className={`w-full border-b-2 py-3 focus:outline-none transition ${
      phoneError
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-green-500"
    }`}
    value={phone}
    onChange={(e) => {
  const value = e.target.value;
  setPhone(value);
  validatePhone(value);
}}
    required
  />




          <input
            type="password"
            placeholder="Password"
            className="w-full border-b-2 border-gray-300 py-3 focus:outline-none focus:border-green-500 transition"
             value={password}
onChange={(e) => {
  const value = e.target.value;
  setPassword(value);

  let strength = "Weak";

  if (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value)
  ) {
    strength = "Moderate";
  }

  if (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  ) {
    strength = "Strong";
  }

  setPasswordStrength(strength);
}}
            required
          />

            {password && (
  <p className={`text-xs mt-1 ${
    passwordStrength === "Weak"
      ? "text-red-500"
      : passwordStrength === "Moderate"
      ? "text-yellow-500"
      : "text-green-500"
  }`}>
    {passwordStrength} password
  </p>
)}

  {/* Red ! Icon */}
  {phoneError && (
    <span className="absolute right-2 top-3 text-red-500 font-bold">
      !
    </span>
  )}

  {/* Error Text */}
  {phoneError && (
    <p className="text-red-500 text-xs mt-1">
      {phoneError}
    </p>
  )}
</div>


          <input
  type="password"
  placeholder="Confirm Password"
  className={`w-full border-b-2 py-3 focus:outline-none transition ${
    passwordError
      ? "border-red-500 focus:border-red-500"
      : "border-gray-300 focus:border-green-500"
  }`}
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  required
/>

{passwordError && (
  <p className="text-red-500 text-xs mt-1">
    {passwordError}
  </p>
)}






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
  disabled={loading}
  className={`w-full mt-8 py-3 rounded-full font-semibold transition shadow-md ${
    loading
      ? "bg-green-400 cursor-not-allowed"
      : "bg-green-500 hover:bg-green-600 text-white"
  }`}
>
  {loading ? "Creating Account..." : "Sign Up"}
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

          // const [loading, setLoading] = useState(false);
          // const [toast, setToast] = useState({...});

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

export default Signup;
