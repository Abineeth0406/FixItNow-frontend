import { useState } from "react";
import api from "../../services/api";

const CreateIssue = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [dialog, setDialog] = useState({
  show: false,
  type: "", // "success" | "error"
  message: "",
});


  const getLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLatitude(position.coords.latitude.toString());
      setLongitude(position.coords.longitude.toString());
    },
    () => {
      alert("Unable to fetch location");
    }
  );
};

  


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", image);
      formData.append("location", latitude + "," + longitude); // keep if you still want readable string
formData.append("latitude", latitude);
formData.append("longitude", longitude);

      await api.post("/api/user/complaints", formData);

      setDialog({
  show: true,
  type: "success",
  message: "Issue created successfully!",
});


      setTitle("");
      setDescription("");
      setImage(null);
      setLatitude("");
      setLongitude("");
    } catch (error) {
      console.error(error);
      setDialog({
  show: true,
  type: "error",
  message: "Failed to create issue. Please fill all details properly.",
});

    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 text-green-600">
          Create Issue
        </h1>

        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter issue title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Describe the issue..."
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </div>

            <button
  type="button"
  onClick={getLocation}
  className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
>
  Use My Current Location
</button>


            {/* Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  type="text"
                  placeholder="Enter latitude"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  type="text"
                  placeholder="Enter longitude"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition shadow-md"
            >
              Submit Issue
            </button>

          </form>
        </div>
      </div>

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



    </div>
  );
};

export default CreateIssue;
