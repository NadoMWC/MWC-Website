// axiosInstance.js
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("access_token");
    let refreshToken = localStorage.getItem("refresh_token");

    if (token) {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        // Token is expired, attempt to refresh
        try {
          const response = await axios.post("http://127.0.0.1:8000/login/token/refresh/", {
            refresh: refreshToken,
          });

          token = response.data.access;
          localStorage.setItem("access_token", token);
        } catch (err) {
          console.error("Token refresh failed:", err);
          // Optionally clear tokens and force logout
        }
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
