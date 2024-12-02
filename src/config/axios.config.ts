import axios from "axios";



const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Set the AUTH token for any request
axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("authToken");

  // If the token exists, add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default axiosInstance;