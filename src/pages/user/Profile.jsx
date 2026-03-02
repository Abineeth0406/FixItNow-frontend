import { useEffect, useState } from "react";
import api from "../../services/api";

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    latitude: null,
    longitude: null
  });

  const [isEditing, setIsEditing] = useState(false);
const [toast, setToast] = useState({
  show: false,
  type: "", // success | error
  message: "",
});
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/user/profile");
      setFormData(response.data);
    } catch (error) {
      console.log("PROFILE ERROR:", error);
      alert("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const captureLocation = () => {
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
        const { latitude, longitude } = position.coords;

        setFormData(prev => ({
          ...prev,
          latitude,
          longitude
        }));

        setToast({
  show: true,
  type: "success",
  message: "Location captured successfully!",
});

setTimeout(() => {
  setToast((prev) => ({ ...prev, show: false }));
}, 3000);
      },
      () => {
        setToast({
  show: true,
  type: "error",
  message: "Unable to fetch location.",
});
setTimeout(() => {
  setToast((prev) => ({ ...prev, show: false }));
}, 3000);
      }
    );
  };

  const handleUpdate = async () => {
    try {
      await api.put("/api/user/profile", formData);
      setToast({
  show: true,
  type: "success",
  message: "Profile updated successfully!",
});

setTimeout(() => {
  setToast((prev) => ({ ...prev, show: false }));
}, 3000);
      setIsEditing(false);
    } catch (error) {
      setToast({
  show: true,
  type: "error",
  message: error.response?.data?.message || "Failed to update profile",
});

setTimeout(() => {
  setToast((prev) => ({ ...prev, show: false }));
}, 3000);
    }
  };

  return (
   <div className="max-w-3xl mx-auto mt-10 bg-white border border-gray-200 rounded-xl shadow-md p-8">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600">
          Profile
        </h1>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-600 hover:text-black"
        >
          ✏️
        </button>
      </div>

     <input
  name="fullName"
  value={formData.fullName || ""}
  onChange={handleChange}
  disabled={!isEditing}
  className="w-full p-3 border border-gray-300 rounded-lg mb-4 
  focus:outline-none focus:ring-2 focus:ring-green-500
  disabled:bg-gray-100"
  placeholder="Full Name"
/>

     <input
  name="email"
  value={formData.email || ""}
  disabled
  className="w-full p-3 border border-gray-300 rounded-lg mb-4 
  focus:outline-none focus:ring-2 focus:ring-green-500
  bg-gray-100"
  placeholder="Email"
/>

<input
  value={formData.latitude || ""}
  disabled
  className="w-full p-3 border border-gray-300 rounded-lg mb-4 
  focus:outline-none focus:ring-2 focus:ring-green-500
  bg-gray-100"
  placeholder="Latitude"
/>

{/* Longitude */}
<input
  value={formData.longitude || ""}
  disabled
  className="w-full p-3 border border-gray-300 rounded-lg mb-4 
  focus:outline-none focus:ring-2 focus:ring-green-500
  bg-gray-100"
  placeholder="Longitude"
/>

      {isEditing && (
        <button
          type="button"
          onClick={captureLocation}
          className="w-full mb-3 px-4 py-2 bg-blue-500 text-white rounded"
        >
          📍 Use Current Location
        </button>
      )}

      {isEditing && (
        <button
          onClick={handleUpdate}
          className="w-full px-4 py-2 bg-green-600 text-white rounded"
        >
          Save Changes
        </button>
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

export default Profile;