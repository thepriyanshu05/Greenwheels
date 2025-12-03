import axios from "axios";
import { toast } from "sonner";

// ================================
// 🌍 Axios Instance Configuration
// ================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================================
// 🚦 Request Interceptor
// ================================
api.interceptors.request.use(
  (config) => {
    // ✅ Attach JWT token if available
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // 🧠 Log requests in development
    if (import.meta.env.DEV) {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        config.data
      );
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// ================================
// 🛑 Response Interceptor
// ================================
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.data
      );
    }
    return response;
  },
  (error) => {
    const { response, message } = error;

    console.error("❌ API Error:", {
      status: response?.status,
      statusText: response?.statusText,
      data: response?.data,
      message,
      url: error.config?.url,
    });

    // 🚨 Handle common errors
    if (response?.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/role-selection"
      ) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/role-selection";
      }
    } else if (response?.status === 403) {
      toast.error("Access denied. You don't have permission for this action.");
    } else if (response?.status === 404) {
      toast.error("Resource not found.");
    } else if (response?.status === 429) {
      toast.error("Too many requests. Please try again later.");
    } else if (response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (error.code === "ECONNABORTED") {
      toast.error("Request timeout. Please check your connection.");
    } else if (!response) {
      toast.error("Network error. Please check your internet connection.");
    }

    return Promise.reject(error);
  }
);

// ================================
// 🔐 Authentication APIs
// ================================
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
  updatePassword: (passwordData) =>
    api.put("/auth/update-password", passwordData),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
};

// ================================
// 🚘 Driver APIs
// ================================
export const driverAPI = {
  register: (driverData) => api.post("/driver/register", driverData),
  login: (credentials) => api.post("/driver/login", credentials),
  getProfile: () => api.get("/driver/profile"),
  updateProfile: (data) => api.put("/driver/update", data),
};

// ================================
// 👤 User APIs
// ================================
export const userAPI = {
  register: (data) => api.post("/user/register", data),
  login: (data) => api.post("/user/login", data),
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/update", data),
  getMyRides: () => api.get("/user/my-rides"),
};

// ================================
// 🧭 Ride APIs
// ================================
export const ridesAPI = {
  getAvailableRides: (params) => api.get("/rides/available", { params }),
  offerRide: (rideData) => api.post("/rides/offer", rideData),
  bookRide: (data) => api.post("/rides/book", data),
  getUserRides: () => api.get("/rides/user"),
  getDriverRides: () => api.get("/rides/driver"),
  cancelRide: (rideId) => api.patch(`/rides/cancel/${rideId}`),
};

// ================================
// 💬 Contact Form API
// ================================
export const contactAPI = {
  sendMessage: (messageData) => api.post("/contact", messageData),
};

// ================================
// 🧩 Utility Functions
// ================================
export const handleApiError = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    "An unexpected error occurred"
  );
};

export const isApiError = (error) => {
  return error.response && error.response.data;
};

export default api;
