import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://e-commerce-backend-1-m0eh.onrender.com",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
