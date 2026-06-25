import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080", // Adjust port to match your Spring Boot application port
});

// Interceptor automatically injects your saved backend authentication token into the request headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;