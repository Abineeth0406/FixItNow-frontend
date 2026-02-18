import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // backend URL
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: only logout on expired/invalid token (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status, data } = error.response || {};

    if (status === 401) {
      console.warn("Access token expired or invalid. Logging out...");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      window.location.href = "/login";
    } else if (status === 403) {
      // Forbidden action (like ADMIN trying wrong endpoint)
      // Do NOT logout — just log a warning for debugging
      console.warn("Action forbidden:", data?.message || error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
