import axios from "axios";
import { jwtDecode } from 'jwt-decode';


const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {"Content-Type": "application/json",},
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("access_token");
    let refreshToken = localStorage.getItem("refresh_token");

    if (token) {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        try {
          const response = await axios.post("http://127.0.0.1:8000/login/token/refresh/", 
            {refresh: refreshToken,});
          localStorage.setItem("access_token", response.data.access);
        } catch (err) 
            {console.error("Token refresh failed: axiosInstance.js File", err);}}
      config.headers.Authorization = `Bearer ${token}`;}

    return config;}, (error) => Promise.reject(error)
);

export default axiosInstance;
